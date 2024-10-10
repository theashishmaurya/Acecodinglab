create table
  public.invited_users (
    id uuid not null default extensions.uuid_generate_v4 (),
    session_id uuid null,
    user_email text not null,
    constraint invited_users_pkey primary key (id),
    constraint invited_users_session_id_fkey foreign key (session_id) references interview_sessions (id)
  ) tablespace pg_default;