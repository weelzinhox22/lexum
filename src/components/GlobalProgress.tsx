import { useLexumProgress } from '../lib/lexumProgress';
import { courseModules } from '../data/modules';
import { CheckCircle2, Circle, Trophy, BookOpen } from 'lucide-react';

interface GlobalProgressProps {
  showDetails?: boolean;
  className?: string;
}

export default function GlobalProgress({ showDetails = false, className = '' }: GlobalProgressProps) {
  const { completedList, completedCount, totalModules, percentage, isAllCompleted } = useLexumProgress();

  return (
    <div className={`p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-lg text-slate-100 ${className}`}>
      {/* Dynamic Text Indicator */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isAllCompleted ? (
            <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
          ) : (
            <BookOpen className="w-5 h-5 text-amber-500" />
          )}
          <span className="text-sm font-bold tracking-wide">Progresso de Estudo</span>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          {completedCount} de {totalModules} módulos ({percentage}% concluído)
        </span>
      </div>

      {/* Styled Horizontal Progress Bar */}
      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-4 relative shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-emerald-500 transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
        {/* Glow effect on the fill bar */}
        <div
          className="absolute top-0 bottom-0 left-0 bg-white opacity-10 animate-pulse"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Compact List/Table of Modules Completed vs Pending */}
      {showDetails && (
        <div className="mt-4 border-t border-slate-800 pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Status dos Módulos
          </h4>
          <div className="max-h-60 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-slate-850">
            {courseModules.map((mod) => {
              const isCompleted = completedList.includes(mod.slug) || completedList.includes(`modulo-${mod.id}`);
              return (
                <div
                  key={mod.id}
                  className="flex items-center justify-between py-2 px-3 bg-slate-950/40 hover:bg-slate-950/80 rounded-lg border border-slate-900 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-amber-500/60 shrink-0" />
                    )}
                    <span className="text-xs font-medium text-slate-300 truncate">
                      Módulo {mod.id}: {mod.title}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full select-none ${
                      isCompleted
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {isCompleted ? 'Concluído' : 'Pendente'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
