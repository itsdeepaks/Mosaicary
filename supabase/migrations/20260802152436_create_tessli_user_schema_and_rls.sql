revoke execute on function public.rls_auto_enable() from public, anon, authenticated, service_role;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.set_updated_at() from public, anon, authenticated;

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length check (
    display_name is null
    or char_length(btrim(display_name)) between 1 and 80
  ),
  constraint profiles_avatar_url check (
    avatar_url is null
    or (char_length(avatar_url) <= 2048 and avatar_url ~ '^https://')
  )
);

create table public.saved_resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id text not null,
  created_at timestamptz not null default now(),
  constraint saved_resources_resource_id_length check (
    char_length(btrim(resource_id)) between 1 and 128
  ),
  constraint saved_resources_user_resource_unique unique (user_id, resource_id)
);

create table public.user_collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_collections_name_length check (
    char_length(btrim(name)) between 1 and 80
  ),
  constraint user_collections_description_length check (
    description is null or char_length(description) <= 500
  ),
  constraint user_collections_id_user_unique unique (id, user_id)
);

create table public.user_collection_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  collection_id uuid not null,
  resource_id text not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_collection_items_owner_fk
    foreign key (collection_id, user_id)
    references public.user_collections(id, user_id)
    on delete cascade,
  constraint user_collection_items_resource_id_length check (
    char_length(btrim(resource_id)) between 1 and 128
  ),
  constraint user_collection_items_position check (position >= 0),
  constraint user_collection_items_collection_resource_unique
    unique (collection_id, resource_id)
);

create table public.resource_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id text not null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resource_notes_resource_id_length check (
    char_length(btrim(resource_id)) between 1 and 128
  ),
  constraint resource_notes_body_length check (
    char_length(btrim(body)) between 1 and 5000
  ),
  constraint resource_notes_user_resource_unique unique (user_id, resource_id)
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_name text not null,
  resource_url text not null,
  description text not null,
  submitter_notes text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint submissions_resource_name_length check (
    char_length(btrim(resource_name)) between 1 and 120
  ),
  constraint submissions_resource_url_length check (
    char_length(resource_url) between 8 and 2048
  ),
  constraint submissions_description_length check (
    char_length(btrim(description)) between 1 and 2000
  ),
  constraint submissions_notes_length check (
    submitter_notes is null or char_length(submitter_notes) <= 2000
  ),
  constraint submissions_status check (
    status in ('pending', 'reviewing', 'accepted', 'rejected')
  )
);

create table public.feature_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  details text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint feature_suggestions_title_length check (
    char_length(btrim(title)) between 1 and 120
  ),
  constraint feature_suggestions_details_length check (
    char_length(btrim(details)) between 1 and 4000
  ),
  constraint feature_suggestions_status check (
    status in ('pending', 'reviewing', 'accepted', 'rejected')
  )
);

create table public.resource_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id text not null,
  reason text not null,
  details text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resource_reports_resource_id_length check (
    char_length(btrim(resource_id)) between 1 and 128
  ),
  constraint resource_reports_reason check (
    reason in ('broken-link', 'outdated-information', 'incorrect-access', 'inappropriate-content', 'other')
  ),
  constraint resource_reports_details_length check (
    details is null or char_length(details) <= 4000
  ),
  constraint resource_reports_status check (
    status in ('pending', 'reviewing', 'resolved', 'rejected')
  )
);

create index saved_resources_user_id_idx on public.saved_resources (user_id);
create index user_collections_user_id_idx on public.user_collections (user_id);
create index user_collection_items_user_id_idx on public.user_collection_items (user_id);
create index user_collection_items_collection_position_idx
  on public.user_collection_items (collection_id, position, created_at);
create index resource_notes_user_id_idx on public.resource_notes (user_id);
create index submissions_user_created_idx on public.submissions (user_id, created_at desc);
create index submissions_status_created_idx on public.submissions (status, created_at);
create index feature_suggestions_user_created_idx
  on public.feature_suggestions (user_id, created_at desc);
create index feature_suggestions_status_created_idx
  on public.feature_suggestions (status, created_at);
create index resource_reports_user_created_idx
  on public.resource_reports (user_id, created_at desc);
create index resource_reports_status_created_idx
  on public.resource_reports (status, created_at);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger user_collections_set_updated_at
before update on public.user_collections
for each row execute function private.set_updated_at();

create trigger user_collection_items_set_updated_at
before update on public.user_collection_items
for each row execute function private.set_updated_at();

create trigger resource_notes_set_updated_at
before update on public.resource_notes
for each row execute function private.set_updated_at();

create trigger submissions_set_updated_at
before update on public.submissions
for each row execute function private.set_updated_at();

create trigger feature_suggestions_set_updated_at
before update on public.feature_suggestions
for each row execute function private.set_updated_at();

create trigger resource_reports_set_updated_at
before update on public.resource_reports
for each row execute function private.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

revoke all on function private.handle_new_user()
from public, anon, authenticated, service_role;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.saved_resources enable row level security;
alter table public.user_collections enable row level security;
alter table public.user_collection_items enable row level security;
alter table public.resource_notes enable row level security;
alter table public.submissions enable row level security;
alter table public.feature_suggestions enable row level security;
alter table public.resource_reports enable row level security;

revoke all on public.profiles from anon, authenticated;
revoke all on public.saved_resources from anon, authenticated;
revoke all on public.user_collections from anon, authenticated;
revoke all on public.user_collection_items from anon, authenticated;
revoke all on public.resource_notes from anon, authenticated;
revoke all on public.submissions from anon, authenticated;
revoke all on public.feature_suggestions from anon, authenticated;
revoke all on public.resource_reports from anon, authenticated;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.saved_resources to authenticated;
grant select, insert, update, delete on public.user_collections to authenticated;
grant select, insert, update, delete on public.user_collection_items to authenticated;
grant select, insert, update, delete on public.resource_notes to authenticated;
grant select, insert on public.submissions to authenticated;
grant select, insert on public.feature_suggestions to authenticated;
grant select, insert on public.resource_reports to authenticated;

grant all on public.profiles to service_role;
grant all on public.saved_resources to service_role;
grant all on public.user_collections to service_role;
grant all on public.user_collection_items to service_role;
grant all on public.resource_notes to service_role;
grant all on public.submissions to service_role;
grant all on public.feature_suggestions to service_role;
grant all on public.resource_reports to service_role;

create policy profiles_select_own on public.profiles for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy profiles_insert_own on public.profiles for insert to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy profiles_update_own on public.profiles for update to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy profiles_delete_own on public.profiles for delete to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy saved_resources_select_own on public.saved_resources for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy saved_resources_insert_own on public.saved_resources for insert to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy saved_resources_update_own on public.saved_resources for update to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy saved_resources_delete_own on public.saved_resources for delete to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy user_collections_select_own on public.user_collections for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy user_collections_insert_own on public.user_collections for insert to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy user_collections_update_own on public.user_collections for update to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy user_collections_delete_own on public.user_collections for delete to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy user_collection_items_select_own on public.user_collection_items for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy user_collection_items_insert_own on public.user_collection_items for insert to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy user_collection_items_update_own on public.user_collection_items for update to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy user_collection_items_delete_own on public.user_collection_items for delete to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy resource_notes_select_own on public.resource_notes for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy resource_notes_insert_own on public.resource_notes for insert to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy resource_notes_update_own on public.resource_notes for update to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy resource_notes_delete_own on public.resource_notes for delete to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy submissions_select_own on public.submissions for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy submissions_insert_pending_own on public.submissions for insert to authenticated
with check (
  (select auth.uid()) is not null
  and (select auth.uid()) = user_id
  and status = 'pending'
);

create policy feature_suggestions_select_own on public.feature_suggestions for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy feature_suggestions_insert_pending_own on public.feature_suggestions for insert to authenticated
with check (
  (select auth.uid()) is not null
  and (select auth.uid()) = user_id
  and status = 'pending'
);

create policy resource_reports_select_own on public.resource_reports for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy resource_reports_insert_pending_own on public.resource_reports for insert to authenticated
with check (
  (select auth.uid()) is not null
  and (select auth.uid()) = user_id
  and status = 'pending'
);
