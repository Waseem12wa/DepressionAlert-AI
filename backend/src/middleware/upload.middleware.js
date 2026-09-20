// CSV upload middleware — Phase 2.
// Multipart handling + validation of format, size, malformed and unsafe
// content (FR-5, SEC-6). Files land in CSV_UPLOAD_DIR temporarily and are
// discarded once rows are persisted as Post records (SDD 5).
