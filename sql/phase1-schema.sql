-- Phase 1: Complete Quiniela Database Schema
-- Run this in Supabase SQL Editor

-- ============================================================================
-- PROFILES TABLE (extends auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT UNIQUE NOT NULL,
  avatar TEXT DEFAULT 'default',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- If profiles already exists, just add is_admin column (this won't fail if it's already there)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can only update their own profile" ON profiles;

-- Create RLS policies
CREATE POLICY "Users can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can only update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- ============================================================================
-- HELPER FUNCTION: Check if user is admin
-- ============================================================================
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND is_admin = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SEASONS TABLE
-- ============================================================================
CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT CHECK (status IN ('upcoming', 'active', 'completed')) DEFAULT 'upcoming',
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view seasons" ON seasons FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can create seasons" ON seasons FOR INSERT TO authenticated
  WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Only admins can update seasons" ON seasons FOR UPDATE TO authenticated
  USING (is_admin(auth.uid()));

-- ============================================================================
-- JORNADAS TABLE (matchdays)
-- ============================================================================
CREATE TABLE jornadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  jornada_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT CHECK (status IN ('upcoming', 'open', 'locked', 'results_entered')) DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (season_id, jornada_number)
);

ALTER TABLE jornadas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view jornadas" ON jornadas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can create jornadas" ON jornadas FOR INSERT TO authenticated
  WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Only admins can update jornadas" ON jornadas FOR UPDATE TO authenticated
  USING (is_admin(auth.uid()));

-- ============================================================================
-- BOLETOS TABLE (user tickets for each jornada)
-- ============================================================================
CREATE TABLE boletos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jornada_id UUID NOT NULL REFERENCES jornadas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  predictions JSONB DEFAULT NULL, -- {matches: [{match_id, prediction, confidence}]}
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  processing_status TEXT CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  error_message TEXT DEFAULT NULL,
  UNIQUE (jornada_id, user_id)
);

ALTER TABLE boletos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all boletos for a jornada" ON boletos FOR SELECT TO authenticated
  USING (true);
CREATE POLICY "Users can only insert their own boleto" ON boletos FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can only update their own pending boleto" ON boletos FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND processing_status IN ('pending', 'failed'));

-- ============================================================================
-- RESULTS TABLE (actual match outcomes)
-- ============================================================================
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jornada_id UUID NOT NULL REFERENCES jornadas(id) ON DELETE CASCADE,
  match_number INTEGER NOT NULL,
  match_description TEXT NOT NULL,
  actual_result CHAR(1) NOT NULL CHECK (actual_result IN ('1', 'X', '2')),
  entered_by UUID NOT NULL REFERENCES auth.users(id),
  entered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (jornada_id, match_number)
);

ALTER TABLE results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view results" ON results FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can insert results" ON results FOR INSERT TO authenticated
  WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Only admins can update results" ON results FOR UPDATE TO authenticated
  USING (is_admin(auth.uid()));

-- ============================================================================
-- SCORES TABLE (calculated per user per jornada)
-- ============================================================================
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jornada_id UUID NOT NULL REFERENCES jornadas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  correct_predictions INTEGER DEFAULT 0,
  total_matches INTEGER DEFAULT 0,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (jornada_id, user_id)
);

ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view scores" ON scores FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only system can insert scores" ON scores FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY "Only system can update scores" ON scores FOR UPDATE TO authenticated USING (false);

-- ============================================================================
-- PRIZES TABLE (prize allocation)
-- ============================================================================
CREATE TABLE prizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jornada_id UUID NOT NULL REFERENCES jornadas(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  prize_amount DECIMAL(10, 2),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  UNIQUE (jornada_id, rank)
);

ALTER TABLE prizes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view prizes" ON prizes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can manage prizes" ON prizes FOR INSERT TO authenticated
  WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Only admins can update prizes" ON prizes FOR UPDATE TO authenticated
  USING (is_admin(auth.uid()));

-- ============================================================================
-- RANKINGS VIEW (materialized on-demand)
-- ============================================================================
-- This is a query-based view, not a materialized table. Can be cached in application.
-- SELECT
--   r.user_id,
--   p.nickname,
--   s.season_id,
--   COALESCE(SUM(sc.points), 0) as total_points,
--   COUNT(DISTINCT sc.jornada_id) as jornadas_completed,
--   RANK() OVER (PARTITION BY s.id ORDER BY COALESCE(SUM(sc.points), 0) DESC) as rank
-- FROM seasons s
-- JOIN jornadas j ON s.id = j.season_id
-- LEFT JOIN scores sc ON j.id = sc.jornada_id
-- LEFT JOIN auth.users u ON sc.user_id = u.id
-- LEFT JOIN profiles p ON u.id = p.id
-- WHERE s.id = <season_id>
-- GROUP BY r.user_id, p.nickname, s.season_id
-- ORDER BY rank;

-- ============================================================================
-- INDEXES (for performance)
-- ============================================================================
CREATE INDEX idx_jornadas_season_id ON jornadas(season_id);
CREATE INDEX idx_boletos_jornada_id ON boletos(jornada_id);
CREATE INDEX idx_boletos_user_id ON boletos(user_id);
CREATE INDEX idx_boletos_processing_status ON boletos(processing_status);
CREATE INDEX idx_results_jornada_id ON results(jornada_id);
CREATE INDEX idx_scores_jornada_id ON scores(jornada_id);
CREATE INDEX idx_scores_user_id ON scores(user_id);
CREATE INDEX idx_scores_points ON scores(points DESC);
CREATE INDEX idx_prizes_jornada_id ON prizes(jornada_id);

-- ============================================================================
-- HELPER: Set admin status for your user
-- ============================================================================
-- Run this to make yourself admin:
-- UPDATE profiles SET is_admin = true WHERE id = '<your-user-id>';
-- (Get your user ID from the profiles table)
