import { supabase } from './supabase';

// Todos os módulos liberados para estudo; "concluido" continua exigido para o certificado
const DEFAULT_MODULE_STATUS: Record<number, 'liberado' | 'bloqueado' | 'concluido'> =
  Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [i + 1, 'liberado'])
  ) as Record<number, 'liberado' | 'bloqueado' | 'concluido'>;

export interface ModuleProgressData {
  status: 'liberado' | 'bloqueado' | 'concluido';
  grade?: number;
}

export interface ModuleProgressMap {
  [moduleId: number]: ModuleProgressData;
}

const STORAGE_KEY = 'oryon_modules_progress';
const TOTAL_MODULES = 12;

const STATUS_RANK: Record<ModuleProgressData['status'], number> = {
  bloqueado: 0,
  liberado: 1,
  concluido: 2,
};

function pickProgressEntry(
  a?: ModuleProgressData,
  b?: ModuleProgressData
): ModuleProgressData | undefined {
  if (!a) return b;
  if (!b) return a;
  return STATUS_RANK[a.status] >= STATUS_RANK[b.status] ? a : b;
}

/** Mescla local e remoto mantendo o status mais avançado de cada módulo. */
function mergeProgressMaps(local: ModuleProgressMap, remote: ModuleProgressMap): ModuleProgressMap {
  const merged: ModuleProgressMap = { ...remote };
  const ids = new Set([
    ...Object.keys(local).map(Number),
    ...Object.keys(remote).map(Number),
  ]);

  for (const id of ids) {
    const picked = pickProgressEntry(local[id], remote[id]);
    if (picked) merged[id] = picked;
  }

  return merged;
}

/**
 * Garante todos os módulos liberados para acesso ao conteúdo.
 * Mantém "concluido" e notas; o certificado exige conclusão de todos.
 */
export function normalizeProgress(progress: ModuleProgressMap): ModuleProgressMap {
  const result: ModuleProgressMap = { ...progress };

  for (let id = 1; id <= TOTAL_MODULES; id++) {
    if (!result[id] || result[id].status === 'bloqueado') {
      result[id] = { status: 'liberado', grade: result[id]?.grade };
    }
  }

  return result;
}

function persistIfChanged(before: ModuleProgressMap, after: ModuleProgressMap): void {
  if (JSON.stringify(before) !== JSON.stringify(after)) {
    saveLocalProgress(after);
  }
}

// ── LocalStorage helpers (fallback) ──

function getLocalProgress(): ModuleProgressMap {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveLocalProgress(progress: ModuleProgressMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// ── Supabase helpers ──

async function getSupabaseProgress(userId: string): Promise<ModuleProgressMap> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('module_id, status, grade')
    .eq('user_id', userId);

  if (error) throw error;

  const map: ModuleProgressMap = {};
  if (data) {
    for (const row of data) {
      map[row.module_id] = {
        status: row.status as ModuleProgressData['status'],
        grade: row.grade ?? undefined,
      };
    }
  }
  return map;
}

async function upsertSupabaseProgress(
  userId: string,
  moduleId: number,
  data: ModuleProgressData
): Promise<void> {
  const { error } = await supabase.from('user_progress').upsert(
    {
      user_id: userId,
      module_id: moduleId,
      status: data.status,
      grade: data.grade ?? null,
    },
    { onConflict: 'user_id, module_id' }
  );
  if (error) throw error;
}

async function upsertSupabaseProgressBatch(
  userId: string,
  progress: ModuleProgressMap
): Promise<void> {
  const rows = Object.entries(progress).map(([moduleId, data]) => ({
    user_id: userId,
    module_id: Number(moduleId),
    status: data.status,
    grade: data.grade ?? null,
  }));

  if (rows.length === 0) return;

  const { error } = await supabase.from('user_progress').upsert(rows, {
    onConflict: 'user_id, module_id',
  });
  if (error) throw error;
}

// ── Sync: merge Supabase data into localStorage ──

async function syncFromSupabase(userId: string): Promise<ModuleProgressMap> {
  try {
    const supabaseData = await getSupabaseProgress(userId);
    const localData = getLocalProgress();

    const merged = normalizeProgress(mergeProgressMaps(localData, supabaseData));
    persistIfChanged(localData, merged);
    return merged;
  } catch {
    // Fallback to local
    const before = getLocalProgress();
    const local = normalizeProgress(before);
    persistIfChanged(before, local);
    return local;
  }
}

// ── Public API ──

/**
 * Get the full progress map for a user.
 * Syncs from Supabase first, falls back to localStorage.
 */
export async function getModuleProgress(userId?: string): Promise<ModuleProgressMap> {
  if (userId) {
    return syncFromSupabase(userId);
  }
  const before = getLocalProgress();
  const local = normalizeProgress(before);
  persistIfChanged(before, local);
  return local;
}

/**
 * Get status for a single module.
 */
export async function getModuleStatus(
  moduleId: number,
  userId?: string
): Promise<'liberado' | 'bloqueado' | 'concluido'> {
  if (userId) {
    const progress = await getModuleProgress(userId);
    return progress[moduleId]?.status ?? (DEFAULT_MODULE_STATUS[moduleId] ?? 'bloqueado');
  }
  return getModuleStatusSync(moduleId);
}

/**
 * Get the grade for a module.
 */
export async function getModuleGrade(
  moduleId: number,
  userId?: string
): Promise<number | undefined> {
  if (userId) {
    const progress = await getModuleProgress(userId);
    return progress[moduleId]?.grade;
  }
  return getLocalProgress()[moduleId]?.grade;
}

/**
 * Unlock a module (set status to 'liberado').
 */
export async function unlockModule(
  moduleId: number,
  userId?: string
): Promise<void> {
  // Update local
  const local = getLocalProgress();
  local[moduleId] = { status: 'liberado' };
  saveLocalProgress(local);

  // Update Supabase if userId provided
  if (userId) {
    try {
      await upsertSupabaseProgress(userId, moduleId, { status: 'liberado' });
    } catch {
      // Silent fallback — local is already saved
    }
  }
}

/**
 * Complete a module with a grade, and unlock the next one.
 */
export async function completeModule(
  moduleId: number,
  grade: number,
  userId?: string
): Promise<void> {
  const local = getLocalProgress();

  // Mark current module as completed
  local[moduleId] = { status: 'concluido', grade };

  // Unlock next module
  if (moduleId < TOTAL_MODULES) {
    local[moduleId + 1] = { status: 'liberado' };
  }

  saveLocalProgress(local);

  // Sync to Supabase
  if (userId) {
    try {
      const updates: ModuleProgressMap = {
        [moduleId]: { status: 'concluido', grade },
      };
      if (moduleId < TOTAL_MODULES) {
        updates[moduleId + 1] = { status: 'liberado' };
      }
      await upsertSupabaseProgressBatch(userId, updates);
    } catch {
      // Silent fallback
    }
  }
}

/**
 * Synchronous status check for immediate UI rendering (uses localStorage cache).
 * Falls back gracefully with module 1 always unlocked.
 */
export function getModuleStatusSync(moduleId: number): 'liberado' | 'bloqueado' | 'concluido' {
  const progress = getModuleProgressSync();
  return progress[moduleId]?.status ?? (DEFAULT_MODULE_STATUS[moduleId] ?? 'bloqueado');
}

/**
 * Synchronous progress map getter for immediate UI rendering.
 */
export function getModuleProgressSync(): ModuleProgressMap {
  const before = getLocalProgress();
  const local = normalizeProgress(before);
  persistIfChanged(before, local);
  return local;
}

// ── Section Progress ──

export interface SectionProgressMap {
  [sectionId: number]: boolean;
}

/**
 * Get which sections have been read for a given module.
 */
export async function getSectionProgress(
  userId: string,
  moduleId: number
): Promise<SectionProgressMap> {
  try {
    const { data, error } = await supabase
      .from('section_progress')
      .select('section_id, completed')
      .eq('user_id', userId)
      .eq('module_id', moduleId);

    if (error) throw error;

    const map: SectionProgressMap = {};
    if (data) {
      for (const row of data) {
        map[row.section_id] = row.completed;
      }
    }
    return map;
  } catch {
    return {};
  }
}

/**
 * Mark a section as completed/read by the user.
 */
export async function completeSection(
  userId: string,
  moduleId: number,
  sectionId: number
): Promise<void> {
  try {
    await supabase.from('section_progress').upsert(
      {
        user_id: userId,
        module_id: moduleId,
        section_id: sectionId,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id, module_id, section_id' }
    );
  } catch {
    // Silent fallback
  }
}

/**
 * Check if all sections in a module are completed.
 * If so, automatically complete the module.
 */
export async function checkAndCompleteModule(
  userId: string,
  moduleId: number,
  totalSections: number
): Promise<boolean> {
  try {
    const progress = await getSectionProgress(userId, moduleId);
    const completedCount = Object.values(progress).filter(Boolean).length;

    if (completedCount >= totalSections) {
      // All sections read — complete the module
      await completeModule(moduleId, 100, userId);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
