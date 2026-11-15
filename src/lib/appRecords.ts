import { supabase } from './supabase';

export type AppRecordType =
  | 'venues'
  | 'contributions'
  | 'community_posts'
  | 'rejected_posts'
  | 'saved_lists'
  | 'notifications'
  | 'reports';

export interface StoredAppRecord<T> {
  recordId: string;
  ownerId: string | null;
  payload: T;
}

export async function loadAppRecords<T>(entityType: AppRecordType): Promise<StoredAppRecord<T>[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('app_records')
    .select('record_id, owner_id, payload')
    .eq('entity_type', entityType);
  if (error) throw new Error(`Could not load ${entityType}: ${error.message}`);
  return (data ?? []).map((row) => ({
    recordId: row.record_id,
    ownerId: row.owner_id,
    payload: row.payload as T,
  }));
}

export async function saveAppRecord<T extends { id: string }>(
  entityType: AppRecordType,
  record: T,
  ownerId: string | null
): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('app_records')
    .upsert({
      id: `${entityType}:${record.id}:${ownerId ?? 'global'}`,
      entity_type: entityType,
      record_id: record.id,
      owner_id: ownerId,
      payload: record,
    }, { onConflict: 'id' });
  if (error) throw new Error(`Could not save ${entityType}: ${error.message}`);
}

export async function updateAppRecord<T extends { id: string }>(
  entityType: AppRecordType,
  record: T
): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('app_records')
    .update({ payload: record })
    .eq('entity_type', entityType)
    .eq('record_id', record.id);
  if (error) throw new Error(`Could not update ${entityType}: ${error.message}`);
}
