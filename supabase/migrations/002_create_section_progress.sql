-- Create section_progress table for tracking which sections each user has read
CREATE TABLE IF NOT EXISTS section_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id INTEGER NOT NULL,
  section_id INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, module_id, section_id)
);

-- Index for fast lookups by user
CREATE INDEX IF NOT EXISTS idx_section_progress_user_id ON section_progress(user_id);

-- Index for looking up section progress per module
CREATE INDEX IF NOT EXISTS idx_section_progress_user_module ON section_progress(user_id, module_id);

-- Auto-update updated_at on row modification
CREATE OR REPLACE FUNCTION update_section_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_section_progress_updated_at ON section_progress;
CREATE TRIGGER trg_section_progress_updated_at
  BEFORE UPDATE ON section_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_section_progress_updated_at();
