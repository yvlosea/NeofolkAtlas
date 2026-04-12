-- ============================================================
-- Neofolk Atlas — Supabase Migration Script
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. USER ROLES (multi-role per account)
create table if not exists public.user_roles (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  role        text check (role in ('seeker', 'curator', 'arbiter')) not null,
  is_active   boolean default true,
  created_at  timestamptz default now()
);
create unique index if not exists user_roles_unique on public.user_roles(user_id, role);
alter table public.user_roles enable row level security;
create policy "Users manage own roles" on public.user_roles
  for all using (auth.uid() = user_id);

-- 2. CURATOR PROFILES
create table if not exists public.curator_profiles (
  id                  uuid default gen_random_uuid() primary key,
  user_id             uuid references auth.users(id) on delete cascade unique not null,
  name                text,
  teaching_style      text,
  domains             text[],
  verification_status text check (verification_status in ('none','pending','verified')) default 'none',
  portfolio_url       text,
  curator_code        text unique,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);
alter table public.curator_profiles enable row level security;
create policy "Curator owners manage profile" on public.curator_profiles
  for all using (auth.uid() = user_id);
create policy "Verified curators are publicly readable" on public.curator_profiles
  for select using (verification_status = 'verified');

-- 3. MODULES
create extension if not exists postgis;

create table if not exists public.modules (
  id                uuid default gen_random_uuid() primary key,
  curator_id        uuid references auth.users(id) on delete cascade not null,
  title             text not null,
  description       text,
  outcomes          text,
  skills            text,
  domain            text,
  duration          text,
  duration_weeks    integer default 1,
  difficulty        text check (difficulty in ('introductory','intermediate','advanced')),
  prerequisites     text,
  syllabus          jsonb default '[]',
  max_capacity      integer default 20,
  current_enrollment integer default 0,
  location_name     text,
  location_coords   geography(point, 4326),
  age_range         int4range default '[13, 99]',
  visibility        boolean default true,
  is_published      boolean default false,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);
alter table public.modules enable row level security;
create policy "Curators manage own modules" on public.modules
  for all using (auth.uid() = curator_id);
create policy "Published modules readable by all" on public.modules
  for select using (is_published = true or visibility = true);
alter table public.modules add column if not exists local_id text;
create unique index if not exists modules_local_id_unique on public.modules(local_id) where local_id is not null;

-- Add spatial index for 'Near Me' logic
create index if not exists modules_location_idx on public.modules using gist(location_coords);

-- 4. BATCHES
create table if not exists public.batches (
  id          uuid default gen_random_uuid() primary key,
  module_id   uuid references public.modules(id) on delete cascade not null,
  curator_id  uuid references auth.users(id) on delete cascade not null,
  batch_name  text not null,
  start_date  date,
  created_at  timestamptz default now()
);
alter table public.batches enable row level security;
create policy "Curators manage own batches" on public.batches
  for all using (auth.uid() = curator_id);

-- 5. BATCH STUDENTS
create table if not exists public.batch_students (
  id          uuid default gen_random_uuid() primary key,
  batch_id    uuid references public.batches(id) on delete cascade not null,
  student_id  uuid references auth.users(id) on delete cascade not null,
  enrolled_at timestamptz default now(),
  unique(batch_id, student_id)
);
alter table public.batch_students enable row level security;
create policy "Curator sees own batch students" on public.batch_students
  for all using (
    exists (select 1 from public.batches b where b.id = batch_id and b.curator_id = auth.uid())
  );
create policy "Students see own enrollment" on public.batch_students
  for select using (auth.uid() = student_id);

-- 6. ATTENDANCE LOGS
create table if not exists public.attendance_logs (
  id         uuid default gen_random_uuid() primary key,
  batch_id   uuid references public.batches(id) on delete cascade not null,
  date       date not null,
  records    jsonb default '[]',
  created_at timestamptz default now(),
  unique(batch_id, date)
);
alter table public.attendance_logs enable row level security;
create policy "Curator manages attendance" on public.attendance_logs
  for all using (
    exists (select 1 from public.batches b where b.id = batch_id and b.curator_id = auth.uid())
  );

-- 7. TEACHING LOGS
create table if not exists public.teaching_logs (
  id            uuid default gen_random_uuid() primary key,
  batch_id      uuid references public.batches(id) on delete cascade not null,
  module_id     uuid references public.modules(id) on delete cascade not null,
  curator_id    uuid references auth.users(id) on delete cascade not null,
  date          date not null,
  topics        text,
  notes         text,
  observations  text,
  created_at    timestamptz default now()
);
alter table public.teaching_logs enable row level security;
create policy "Curator manages teaching logs" on public.teaching_logs
  for all using (auth.uid() = curator_id);

-- 8. NODES
create table if not exists public.nodes (
  id                  uuid default gen_random_uuid() primary key,
  name                text not null,
  lat                 numeric,
  lng                 numeric,
  subjects            text[],
  curator_id          uuid references auth.users(id),
  verification_status text check (verification_status in ('pending','verified')) default 'pending',
  format              text check (format in ('offline','hybrid','online')),
  created_at          timestamptz default now()
);
alter table public.nodes enable row level security;
create policy "Verified nodes publicly readable" on public.nodes
  for select using (verification_status = 'verified');

-- 9. GUILDS
create table if not exists public.guilds (
  id          uuid default gen_random_uuid() primary key,
  topic       text not null,
  domain      text,
  description text,
  duration    text,
  creator_id  uuid references auth.users(id) on delete cascade not null,
  status      text check (status in ('active','completed','certified')) default 'active',
  arbiter_id  uuid references auth.users(id),
  created_at  timestamptz default now()
);
alter table public.guilds enable row level security;
create policy "Guild creators manage guilds" on public.guilds
  for all using (auth.uid() = creator_id);
create policy "Members can read guilds" on public.guilds
  for select using (
    exists (select 1 from public.guild_members gm where gm.guild_id = id and gm.user_id = auth.uid())
  );

-- 10. GUILD MEMBERS
create table if not exists public.guild_members (
  id         uuid default gen_random_uuid() primary key,
  guild_id   uuid references public.guilds(id) on delete cascade not null,
  user_id    uuid references auth.users(id) on delete cascade not null,
  joined_at  timestamptz default now(),
  unique(guild_id, user_id)
);
alter table public.guild_members enable row level security;
create policy "Members manage own membership" on public.guild_members
  for all using (auth.uid() = user_id);

-- 11. DISCOVER CONTENT
create table if not exists public.discover_content (
  id          uuid default gen_random_uuid() primary key,
  uploader_id uuid references auth.users(id) on delete cascade not null,
  type        text check (type in ('video','explainer','diagram','reel','project','media')),
  title       text not null,
  url         text,
  description text,
  domain      text,
  scope       text check (scope in ('local','national')) default 'national',
  status      text check (status in ('pending','approved','rejected','flagged')) default 'pending',
  arbiter_id  uuid references auth.users(id),
  created_at  timestamptz default now()
);
alter table public.discover_content enable row level security;
create policy "Uploaders manage own content" on public.discover_content
  for all using (auth.uid() = uploader_id);
create policy "Approved content viewable by all" on public.discover_content
  for select using (status = 'approved');

-- 12. DISCOVER BOARDS
create table if not exists public.discover_boards (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  name       text not null,
  created_at timestamptz default now()
);
alter table public.discover_boards enable row level security;
create policy "Users manage own boards" on public.discover_boards
  for all using (auth.uid() = user_id);

-- 13. BOARD ITEMS
create table if not exists public.board_items (
  id         uuid default gen_random_uuid() primary key,
  board_id   uuid references public.discover_boards(id) on delete cascade not null,
  content_id uuid references public.discover_content(id) on delete cascade not null,
  saved_at   timestamptz default now(),
  unique(board_id, content_id)
);
alter table public.board_items enable row level security;
create policy "Users manage own board items" on public.board_items
  for all using (
    exists (select 1 from public.discover_boards db where db.id = board_id and db.user_id = auth.uid())
  );

-- 14. FORUM THREADS
create table if not exists public.forum_threads (
  id         uuid default gen_random_uuid() primary key,
  author_id  uuid references auth.users(id) on delete cascade not null,
  category   text check (category in ('node_experiences','study_collaboration','subject_discussion','local_opportunities')),
  title      text not null,
  body       text,
  node_id    uuid references public.nodes(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.forum_threads enable row level security;
create policy "Node members can post threads" on public.forum_threads
  for all using (auth.uid() = author_id);
create policy "Node members read threads" on public.forum_threads
  for select using (true);

-- 15. FORUM REPLIES
create table if not exists public.forum_replies (
  id         uuid default gen_random_uuid() primary key,
  thread_id  uuid references public.forum_threads(id) on delete cascade not null,
  author_id  uuid references auth.users(id) on delete cascade not null,
  body       text not null,
  created_at timestamptz default now()
);
alter table public.forum_replies enable row level security;
create policy "Authors manage own replies" on public.forum_replies
  for all using (auth.uid() = author_id);
create policy "All can read replies" on public.forum_replies
  for select using (true);

-- 16. ACHIEVEMENTS
create table if not exists public.achievements (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  type        text not null,
  unlocked_at timestamptz default now(),
  unique(user_id, type)
);
alter table public.achievements enable row level security;
create policy "Users manage own achievements" on public.achievements
  for all using (auth.uid() = user_id);

-- 17. NEO SCORES
create table if not exists public.neo_scores (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  role        text check (role in ('seeker','curator','arbiter')) not null,
  score       integer default 0,
  breakdown   jsonb default '{}',
  updated_at  timestamptz default now(),
  unique(user_id, role)
);
alter table public.neo_scores enable row level security;
drop policy if exists "Users read own scores" on public.neo_scores;
drop policy if exists "Users manage own neo scores" on public.neo_scores;
drop policy if exists "Curator neo scores publicly readable" on public.neo_scores;
create policy "Users manage own neo scores" on public.neo_scores
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create policy "Curator neo scores publicly readable" on public.neo_scores
  for select using (role = 'curator');

-- 18. ENROLLMENTS
create table if not exists public.enrolled_modules (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  module_id     uuid references public.modules(id) on delete cascade not null,
  status        text check (status in ('enrolled','in_progress','completed','dropped')) default 'enrolled',
  enrolled_at   timestamptz default now(),
  completed_at  timestamptz,
  unique(user_id, module_id)
);
alter table public.enrolled_modules enable row level security;
drop policy if exists "Users manage own enrollments" on public.enrolled_modules;
create policy "Users manage own enrollments" on public.enrolled_modules
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 19. NOTES
create table if not exists public.notes (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  module_id   uuid references public.modules(id) on delete cascade,
  title       text,
  body        text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table public.notes enable row level security;
drop policy if exists "Users manage own notes" on public.notes;
create policy "Users manage own notes" on public.notes
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 20. Storage bucket for avatars (run separately if needed)
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
-- create policy "Avatar uploads" on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
-- create policy "Avatar reads" on storage.objects for select using (bucket_id = 'avatars');

-- ============================================================
-- Done. All tables created with RLS enabled.
-- ============================================================
