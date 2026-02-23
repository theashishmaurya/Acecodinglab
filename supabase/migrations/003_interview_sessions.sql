-- Interview Session Management Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table (for team management)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  brand_colors JSONB DEFAULT '{}'::jsonb,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'team', 'enterprise')),
  max_interviews_per_month INTEGER DEFAULT 10,
  max_team_members INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  interviewer_id UUID REFERENCES auth.users(id) NOT NULL,
  organization_id UUID REFERENCES organizations(id),
  
  -- Scheduling
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 60,
  timezone TEXT DEFAULT 'UTC',
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  
  -- Type and Configuration
  type TEXT DEFAULT 'live' CHECK (type IN ('live', 'ai_conducted', 'take_home')),
  auto_record BOOLEAN DEFAULT true,
  anti_cheat_enabled BOOLEAN DEFAULT true,
  ai_proctoring_enabled BOOLEAN DEFAULT false,
  
  -- Challenges
  selected_challenges TEXT[] DEFAULT '{}',
  
  -- Notes
  notes TEXT,
  
  -- Settings
  settings JSONB DEFAULT '{
    "allow_hints": true,
    "max_hints_per_challenge": 3,
    "show_timer": true,
    "allow_code_explanation": true,
    "require_fullscreen": true,
    "block_copy_paste": true
  }'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview participants table
CREATE TABLE IF NOT EXISTS interview_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE NOT NULL,
  
  -- User info
  user_id UUID REFERENCES auth.users(id),
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  
  -- Role
  role TEXT DEFAULT 'candidate' CHECK (role IN ('interviewer', 'candidate', 'observer')),
  
  -- Invite
  invite_token TEXT UNIQUE,
  invite_status TEXT DEFAULT 'pending' CHECK (invite_status IN ('pending', 'sent', 'accepted', 'declined', 'expired')),
  invite_expires_at TIMESTAMPTZ,
  invited_at TIMESTAMPTZ,
  
  -- Session
  joined_at TIMESTAMPTZ,
  left_at TIMESTAMPTZ,
  connection_quality TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invite tokens table (for secure invite links)
CREATE TABLE IF NOT EXISTS invite_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES interview_participants(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  max_uses INTEGER DEFAULT 1,
  current_uses INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview sessions (per challenge)
CREATE TABLE IF NOT EXISTS interview_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE NOT NULL,
  participant_id UUID REFERENCES interview_participants(id) NOT NULL,
  challenge_key TEXT NOT NULL,
  
  -- Timing
  started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  time_spent_seconds INTEGER,
  
  -- Code
  code_snapshot TEXT,
  language TEXT DEFAULT 'javascript',
  
  -- Status
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'timeout')),
  
  -- Hints
  hints_used INTEGER DEFAULT 0,
  
  -- AI Evaluation
  ai_score INTEGER,
  ai_feedback TEXT,
  code_quality_score INTEGER,
  communication_score INTEGER,
  problem_solving_score INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hint usage tracking
CREATE TABLE IF NOT EXISTS hint_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  challenge_id TEXT NOT NULL,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 3),
  hint_text TEXT NOT NULL,
  code_snapshot TEXT,
  session_id UUID REFERENCES interview_sessions(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anti-cheat events (from existing schema)
CREATE TABLE IF NOT EXISTS anti_cheat_events (
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

-- Organization memberships
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'interviewer', 'viewer')),
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(organization_id, user_id)
);

-- Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hint_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Policies for interviews
CREATE POLICY "Users can view their own interviews"
  ON interviews FOR SELECT
  USING (interviewer_id = auth.uid());

CREATE POLICY "Users can create interviews"
  ON interviews FOR INSERT
  WITH CHECK (interviewer_id = auth.uid());

CREATE POLICY "Interviewers can update their interviews"
  ON interviews FOR UPDATE
  USING (interviewer_id = auth.uid());

CREATE POLICY "Participants can view interviews they're in"
  ON interviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM interview_participants 
      WHERE interview_id = interviews.id 
      AND (user_id = auth.uid() OR email = auth.email())
    )
  );

-- Policies for interview_participants
CREATE POLICY "Users can view their own participant records"
  ON interview_participants FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Interviewers can manage participants"
  ON interview_participants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM interviews 
      WHERE id = interview_participants.interview_id 
      AND interviewer_id = auth.uid()
    )
  );

-- Policies for interview_sessions
CREATE POLICY "Users can view their own sessions"
  ON interview_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM interview_participants 
      WHERE id = interview_sessions.participant_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own sessions"
  ON interview_sessions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interview_participants 
      WHERE id = interview_sessions.participant_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own sessions"
  ON interview_sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM interview_participants 
      WHERE id = interview_sessions.participant_id 
      AND user_id = auth.uid()
    )
  );

-- Policies for hint_usage
CREATE POLICY "Users can view their own hint usage"
  ON hint_usage FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own hint usage"
  ON hint_usage FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policies for organizations
CREATE POLICY "Organization members can view their org"
  ON organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members 
      WHERE organization_id = organizations.id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Org owners can update their org"
  ON organizations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM organization_members 
      WHERE organization_id = organizations.id 
      AND user_id = auth.uid() 
      AND role = 'owner'
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_interviews_interviewer ON interviews(interviewer_id);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);
CREATE INDEX IF NOT EXISTS idx_interviews_scheduled ON interviews(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_interviews_organization ON interviews(organization_id);
CREATE INDEX IF NOT EXISTS idx_interview_participants_interview ON interview_participants(interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_participants_user ON interview_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_participants_email ON interview_participants(email);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_interview ON interview_sessions(interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_participant ON interview_sessions(participant_id);
CREATE INDEX IF NOT EXISTS idx_hint_usage_user_challenge ON hint_usage(user_id, challenge_id);
CREATE INDEX IF NOT EXISTS idx_anti_cheat_events_session ON anti_cheat_events(session_id);
CREATE INDEX IF NOT EXISTS idx_invite_tokens_token ON invite_tokens(token);
CREATE INDEX IF NOT EXISTS idx_organization_members_user ON organization_members(user_id);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS interviews_updated_at ON interviews;
CREATE TRIGGER interviews_updated_at
  BEFORE UPDATE ON interviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS interview_sessions_updated_at ON interview_sessions;
CREATE TRIGGER interview_sessions_updated_at
  BEFORE UPDATE ON interview_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS organizations_updated_at ON organizations;
CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate invite token function
CREATE OR REPLACE FUNCTION generate_invite_token(
  p_interview_id UUID,
  p_email TEXT,
  p_role TEXT DEFAULT 'candidate',
  p_expires_days INTEGER DEFAULT 7
)
RETURNS TEXT AS $$
DECLARE
  v_token TEXT;
  v_participant_id UUID;
BEGIN
  -- Generate secure token
  v_token := 'inv_' || encode(gen_random_bytes(16), 'hex') || '_' || extract(epoch from now())::text;
  
  -- Create participant
  INSERT INTO interview_participants (
    interview_id, email, role, invite_token, invite_status, invite_expires_at, invited_at
  ) VALUES (
    p_interview_id, p_email, p_role, v_token, 'pending', 
    now() + (p_expires_days || ' days')::interval, now()
  ) RETURNING id INTO v_participant_id;
  
  -- Create invite token record
  INSERT INTO invite_tokens (
    token, interview_id, participant_id, expires_at
  ) VALUES (
    v_token, p_interview_id, v_participant_id, now() + (p_expires_days || ' days')::interval
  );
  
  RETURN v_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;