create table
  public.interview_sessions (
    id uuid not null default extensions.uuid_generate_v4 (),
    title text not null,
    description text null,
    created_by uuid null,
    created_at timestamp with time zone null default current_timestamp,
    start_date timestamp with time zone null,
    end_date timestamp with time zone null,
    max_participants integer null,
    is_public boolean null default false,
    tasks jsonb not null,
    duration numeric null default '30'::numeric,
    constraint interview_sessions_pkey primary key (id),
    constraint interview_sessions_created_by_fkey foreign key (created_by) references users (id)
  ) tablespace pg_default;