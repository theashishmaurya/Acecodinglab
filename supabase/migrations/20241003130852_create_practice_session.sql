create table
  public.practice_sessions (
    id uuid not null default extensions.uuid_generate_v4 (),
    user_id uuid null,
    question_id text not null,
    created_at timestamp with time zone null default current_timestamp,
    updated_at timestamp with time zone null default current_timestamp,
    completed_at timestamp with time zone null,
    current_code text not null default ''::text,
    language text not null,
    status text not null,
    constraint practice_sessions_pkey primary key (id),
    constraint practice_sessions_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
    constraint practice_sessions_status_check check (
      (
        status = any (array['in_progress'::text, 'completed'::text])
      )
    )
  ) tablespace pg_default;

create index if not exists idx_practice_sessions_user_id on public.practice_sessions using btree (user_id) tablespace pg_default;

create index if not exists idx_practice_sessions_question_id on public.practice_sessions using btree (question_id) tablespace pg_default;

create trigger update_practice_sessions_updated_at before
update on practice_sessions for each row
execute function update_updated_at_column ();