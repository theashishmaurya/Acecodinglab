-- AI Interview Platform Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Interviews Table
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  interviewer_id UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  type TEXT DEFAULT 'live' CHECK (type IN ('live', 'ai_conducted', 'take_home')),
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 60,
  max_candidates INTEGER DEFAULT 1,
  auto_record BOOLEAN DEFAULT true,
  anti_cheat_enabled BOOLEAN DEFAULT true,
  ai_proctoring_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Participants (candidates + interviewers)
CREATE TABLE interview_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'candidate' CHECK (role IN ('interviewer', 'candidate', 'observer')),
  invite_token TEXT UNIQUE,
  invite_status TEXT DEFAULT 'pending' CHECK (invite_status IN ('pending', 'accepted', 'declined', 'expired')),
  joined_at TIMESTAMPTZ,
  left_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Challenges (which challenges are part of an interview)
CREATE TABLE interview_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE NOT NULL,
  challenge_key TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  time_limit_minutes INTEGER,
  required BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Sessions (each candidate's session)
CREATE TABLE interview_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE NOT NULL,
  participant_id UUID REFERENCES interview_participants(id) NOT NULL,
  challenge_id UUID REFERENCES interview_challenges(id),
  started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  code_snapshot TEXT,
  language TEXT DEFAULT 'javascript',
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'timeout')),
  
  -- AI Evaluation
  ai_score INTEGER,
  ai_feedback TEXT,
  code_quality_score INTEGER,
  communication_score INTEGER,
  problem_solving_score INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anti-Cheat Events
CREATE TABLE anti_cheat_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES interview_sessions(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'tab_switch', 
    'copy_paste', 
    'devtools_open', 
    'fullscreen_exit',
    'right_click',
    'keyboard_shortcut',
    'window_blur',
    'multiple_faces',
    'no_face_detected',
    'suspicious_audio',
    'external_api_call',
    'unusual_typing_pattern'
  )),
  severity TEXT DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  details JSONB,
  screenshot_url TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- AI Conversation History
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES interview_sessions(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Recordings
CREATE TABLE interview_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE NOT NULL,
  participant_id UUID REFERENCES interview_participants(id),
  recording_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  format TEXT DEFAULT 'webm',
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'error')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidate Evaluations (final report)
CREATE TABLE candidate_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE NOT NULL,
  participant_id UUID REFERENCES interview_participants(id) NOT NULL,
  
  -- Scores
  overall_score INTEGER,
  technical_score INTEGER,
  communication_score INTEGER,
  problem_solving_score INTEGER,
  code_quality_score INTEGER,
  
  -- AI Generated
  ai_summary TEXT,
  strengths TEXT[],
  areas_for_improvement TEXT[],
  
  -- Reviewer Notes
  interviewer_notes TEXT,
  recommendation TEXT CHECK (recommendation IN ('strong_yes', 'yes', 'maybe', 'no', 'strong_no')),
  
  -- Trust/Integrity
  trust_score INTEGER DEFAULT 100,
  cheat_events_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE anti_cheat_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_evaluations ENABLE ROW LEVEL SECURITY;

-- Policies for interviews
CREATE POLICY "Users can view interviews they created or are participants in"
  ON interviews FOR SELECT
  USING (
    interviewer_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM interview_participants 
      WHERE interview_id = interviews.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create interviews"
  ON interviews FOR INSERT
  WITH CHECK (interviewer_id = auth.uid());

CREATE POLICY "Interview creators can update their interviews"
  ON interviews FOR UPDATE
  USING (interviewer_id = auth.uid());

-- Indexes for performance
CREATE INDEX idx_interviews_interviewer ON interviews(interviewer_id);
CREATE INDEX idx_interviews_status ON interviews(status);
CREATE INDEX idx_interview_participants_interview ON interview_participants(interview_id);
CREATE INDEX idx_interview_sessions_interview ON interview_sessions(interview_id);
CREATE INDEX idx_anti_cheat_events_session ON anti_cheat_events(session_id);
CREATE INDEX idx_anti_cheat_events_timestamp ON anti_cheat_events(timestamp);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER interviews_updated_at
  BEFORE UPDATE ON interviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER interview_sessions_updated_at
  BEFORE UPDATE ON interview_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER candidate_evaluations_updated_at
  BEFORE UPDATE ON candidate_evaluations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();