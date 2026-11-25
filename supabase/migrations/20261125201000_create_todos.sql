-- Applied to app-foundation-dev and app-foundation-prod on 2026-11-25.
create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  done boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.todos enable row level security;

-- DEMO ONLY: anyone with your anon key can read and write.
-- Replace with per-user policies (auth.uid() = user_id) once you add sign-in.
create policy "demo read"   on public.todos for select using (true);
create policy "demo insert" on public.todos for insert with check (true);
create policy "demo update" on public.todos for update using (true);
