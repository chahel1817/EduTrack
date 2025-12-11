/*
  # EduTrack Database Schema - Initial Setup

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `password` (text, hashed)
      - `role` (text: student/teacher)
      - `age` (integer, optional)
      - `phone` (text, optional)
      - `avatar_url` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `quizzes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `subject` (text)
      - `description` (text)
      - `difficulty` (text: easy/medium/hard)
      - `time_limit` (integer, minutes)
      - `is_active` (boolean)
      - `total_points` (integer)
      - `created_by` (uuid, foreign key to users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `questions`
      - `id` (uuid, primary key)
      - `quiz_id` (uuid, foreign key to quizzes)
      - `question_text` (text)
      - `options` (jsonb array)
      - `correct_answer` (integer)
      - `points` (integer)
      - `order_index` (integer)
      - `created_at` (timestamptz)
    
    - `results`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to users)
      - `quiz_id` (uuid, foreign key to quizzes)
      - `score` (integer)
      - `total` (integer)
      - `percentage` (numeric)
      - `time_spent` (integer, seconds)
      - `submitted_at` (timestamptz)
      - `created_at` (timestamptz)
    
    - `answer_details`
      - `id` (uuid, primary key)
      - `result_id` (uuid, foreign key to results)
      - `question_id` (uuid, foreign key to questions)
      - `selected_answer` (integer)
      - `is_correct` (boolean)
      - `points_earned` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Students can only see their own results
    - Teachers can see all results for their quizzes
    - Teachers can only modify their own quizzes

  3. Indexes
    - Index on user email for fast lookups
    - Index on quiz created_by for teacher queries
    - Index on results student_id and quiz_id for performance
    - Index on questions quiz_id for quiz loading
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(name) >= 2),
  email text UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  password text NOT NULL CHECK (length(password) >= 6),
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
  age integer CHECK (age >= 10 AND age <= 100),
  phone text CHECK (phone ~ '^[0-9+\-\s()]{10,}$'),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (length(title) >= 3),
  subject text NOT NULL,
  description text DEFAULT '',
  difficulty text DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  time_limit integer DEFAULT 30 CHECK (time_limit >= 1 AND time_limit <= 180),
  is_active boolean DEFAULT true,
  total_points integer DEFAULT 0,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text text NOT NULL CHECK (length(question_text) >= 5),
  options jsonb NOT NULL,
  correct_answer integer NOT NULL CHECK (correct_answer >= 0),
  points integer DEFAULT 1 CHECK (points >= 1),
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create results table
CREATE TABLE IF NOT EXISTS results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0 CHECK (score >= 0),
  total integer NOT NULL CHECK (total > 0),
  percentage numeric(5,2) DEFAULT 0 CHECK (percentage >= 0 AND percentage <= 100),
  time_spent integer DEFAULT 0 CHECK (time_spent >= 0),
  submitted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, quiz_id)
);

-- Create answer_details table
CREATE TABLE IF NOT EXISTS answer_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  result_id uuid NOT NULL REFERENCES results(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer integer NOT NULL,
  is_correct boolean NOT NULL DEFAULT false,
  points_earned integer DEFAULT 0 CHECK (points_earned >= 0)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_quizzes_created_by ON quizzes(created_by);
CREATE INDEX IF NOT EXISTS idx_quizzes_subject ON quizzes(subject);
CREATE INDEX IF NOT EXISTS idx_quizzes_active ON quizzes(is_active);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_questions_order ON questions(quiz_id, order_index);
CREATE INDEX IF NOT EXISTS idx_results_student ON results(student_id);
CREATE INDEX IF NOT EXISTS idx_results_quiz ON results(quiz_id);
CREATE INDEX IF NOT EXISTS idx_results_submitted ON results(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_answer_details_result ON answer_details(result_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate quiz total points
CREATE OR REPLACE FUNCTION calculate_quiz_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE quizzes 
  SET total_points = (
    SELECT COALESCE(SUM(points), 0)
    FROM questions
    WHERE quiz_id = NEW.quiz_id
  )
  WHERE id = NEW.quiz_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate quiz points
CREATE TRIGGER update_quiz_points AFTER INSERT OR UPDATE OR DELETE ON questions
  FOR EACH ROW EXECUTE FUNCTION calculate_quiz_points();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_details ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid)
  WITH CHECK (id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid);

-- RLS Policies for quizzes table
CREATE POLICY "Anyone can view active quizzes"
  ON quizzes FOR SELECT
  TO authenticated
  USING (is_active = true OR created_by = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid);

CREATE POLICY "Teachers can create quizzes"
  ON quizzes FOR INSERT
  TO authenticated
  WITH CHECK (created_by = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid);

CREATE POLICY "Teachers can update own quizzes"
  ON quizzes FOR UPDATE
  TO authenticated
  USING (created_by = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid)
  WITH CHECK (created_by = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid);

CREATE POLICY "Teachers can delete own quizzes"
  ON quizzes FOR DELETE
  TO authenticated
  USING (created_by = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid);

-- RLS Policies for questions table
CREATE POLICY "Anyone can view questions for active quizzes"
  ON questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = questions.quiz_id
      AND (quizzes.is_active = true OR quizzes.created_by = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid)
    )
  );

CREATE POLICY "Teachers can manage questions for own quizzes"
  ON questions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = questions.quiz_id
      AND quizzes.created_by = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = questions.quiz_id
      AND quizzes.created_by = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid
    )
  );

-- RLS Policies for results table
CREATE POLICY "Students can view own results"
  ON results FOR SELECT
  TO authenticated
  USING (
    student_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid
    OR EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = results.quiz_id
      AND quizzes.created_by = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid
    )
  );

CREATE POLICY "Students can submit results"
  ON results FOR INSERT
  TO authenticated
  WITH CHECK (student_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid);

-- RLS Policies for answer_details table
CREATE POLICY "Users can view answer details for accessible results"
  ON answer_details FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM results
      WHERE results.id = answer_details.result_id
      AND (
        results.student_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid
        OR EXISTS (
          SELECT 1 FROM quizzes
          WHERE quizzes.id = results.quiz_id
          AND quizzes.created_by = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid
        )
      )
    )
  );

CREATE POLICY "Students can insert answer details for own results"
  ON answer_details FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM results
      WHERE results.id = answer_details.result_id
      AND results.student_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid
    )
  );
