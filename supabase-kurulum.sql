-- PPL Defteri · Supabase kurulumu
-- Supabase panelinde: SQL Editor → New query → bu dosyanın tamamını yapıştır → Run.
-- Bir kez çalıştırman yeterli.

-- 1) Kayıtlar tablosu: her kullanıcının her kaydı (antrenman, kilo, beslenme, ölçü, ayar) bir satır.
create table if not exists public.docs (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- 2) Satır düzeyi güvenlik: herkes sadece kendi kayıtlarını görür ve değiştirir.
alter table public.docs enable row level security;
create policy "docs_select_own" on public.docs for select to authenticated using (auth.uid() = user_id);
create policy "docs_insert_own" on public.docs for insert to authenticated with check (auth.uid() = user_id);
create policy "docs_update_own" on public.docs for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "docs_delete_own" on public.docs for delete to authenticated using (auth.uid() = user_id);

-- 3) Canlı eşitleme: bir cihazda girilen kayıt diğerinde hemen görünsün.
alter publication supabase_realtime add table public.docs;

-- 4) Fotoğraflar: gizli "photos" klasörü, herkes sadece kendi klasörüne erişir.
insert into storage.buckets (id, name, public) values ('photos', 'photos', false) on conflict (id) do nothing;
create policy "photos_select_own" on storage.objects for select to authenticated using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "photos_insert_own" on storage.objects for insert to authenticated with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "photos_delete_own" on storage.objects for delete to authenticated using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
