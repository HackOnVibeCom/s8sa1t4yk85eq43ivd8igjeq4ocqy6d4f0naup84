create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'citizen' check (role in ('citizen', 'admin')),
  display_name text not null default '',
  avatar_url text not null default '',
  location text not null default '',
  bio text not null default '',
  badge text not null default 'Community Contributor',
  contributions_count integer not null default 0,
  reviews_count integer not null default 0,
  saved_places_count integer not null default 0,
  reputation_points integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists create_profile_after_signup on auth.users;
create trigger create_profile_after_signup
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();

create table if not exists public.app_records (
  id text primary key,
  entity_type text not null check (
    entity_type in ('venues', 'contributions', 'community_posts', 'rejected_posts', 'saved_lists', 'notifications', 'reports')
  ),
  record_id text not null,
  owner_id uuid references auth.users (id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint app_records_id_matches_scope check (
    id = entity_type || ':' || record_id || ':' || coalesce(owner_id::text, 'global')
  )
);

create index if not exists app_records_type_owner_idx
  on public.app_records (entity_type, owner_id);

create table if not exists public.community_post_reactions (
  post_id text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  reaction text not null check (reaction in ('like', 'dislike')),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.community_post_comments (
  id text primary key,
  post_id text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  constraint community_post_comments_nonempty check (
    length(trim(coalesce(payload ->> 'content', ''))) between 1 and 1000
  )
);

create index if not exists community_post_comments_post_idx
  on public.community_post_comments (post_id, created_at);

alter table public.community_post_reactions enable row level security;
alter table public.community_post_comments enable row level security;

create or replace function public.prevent_post_author_moderation_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.entity_type = 'community_posts'
    and old.owner_id = (select auth.uid())
    and not (select public.current_user_is_admin())
    and old.payload ->> 'moderationStatus' is distinct from new.payload ->> 'moderationStatus'
  then
    raise exception 'Only an administrator can change a post moderation status';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_community_post_moderation on public.app_records;
create trigger protect_community_post_moderation
  before update on public.app_records
  for each row execute procedure public.prevent_post_author_moderation_changes();

create or replace function public.moderate_community_post(p_record_id text, p_status text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  post_record public.app_records%rowtype;
  rejected_payload jsonb;
begin
  if not (select public.current_user_is_admin()) then
    raise exception 'Administrator access is required to moderate community posts';
  end if;
  if p_status not in ('Verified', 'Rejected') then
    raise exception 'Unsupported moderation status';
  end if;
  select * into post_record
  from public.app_records
  where entity_type = 'community_posts'
    and record_id = p_record_id
  for update;
  if not found then
    raise exception 'Community post not found';
  end if;
  rejected_payload := jsonb_set(post_record.payload, '{moderationStatus}', to_jsonb(p_status), true);
  if p_status = 'Rejected' then
    insert into public.app_records (id, entity_type, record_id, owner_id, payload)
    values (
      'rejected_posts:' || post_record.record_id || ':' || coalesce(post_record.owner_id::text, 'global'),
      'rejected_posts',
      post_record.record_id,
      post_record.owner_id,
      rejected_payload
    )
    on conflict (id) do update set payload = excluded.payload, updated_at = now();
    delete from public.community_post_reactions where post_id = p_record_id;
    delete from public.community_post_comments where post_id = p_record_id;
    delete from public.app_records where id = post_record.id;
  else
    update public.app_records
    set payload = rejected_payload, updated_at = now()
    where id = post_record.id;
  end if;
end;
$$;

revoke all on function public.moderate_community_post(text, text) from public;
grant execute on function public.moderate_community_post(text, text) to authenticated;

do $$
begin
  begin
    execute 'alter publication supabase_realtime add table public.app_records';
  exception when duplicate_object then null;
  end;
  begin
    execute 'alter publication supabase_realtime add table public.community_post_reactions';
  exception when duplicate_object then null;
  end;
  begin
    execute 'alter publication supabase_realtime add table public.community_post_comments';
  exception when duplicate_object then null;
  end;
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists app_records_set_updated_at on public.app_records;
create trigger app_records_set_updated_at
  before update on public.app_records
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.app_records enable row level security;

drop policy if exists "Users can read their profile" on public.profiles;
create policy "Users can read their profile"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.current_user_is_admin()));

drop policy if exists "Users can update their profile details" on public.profiles;
create policy "Users can update their profile details"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

revoke update on public.profiles from authenticated;
grant update (
  display_name,
  avatar_url,
  location,
  bio
) on public.profiles to authenticated;

drop policy if exists "Public can read venues and community posts" on public.app_records;
create policy "Public can read venues and community posts"
  on public.app_records for select to anon, authenticated
  using (
    entity_type = 'venues'
    or (
      entity_type = 'community_posts'
      and (
        coalesce(payload ->> 'moderationStatus', 'Verified') <> 'Rejected'
        or owner_id = (select auth.uid())
        or (select public.current_user_is_admin())
      )
    )
    or (
      entity_type = 'rejected_posts'
      and (owner_id = (select auth.uid()) or (select public.current_user_is_admin()))
    )
    or (
      entity_type in ('contributions', 'notifications', 'saved_lists')
      and owner_id = (select auth.uid())
    )
    or (entity_type = 'reports' and (owner_id = (select auth.uid()) or (select public.current_user_is_admin())))
    or (
      entity_type = 'contributions'
      and (select public.current_user_is_admin())
    )
  );

drop policy if exists "Citizens can create owned app records" on public.app_records;
create policy "Citizens can create owned app records"
  on public.app_records for insert to authenticated
  with check (
    (
      entity_type in ('contributions', 'community_posts', 'saved_lists', 'notifications', 'reports')
      and owner_id = (select auth.uid())
    )
    or (
      entity_type in ('venues', 'contributions', 'community_posts', 'reports')
      and owner_id is null
      and (select public.current_user_is_admin())
    )
  );

drop policy if exists "Owners and admins can update app records" on public.app_records;
create policy "Owners and admins can update app records"
  on public.app_records for update to authenticated
  using (
    (entity_type in ('community_posts', 'saved_lists', 'notifications') and owner_id = (select auth.uid()))
    or (
      entity_type in ('venues', 'contributions', 'reports', 'rejected_posts')
      and (select public.current_user_is_admin())
    )
  )
  with check (
    (entity_type in ('community_posts', 'saved_lists', 'notifications') and owner_id = (select auth.uid()))
    or (
      entity_type in ('venues', 'contributions', 'reports', 'rejected_posts')
      and (select public.current_user_is_admin())
    )
  );

drop policy if exists "Owners and admins can delete app records" on public.app_records;
create policy "Owners and admins can delete app records"
  on public.app_records for delete to authenticated
  using (
    (entity_type in ('community_posts', 'saved_lists', 'notifications') and owner_id = (select auth.uid()))
    or (
      entity_type in ('venues', 'contributions', 'reports')
      and (select public.current_user_is_admin())
    )
  );

grant select, insert, update, delete on public.app_records to authenticated;
grant select on public.app_records to anon;
grant select on public.profiles to authenticated;

drop policy if exists "Public can read post reactions" on public.community_post_reactions;
create policy "Public can read post reactions"
  on public.community_post_reactions for select to anon, authenticated
  using (true);

drop policy if exists "Users can create their own post reaction" on public.community_post_reactions;
create policy "Users can create their own post reaction"
  on public.community_post_reactions for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.app_records post
      where post.entity_type = 'community_posts'
        and post.record_id = post_id
        and coalesce(post.payload ->> 'moderationStatus', 'Verified') <> 'Rejected'
    )
  );

drop policy if exists "Users can update or remove their own post reaction" on public.community_post_reactions;
create policy "Users can update or remove their own post reaction"
  on public.community_post_reactions for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "Users can delete their own post reaction" on public.community_post_reactions;
create policy "Users can delete their own post reaction"
  on public.community_post_reactions for delete to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Public can read comments on visible posts" on public.community_post_comments;
create policy "Public can read comments on visible posts"
  on public.community_post_comments for select to anon, authenticated
  using (
    exists (
      select 1 from public.app_records post
      where post.entity_type = 'community_posts'
        and post.record_id = post_id
        and (
          coalesce(post.payload ->> 'moderationStatus', 'Verified') <> 'Rejected'
          or post.owner_id = (select auth.uid())
          or (select public.current_user_is_admin())
        )
    )
  );

drop policy if exists "Users can comment on visible posts" on public.community_post_comments;
create policy "Users can comment on visible posts"
  on public.community_post_comments for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.app_records post
      where post.entity_type = 'community_posts'
        and post.record_id = post_id
        and coalesce(post.payload ->> 'moderationStatus', 'Verified') <> 'Rejected'
    )
  );

drop policy if exists "Authors and admins can delete post comments" on public.community_post_comments;
create policy "Authors and admins can delete post comments"
  on public.community_post_comments for delete to authenticated
  using (user_id = (select auth.uid()) or (select public.current_user_is_admin()));

grant select on public.community_post_reactions, public.community_post_comments to anon, authenticated;
grant insert, update, delete on public.community_post_reactions to authenticated;
grant insert, delete on public.community_post_comments to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'contribution-photos',
  'contribution-photos',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view contribution photos" on storage.objects;
create policy "Public can view contribution photos"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'contribution-photos');

drop policy if exists "Citizens can upload their contribution photos" on storage.objects;
create policy "Citizens can upload their contribution photos"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'contribution-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Owners and admins can update contribution photos" on storage.objects;
create policy "Owners and admins can update contribution photos"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'contribution-photos'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or (select public.current_user_is_admin())
    )
  )
  with check (
    bucket_id = 'contribution-photos'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or (select public.current_user_is_admin())
    )
  );

drop policy if exists "Owners and admins can delete contribution photos" on storage.objects;
create policy "Owners and admins can delete contribution photos"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'contribution-photos'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or (select public.current_user_is_admin())
    )
  );
