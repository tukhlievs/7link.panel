-- 7Link panel schema. Run in the Supabase SQL editor.

create extension if not exists pgcrypto;

do $$ begin
  create type public.link_type as enum ('turnstile', 'conditions', 'password');
exception when duplicate_object then null; end $$;

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  title text not null default '',
  destination_url text not null,
  type public.link_type not null,
  max_clicks integer,
  click_count integer not null default 0,
  conditions jsonb not null default '[]'::jsonb,
  password text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists links_user_id_idx on public.links (user_id);

alter table public.links enable row level security;

drop policy if exists links_select_own on public.links;
drop policy if exists links_insert_own on public.links;
drop policy if exists links_update_own on public.links;
drop policy if exists links_delete_own on public.links;

create policy links_select_own on public.links
  for select to authenticated using (auth.uid() = user_id);
create policy links_insert_own on public.links
  for insert to authenticated with check (auth.uid() = user_id);
create policy links_update_own on public.links
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy links_delete_own on public.links
  for delete to authenticated using (auth.uid() = user_id);

-- Atomic gate pass: increments click_count and returns destination,
-- or null when the link is paused or the cap is reached.
create or replace function public.register_click(p_slug text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare dest text;
begin
  update public.links
     set click_count = click_count + 1
   where slug = p_slug
     and active
     and (max_clicks is null or click_count < max_clicks)
  returning destination_url into dest;
  return dest;
end;
$$;

revoke all on function public.register_click(text) from public, anon, authenticated;
grant execute on function public.register_click(text) to service_role;
