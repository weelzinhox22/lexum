-- Allow multiple exam attempts per user
-- Remove the unique constraint on user_id so each attempt creates a new row

ALTER TABLE general_exam_results DROP CONSTRAINT IF EXISTS unique_user_exam;

-- Create index on (user_id, completed_at) for efficient "latest attempt" queries
CREATE INDEX IF NOT EXISTS idx_general_exam_results_user_attempt
  ON general_exam_results(user_id, completed_at DESC);
