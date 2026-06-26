import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { courseModules } from '../data/modules';

const PROGRESS_KEY = 'lexum_progress_v1';

// Get completed module slugs/ids from localStorage
export function getLexumProgress(): string[] {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Save progress to localStorage
export function saveLexumProgress(progress: string[]): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    // Trigger custom event for same-window updates
    window.dispatchEvent(new Event('lexum-progress-change'));
  } catch (e) {
    console.error('Failed to save Lexum progress', e);
  }
}

// Mark a module as read/completed
export function completeLexumModule(moduleSlugOrId: string): void {
  const current = getLexumProgress();
  if (!current.includes(moduleSlugOrId)) {
    const updated = [...current, moduleSlugOrId];
    saveLexumProgress(updated);
  }
}

// Mark a module as uncompleted/pending
export function uncompleteLexumModule(moduleSlugOrId: string): void {
  const current = getLexumProgress();
  const updated = current.filter(item => item !== moduleSlugOrId);
  saveLexumProgress(updated);
}

// Reset all progress
export function resetLexumProgress(): void {
  saveLexumProgress([]);
}

/**
 * Sincroniza do Supabase os módulos concluídos e mescla com localStorage.
 * Retorna a lista mesclada de slugs/IDs concluídos.
 */
async function syncFromSupabase(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('module_id')
      .eq('user_id', userId)
      .eq('status', 'concluido');

    if (error) throw error;

    // Converte module_id para o formato de slug usado no lexum_progress_v1
    const supabaseSlugs: string[] = [];
    if (data) {
      for (const row of data) {
        const mod = courseModules.find(m => m.id === row.module_id);
        const slug = mod?.slug ?? `modulo-${row.module_id}`;
        if (!supabaseSlugs.includes(slug)) {
          supabaseSlugs.push(slug);
        }
      }
    }

    // Mescla com localStorage (preserva ambos, remove duplicatas)
    const local = getLexumProgress();
    const merged = [...new Set([...local, ...supabaseSlugs])];

    // Persiste no localStorage se houver mudança
    if (JSON.stringify(local) !== JSON.stringify(merged)) {
      saveLexumProgress(merged);
    }

    return merged;
  } catch {
    return getLexumProgress();
  }
}

// Custom hook to listen to progress changes in real-time
export function useLexumProgress(userId?: string | null) {
  const [completedList, setCompletedList] = useState<string[]>(() => getLexumProgress());

  // Sincroniza do Supabase quando o userId estiver disponível
  useEffect(() => {
    if (!userId) return;
    syncFromSupabase(userId).then(setCompletedList);
  }, [userId]);

  useEffect(() => {
    const handleUpdate = () => {
      setCompletedList(getLexumProgress());
    };

    // Listen to local changes (same window)
    window.addEventListener('lexum-progress-change', handleUpdate);
    // Listen to storage changes (other tabs/windows)
    window.addEventListener('storage', (e) => {
      if (e.key === PROGRESS_KEY) {
        handleUpdate();
      }
    });

    return () => {
      window.removeEventListener('lexum-progress-change', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const totalModules = courseModules.length;
  const completedCount = completedList.length;
  const percentage = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
  const isAllCompleted = completedCount === totalModules;

  return {
    completedList,
    completedCount,
    totalModules,
    percentage,
    isAllCompleted,
    completeModule: completeLexumModule,
    uncompleteModule: uncompleteLexumModule,
    resetProgress: resetLexumProgress,
  };
}
