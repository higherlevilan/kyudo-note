-- 稽古帳 (practice journal) cloud sync.
--
-- One row per journal entry and user. The browser keeps the full journal locally and syncs
-- with this table directly through PostgREST (supabase-js, anon key + the user's JWT), so all
-- access control lives here: Row Level Security limits every operation to the owner's rows.
--
--   updated_at         the entry's own last-modified time (device clock) → last-writer-wins
--   server_updated_at  set by trigger on every accepted write (server clock) → pull cursor
--   deleted            soft delete (tombstone) so deletions reach every device; content is wiped
--
-- Safe to run more than once.

-- ---------- table ----------

create table if not exists public.journal_entries (
  id                text        not null,
  user_id           uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  type              text,
  date              date,
  data              jsonb       not null default '{}'::jsonb,
  created_at        timestamptz,
  updated_at        timestamptz not null,
  deleted           boolean     not null default false,
  server_updated_at timestamptz not null default now(),
  primary key (user_id, id),

  constraint journal_entries_id_format check (id ~ '^[A-Za-z0-9_.:-]{1,100}$'),
  constraint journal_entries_type_known check (
    type is null or type in ('practice', 'lesson', 'exam', 'purchase', 'culture', 'goal')
  ),
  constraint journal_entries_live_complete check (deleted or (type is not null and date is not null)),
  constraint journal_entries_data_object check (jsonb_typeof(data) = 'object'),
  -- One entry is a few KB at most; this only stops abuse.
  constraint journal_entries_data_size check (pg_column_size(data) <= 262144),
  -- Sample data ("載入範例資料") is never uploaded by the app.
  constraint journal_entries_no_samples check (id not like 'sample-%')
);

comment on table public.journal_entries is '稽古帳 entries, one per (user, entry id); synced from the browser. RLS: owner only.';
comment on column public.journal_entries.updated_at is 'Entry last-modified time from the device; last-writer-wins key.';
comment on column public.journal_entries.server_updated_at is 'Server time of the last accepted write; clients pull rows newer than their cursor.';
comment on column public.journal_entries.deleted is 'Tombstone: the entry was deleted; data is emptied by trigger.';

-- ---------- indexes ----------

-- Incremental pull: where user_id = ? and server_updated_at >= ? order by server_updated_at, id
create index if not exists journal_entries_user_sync_idx
  on public.journal_entries (user_id, server_updated_at, id);

-- Future server-side queries by day / type (live rows only).
create index if not exists journal_entries_user_date_idx
  on public.journal_entries (user_id, date) where not deleted;

-- ---------- write trigger: sanity checks + last-writer-wins ----------

create or replace function public.journal_entries_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- Device clocks can be wrong: never accept a timestamp from the far future, or it would
  -- win every later conflict. (The client adopts the clamped value it gets back.)
  if new.updated_at > now() + interval '5 minutes' then
    new.updated_at := now();
  end if;
  if new.created_at is null or new.created_at > new.updated_at then
    new.created_at := new.updated_at;
  end if;

  -- A tombstone keeps no content.
  if new.deleted then
    new.type := null;
    new.date := null;
    new.data := '{}'::jsonb;
  end if;

  if tg_op = 'UPDATE' then
    -- Keys are immutable.
    new.user_id := old.user_id;
    new.id := old.id;
    -- Last writer wins: ignore versions that are older than (or the same age as) the stored
    -- one; on an exact tie a deletion beats a live copy. Returning NULL skips this row
    -- silently, which also makes `insert … on conflict do update` (upsert) conditional.
    if new.updated_at < old.updated_at
       or (new.updated_at = old.updated_at and not (new.deleted and not old.deleted)) then
      return null;
    end if;
  end if;

  new.server_updated_at := clock_timestamp();
  return new;
end;
$$;

drop trigger if exists journal_entries_before_write on public.journal_entries;
create trigger journal_entries_before_write
  before insert or update on public.journal_entries
  for each row execute function public.journal_entries_before_write();

-- ---------- Row Level Security ----------

alter table public.journal_entries enable row level security;

-- Only signed-in users, and only their own rows. `(select auth.uid())` is evaluated once per
-- statement instead of once per row.
revoke all on public.journal_entries from anon;
grant select, insert, update, delete on public.journal_entries to authenticated;

drop policy if exists "journal_entries_select_own" on public.journal_entries;
create policy "journal_entries_select_own" on public.journal_entries
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "journal_entries_insert_own" on public.journal_entries;
create policy "journal_entries_insert_own" on public.journal_entries
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "journal_entries_update_own" on public.journal_entries;
create policy "journal_entries_update_own" on public.journal_entries
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- The app only soft-deletes; hard delete is allowed so a user's rows can be purged.
drop policy if exists "journal_entries_delete_own" on public.journal_entries;
create policy "journal_entries_delete_own" on public.journal_entries
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ---------- optional maintenance (run by hand, not part of the migration) ----------
-- Tombstones are tiny, but very old ones can be purged. A device that was offline for longer
-- than this window could then re-upload an entry that was deleted elsewhere.
--
--   delete from public.journal_entries
--   where deleted and server_updated_at < now() - interval '2 years';
