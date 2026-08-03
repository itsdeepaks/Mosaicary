insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resource-previews',
  'resource-previews',
  true,
  307200,
  array['image/webp']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types,
  updated_at = now();

create policy "pilot_exact_resource_preview_uploads"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'resource-previews'
  and name = any (
    array[
      'pilot/resource-fd3c2a3a5685.webp',
      'pilot/resource-25d0d0a31e39.webp',
      'pilot/resource-66b5da3637f8.webp',
      'pilot/resource-29300a9360ac.webp',
      'pilot/resource-21359fe8c171.webp'
    ]::text[]
  )
);
