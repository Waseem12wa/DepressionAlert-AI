// Express app assembly — Phase 2.
// Middleware: JSON parsing, CORS (CLIENT_URL), auth, consent, errors.
// Routers mounted under /api per SRS 6.2 interfaces:
//   /api/auth            register, login, logout
//   /api/users           profile + consent management
//   /api/submissions     manual text submission + CSV upload
//   /api/analysis        latest result + analysis history
//   /api/trends          behavioral-trend retrieval
//   /api/alerts          alert retrieval + status updates (Viewed/Dismissed)
//   /api/crisis-support  crisis-support resource retrieval
