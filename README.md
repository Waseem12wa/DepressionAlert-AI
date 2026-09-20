# DepressionAlert AI

> Final Year Project — COMSATS University Islamabad, Abbottabad Campus
> BS Computer Science (2023–2027)
>
> **Team:** Muhammad Salahudin Khan (SP23-BCS-135), Muhammad Azan (SP23-BCS-116)
> **Supervisor:** Ms. Sara Shafique

---

## 1. Project Overview

DepressionAlert AI is an intelligent, web-based mental-health monitoring system that detects
**early signs of depression** by analyzing **user-provided social-media text** with Natural
Language Processing (NLP) and Machine Learning (ML).

A registered user submits social-media posts — by **pasting text directly** or by **uploading a
CSV file** — after granting explicit data-processing consent. The system cleans and tokenizes the
text, extracts sentiment and linguistic features, runs a trained ML classifier to produce a
**depression risk score (0–100)** and **risk level (Low / Moderate / High)**, stores the result in
the user's analysis history, and raises a **high-risk alert with crisis-support resources** when
the score crosses the configured threshold.

The system is **strictly permission-based**: no data is collected automatically, and all
monitoring begins only after explicit user consent. It provides **supportive early-awareness
insight only — it is not a diagnostic or clinical tool**, and all outputs are advisory.

**Project category:** Web Application / Information System + Artificial Intelligence & Machine Learning

### Source documents (single source of truth)

| Document | File | Contents |
|---|---|---|
| Project Proposal | `DepalertAi.pdf` | Vision, problem statement, scope, 9 system modules, tools & technologies, WBS |
| SRS (30%) | `SRS_DepressionAlertAI 30 %.pdf` | 8 use cases, FR-1..FR-14, quality attributes, external interfaces, constraints |
| SDD | `SDD_DepressionAlert_AI.pdf` | 3-tier architecture, 6 core modules, data dictionary, algorithms (PDL), screen designs |

Plain-text extracts for quick grepping live in `docs/extracted-text/`.
A condensed requirements reference for implementation prompts lives in
`PROJECT_REQUIREMENTS.txt`.

---

## 2. Requirements Extracted from the PDFs

### 2.1 Functional Requirements (SRS §4)

| ID | Requirement |
|---|---|
| FR-1 | User registration with name, email, password |
| FR-2 | User login / authentication before protected features |
| FR-3 | Verify data-processing consent before accepting/processing text (revocable) |
| FR-4 | Manual text submission (paste social-media post text) |
| FR-5 | CSV file upload for batch analysis of multiple posts |
| FR-6 | Submission validation — reject empty, malformed, invalid, duplicate records |
| FR-7 | Text preprocessing — remove symbols, stop words, irrelevant characters |
| FR-8 | Tokenization + sentiment, emotional and linguistic feature extraction |
| FR-9 | Trained ML model generates risk score + risk level per analysis |
| FR-10 | Behavioral trend analysis — compare current vs previous results over time |
| FR-11 | Threshold-based alerting — auto-generate + store high-risk alert |
| FR-12 | Crisis-support resources displayed whenever a high-risk alert fires |
| FR-13 | Dashboard shows latest risk score, risk level, alert status, analysis options |
| FR-14 | Analysis history — date, risk score, risk level, sentiment result per record |

### 2.2 Use Cases (SRS §3)

- **UC-1** Register Account · **UC-2** Login · **UC-3** View Dashboard
- **UC-4** Get Depression Evaluation (paste text or upload CSV → NLP → risk score)
- **UC-5** View Risk Score (latest score + Low/Moderate/High + brief explanation)
- **UC-6** View Analysis History (records by date, selectable detail)
- **UC-7** View Behavioral Trends (charts + summaries of changes)
- **UC-8** Receive High-Risk Alert & Crisis Support (threshold breach → alert → helplines/resources → view or dismiss)

### 2.3 Six Core Modules (SDD §1, §3)

1. **Data Collection Module** — `validateAndStorePost()`: consent check, manual/CSV ingest, dedupe/validation, persist `Post`.
2. **NLP Processing Module** — `preprocessText()`: clean, lowercase, tokenize, remove stop words, sentiment score, feature vector → `ProcessedText`.
3. **Depression Detection Module** — `computeRiskScore()`: trained classifier → `risk_score` 0–100 → `risk_level` (≥70 High, ≥40 Moderate, else Low) → `AnalysisResult`.
4. **Behavioral Analysis Module** — `updateBehavioralPattern()`: rolling per-user linguistic markers (first-person pronoun density, absolutist language, negative-emotion word frequency) → `BehavioralPattern`.
5. **Alert System Module** — `evaluateAndGenerateAlert()`: High risk → `Alert` (status New → Viewed/Dismissed) + user notification.
6. **Dashboard Module** — aggregated view of results, trends, alerts for the user.

### 2.4 Quality Attributes (SRS §5)

- **Usability:** submit text within ≤3 interactions from Dashboard (USE-1); dashboard shows score/level/alert/trend summary on one page (USE-2); clear labels + validation feedback (USE-3); responsive on desktop/laptop/tablet/phone (USE-4); consistent navigation (USE-5).
- **Performance:** single-text risk score within 5 s (PER-1); 95% of dashboard loads < 3 s on ≥10 Mbps (PER-2); CSV upload acknowledged < 3 s with processing status (PER-3); concurrent users without degradation (PER-4).
- **Security & privacy:** HTTPS/TLS 1.2+ everywhere (SEC-1); consent-based, revocable processing (SEC-2); salted one-way password hashing (SEC-3); auth required for all protected features (SEC-4); per-user data isolation (SEC-5); secure CSV validation — format/size/malformed/unsafe (SEC-6); secure session termination + invalid-token rejection (SEC-7).

### 2.5 Operating Environment & Constraints (SRS §2)

- Browsers: current Chrome, Firefox, Edge — desktop **and** mobile.
- Server: Linux environment; **Node.js 20.x LTS** and **Python 3.11**.
- CO-1: Frontend = **React 18.x**. CO-2: Backend API = **Node.js/Express**; AI/NLP/ML = **Python 3.11 + scikit-learn + spaCy/NLTK**. CO-3: model trained on publicly available, ethically sourced mental-health text datasets.

### 2.6 Explicit Exclusions (Proposal §6)

No clinical diagnosis, no automated contact with monitored individuals, no image/video
analysis, no suicide-risk prediction, no biometric/wearable data, no treatment
recommendations.

> **Scope note:** the Proposal describes a broad long-term vision (direct social-media APIs,
> professional/clinician roles, admin console, multi-language, GDPR/HIPAA, EMR/HL7-FHIR export).
> The **SRS + SDD define the FYP build scope**: a consent-based, user-facing web app with manual
> paste + CSV submission and the six modules above. This scaffold implements the SRS/SDD scope;
> Proposal-only items are documented as future work, not built.

---

## 3. Technology Stack

Strictly the technologies named in the PDFs:

| Layer | Technology | Source |
|---|---|---|
| **Frontend** | React 18.x (SPA), HTML, CSS, JavaScript | SRS CO-1; Proposal §9 |
| **Backend API** | Node.js 20.x LTS, Express.js — REST + JSON | SRS CO-2, §6.2; Proposal §9 |
| **ML/NLP service** | Python 3.11, scikit-learn, spaCy, NLTK | SRS CO-2, §6.2 |
| **Database** | **MongoDB** | Proposal §9 (Tools & Technologies) |
| **Auth** | JWT-based session tokens | Proposal §7.1; SRS SEC-4/7 |
| **Comms** | HTTPS/TLS 1.2+, RESTful JSON, multipart CSV upload | SRS §6.4 |
| **Tools** | GitHub (version control), Postman (API testing) | Proposal §9 |

Supporting npm packages (`mongoose`, `jsonwebtoken`, `bcryptjs`, `multer`, `cors`, `dotenv`,
`react-router-dom`, `vite`) are implementation plumbing for the named technologies above, not new
stack choices.

> **Database discrepancy (documented for honesty):** the SDD's data dictionary is written
> generically ("relational database, e.g. PostgreSQL/MySQL", integer PKs). The **Proposal names
> MongoDB**, and the project plan phases in "MongoDB Integration" — so MongoDB is the database.
> In Mongoose the integer PKs map to MongoDB `_id` / ObjectId references; attributes and enums are
> unchanged.

---

## 4. Project Architecture

Three-tier client–server system (SDD §3), six modules in the application tier:

```
┌──────────────────────────┐   REST/JSON (HTTPS)   ┌───────────────────────────────┐
│  CLIENT TIER             │ ◄──────────────────► │  APPLICATION TIER             │
│  React 18 SPA            │                       │  Node.js 20 + Express API     │
│  Dashboard · Daily Log · │   multipart CSV      │  ├─ Auth (JWT)                 │
│  Sentiment Alert ·       │ ───────────────────► │  ├─ Data Collection Module    │
│  Crisis Support ·        │                       │  ├─ Alert System Module       │
│  History · Trends ·      │                       │  ├─ Behavioral Analysis Mod.  │
│  Privacy/Profile         │                       │  ├─ Dashboard aggregation     │
└──────────────────────────┘                       │  └─ ML-service client         │
                                                   └───────────┬───────────────────┘
                                                               │ protected internal API
                                                   ┌───────────▼───────────────────┐
                                                   │  Python 3.11 service          │
                                                   │  scikit-learn · spaCy · NLTK  │
                                                   │  ├─ NLP Processing Module     │
                                                   │  └─ Depression Detection Mod. │
                                                   └───────────┬───────────────────┘
                                                               │
                                                   ┌───────────▼───────────────────┐
                                                   │  DATA TIER — MongoDB          │
                                                   │  users · posts · processedtexts│
                                                   │  · analysisresults · alerts   │
                                                   │  · behavioralpatterns         │
                                                   └───────────────────────────────┘
```

**Pipeline flow (SDD §3.2):** consent → submit text/CSV → validate & store `Post` →
preprocess/extract → `ProcessedText` → classifier → `AnalysisResult` (score + level) →
update `BehavioralPattern` → if High, create `Alert` + notify → dashboard reflects result.

---

## 5. Folder Structure

```
.
├── DepalertAi.pdf                     # Project Proposal (source of truth)
├── SRS_DepressionAlertAI 30 %.pdf     # SRS (source of truth)
├── SDD_DepressionAlert_AI.pdf         # SDD (source of truth)
├── PROJECT_REQUIREMENTS.txt           # Condensed requirements reference
├── README.md
├── docs/extracted-text/               # Plain-text extracts of the 3 PDFs
│
├── frontend/                          # React 18 SPA (Phase 1)
│   ├── index.html  vite.config.js  package.json  .env.example
│   ├── public/
│   └── src/
│       ├── main.jsx  App.jsx  index.css
│       ├── routes/AppRoutes.jsx       # route table (public + protected)
│       ├── context/AuthContext.jsx    # JWT session state (FR-2, SEC-4/7)
│       ├── services/api.js            # REST client -> backend
│       ├── components/
│       │   ├── layout/                # AppLayout, Sidebar (Dashboard, Daily Log,
│       │   │                          #   Privacy, Crisis Support — SDD §8)
│       │   ├── alerts/                # SentimentAlertModal (Take 30-min break /
│       │   │                          #   Dismiss → Viewed / Dismissed)
│       │   ├── charts/                # trend + volatility visualizations
│       │   └── common/
│       ├── pages/
│       │   ├── auth/                  # LoginPage, RegisterPage
│       │   ├── dashboard/             # DashboardPage
│       │   ├── daily-log/             # DailyLogPage (Depression Evaluation)
│       │   ├── analysis-result/       # AnalysisResultPage (View Risk Score)
│       │   ├── analysis-history/      # AnalysisHistoryPage
│       │   ├── behavioral-trends/     # BehavioralTrendsPage
│       │   ├── crisis-support/        # CrisisSupportPage
│       │   └── privacy/               # PrivacyProfilePage (consent mgmt)
│       ├── hooks/  utils/  assets/
│
├── backend/                           # Node.js/Express API (Phase 2)
│   ├── package.json  .env.example
│   ├── uploads/                       # temp CSV files (discarded after parse — SDD §5)
│   └── src/
│       ├── index.js  app.js
│       ├── config/                    # env.js, db.js (MongoDB — Phase 3)
│       ├── models/                    # User, Post, ProcessedText, AnalysisResult,
│       │                              #   BehavioralPattern, Alert  (SDD §5.1)
│       ├── routes/                    # auth, user, submission, analysis, trend,
│       │                              #   alert, crisisSupport
│       ├── controllers/               # one per route module
│       ├── middleware/                # auth (JWT), consent, upload (CSV), errors
│       ├── services/                  # mlService client, alert, behavioralAnalysis
│       └── utils/                     # csvValidator, riskLevel
│
└── ml-service/                        # Python 3.11 NLP/ML service (Phase 2)
    ├── requirements.txt  .env.example
    ├── tests/
    └── app/
        ├── main.py                    # protected internal API (SRS §6.2)
        ├── preprocessing/             # text_cleaner, tokenizer
        ├── features/                  # sentiment, linguistic_features
        ├── detection/                 # model_loader, risk_scorer
        ├── behavioral/                # pattern_analyzer
        └── models/artifacts/          # trained model files (MODEL_VERSION)
```

---

## 6. Required Pages / Interfaces

Nine interfaces (SRS §6.1) plus the alert modal (SDD §8.1.3):

| # | Interface | Route (planned) | Key contents |
|---|---|---|---|
| 1 | Registration | `/register` | name, email, password; validation errors → Login |
| 2 | Login | `/login` | email, password → Dashboard |
| 3 | Dashboard | `/` | Digital Sentiment Score, 7-day usage-vs-mood chart, mood-by-platform breakdown, preventive actions (Mute Keywords, Feed Filter, Nightly Pause, START 30-MIN DETOX), live sentiment-monitor feed; options: Get Evaluation / Risk Score / History / Trends |
| 4 | Daily Log — Depression Evaluation | `/daily-log` | paste text OR upload CSV; linguistic-marker panel; Sentiment Volatility timeline; Post & Comment Deep Dive (Social Feed / Direct Messages toggle) |
| 5 | Analysis Result | `/analysis-result` | latest risk score, Low/Moderate/High level, sentiment, indicators, brief explanation |
| 6 | Analysis History | `/history` | records by date: date, score, level, sentiment; record detail |
| 7 | Behavioural Trends | `/trends` | charts + summaries of risk/sentiment/emotion changes |
| 8 | Crisis Support & Resources | `/crisis-support` | helplines, emergency contacts, breathing exercises (START SESSION), guided meditation (OPEN), mood-boost audio (OPEN PLAYLIST), learning library |
| 9 | Privacy & Profile | `/privacy` | privacy info, grant/revoke consent, account details |
| — | Sentiment Alert (modal) | overlay | non-alarming explanation; "Take a 30-min break" → Viewed, "Dismiss" → Dismissed |

---

## 7. Development Phases

### Phase 1 — Frontend (next prompt)

Build the complete React 18 UI: all 9 interfaces + Sentiment Alert modal, sidebar layout,
routing with protected routes, auth context, API client, form validation states, empty/error
states, color-coded risk indicators, and all SDD screen objects/actions — consistent, calm,
responsive design (USE-1..5). Backend responses may be mocked until Phase 2.

### Phase 2 — Backend

Implement the Express REST API (all SRS §6.2 interfaces), JWT auth, consent enforcement,
submission validation, CSV handling, the six-module pipeline, and the internal Python service
(text cleaning → features → risk score → behavioral patterns). CSV files are temporary and
deleted after rows are persisted (SDD §5).

### Phase 3 — MongoDB Integration

Connect via Mongoose (`MONGODB_URI`); implement the six entities from the SDD data
dictionary; enforce per-user data isolation (`user_id` scoping, SEC-5); salted password
hashing (SEC-3); `model_version` stored on every `AnalysisResult` for traceability.

---

## 8. Environment Variables

Copy each `.env.example` to `.env` and fill values. `.env` is gitignored — never commit secrets.

**`backend/.env`**

| Variable | Purpose |
|---|---|
| `NODE_ENV` / `PORT` | Runtime env / API port (default 5000) |
| `CLIENT_URL` | Frontend origin for CORS |
| `MONGODB_URI` | MongoDB connection string (local or Atlas free tier) |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Session-token signing / lifetime (SEC-4, SEC-7) |
| `ML_SERVICE_URL` / `ML_SERVICE_API_KEY` | Protected internal Python service (SRS §6.2) |
| `HIGH_RISK_THRESHOLD` | Score (0–100) that triggers a High alert — default 70 (SDD §6.3) |
| `MAX_CSV_FILE_SIZE_MB` / `CSV_UPLOAD_DIR` | Secure CSV upload limits (SEC-6) |

**`frontend/.env`**: `VITE_API_BASE_URL` — backend REST base URL.
**`ml-service/.env`**: `ML_SERVICE_PORT`, `ML_SERVICE_API_KEY`, `MODEL_VERSION`.

---

## 9. Setup Instructions

```bash
# Frontend (React 18)
cd frontend && npm install && cp .env.example .env && npm run dev     # :5173

# Backend (Node 20 LTS)
cd backend && npm install && cp .env.example .env && npm run dev      # :5000

# ML service (Python 3.11)
cd ml-service && python -m venv .venv && .venv\Scripts\activate       # Windows
pip install -r requirements.txt && cp .env.example .env

# MongoDB (Phase 3): local mongod, or a free MongoDB Atlas M0 cluster
# -> paste the connection string into backend/.env MONGODB_URI
```

Scaffold note: backend `routes/`, `controllers/`, `models/` and `ml-service/` files are
**intentional stubs** annotated with their source requirement. The **frontend is fully
implemented** (Phase 1 complete) with a mock API layer in `frontend/src/services/` that Phase 2
replaces with real `fetch()` calls to `VITE_API_BASE_URL` — page/component code stays unchanged.

**Demo accounts** (mock auth): `demo@depalert.ai / demo1234` (Standard) ·
`viewer@depalert.ai / viewer1234` (Authorized Viewer).

---

## 10. Future Implementation Steps

1. Phase 1 frontend per §7, verified against SRS use-case flows UC-1..UC-8.
2. Phase 2 backend + Python service; train the classifier on ethically sourced mental-health
   text datasets (CO-3); keep `MODEL_VERSION` artifacts out of git.
3. Phase 3 persistence + isolation.
4. Proposal-level expansion (post-FYP): direct social-media API ingestion, clinician/professional
   roles & dashboards, admin console, email/SMS alerts, report export (PDF/CSV/JSON, HL7 FHIR),
   multi-language NLP, differential privacy, EMR integration.

## 11. Deployment Considerations (free-tier friendly)

No technology beyond the PDFs is required; each tier maps cleanly to a free host:

- **Frontend** → static `vite build` output → any free static host (e.g. Vercel/Netlify/GitHub Pages). Set `VITE_API_BASE_URL` to the deployed API.
- **Backend** → Node web service on a free tier (e.g. Render/Railway); HTTPS provided by the platform satisfies SEC-1.
- **ML service** → small Python web service on a free tier; keep it private — reachable only by the backend via `ML_SERVICE_API_KEY`.
- **MongoDB** → Atlas M0 free cluster; connection string goes in `MONGODB_URI`.

Config is fully env-driven (no hardcoded URLs/secrets), so each tier deploys independently.
