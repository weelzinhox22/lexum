-- Create certificates table
-- Each user can have only ONE certificate (UNIQUE user_id)
-- Anyone can query by auth_code for validation (public RLS SELECT)

CREATE TABLE IF NOT EXISTS certificates (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  auth_code TEXT NOT NULL,
  hash TEXT NOT NULL UNIQUE,
  course_name TEXT NOT NULL DEFAULT 'Extensão em Direito Previdenciário e Prática Advocatícia',
  workload TEXT NOT NULL DEFAULT '40 Horas',
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_certificates_auth_code ON certificates(auth_code);
CREATE INDEX IF NOT EXISTS idx_certificates_hash ON certificates(hash);

-- RLS
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Anyone can view certificates (for the public /validate page)
CREATE POLICY "Anyone can view certificates"
  ON certificates FOR SELECT
  USING (true);

-- Authenticated users can insert their own certificate
CREATE POLICY "Users can insert own certificate"
  ON certificates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own certificate (e.g. regenerate visual)
CREATE POLICY "Users can update own certificate"
  ON certificates FOR UPDATE
  USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_certificates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_certificates_updated_at ON certificates;
CREATE TRIGGER trg_certificates_updated_at
  BEFORE UPDATE ON certificates
  FOR EACH ROW
  EXECUTE FUNCTION update_certificates_updated_at();
