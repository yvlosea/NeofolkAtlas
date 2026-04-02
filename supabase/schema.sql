-- Neofolk Atlas Alpha 11.4 - core relational schema
create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'seeker' check (role in ('seeker','curator','arbiter','operator')),
  verified boolean not null default false,
  bio text,
  research_goals text,
  learning_philosophy text,
  created_at timestamptz not null default now()
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text default 'Subject',
  description text,
  learning_approach text,
  expected_outcomes text,
  created_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  guild text not null,
  created_by uuid not null references public.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','approved','denied')),
  denial_reason text,
  location text,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text not null,
  link text,
  visibility text not null default 'private',
  created_at timestamptz not null default now()
);

create table if not exists public.niche_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  interest text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.users(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(student_id, module_id)
);

create table if not exists public.verification_reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid references public.users(id) on delete set null,
  target_id uuid not null,
  target_type text not null,
  decision text not null,
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.tag_links (
  id uuid primary key default gen_random_uuid(),
  tag_id uuid not null references public.tags(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  created_at timestamptz not null default now(),
  unique(tag_id, entity_type, entity_id)
);

create table if not exists public.guild_members (
  id uuid primary key default gen_random_uuid(),
  guild_id uuid not null,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  unique(guild_id, user_id)
);

create table if not exists public.curator_codes (
  id uuid primary key default gen_random_uuid(),
  assigned_to uuid references public.users(id) on delete set null,
  code text not null unique,
  location text,
  created_at timestamptz not null default now()
);

create table if not exists public.highlights (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null,
  entry_type text not null default 'portfolio',
  created_at timestamptz not null default now(),
  unique(entry_id, entry_type)
);

-- Signup sync: auth.users -> public.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, role, verified)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'role','seeker'), false)
  on conflict (id) do update
  set email = excluded.email,
      role = coalesce(excluded.role, public.users.role);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
