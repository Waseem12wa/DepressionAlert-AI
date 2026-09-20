// AnalysisResult model (SDD 5.1) — Phase 3.
//   processed_text_id: FK -> ProcessedText
//   risk_score: Float (0-100)
//   risk_level: Enum (Low, Moderate, High)  // >=70 High, >=40 Moderate
//   model_version: String (ML model version, for traceability)
//   analyzed_at: DateTime
