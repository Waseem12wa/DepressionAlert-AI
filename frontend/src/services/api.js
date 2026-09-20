// Frontend API layer — mirrors the backend surface defined in SRS §6.2.
// Every function is async and returns the same shape the real Express
// API will return, so Phase 2 swaps these implementations for fetch()
// calls to VITE_API_BASE_URL without touching any page or component.
//
//   POST /api/auth/register | login | logout
//   GET/PATCH /api/users/me  PUT /api/users/me/consent
//   POST /api/submissions/text | /csv
//   GET /api/analysis/latest | /history | /:id
//   GET /api/trends
//   GET /api/alerts  PATCH /api/alerts/:id
//   GET /api/crisis-support
//   GET/PATCH /api/settings
import { store, CRISIS_RESOURCES, VIEWER_CASES } from './mockStore';
import { analyzeText, parseCsvPosts } from '../utils/mockAnalyzer';
import { riskLevel } from '../utils/format';
import { DEMO_USERS } from '../data/mockData';

const wait = (ms = 450) => new Promise((r) => setTimeout(r, ms));
const TOKEN_KEY = 'depalert_token';
const USER_KEY = 'depalert_user';

/* ---------------- auth (FR-1, FR-2, SEC-4/7) ---------------- */

export async function login(email, password) {
  await wait();
  const known = DEMO_USERS.find((u) => u.email === email.toLowerCase().trim());
  if (known && known.password !== password) {
    throw new Error('Incorrect password. Please try again.');
  }
  if (!known && store.db.users.every((u) => u.email !== email.toLowerCase().trim())) {
    throw new Error('No account found for this email. Please register first.');
  }
  const { password: _pw, ...user } = known || store.db.users.find((u) => u.email === email.toLowerCase().trim());
  localStorage.setItem(TOKEN_KEY, `mock-jwt-${Date.now()}`);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return { token: 'mock-jwt', user };
}

export async function register({ name, email, password, consent }) {
  await wait();
  const normalized = email.toLowerCase().trim();
  const exists =
    DEMO_USERS.some((u) => u.email === normalized) ||
    store.db.users.some((u) => u.email === normalized);
  if (exists) throw new Error('This email is already registered. Try logging in.');
  const user = {
    id: store.nextId('u'), name: name.trim(), email: normalized,
    role: 'Standard', consentGiven: !!consent, createdAt: new Date().toISOString(),
  };
  store.db.users.push(user);
  if (consent) store.db.consentLog.push({ at: new Date().toISOString(), action: 'granted' });
  store.save();
  localStorage.setItem(TOKEN_KEY, `mock-jwt-${Date.now()}`);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return { token: 'mock-jwt', user };
}

export async function logout() {
  await wait(150);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  const raw = localStorage.getItem(USER_KEY);
  if (!token || !raw) return null;
  try { return { token, user: JSON.parse(raw) }; } catch { return null; }
}

export async function requestPasswordReset(email) {
  await wait(700);
  if (!email) throw new Error('Please enter your email address.');
  return { ok: true }; // email service wired in backend phase
}

export async function resetPassword() {
  await wait(700);
  return { ok: true };
}

/* ---------------- profile & consent (FR-3, SEC-2) ---------------- */

export async function updateProfile(patch) {
  await wait(400);
  const session = getSession();
  const user = { ...session.user, ...patch };
  const idx = store.db.users.findIndex((u) => u.id === user.id);
  if (idx >= 0) store.db.users[idx] = user;
  store.save();
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export async function updateConsent(granted) {
  await wait(350);
  const session = getSession();
  const user = { ...session.user, consentGiven: granted };
  const idx = store.db.users.findIndex((u) => u.id === user.id);
  if (idx >= 0) store.db.users[idx] = user;
  store.db.consentLog.push({ at: new Date().toISOString(), action: granted ? 'granted' : 'revoked' });
  store.save();
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

/* ---------------- submissions -> analysis pipeline ---------------- */
/* validateAndStorePost -> preprocessText -> computeRiskScore ->
   evaluateAndGenerateAlert (SDD §6.1–6.4), mocked end-to-end.         */

function persistAnalysis(text, source) {
  const a = analyzeText(text);
  const postId = store.nextId('post');
  const analysis = {
    id: store.nextId('a'),
    postId,
    date: new Date().toISOString(),
    riskScore: a.riskScore,
    riskLevel: a.riskLevel,
    sentiment: a.sentimentScore,
    source,
    excerpt: text.slice(0, 140),
    cleanedText: a.cleanedText,
    tokens: a.tokens,
    markers: a.markers,
    indicators: a.indicators,
    modelVersion: a.modelVersion,
  };
  store.db.analyses.unshift(analysis);

  let alert = null;
  if (a.riskLevel === 'High') {
    alert = {
      id: store.nextId('al'),
      analysisId: analysis.id,
      createdAt: analysis.date,
      status: 'New',
      message:
        'Elevated depression-related language patterns detected in your latest submission. ' +
        'Your wellbeing matters — consider the crisis-support resources or talking to someone you trust.',
    };
    store.db.alerts.unshift(alert);
  }
  store.save();
  return { analysis, alert };
}

export async function submitText(text) {
  await wait(900); // PER-1: real target is <5s
  const session = getSession();
  if (!session?.user?.consentGiven) throw new Error('Consent required — please grant data-processing consent first.');
  if (!text.trim()) throw new Error('Please enter some text to analyze.');
  return persistAnalysis(text.trim(), 'Manual');
}

export async function submitCsv(file) {
  await wait(1200);
  const session = getSession();
  if (!session?.user?.consentGiven) throw new Error('Consent required — please grant data-processing consent first.');
  const content = await file.text();
  const rows = parseCsvPosts(content);
  if (!rows.length) throw new Error('No valid post text found in this CSV file.');
  const seen = new Set();
  const results = [];
  let skipped = 0;
  let latestAlert = null;
  for (const row of rows) {
    const key = row.toLowerCase();
    if (seen.has(key)) { skipped += 1; continue; } // FR-6 dedupe
    seen.add(key);
    const { analysis, alert } = persistAnalysis(row, 'CSV');
    results.push(analysis);
    if (alert) latestAlert = alert;
  }
  return { results, skipped, alert: latestAlert };
}

/* ---------------- retrieval (FR-9..FR-14) ---------------- */

export async function getAnalyses() {
  await wait(300);
  return [...store.db.analyses];
}

export async function getAnalysisById(id) {
  await wait(250);
  return store.db.analyses.find((a) => a.id === id) || null;
}

export async function getLatestAnalysis() {
  await wait(250);
  return store.db.analyses[0] || null;
}

export async function getTrends() {
  await wait(350);
  const items = [...store.db.analyses].sort((a, b) => new Date(a.date) - new Date(b.date));
  const points = items.map((a) => ({ date: a.date, score: a.riskScore, sentiment: a.sentiment, level: a.riskLevel }));
  const markers = items.map((a) => ({ date: a.date, ...a.markers }));
  const first = items[0];
  const last = items[items.length - 1];
  return {
    points,
    markers,
    summary: first && last ? {
      delta: last.riskScore - first.riskScore,
      first: first.riskScore,
      last: last.riskScore,
      count: items.length,
      highDays: items.filter((a) => a.riskLevel === 'High').length,
    } : null,
  };
}

export async function getAlerts() {
  await wait(280);
  return [...store.db.alerts];
}

export async function updateAlertStatus(id, status) {
  await wait(200);
  const alert = store.db.alerts.find((a) => a.id === id);
  if (alert) { alert.status = status; store.save(); }
  return alert;
}

export async function getPosts() {
  await wait(250);
  return [...store.db.posts];
}

export async function getMonitorFeed() {
  await wait(250);
  return [...store.db.monitor];
}

export async function getCrisisResources() {
  await wait(250);
  return CRISIS_RESOURCES;
}

/* ---------------- settings (SDD §8.2 preventive actions) ---------------- */

export async function getSettings() {
  await wait(200);
  return { ...store.db.settings };
}

export async function updateSettings(patch) {
  await wait(250);
  store.db.settings = { ...store.db.settings, ...patch };
  store.save();
  return { ...store.db.settings };
}

export async function logActivity(action) {
  store.db.activity.unshift({ id: store.nextId('act'), action, at: new Date().toISOString() });
  store.save();
}

/* ---------------- Authorized Viewer role (SDD §5.1 User.role) ---------------- */

export async function getAuthorizedCases() {
  await wait(350);
  return VIEWER_CASES;
}

export async function getCaseDetail(id) {
  await wait(350);
  const kase = VIEWER_CASES.find((c) => c.id === id);
  if (!kase) return null;
  const analyses = id === 'u-demo'
    ? [...store.db.analyses]
    : [...store.db.analyses].slice(0, kase.analyses);
  return { ...kase, analyses };
}

export { riskLevel };
