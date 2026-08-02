create index user_collection_items_collection_owner_idx
  on public.user_collection_items (collection_id, user_id);
