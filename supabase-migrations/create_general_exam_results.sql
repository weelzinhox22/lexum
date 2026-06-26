-- Create table for general exam results
CREATE TABLE IF NOT EXISTS general_exam_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  answers JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint on user_id to ensure only one exam result per user
ALTER TABLE general_exam_results ADD CONSTRAINT unique_user_exam UNIQUE (user_id);

-- Add index for faster lookups
CREATE INDEX idx_general_exam_results_user_id ON general_exam_results(user_id);
CREATE INDEX idx_general_exam_results_score ON general_exam_results(score);
CREATE INDEX idx_general_exam_results_passed ON general_exam_results(passed);

-- Enable Row Level Security
ALTER TABLE general_exam_results ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own exam results
CREATE POLICY "Users can view own exam results"
  ON general_exam_results
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own exam results
CREATE POLICY "Users can insert own exam results"
  ON general_exam_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own exam results
CREATE POLICY "Users can update own exam results"
  ON general_exam_results
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_general_exam_results_updated_at
  BEFORE UPDATE ON general_exam_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
