ALTER TABLE studio_entries DROP CONSTRAINT IF EXISTS studio_entries_kind_check;
ALTER TABLE studio_entries ADD CONSTRAINT studio_entries_kind_check
  CHECK (kind IN ('logo','blog','news','case-study','testimonial','promotion'));
