/**
 * Interview types and interfaces
 */

export type InterviewType = 'live' | 'ai_conducted' | 'take_home';
export type InterviewStatus = 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type ParticipantRole = 'interviewer' | 'candidate' | 'observer';
export type InviteStatus = 'pending' | 'sent' | 'accepted' | 'declined' | 'expired';

export interface Interview {
  id: string;
  title: string;
  description?: string;
  interviewer_id: string;
  organization_id?: string;
  
  // Scheduling
  scheduled_at?: string;
  duration_minutes: number;
  timezone: string;
  
  // Status
  status: InterviewStatus;
  
  // Type and Configuration
  type: InterviewType;
  auto_record: boolean;
  anti_cheat_enabled: boolean;
  ai_proctoring_enabled: boolean;
  
  // Challenges
  selected_challenges: string[];
  
  // Notes
  notes?: string;
  
  // Settings
  settings: InterviewSettings;
  
  created_at: string;
  updated_at: string;
}

export interface InterviewSettings {
  allow_hints: boolean;
  max_hints_per_challenge: number;
  show_timer: boolean;
  allow_code_explanation: boolean;
  require_fullscreen: boolean;
  block_copy_paste: boolean;
  enable_breaks: boolean;
  max_breaks: number;
}

export interface InterviewParticipant {
  id: string;
  interview_id: string;
  user_id?: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role: ParticipantRole;
  invite_token?: string;
  invite_status: InviteStatus;
  invite_expires_at?: string;
  invited_at?: string;
  joined_at?: string;
  left_at?: string;
  connection_quality?: string;
  created_at: string;
}

export interface InterviewSession {
  id: string;
  interview_id: string;
  participant_id: string;
  challenge_key: string;
  
  // Timing
  started_at?: string;
  submitted_at?: string;
  time_spent_seconds?: number;
  
  // Code
  code_snapshot?: string;
  language: string;
  
  // Status
  status: 'not_started' | 'in_progress' | 'submitted' | 'timeout';
  
  // Hints
  hints_used: number;
  
  // AI Evaluation
  ai_score?: number;
  ai_feedback?: string;
  code_quality_score?: number;
  communication_score?: number;
  problem_solving_score?: number;
  
  created_at: string;
  updated_at: string;
}

export interface CreateInterviewInput {
  title: string;
  description?: string;
  type: InterviewType;
  scheduled_at?: string;
  duration_minutes: number;
  timezone: string;
  auto_record: boolean;
  anti_cheat_enabled: boolean;
  ai_proctoring_enabled: boolean;
  selected_challenges: string[];
  notes?: string;
  settings: Partial<InterviewSettings>;
  participants?: CreateParticipantInput[];
}

export interface CreateParticipantInput {
  email: string;
  name?: string;
  role: ParticipantRole;
}

export interface InterviewWithParticipants extends Interview {
  participants: InterviewParticipant[];
}

export interface InterviewListFilters {
  status?: InterviewStatus;
  type?: InterviewType;
  from?: string;
  to?: string;
  search?: string;
}

export interface ChallengeSummary {
  key: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_time: number;
  tags: string[];
  category: string;
}