// Alert model (SDD 5.1) — Phase 3.
//   analysis_result_id: FK -> AnalysisResult (triggering result)
//   message: String (e.g., high concentration of negative sentiment)
//   status: Enum (New, Viewed, Dismissed)
//   created_at: DateTime
// Notification hierarchy: base Notification -> InAppAlert / EmailAlert
// (EmailAlert optional per SDD 4.1).
