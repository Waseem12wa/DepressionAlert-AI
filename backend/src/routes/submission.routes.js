// Submission routes — Data Collection Module (SRS 6.2, UC-4,
// FR-4/FR-5/FR-6) — Phase 2.
//   POST /api/submissions/text   manual paste (JSON)
//   POST /api/submissions/csv    CSV batch upload (multipart/form-data)
// Both run validateAndStorePost() semantics: consent check, empty /
// malformed / duplicate rejection (SDD 6.1).
