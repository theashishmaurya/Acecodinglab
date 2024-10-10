create table
  public.interview_attempts (
    id uuid not null default extensions.uuid_generate_v4 (),
    session_id uuid not null,
    user_id uuid not null,
    started_at timestamp with time zone null default current_timestamp,
    completed_at timestamp with time zone null,
    constraint interview_attempts_pkey primary key (id),
    constraint interview_attempts_session_id_fkey foreign key (session_id) references interview_sessions (id),
    constraint interview_attempts_user_id_fkey foreign key (user_id) references users (id)
  ) tablespace pg_default;