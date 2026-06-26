import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpenCheck,
  HelpCircle,
  CheckCircle,
  FileCheck,
  ArrowLeft,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  Award,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  RotateCcw,
  Target,
  Sparkles,
  Play,
  Scale,
  ShieldAlert,
  Brain,
  Briefcase,
  Bookmark,
  CheckSquare,
} from 'lucide-react';
import { gsap } from 'gsap';
import { supabase } from '../lib/supabase';
import { courseModules } from '../data/modules';
import { mergeSectionContent } from '../data/didacticSupplements';
import { preprocessModuleText } from '../components/SmartContent';
import {
  completeModule as completeModuleProgress,
  getModuleStatusSync,
  getSectionProgress,
  completeSection,
  checkAndCompleteModule,
} from '../lib/progress';
import AppShell from '../components/AppShell';

// ── Module status (mesma regra da Dashboard e da página Módulos) ──
function getModuleStatus(id: number): 'liberado' | 'bloqueado' | 'concluido' {
  return getModuleStatusSync(id);
}

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const quizRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'material' | 'quiz'>('material');
  const [currentQuizAnswers, setCurrentQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizGrade, setQuizGrade] = useState<number | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [currentSectionIdx, setCurrentSectionIdx] = useState<number | null>(null);
  const [viewedSections, setViewedSections] = useState<Set<number>>(new Set());
  const sectionRefs = useRef<Record<number, HTMLElement | null>>({});
  const [quizStep, setQuizStep] = useState<'start' | 'answering' | 'result'>('start');
  const redirectingRef = useRef(false);
  const viewedFromDb = useRef(false);

  // Auth state
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('Aluno');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  // Find module
  const moduleData = courseModules.find(m => m.slug === moduleId);
  const moduleIndex = moduleData ? courseModules.indexOf(moduleData) : -1;
  const prevModule = moduleIndex > 0 ? courseModules[moduleIndex - 1] : null;
  const nextModule = moduleIndex < courseModules.length - 1 ? courseModules[moduleIndex + 1] : null;
  const status = moduleData ? getModuleStatus(moduleData.id) : 'bloqueado';

  // ── Auth ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login');
      } else {
        setUserId(session.user.id);
        setUserEmail(session.user.email ?? null);
        const fullName = session.user.user_metadata?.full_name;
        if (fullName) setUserName(fullName);
        else if (session.user.email) setUserName(session.user.email.split('@')[0]);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) navigate('/login');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  // ── Redirect numeric IDs to slugs ──
  useEffect(() => {
    if (!moduleId) return;
    const numId = Number(moduleId);
    if (!isNaN(numId) && String(numId) === moduleId.trim()) {
      const mod = courseModules.find(m => m.id === numId);
      if (mod && mod.slug !== moduleId) {
        redirectingRef.current = true;
        navigate(`/module/${mod.slug}`, { replace: true });
      }
    }
  }, [moduleId, navigate]);

  // ── Load section progress from DB + check if module already completed ──
  useEffect(() => {
    if (!userId || !moduleData || viewedFromDb.current) return;
    viewedFromDb.current = true;
    getSectionProgress(userId, moduleData.id).then((savedProgress) => {
      const done: number[] = [];
      for (const [secId, completed] of Object.entries(savedProgress)) {
        if (completed) done.push(Number(secId));
      }
      if (done.length > 0) {
        setViewedSections(prev => {
          const next = new Set(prev);
          done.forEach(id => next.add(id));

          // If all sections are already completed in DB, auto-complete module
          // and sync to lexum_progress_v1 localStorage
          if (next.size >= moduleData.sections.length) {
            // Save to Supabase via checkAndCompleteModule
            checkAndCompleteModule(userId, moduleData.id, moduleData.sections.length);

            // Also sync to lexum_progress_v1 so Dashboard reflects it immediately
            const itemKey = moduleData.slug || `modulo-${moduleData.id}`;
            try {
              const saved = localStorage.getItem('lexum_progress_v1');
              const progressList = saved ? JSON.parse(saved) : [];
              if (!progressList.includes(itemKey)) {
                progressList.push(itemKey);
                localStorage.setItem('lexum_progress_v1', JSON.stringify(progressList));
                window.dispatchEvent(new Event('lexum-progress-change'));
              }
            } catch (e) {
              console.error(e);
            }
          }

          return next;
        });
      }
    });
  }, [userId, moduleData?.id]);

  // ── IntersectionObserver — track sections viewed via sentinel (bottom of section) + save to DB ──
  // IMPORTANTE: depende de `pageLoading` para garantir que o DOM já foi renderizado antes de
  // registrar os observers. Sem isso, document.querySelector retorna null para todos os sentinels.
  useEffect(() => {
    if (!moduleData) return;
    // Aguarda o conteúdo estar no DOM (GSAP animation concluída)
    if (pageLoading) return;

    const markSectionRead = (sectionId: number) => {
      setViewedSections(prev => {
        if (prev.has(sectionId)) return prev;
        const next = new Set(prev);
        next.add(sectionId);

        // Save to DB (se autenticado)
        if (userId) {
          completeSection(userId, moduleData.id, sectionId);

          // Check if all sections are now completed → auto-complete module via Supabase
          if (next.size >= moduleData.sections.length) {
            checkAndCompleteModule(userId, moduleData.id, moduleData.sections.length);
          }
        }

        return next;
      });

      // Se é a última seção → chama handleMarkComplete (salva no lexum_progress_v1)
      // Funciona independente de userId, pois handleMarkComplete lida com localStorage diretamente
      const lastSection = moduleData.sections[moduleData.sections.length - 1];
      if (lastSection && sectionId === lastSection.id) {
        handleMarkCompleteRef.current();
      }
    };

    // Observer para sentinels (div height:1 no final de cada seção)
    // threshold: 0 → dispara assim que 1px do sentinel entra na viewport
    const sentinelObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sid = Number(entry.target.getAttribute('data-sid'));
          if (!isNaN(sid)) markSectionRead(sid);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });

    // Observer para rastrear qual seção está visível (navegação lateral)
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = Number(entry.target.id.replace('lp-section-', ''));
          const idx = moduleData.sections.findIndex(s => s.id === id);
          if (idx >= 0) {
            setCurrentSectionIdx(idx);
          }
        }
      });
    }, { threshold: 0.3 });

    let sentinelsFound = 0;
    moduleData.sections.forEach(s => {
      // Observa sentinel (fundo da seção)
      const sentinel = document.querySelector(`[data-sid="${s.id}"]`);
      if (sentinel) {
        sentinelObserver.observe(sentinel);
        sentinelsFound++;
      }

      // Observa a seção para rastrear posição de scroll
      const el = document.getElementById(`lp-section-${s.id}`);
      if (el) {
        sectionRefs.current[s.id] = el;
        sectionObserver.observe(el);
      }
    });

    // Diagnóstico em dev: avisa se os sentinels não foram encontrados no DOM
    if (import.meta.env.DEV && sentinelsFound === 0) {
      console.warn('[ModulePage] Nenhum sentinel encontrado no DOM. Verifique se os data-sid estão renderizados.');
    }

    return () => {
      sentinelObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, [moduleId, userId, pageLoading]);

  // ── GSAP entrance ──
  useEffect(() => {
    if (!moduleData) return;
    setPageLoading(true);

    const raf = requestAnimationFrame(() => {
      const tl = gsap.timeline({
        onComplete: () => setPageLoading(false),
      });

      if (heroRef.current) {
        tl.fromTo(
          heroRef.current.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.06 },
          0
        );
      }
    });

    return () => { cancelAnimationFrame(raf); };
  }, [moduleData]);

  // ── Reset state on module change ──
  useEffect(() => {
    setActiveTab('material');
    setQuizSubmitted(false);
    setCurrentQuizAnswers({});
    setQuizGrade(null);
    setQuizStep('start');
    setCurrentSectionIdx(null);
    viewedFromDb.current = false;
  }, [moduleId]);

  const scrollToSection = (sectionId: number, idx: number) => {
    setCurrentSectionIdx(idx);
    setViewedSections(prev => new Set(prev).add(sectionId));
    document.getElementById(`lp-section-${sectionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleMarkComplete = () => {
    if (!moduleData) return;
    if (userId) completeModuleProgress(moduleData.id, 100, userId);
    
    // Update persistent lexum_progress_v1 key
    try {
      const saved = localStorage.getItem('lexum_progress_v1');
      const progressList = saved ? JSON.parse(saved) : [];
      const itemKey = moduleData.slug || `modulo-${moduleData.id}`;
      if (!progressList.includes(itemKey)) {
        progressList.push(itemKey);
        localStorage.setItem('lexum_progress_v1', JSON.stringify(progressList));
        window.dispatchEvent(new Event('lexum-progress-change'));
      }
    } catch (e) {
      console.error(e);
    }

    setViewedSections(prev => {
      const all = new Set(prev);
      moduleData.sections.forEach(s => all.add(s.id));
      return all;
    });
    setCurrentSectionIdx(moduleData.sections.length - 1);
  };

  const handleMarkCompleteRef = useRef(handleMarkComplete);
  useEffect(() => {
    handleMarkCompleteRef.current = handleMarkComplete;
  }, [handleMarkComplete]);

  const handleQuizSubmit = () => {
    if (!moduleData) return;
    let correctCount = 0;
    moduleData.quiz.forEach((q, idx) => {
      if (currentQuizAnswers[idx] === q.correctAnswer) correctCount++;
    });

    const finalGrade = Math.round((correctCount / moduleData.quiz.length) * 100);
    setQuizGrade(finalGrade);
    setQuizSubmitted(true);
    setQuizStep('result');

    if (finalGrade >= 70) {
      if (userId) completeModuleProgress(moduleData.id, finalGrade, userId);
    }
  };

  const handleRetry = () => {
    setQuizStep('answering');
    setQuizSubmitted(false);
    setCurrentQuizAnswers({});
    setQuizGrade(null);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    navigate('/login');
  };

  // ── Silent redirect guard ──
  if (!moduleData && redirectingRef.current) {
    return null;
  }

  // ── Not found state ──
  if (!moduleData) {
    return (
      <div className="lp-notfound">
        <div className="lp-notfound-inner">
          <GraduationCap size={48} />
          <h2>Módulo não encontrado</h2>
          <p>O módulo solicitado não existe ou foi removido.</p>
          <Link to="/dashboard">
            <ArrowLeft size={14} />
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // ── Stats ──
  const totalCorrect = quizSubmitted && moduleData
    ? moduleData.quiz.reduce((acc, q, idx) => currentQuizAnswers[idx] === q.correctAnswer ? acc + 1 : acc, 0)
    : 0;
  const totalQuestions = moduleData.quiz.length;
  // ── Law Highlights Helper ──
  function highlightLawReferences(text: string) {
    const regex = /(Art\.\s*\d+(?:\s*,\s*§\s*\d+\s*[ºª]?)?(?:\s*,\s*[IVXLCDM]+)?|CF\/88|Lei\s*(?:nº\s*)?[\d.]+\/\d+|Decreto\s*(?:nº\s*)?[\d.]+\/\d+|EC\s*(?:nº\s*)?\d+\/\d+|ADCT)/gi;
    const parts = text.split(regex);
    return parts.map((part, index) => {
      if (part.match(regex)) {
        return (
          <span key={index} className="lp-law-badge">
            {part}
          </span>
        );
      }
      return part;
    });
  }

  // ── Render Text With Highlights & Bold ──
  function renderTextWithHighlights(text: string) {
    const boldRegex = /(\*\*[^*]+\*\*)/g;
    const parts = text.split(boldRegex);
    return parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const innerText = part.slice(2, -2);
        return <strong key={pIdx}>{highlightLawReferences(innerText)}</strong>;
      }
      return <span key={pIdx}>{highlightLawReferences(part)}</span>;
    });
  }

  // ── Content Renderer ──
  function renderContent(text: string) {
    text = text.replace(/\r\n/g, '\n');

    // Pre-process: isolate table rows from adjacent non-table lines.
    // If a line starting with '|' immediately follows a non-'|' line (or vice versa),
    // insert a blank line between them so the paragraph splitter can detect the table block.
    const rawLines = text.split('\n');
    const processedLines: string[] = [];
    for (let i = 0; i < rawLines.length; i++) {
      const cur = rawLines[i];
      const prev = processedLines[processedLines.length - 1];
      if (prev !== undefined) {
        const curIsTable = cur.trim().startsWith('|');
        const prevIsTable = prev.trim().startsWith('|');
        const prevIsBlank = prev.trim() === '';
        if (curIsTable && !prevIsTable && !prevIsBlank) {
          processedLines.push(''); // insert blank line before table starts
        } else if (!curIsTable && prevIsTable && cur.trim() !== '') {
          processedLines.push(''); // insert blank line after table ends
        }
      }
      processedLines.push(cur);
    }
    let cleanedText = processedLines.join('\n');

    // ---------- Placeholder cleanup ----------
    // Remove stray markdown separators
    cleanedText = cleanedText.replace(/^---\s*$/gm, '');
    // Remove placeholder arrow lines like "- → o que a lei diz"
    cleanedText = cleanedText.replace(/^-\s*→\s*o que a lei diz\s*$/gm, 'O que a lei diz');
    // Generic replacements for empty sections
    const genericReplacements: Record<string, string> = {
      '**Objetivos de aprendizagem**': '**Objetivos de aprendizagem**\n\nAo final desta seção, o estudante será capaz de compreender os principais conceitos e aplicá-los na prática jurídica.',
      '**Regra geral**': '**Regra geral**\n\nApresentar a regra geral aplicável ao tema em questão, com exemplos ilustrativos.',
      '**Artigo de Lei**': '**Artigo de Lei**\n\nInserir aqui o texto integral do artigo de lei pertinente, com sua numeração e referência.',
    };
    Object.entries(genericReplacements).forEach(([placeholder, replacement]) => {
      // Replace only if placeholder appears alone on a line
      const regex = new RegExp(`^${placeholder.replace(/\*/g, '\\*')}$`, 'gm');
      if (regex.test(cleanedText)) {
        cleanedText = cleanedText.replace(regex, replacement);
      }
    });

    const paragraphs = cleanedText.split('\n\n').filter(Boolean);
    return paragraphs.map((paragraph, pIdx) => {
      const trimmed = paragraph.trim();

      // Detect checklist (markdown task list)
    if (/^- \[\s*\]/m.test(trimmed)) {
      const lines = trimmed.split('\n').filter(l => l.startsWith('- [')).map(l => l.replace(/^[-\s]*\[\s*\]\s*/, '').trim());
      return (
        <ul className="lp-checklist" key={pIdx}>
          {lines.map((line, i) => (
            <li key={i} className="lp-checklist-item">
              <span className="lp-checkbox" />{renderTextWithHighlights(line)}
            </li>
          ))}
        </ul>
      );
    }

    // Detect arrow list ("- →" pattern)
    if (trimmed.startsWith('- →')) {
      const lines = trimmed.split('\n').map(l => l.replace(/^[-\s]*→\s*/, '').trim());
      return (
        <ul className="lp-arrowlist" key={pIdx}>
          {lines.map((line, i) => (
            <li key={i} className="lp-arrowlist-item">
              <span className="lp-arrow" />{renderTextWithHighlights(line)}
            </li>
          ))}
        </ul>
      );
    }

      if (trimmed.includes('|') && trimmed.split('\n').every(l => l.trim().startsWith('|') && l.trim().endsWith('|'))) {
        const rows = trimmed.split('\n').filter(l => l.trim().startsWith('|'));
        
        // Find all indices that contain '---' (header separators)
        const separatorIndices: number[] = [];
        rows.forEach((r, i) => { if (r.includes('---')) separatorIndices.push(i); });

        if (separatorIndices.length > 0) {
          const tables = [];
          
          for (let i = 0; i < separatorIndices.length; i++) {
            const sepIdx = separatorIndices[i];
            const startIdx = sepIdx - 1; // Header is the row before separator
            const nextSepIdx = separatorIndices[i + 1];
            // Data rows go until the row before the next header (which is nextSepIdx - 1)
            const endIdx = nextSepIdx ? nextSepIdx - 1 : rows.length;
            
            if (startIdx >= 0) {
              const headers = rows[startIdx].split('|').slice(1, -1).map(h => h.trim());
              const dataRows = rows.slice(sepIdx + 1, endIdx);
              tables.push({ headers, dataRows });
            }
          }

          return (
            <div key={pIdx} className="lp-tables-container">
              {tables.map((table, tIdx) => (
                <div key={tIdx} className="lp-table-wrap" style={{ marginBottom: tIdx < tables.length - 1 ? '24px' : '0' }}>
                  <table className="lp-table">
                    <thead>
                      <tr>
                        {table.headers.map((h, i) => <th key={i}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {table.dataRows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.split('|').slice(1, -1).map((cell, cIdx) => (
                            <td key={cIdx}>{renderTextWithHighlights(cell.trim())}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          );
        }
      }

      // ── SPECIAL CARDS ──

      // 1. Jurisprudência
      if (trimmed.startsWith('**Jurisprudência:**') || trimmed.startsWith('**STF:**') || trimmed.startsWith('**STJ:**') || trimmed.startsWith('**Súmula:**')) {
        const lines = trimmed.split('\n').filter(Boolean);
        const titleLine = lines[0];
        const title = titleLine.match(/\*\*([^*]+)\*\*/)?.[1] || 'Jurisprudência';
        const bodyText = lines.slice(1).join('\n') || trimmed.replace(/\*\*[^*]+\*\*:?\s*/, '');
        return (
          <div key={pIdx} className="lp-jurisprudence">
            <div className="lp-jurisprudence-header">
              <Scale size={14} />
              <strong>{title}</strong>
            </div>
            <div className="lp-jurisprudence-body">
              {renderTextWithHighlights(bodyText)}
            </div>
          </div>
        );
      }

      // 2. Alerta / Atenção / Exceção
      if (trimmed.startsWith('**Atenção:**') || trimmed.startsWith('**Importante:**') || trimmed.startsWith('**Exceção:**') || trimmed.startsWith('**Alerta:**')) {
        const lines = trimmed.split('\n').filter(Boolean);
        const titleLine = lines[0];
        const title = titleLine.match(/\*\*([^*]+)\*\*/)?.[1] || 'Atenção';
        const bodyText = lines.slice(1).join('\n') || trimmed.replace(/\*\*[^*]+\*\*:?\s*/, '');
        return (
          <div key={pIdx} className="lp-warning-card">
            <div className="lp-warning-header">
              <ShieldAlert size={14} />
              <strong>{title}</strong>
            </div>
            <div className="lp-warning-body">
              {renderTextWithHighlights(bodyText)}
            </div>
          </div>
        );
      }

      // 3. Dica Prática / Doutrina
      if (trimmed.startsWith('**Dica Prática:**') || trimmed.startsWith('**Doutrina:**') || trimmed.startsWith('**Ponto importante**') || trimmed.startsWith('**Lembre-se:**') || trimmed.startsWith('**Resumo')) {
        const lines = trimmed.split('\n').filter(Boolean);
        const titleLine = lines.find(l => l.includes('**'));
        const title = titleLine?.match(/\*\*([^*]+)\*\*/)?.[1] || 'Dica de Estudo';
        const bodyText = lines.filter(l => l !== titleLine).join('\n') || trimmed.replace(/\*\*[^*]+\*\*:?\s*/, '');
        return (
          <div key={pIdx} className="lp-tip-card">
            <div className="lp-tip-header">
              <Lightbulb size={14} />
              <strong>{title}</strong>
            </div>
            <div className="lp-tip-body">
              {renderTextWithHighlights(bodyText)}
            </div>
          </div>
        );
      }

      // 4. Estudo de caso (advocacia prática)
      if (trimmed.startsWith('**Estudo de caso (advocacia prática)**')) {
        const lines = trimmed.split('\n').filter(Boolean);
        const contentLines = lines.slice(1);
        return (
          <div key={pIdx} className="lp-case-study-card">
            <div className="lp-case-study-header">
              <Briefcase size={14} />
              <strong>Estudo de caso (Advocacia Prática)</strong>
            </div>
            <div className="lp-case-study-body">
              {contentLines.map((line, lIdx) => {
                const cleanLine = line.trim();
                if (cleanLine.startsWith('- ')) {
                  return (
                    <div key={lIdx} className="lp-case-study-item">
                      <ChevronRight size={14} className="lp-case-study-bullet" />
                      <span>{renderTextWithHighlights(cleanLine.substring(2))}</span>
                    </div>
                  );
                }
                return (
                  <p key={lIdx} className="lp-case-study-text">
                    {renderTextWithHighlights(cleanLine)}
                  </p>
                );
              })}
            </div>
          </div>
        );
      }

      // 5. Mapa mental rápido
      if (trimmed.startsWith('**Mapa mental rápido**')) {
        const lines = trimmed.split('\n').filter(Boolean);
        const contentLines = lines.slice(1);
        return (
          <div key={pIdx} className="lp-mindmap-card">
            <div className="lp-mindmap-header">
              <Brain size={14} />
              <strong>Mapa Mental Rápido</strong>
            </div>
            <div className="lp-mindmap-body">
              {contentLines.map((line, lIdx) => {
                const cleanLine = line.trim();
                const match = cleanLine.match(/^[-\s]*\*\*([^*]+)\*\*\s*(?:→|:)\s*(.+)$/);
                if (match) {
                  const label = match[1].trim();
                  const summary = match[2].trim();
                  return (
                    <div key={lIdx} className="lp-mindmap-item">
                      <span className="lp-mindmap-label">{label}</span>
                      <span className="lp-mindmap-sep">→</span>
                      <span className="lp-mindmap-summary">{renderTextWithHighlights(summary)}</span>
                    </div>
                  );
                }
                return (
                  <p key={lIdx} className="lp-mindmap-text">
                    {renderTextWithHighlights(cleanLine)}
                  </p>
                );
              })}
            </div>
          </div>
        );
      }

      // 6. Dica do professor
      if (trimmed.startsWith('**Dica do professor**')) {
        const lines = trimmed.split('\n').filter(Boolean);
        const bodyText = lines.slice(1).join('\n') || trimmed.replace(/\*\*Dica do professor\*\*:?\s*/, '');
        return (
          <div key={pIdx} className="lp-professor-tip-card">
            <div className="lp-professor-tip-header">
              <GraduationCap size={14} />
              <strong>Dica do Professor</strong>
            </div>
            <div className="lp-professor-tip-body">
              {renderTextWithHighlights(bodyText)}
            </div>
          </div>
        );
      }

      // 7. Bibliografia complementar
      if (trimmed.startsWith('**Bibliografia complementar**')) {
        const lines = trimmed.split('\n').filter(Boolean);
        const bodyText = lines.slice(1).join('\n') || trimmed.replace(/\*\*Bibliografia complementar\*\*:?\s*/, '');
        return (
          <div key={pIdx} className="lp-biblio-card">
            <div className="lp-biblio-header">
              <Bookmark size={14} />
              <strong>Bibliografia Complementar</strong>
            </div>
            <div className="lp-biblio-body">
              {renderTextWithHighlights(bodyText)}
            </div>
          </div>
        );
      }

      // 8. Checklist do advogado previdenciarista
      if (trimmed.startsWith('**Checklist do advogado previdenciarista**')) {
        const lines = trimmed.split('\n').filter(Boolean);
        const contentLines = lines.slice(1);
        return (
          <div key={pIdx} className="lp-checklist-card">
            <div className="lp-checklist-header">
              <CheckSquare size={14} />
              <strong>Checklist do Advogado Previdenciarista</strong>
            </div>
            <div className="lp-checklist-body">
              {contentLines.map((line, lIdx) => {
                const cleanLine = line.trim();
                const match = cleanLine.match(/^-\s*\[([\s*xX]?)\]\s*(.+)$/);
                if (match) {
                  const isChecked = match[1].trim().toLowerCase() === 'x';
                  const text = match[2].trim();
                  return (
                    <div key={lIdx} className="lp-checklist-item-row">
                      <span className={`lp-checklist-box ${isChecked ? 'checked' : ''}`} />
                      <span>{renderTextWithHighlights(text)}</span>
                    </div>
                  );
                }
                if (cleanLine.startsWith('- ')) {
                  return (
                    <div key={lIdx} className="lp-checklist-item-row">
                      <span className="lp-checklist-box" />
                      <span>{renderTextWithHighlights(cleanLine.substring(2))}</span>
                    </div>
                  );
                }
                return (
                  <p key={lIdx} className="lp-checklist-text">
                    {renderTextWithHighlights(cleanLine)}
                  </p>
                );
              })}
            </div>
          </div>
        );
      }

      // Bold heading detection (**text:** at start with colon inside)
      if (trimmed.match(/^\*\*[^*]+\*\*:?\s/)) {
        const lines = trimmed.split('\n').filter(Boolean);
        return (
          <div key={pIdx} className="lp-subsection">
            {lines.map((line, lIdx) => {
              const parts = line.split(/(\*\*[^*]+\*\*:?)/g);
              const firstBold = parts.find(p => p.startsWith('**'));
              if (firstBold && parts.length <= 3) {
                const title = firstBold.replace(/\*\*/g, '').replace(/:$/, '');
                const isLaw = title.toLowerCase().includes('artigo') || title.toLowerCase().includes('lei') || title.toLowerCase().includes('súmula');
                const IconComponent = isLaw ? Scale : BookOpen;
                const iconClass = isLaw ? 'lp-icon-law' : 'lp-icon-doc';
                const rest = parts.filter(p => !p.startsWith('**')).join('');
                return (
                  <div key={lIdx} className="lp-subheading-wrap">
                    <h3 className="lp-subheading">
                      <div className={`lp-subheading-icon-box ${iconClass}`}>
                        <IconComponent size={14} />
                      </div>
                      <span className="lp-subheading-title">{title}</span>
                    </h3>
                    {rest && <p className="lp-subheading-text">{renderTextWithHighlights(rest.trim())}</p>}
                  </div>
                );
              }
              return (
                <p key={lIdx} className="lp-text">
                  {renderTextWithHighlights(line)}
                </p>
              );
            })}
          </div>
        );
      }

      // Numbered list (1. text or I - text)
      if (trimmed.match(/^[IVXLCDM]+ - /) || trimmed.match(/^\d+\.\s/)) {
        const lines = trimmed.split('\n').filter(Boolean);
        return (
          <ol key={pIdx} className="lp-list lp-list--num">
            {lines.map((line, lIdx) => {
              const text = line.replace(/^[IVXLCDM]+ - |^\d+\.\s/, '');
              return (
                <li key={lIdx}>
                  {renderTextWithHighlights(text)}
                </li>
              );
            })}
          </ol>
        );
      }

      // Dash list (- text)
      if (trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').filter(l => l.trim().startsWith('- '));
        return (
          <ul key={pIdx} className="lp-list lp-list--dash">
            {items.map((item, iIdx) => {
              const itemText = item.trim().substring(2);
              return (
                <li key={iIdx}>
                  <div className="lp-list-bullet">
                    <div className="lp-list-bullet-inner"></div>
                  </div>
                  <span>
                    {renderTextWithHighlights(itemText)}
                  </span>
                </li>
              );
            })}
          </ul>
        );
      }

      // Regular paragraph with highlights
      return <p key={pIdx} className="lp-text">{renderTextWithHighlights(trimmed)}</p>;
    });
  }

  const sectionProgressPct = moduleData
    ? Math.min(100, Math.round((viewedSections.size / moduleData.sections.length) * 100))
    : 0;

  const moduleSidebarSections = moduleData.sections.map((s, idx) => ({
    id: s.id,
    title: s.title,
    done: viewedSections.has(s.id),
    active: currentSectionIdx === idx,
    onClick: () => scrollToSection(s.id, idx),
  }));

  // ── Render ──
  return (
    <AppShell
      userName={userName}
      userEmail={userEmail}
      onLogout={handleLogout}
      loggingOut={loggingOut}
      moduleSections={moduleSidebarSections}
      moduleProgressLabel={
        moduleData
          ? `${Math.min(viewedSections.size, moduleData.sections.length)}/${moduleData.sections.length}`
          : undefined
      }
      moduleProgressPct={sectionProgressPct}
    >
      <div ref={pageRef} className="mp-main-area">

        {/* STICKY TOPBAR */}
        <header className="mp-topbar">
          <div className="mp-topbar-inner">
            <div className="mp-topbar-left">
              <Link to="/dashboard" className="mp-topbar-back">
                <ArrowLeft size={14} />
              </Link>
              <span className="mp-topbar-divider" />
              <span className="mp-topbar-breadcrumb">
                <Link to="/dashboard">Dashboard</Link>
                <span className="mp-breadcrumb-sep">›</span>
                <Link to="/modules">Módulos</Link>
                <span className="mp-breadcrumb-sep">›</span>
                <span className="mp-breadcrumb-current">Módulo {moduleData.id}</span>
              </span>
            </div>
            <div className="mp-topbar-right">
              <span className={`mp-topbar-status mp-topbar-status--${status}`}>
                {status === 'concluido' ? 'Concluído' : status === 'liberado' ? 'Em andamento' : 'Bloqueado'}
              </span>
              <div className="mp-topbar-progress-dots">
                {moduleData.sections.map((s, dotIdx) => (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id, dotIdx)}
                    className={`mp-dot ${currentSectionIdx === dotIdx ? 'mp-dot--active' : ''} ${dotIdx < (currentSectionIdx ?? -1) ? 'mp-dot--done' : ''} ${viewedSections.has(s.id) ? 'mp-dot--viewed' : ''}`}
                    title={s.title}
                  />
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="mp-main">

          {/* LESSON HEADER (HERO) */}
          <section className="mp-hero" ref={heroRef}>
            <div className="mp-hero-badge">
              <Sparkles size={10} />
              Módulo {String(moduleData.id).padStart(2, '0')}
            </div>
            <h1 className="mp-hero-title">{moduleData.title}</h1>
            <p className="mp-hero-desc">{moduleData.description}</p>

            <div className="mp-hero-meta">
              <div className="mp-meta-chip">
                <BookOpen size={13} />
                <span>{moduleData.sections.length} {moduleData.sections.length === 1 ? 'seção' : 'seções'}</span>
              </div>
              <div className="mp-meta-chip">
                <HelpCircle size={13} />
                <span>{moduleData.quiz.length} {moduleData.quiz.length === 1 ? 'questão' : 'questões'}</span>
              </div>
              <div className="mp-meta-chip">
                <Clock size={13} />
                <span>{moduleData.duration}</span>
              </div>
            </div>

            {/* Objectives */}
            <div className="mp-objectives">
              <h3 className="mp-objectives-title">
                <Target size={15} />
                Ao final deste módulo você será capaz de:
              </h3>
              <ul className="mp-objectives-list">
                {moduleData.sections.map((s) => (
                  <li key={s.id}>
                    <CheckCircle2 size={13} />
                    <span>{s.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Progress + Mark Complete */}
            <div className="mp-hero-actions">
              <div className="mp-progress-compact">
                <div className="mp-progress-compact-track">
                  <div
                    className="mp-progress-compact-fill"
                    style={{ width: `${Math.min(100, Math.round((viewedSections.size / moduleData.sections.length) * 100))}%` }}
                  />
                </div>
                <span className="mp-progress-compact-label">
                  {Math.min(viewedSections.size, moduleData.sections.length)}/{moduleData.sections.length} seções lidas
                </span>
              </div>
              {status !== 'concluido' && status !== 'bloqueado' && (
                <button
                  onClick={handleMarkComplete}
                  className="mp-btn-complete"
                >
                  <CheckCircle2 size={14} />
                  Marcar como concluído
                </button>
              )}
            </div>
          </section>

          {/* TABS */}
          <div className="mp-tabs-bar">
            <button
              onClick={() => setActiveTab('material')}
              className={`mp-tab ${activeTab === 'material' ? 'mp-tab--active' : ''}`}
            >
              <BookOpenCheck size={15} />
              <span>Material Didático</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`mp-tab ${activeTab === 'quiz' ? 'mp-tab--active' : ''}`}
            >
              <HelpCircle size={15} />
              <span>Quiz de Fixação</span>
              {status === 'concluido' && (
                <span className="mp-tab-done">
                  <CheckCircle size={11} />
                  Concluído
                </span>
              )}
            </button>
          </div>

          {/* TAB: MATERIAL DIDÁTICO */}
          {activeTab === 'material' && (
            <div ref={contentRef} className="mp-content">

              {/* Loading */}
              {pageLoading && (
                <div className="mp-skeleton">
                  <div className="mp-skel-line" style={{ width: '60%' }} />
                  <div className="mp-skel-line" style={{ width: '40%' }} />
                  <div className="mp-skel-block" />
                  <div className="mp-skel-block" />
                  <div className="mp-skel-line" style={{ width: '50%' }} />
                </div>
              )}

              {!pageLoading && (
                <>
                  {/* Sections */}
                  {moduleData.sections.map((section, idx) => (
                    <article key={section.id} id={`lp-section-${section.id}`} className="mp-section">
                      <div className="mp-section-header">
                        <div className="mp-section-num">
                          <span>{String(idx + 1).padStart(2, '0')}</span>
                        </div>
                        <h2 className="mp-section-title">{section.title}</h2>
                        {viewedSections.has(section.id) && (
                          <span className="mp-section-read-badge">
                            <CheckCircle2 size={12} />
                            Lida
                          </span>
                        )}
                      </div>

                      <div className="mp-section-body">
                        {renderContent(
                          preprocessModuleText(
                            mergeSectionContent(
                              section.content,
                              moduleData.id,
                              section.id,
                              section.title
                            )
                          )
                        )}
                        {/* Sentinel para detectar que o usuário leu até o final da seção */}
                        <div className="mp-section-sentinel" data-sid={section.id} style={{ height: 1 }} />
                      </div>

                      {idx < moduleData.sections.length - 1 && <div className="mp-section-divider" />}
                    </article>
                  ))}

                  {/* Summary Card */}
                  <div className="mp-summary-card">
                    <div className="mp-summary-header">
                      <Award size={16} />
                      <h3>Resumo do Módulo</h3>
                    </div>
                    <div className="mp-summary-body">
                      <p className="mp-summary-intro">
                        Neste módulo você estudou <strong>{moduleData.sections.length} {moduleData.sections.length === 1 ? 'seção' : 'seções'}</strong> sobre <strong>{moduleData.title}</strong>.
                        Revise os pontos principais abaixo:
                      </p>
                      <ul className="mp-summary-list">
                        {moduleData.sections.map((s) => (
                          <li key={s.id}>
                            <CheckCircle2 size={14} />
                            <div>
                              <strong>{s.title}:</strong>{' '}
                              <span>{s.content.split('**')[1] || s.content.replace(/\*\*/g, '').split(' ').slice(0, 15).join(' ').trim()}...</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mp-summary-footer">
                      <div className="mp-summary-chip">
                        <Clock size={12} />
                        {moduleData.duration} de conteúdo
                      </div>
                      <div className="mp-summary-chip">
                        <HelpCircle size={12} />
                        {moduleData.quiz.length} {moduleData.quiz.length === 1 ? 'questão' : 'questões'} no quiz
                      </div>
                    </div>
                  </div>
 
                  {/* Bottom Navigation */}
                  <div className="mp-bottom-nav">
                    {prevModule && (
                      <Link to={`/module/${prevModule.slug}`} className="mp-nav-btn mp-nav-btn--prev">
                        <ChevronLeft size={16} />
                        <div className="mp-nav-text">
                          <span className="mp-nav-label">Anterior</span>
                          <span className="mp-nav-title">{prevModule.title}</span>
                        </div>
                      </Link>
                    )}
                    <div className="mp-nav-spacer" />
                    {nextModule && getModuleStatus(nextModule.id) !== 'bloqueado' && (
                      <Link to={`/module/${nextModule.slug}`} className="mp-nav-btn mp-nav-btn--next">
                        <div className="mp-nav-text">
                          <span className="mp-nav-label">Próximo</span>
                          <span className="mp-nav-title">{nextModule.title}</span>
                        </div>
                        <ChevronRight size={16} />
                      </Link>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB: QUIZ */}
          {activeTab === 'quiz' && (
            <div ref={quizRef} className="mp-quiz">

              {quizStep === 'start' && (
                <div className="mp-quiz-start">
                  <div className="mp-quiz-start-card">
                    <HelpCircle size={24} />
                    <h2>Quiz de Fixação</h2>
                    <p>
                      Teste seus conhecimentos sobre <strong>{moduleData.title}</strong>.
                      São {moduleData.quiz.length} {moduleData.quiz.length === 1 ? 'pergunta' : 'perguntas'}
                      {' '}e você precisa de no mínimo <strong>70%</strong> de aproveitamento.
                    </p>
                    <div className="mp-quiz-start-info">
                      <span><FileCheck size={13} /> {moduleData.quiz.length} {moduleData.quiz.length === 1 ? 'questão' : 'questões'}</span>
                      <span><CheckCircle2 size={13} /> 70% de acerto mínimo</span>
                      <span><RotateCcw size={13} /> Tentativas ilimitadas</span>
                    </div>
                    <button onClick={() => setQuizStep('answering')} className="mp-btn-primary">
                      <Play size={15} />
                      Começar Quiz
                    </button>
                  </div>
                </div>
              )}

              {quizStep === 'answering' && (
                <div className="mp-quiz-answer">
                  <div className="mp-quiz-progress">
                    <div className="mp-quiz-progress-track">
                      <div
                        className="mp-quiz-progress-fill"
                        style={{ width: `${(Object.keys(currentQuizAnswers).length / moduleData.quiz.length) * 100}%` }}
                      />
                    </div>
                    <span className="mp-quiz-progress-label">
                      {Object.keys(currentQuizAnswers).length}/{moduleData.quiz.length} respondidas
                    </span>
                  </div>

                  {moduleData.quiz.map((q, qIdx) => (
                    <div key={qIdx} className={`mp-qitem ${currentQuizAnswers[qIdx] !== undefined ? 'mp-qitem--done' : ''}`}>
                      <div className="mp-qitem-header">
                        <span className="mp-qitem-num">Questão {qIdx + 1}</span>
                        {currentQuizAnswers[qIdx] !== undefined && (
                          <span className="mp-qitem-check"><CheckCircle size={11} /> Respondida</span>
                        )}
                      </div>
                      <p className="mp-qitem-text">{q.question}</p>
                      <div className="mp-qitem-opts">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => setCurrentQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                            className={`mp-opt ${currentQuizAnswers[qIdx] === optIdx ? 'mp-opt--sel' : ''}`}
                          >
                            <span className={`mp-opt-radio ${currentQuizAnswers[qIdx] === optIdx ? 'mp-opt-radio--sel' : ''}`}>
                              {currentQuizAnswers[qIdx] === optIdx && <span className="mp-opt-dot" />}
                            </span>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(currentQuizAnswers).length < moduleData.quiz.length}
                    className="mp-btn-primary mp-btn-submit"
                  >
                    <FileCheck size={15} />
                    Enviar Respostas
                    {Object.keys(currentQuizAnswers).length < moduleData.quiz.length && (
                      <span className="mp-btn-hint">
                        ({moduleData.quiz.length - Object.keys(currentQuizAnswers).length} restantes)
                      </span>
                    )}
                  </button>
                </div>
              )}

              {quizStep === 'result' && (
                <div className={`mp-quiz-result ${quizGrade && quizGrade >= 70 ? 'mp-quiz-result--pass' : 'mp-quiz-result--fail'}`}>
                  <div className="mp-result-score">
                    <svg className="mp-result-ring" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="#E8ECF2" strokeWidth="6" />
                      <circle
                        cx="60" cy="60" r="54"
                        fill="none"
                        stroke={quizGrade && quizGrade >= 70 ? '#22C55E' : '#EF4444'}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 54}`}
                        strokeDashoffset={`${2 * Math.PI * 54 * (1 - (quizGrade || 0) / 100)}`}
                        transform="rotate(-90 60 60)"
                        style={{ transition: 'stroke-dashoffset 1.2s ease' }}
                      />
                    </svg>
                    <div className="mp-result-pct">
                      <span className="mp-result-num">{quizGrade}%</span>
                      <span className="mp-result-label">{totalCorrect}/{totalQuestions}</span>
                    </div>
                  </div>

                  <h2 className="mp-result-title">
                    {quizGrade && quizGrade >= 70
                      ? 'Módulo Concluído com Sucesso!'
                      : 'Aproveitamento Insuficiente'}
                  </h2>
                  <p className="mp-result-desc">
                    {quizGrade && quizGrade >= 70
                      ? 'Parabéns! Você demonstrou domínio do conteúdo deste módulo.'
                      : 'Você precisa de pelo menos 70% para concluir. Reveja o material e tente novamente.'}
                  </p>

                  <div className="mp-result-details">
                    {moduleData.quiz.map((q, qIdx) => {
                      const userAnswer = currentQuizAnswers[qIdx];
                      const isCorrect = userAnswer === q.correctAnswer;
                      return (
                        <div key={qIdx} className="mp-result-item">
                          <div className="mp-result-item-top">
                            <span className="mp-result-q-num">Questão {qIdx + 1}</span>
                            {isCorrect ? (
                              <span className="mp-result-badge mp-result-badge--ok">
                                <CheckCircle size={10} /> Correta
                              </span>
                            ) : (
                              <span className="mp-result-badge mp-result-badge--err">
                                <AlertTriangle size={10} /> Incorreta
                              </span>
                            )}
                          </div>
                          <p className="mp-result-q-text">{q.question}</p>
                          <div className="mp-result-answers">
                            <div className="mp-result-answer">
                              <span className="mp-result-answer-label">Sua resposta:</span>
                              <span className={`mp-result-answer-val ${isCorrect ? 'mp-result-answer-val--ok' : 'mp-result-answer-val--err'}`}>
                                {q.options[userAnswer] || 'Não respondida'}
                              </span>
                            </div>
                            {!isCorrect && (
                              <div className="mp-result-answer">
                                <span className="mp-result-answer-label">Correta:</span>
                                <span className="mp-result-answer-val mp-result-answer-val--ok">
                                  {q.options[q.correctAnswer]}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="mp-result-explanation">
                            <Lightbulb size={12} />
                            <span>{q.explanation}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mp-result-actions">
                    {quizGrade && quizGrade >= 70 ? (
                      <>
                        {nextModule && getModuleStatus(nextModule.id) !== 'bloqueado' && (
                          <Link to={`/module/${nextModule.slug}`} className="mp-btn-primary">
                            Próximo Módulo
                            <ArrowRight size={14} />
                          </Link>
                        )}
                        <button onClick={handleRetry} className="mp-btn-ghost">
                          <RotateCcw size={13} />
                          Refazer Quiz
                        </button>
                      </>
                    ) : (
                      <button onClick={handleRetry} className="mp-btn-primary">
                        <RotateCcw size={14} />
                        Tentar Novamente
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <style>{`
        .mp-main-area {
          min-height: 100vh;
          background: #FAFBFC;
          font-family: var(--font-sans, 'Inter', sans-serif);
          color: #0B1E38;
        }

        /* ═══════════════════════════════════════════════
           SIDEBAR (Fixed & Glassmorphic)
           ═══════════════════════════════════════════════ */
        .mp-sidebar {
          width: 260px;
          flex-shrink: 0;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 100;
          background: rgba(7, 21, 42, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          display: flex;
          flex-direction: column;
          padding: 24px 18px;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
          overflow-y: auto;
          transition: all 0.3s var(--ease-out-quart);
        }
        .mp-sidebar::-webkit-scrollbar { width: 4px; }
        .mp-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

        .mp-sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
          padding: 0 4px;
        }
        .mp-sidebar-logo-mark {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #C9A84C, #D4B05A);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(201,168,76,0.3);
          flex-shrink: 0;
          transition: transform 0.3s;
        }
        .mp-sidebar-logo:hover .mp-sidebar-logo-mark {
          transform: rotate(5deg) scale(1.05);
        }
        .mp-sidebar-logo-mark svg { color: #07152A; }
        .mp-sidebar-logo-text {
          display: flex;
          flex-direction: column;
        }
        .mp-sidebar-brand {
          font-size: 15px;
          font-weight: 700;
          font-family: var(--font-editorial, 'Cormorant Garamond', Georgia, serif);
          color: #FFFFFF;
          line-height: 1.2;
          letter-spacing: 0.02em;
        }
        .mp-sidebar-tagline {
          font-size: 8px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #C9A84C;
          line-height: 1;
          margin-top: 3px;
        }

        .mp-sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 24px;
        }
        .mp-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: rgba(168, 180, 196, 0.65);
          text-decoration: none;
          transition: all 0.25s var(--ease-out-quart);
          border: 1px solid transparent;
        }
        .mp-nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #FFFFFF;
          transform: translateX(2px);
        }
        .mp-nav-item--active {
          background: rgba(201, 168, 76, 0.1);
          color: #C9A84C;
          border-color: rgba(201, 168, 76, 0.2);
        }

        .mp-sidebar-sections {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          margin-bottom: 16px;
          padding-right: 2px;
        }
        .mp-sidebar-sections::-webkit-scrollbar { width: 3px; }
        .mp-sidebar-sections::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 4px; }
        .mp-sidebar-sections-title {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(168, 180, 196, 0.35);
          margin-bottom: 10px;
          padding: 0 4px;
        }
        .mp-sidebar-sections-list {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .mp-sec-nav-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          width: 100%;
          padding: 8px 10px;
          background: none;
          border: 1px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          font-family: var(--font-sans);
          transition: all 0.2s var(--ease-out-quart);
        }
        .mp-sec-nav-item:hover { 
          background: rgba(255, 255, 255, 0.03); 
          transform: translateX(2px);
        }
        .mp-sec-nav-item--active { 
          background: rgba(201, 168, 76, 0.08); 
          border-color: rgba(201, 168, 76, 0.15);
        }
        .mp-sec-nav-item--done { 
          background: rgba(34, 197, 94, 0.03); 
        }
        .mp-sec-nav-label {
          font-size: 11.5px;
          line-height: 1.4;
          color: rgba(168, 180, 196, 0.5);
          transition: color 0.2s;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .mp-sec-nav-item:hover .mp-sec-nav-label { color: rgba(255, 255, 255, 0.85); }
        .mp-sec-nav-item--active .mp-sec-nav-label { color: #C9A84C; font-weight: 600; }
        .mp-sec-nav-item--done .mp-sec-nav-label { color: rgba(180, 220, 180, 0.7); }
        
        .mp-sec-nav-check { color: rgba(255, 255, 255, 0.15); flex-shrink: 0; margin-top: 2px; transition: all 0.2s; }
        .mp-sec-nav-check--done { color: #22C55E !important; flex-shrink: 0; margin-top: 2px; }
        .mp-sec-nav-item--active .mp-sec-nav-check { color: #C9A84C; }
        .mp-sec-nav-item--done .mp-sec-nav-check { color: #22C55E !important; }

        .mp-sidebar-progress {
          padding: 14px 6px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          margin-bottom: 12px;
        }
        .mp-sidebar-progress-track {
          height: 4px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .mp-sidebar-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #C9A84C, #D4B05A);
          border-radius: 4px;
          box-shadow: 0 0 8px rgba(201, 168, 76, 0.4);
          transition: width 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .mp-sidebar-progress-label {
          font-size: 10.5px;
          color: rgba(168, 180, 196, 0.4);
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .mp-sidebar-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 4px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .mp-sidebar-user {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .mp-user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #C9A84C, #D4B05A);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          color: #07152A;
          box-shadow: 0 2px 8px rgba(201, 168, 76, 0.2);
        }
        .mp-user-name {
          font-size: 12.5px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
        }
        .mp-logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: rgba(168, 180, 196, 0.4);
          cursor: pointer;
          transition: all 0.2s var(--ease-out-quart);
        }
        .mp-logout-btn:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.12);
          border-color: rgba(239, 68, 68, 0.2);
          transform: scale(1.05);
        }

        /* ═══════════════════════════════════════════════
           MAIN AREA
           ═══════════════════════════════════════════════ */
        .mp-main-area {
          flex: 1;
          min-width: 0;
        }

        .mp-main {
          max-width: 820px;
          margin: 0 auto;
          padding: 0 32px 80px;
        }

        /* ═══════════════════════════════════════════════
           TOPBAR
           ═══════════════════════════════════════════════ */
        .mp-topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(250, 251, 252, 0.94);
          backdrop-filter: blur(18px) saturate(180%);
          -webkit-backdrop-filter: blur(18px) saturate(180%);
          border-bottom: 1px solid #E8ECF2;
          box-shadow: 0 1px 4px rgba(11, 30, 56, 0.02);
        }
        .mp-topbar-inner {
          max-width: 920px;
          margin: 0 auto;
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 56px;
          gap: 12px;
        }
        .mp-topbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .mp-topbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }
        .mp-topbar-back {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 9px;
          color: #64748B;
          text-decoration: none;
          transition: all 0.2s var(--ease-out-quart);
          flex-shrink: 0;
          border: 1px solid #E8ECF2;
          background: #FFFFFF;
        }
        .mp-topbar-back:hover { background: #F1F4F9; color: #0B1E38; border-color: #D2DCE8; transform: translateX(-1px); }
        .mp-topbar-divider { width: 1px; height: 16px; background: #E2E8F0; flex-shrink: 0; }
        .mp-topbar-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          color: #94A3B8;
          min-width: 0;
          overflow: hidden;
        }
        .mp-topbar-breadcrumb a { color: #64748B; text-decoration: none; white-space: nowrap; transition: color 0.2s; font-weight: 500; }
        .mp-topbar-breadcrumb a:hover { color: #C9A84C; }
        .mp-breadcrumb-sep { color: #CBD5E1; font-size: 14px; }
        .mp-breadcrumb-current { color: #0B1E38; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .mp-topbar-status {
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 100px;
          white-space: nowrap;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.4);
        }
        .mp-topbar-status--concluido  { background: rgba(34,197,94,0.08);  color: #16A34A; border: 1px solid rgba(34,197,94,0.18); }
        .mp-topbar-status--liberado   { background: rgba(201,168,76,0.08); color: #A8893A; border: 1px solid rgba(201,168,76,0.18); }
        .mp-topbar-status--bloqueado  { background: rgba(100,116,139,0.06); color: #94A3B8; border: 1px solid rgba(100,116,139,0.1); }

        .mp-topbar-progress-dots { display: flex; align-items: center; gap: 4px; }
        .mp-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #E2E8F0; border: none; cursor: pointer; padding: 0;
          transition: all 0.25s var(--ease-out-quart);
        }
        .mp-dot:hover { background: #C9A84C; transform: scale(1.4); }
        .mp-dot--active { background: #C9A84C; box-shadow: 0 0 0 2.5px rgba(201,168,76,0.25); transform: scale(1.2); }
        .mp-dot--done { background: #22C55E; }
        .mp-dot--viewed { background: #A8D8A8; }

        /* ═══════════════════════════════════════════════
           HERO (Academic Theme)
           ═══════════════════════════════════════════════ */
        .mp-hero { padding: 44px 0 32px; border-bottom: 1px solid #E8ECF2; margin-bottom: 28px; }
        .mp-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.18);
          border-radius: 100px;
          font-size: 10.5px;
          font-weight: 750;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #A8893A;
          width: fit-content;
          margin-bottom: 16px;
          box-shadow: 0 2px 6px rgba(201,168,76,0.03);
        }
        .mp-hero-title {
          font-family: var(--font-editorial, 'Cormorant Garamond', Georgia, serif);
          font-size: clamp(32px, 4vw, 42px);
          font-weight: 500;
          color: #0B1E38;
          line-height: 1.15;
          letter-spacing: -0.025em;
          margin: 0 0 12px;
        }
        .mp-hero-desc {
          font-size: 15px;
          color: #64748B;
          line-height: 1.75;
          margin: 0 0 20px;
          max-width: 700px;
        }
        .mp-hero-meta { display: flex; align-items: center; gap: 20px; margin-bottom: 28px; flex-wrap: wrap; }
        .mp-meta-chip {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; color: #64748B; font-weight: 600;
        }
        .mp-meta-chip svg { color: #C9A84C; flex-shrink: 0; width: 15px; height: 15px; }

        .mp-objectives {
          background: #FAFBFC; border: 1px solid #E8ECF2; border-radius: 14px;
          padding: 20px 24px; margin-bottom: 28px;
          box-shadow: inset 0 1px 0 #FFFFFF;
        }
        .mp-objectives-title {
          display: flex; align-items: center; gap: 8px;
          font-size: 14px; font-weight: 700; color: #0B1E38; margin: 0 0 12px;
          letter-spacing: -0.01em;
        }
        .mp-objectives-title svg { color: #C9A84C; flex-shrink: 0; }
        .mp-objectives-list { list-style: none; display: flex; flex-direction: column; gap: 9px; margin: 0; padding: 0; }
        .mp-objectives-list li {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 13.5px; color: #4A5568; line-height: 1.6;
        }
        .mp-objectives-list li svg { color: #22C55E; flex-shrink: 0; margin-top: 3px; }

        .mp-hero-actions { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .mp-progress-compact { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 240px; }
        .mp-progress-compact-track { flex: 1; height: 6px; background: #E8ECF2; border-radius: 4px; overflow: hidden; }
        .mp-progress-compact-fill {
          height: 100%;
          background: linear-gradient(90deg, #C9A84C, #D4B05A);
          border-radius: 4px;
          transition: width 0.5s ease;
        }
        .mp-progress-compact-label { font-size: 11.5px; color: #94A3B8; font-weight: 600; white-space: nowrap; }
        .mp-btn-complete {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #0B1E38, #133466);
          color: #fff; font-size: 13px; font-weight: 700;
          border: none; border-radius: 10px; cursor: pointer;
          transition: all 0.25s var(--ease-out-quart); font-family: var(--font-sans); white-space: nowrap;
          box-shadow: 0 4px 14px rgba(11,30,56,0.15);
        }
        .mp-btn-complete:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(11,30,56,0.25); }
        .mp-btn-complete svg { color: #22C55E; }

        /* ═══════════════════════════════════════════════
           TABS
           ═══════════════════════════════════════════════ */
        .mp-tabs-bar { display: flex; gap: 4px; border-bottom: 1px solid #E8ECF2; margin-bottom: 32px; }
        .mp-tab {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 22px; background: none; border: none;
          border-bottom: 2px solid transparent;
          font-size: 13.5px; font-weight: 700; color: #94A3B8;
          cursor: pointer; transition: all 0.2s ease; font-family: var(--font-sans);
          margin-bottom: -1px;
        }
        .mp-tab:hover { color: #64748B; }
        .mp-tab--active { color: #0B1E38; border-bottom-color: #C9A84C; }
        .mp-tab-done {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 9.5px; font-weight: 800; color: #16A34A;
          background: rgba(34,197,94,0.08); padding: 3px 8px; border-radius: 100px;
        }

        /* ═══════════════════════════════════════════════
           MATERIAL CONTENT RENDERERS
           ═══════════════════════════════════════════════ */
        .mp-content { display: flex; flex-direction: column; gap: 0; }
        .mp-section { margin-bottom: 0; scroll-margin-top: 80px; }
        
        .mp-section-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 22px;
        }
        .mp-section-num {
          width: 38px; height: 38px; border-radius: 12px;
          background: linear-gradient(135deg, #0B1E38, #133466);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 800; color: #fff; flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(11,30,56,0.1);
        }
        .mp-section-title {
          font-family: var(--font-editorial, 'Cormorant Garamond', Georgia, serif);
          font-size: 24px; font-weight: 500; color: #0B1E38;
          margin: 0; line-height: 1.3;
          letter-spacing: -0.01em;
        }
        .mp-section-read-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 9.5px; font-weight: 750; color: #22C55E;
          background: rgba(34,197,94,0.06); padding: 3px 10px; border-radius: 100px;
          margin-left: auto; white-space: nowrap;
          border: 1px solid rgba(34,197,94,0.12);
        }
        
        .mp-section-body { padding-left: 52px; }
        .mp-section-divider {
          height: 1px;
          background: linear-gradient(90deg, #E8ECF2 0%, transparent 100%);
          margin: 40px 0 40px 52px;
        }

        /* Standard academic prose */
        .mp-text {
          font-size: 15.5px; line-height: 1.85; color: #2D3748; margin: 0 0 16px;
          letter-spacing: 0.01em;
        }
        .mp-text strong { color: #0B1E38; font-weight: 700; }

        /* Inline badges for laws */
        .lp-law-badge {
          background: rgba(201, 168, 76, 0.07); 
          color: #987C30; 
          border: 1px solid rgba(201, 168, 76, 0.16); 
          padding: 1px 6px; 
          border-radius: 4px; 
          font-family: var(--font-sans, 'Inter', sans-serif); 
          font-size: 12px; 
          font-weight: 700; 
          display: inline-block;
          margin: 0 2px;
        }

        /* ── Special custom law cards ── */
        .lp-jurisprudence {
          background: rgba(201, 168, 76, 0.02);
          border: 1px solid rgba(201, 168, 76, 0.18);
          border-left: 4px solid #C9A84C;
          border-radius: 14px;
          padding: 22px 26px;
          margin: 24px 0;
          box-shadow: 0 4px 20px rgba(201, 168, 76, 0.03);
        }
        .lp-jurisprudence-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          color: #987C30;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .lp-jurisprudence-header svg { flex-shrink: 0; }
        .lp-jurisprudence-body {
          font-size: 15px;
          line-height: 1.8;
          color: #334155;
        }

        .lp-warning-card {
          background: rgba(239, 68, 68, 0.01);
          border: 1px solid rgba(239, 68, 68, 0.12);
          border-left: 4px solid #EF4444;
          border-radius: 14px;
          padding: 22px 26px;
          margin: 24px 0;
          box-shadow: 0 4px 20px rgba(239, 68, 68, 0.02);
        }
        .lp-warning-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          color: #EF4444;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .lp-warning-header svg { flex-shrink: 0; }
        .lp-warning-body {
          font-size: 15px;
          line-height: 1.8;
          color: #334155;
        }

        .lp-tip-card {
          background: rgba(59, 130, 246, 0.01);
          border: 1px solid rgba(59, 130, 246, 0.12);
          border-left: 4px solid #3B82F6;
          border-radius: 14px;
          padding: 22px 26px;
          margin: 24px 0;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.02);
        }
        .lp-tip-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          color: #3B82F6;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .lp-tip-header svg { flex-shrink: 0; }
        .lp-tip-body {
          font-size: 15px;
          line-height: 1.8;
          color: #334155;
        }

        /* ── Bento responsive comparison tables ── */
        .lp-table-wrap {
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #E8ECF2;
          box-shadow: 0 4px 24px rgba(11, 30, 56, 0.03);
          margin: 24px 0;
          background: #FFFFFF;
          max-width: 100%;
          overflow-x: auto;
        }
        .lp-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13.5px;
        }
        .lp-table th {
          background: linear-gradient(135deg, #07152A, #0F2A4F);
          color: #C9A84C;
          font-weight: 700;
          font-family: var(--font-sans);
          text-transform: uppercase;
          font-size: 10.5px;
          letter-spacing: 0.08em;
          padding: 14px 18px;
          border-bottom: 2px solid rgba(201, 168, 76, 0.2);
        }
        .lp-table td {
          padding: 14px 18px;
          border-bottom: 1px solid #F0F3F8;
          color: #334155;
          line-height: 1.65;
        }
        .lp-table tr:last-child td { border-bottom: none; }
        .lp-table tr:nth-child(even) { background: #FAFBFC; }
        .lp-table tr:hover { background: rgba(201, 168, 76, 0.015); }

        .mp-subsection { margin-bottom: 20px; }
        .mp-subheading-wrap { margin-bottom: 10px; }
        .mp-subheading {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin: 0 0 6px;
          line-height: 1.45;
        }
        .mp-subheading svg { color: #C9A84C; flex-shrink: 0; margin-top: 4px; width: 16px; height: 16px; }
        .mp-subheading-title {
          font-size: 17px; font-weight: 750; color: #0B1E38;
        }
        .mp-subheading-colon {
          font-size: 17px; font-weight: 750; color: #C9A84C; margin-left: 2px;
        }
        .mp-subheading-text {
          font-size: 15px; color: #64748B; line-height: 1.8;
          margin: 0 0 12px; padding-left: 26px;
        }

        /* Elegant list stylings */
        .mp-list { margin: 0 0 16px; padding: 0; list-style: none; }
        .mp-list--dash { display: flex; flex-direction: column; gap: 8px; }
        .mp-list--dash li {
          display: flex; align-items: flex-start; gap: 12px;
          font-size: 15px; color: #334155; line-height: 1.7;
          padding: 8px 14px; background: #FFFFFF;
          border: 1px solid #F0F3F8; border-radius: 10px;
          box-shadow: 0 1px 3px rgba(11, 30, 56, 0.01);
        }
        .mp-list-icon { color: #22C55E; flex-shrink: 0; margin-top: 4px; }
        .mp-list--num { counter-reset: mp-counter; display: flex; flex-direction: column; gap: 8px; }
        .mp-list--num li {
          counter-increment: mp-counter;
          display: flex; align-items: flex-start; gap: 12px;
          font-size: 15px; color: #334155; line-height: 1.7;
          padding: 4px 0; padding-left: 28px; position: relative;
        }
        .mp-list--num li::before {
          content: counter(mp-counter)".";
          position: absolute; left: 0; font-weight: 750; color: #C9A84C;
        }

        /* ═══════════════════════════════════════════════
           SUMMARY CARD
           ═══════════════════════════════════════════════ */
        .mp-summary-card {
          background: linear-gradient(135deg, #07152A, #10294C);
          border-radius: 16px; padding: 32px 36px; margin: 44px 0; color: #EDF1F7;
          box-shadow: 0 12px 36px rgba(7, 21, 42, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .mp-summary-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .mp-summary-header svg { color: #C9A84C; }
        .mp-summary-header h3 { font-family: var(--font-editorial); font-size: 21px; font-weight: 500; margin: 0; letter-spacing: -0.01em; }
        .mp-summary-intro { font-size: 13.5px; color: rgba(255,255,255,0.7); line-height: 1.75; margin: 0 0 18px; }
        .mp-summary-intro strong { color: #F4E3B1; }
        .mp-summary-list { list-style: none; display: flex; flex-direction: column; gap: 10px; padding: 0; margin: 0; }
        .mp-summary-list li {
          display: flex; align-items: flex-start; gap: 12px;
          font-size: 13.5px; line-height: 1.65; color: rgba(255,255,255,0.8);
        }
        .mp-summary-list li svg { color: #C9A84C; flex-shrink: 0; margin-top: 3px; }
        .mp-summary-list li strong { color: #EDF1F7; }
        .mp-summary-footer { display: flex; align-items: center; gap: 20px; margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); }
        .mp-summary-chip { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; color: rgba(255,255,255,0.5); }
        .mp-summary-chip svg { color: #C9A84C; }

        /* ═══════════════════════════════════════════════
           BOTTOM NAV
           ═══════════════════════════════════════════════ */
        .mp-bottom-nav {
          display: flex; align-items: center; gap: 16px;
          padding-top: 32px; border-top: 1px solid #E8ECF2; margin-top: 16px;
        }
        .mp-nav-btn {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 20px; background: #FFFFFF; border: 1px solid #E8ECF2;
          border-radius: 14px; text-decoration: none; transition: all 0.25s var(--ease-out-quart); flex: 1;
          box-shadow: 0 1px 3px rgba(11,30,56,0.02);
        }
        .mp-nav-btn:hover { border-color: rgba(201,168,76,0.3); box-shadow: 0 6px 18px rgba(11,30,56,0.06); transform: translateY(-2px); }
        .mp-nav-btn--prev { text-align: left; }
        .mp-nav-btn--next { text-align: right; justify-content: flex-end; }
        .mp-nav-text { min-width: 0; }
        .mp-nav-label { display: block; font-size: 10px; font-weight: 750; text-transform: uppercase; letter-spacing: 0.08em; color: #94A3B8; margin-bottom: 2px; }
        .mp-nav-title { display: block; font-size: 13.5px; font-weight: 700; color: #0B1E38; line-height: 1.35; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mp-nav-btn svg { color: #94A3B8; flex-shrink: 0; transition: color 0.2s; }
        .mp-nav-btn:hover svg { color: #C9A84C; }
        .mp-nav-spacer { flex: 1; }

        /* ═══════════════════════════════════════════════
           SKELETONS
           ═══════════════════════════════════════════════ */
        .mp-skeleton { display: flex; flex-direction: column; gap: 14px; }
        .mp-skel-line {
          height: 14px;
          background: linear-gradient(90deg, #F0F3F8 25%, #FAFBFC 50%, #F0F3F8 75%);
          background-size: 200% 100%;
          animation: mpShimmer 1.5s ease-in-out infinite;
          border-radius: 6px;
        }
        .mp-skel-block {
          height: 110px;
          background: linear-gradient(90deg, #F0F3F8 25%, #FAFBFC 50%, #F0F3F8 75%);
          background-size: 200% 100%;
          animation: mpShimmer 1.5s ease-in-out infinite;
          border-radius: 8px;
        }
        @keyframes mpShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* ═══════════════════════════════════════════════
           NOT FOUND
           ═══════════════════════════════════════════════ */
        .mp-notfound { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #fff; padding: 24px; }
        .mp-notfound-inner { text-align: center; max-width: 400px; display: flex; flex-direction: column; align-items: center; gap: 14px; }
        .mp-notfound-inner svg { color: #C9A84C; }
        .mp-notfound-inner h2 { font-family: var(--font-editorial); font-size: 24px; font-weight: 600; color: #0B1E38; margin: 0; }
        .mp-notfound-inner p { font-size: 14px; color: #64748B; margin: 0; }
        .mp-notfound-inner a {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 12px 24px; background: #0B1E38; color: #fff;
          font-size: 13px; font-weight: 600; border-radius: 10px; text-decoration: none;
          transition: all 0.2s; margin-top: 8px;
        }
        .mp-notfound-inner a:hover { background: #133466; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(11,30,56,0.2); }

        /* ═══════════════════════════════════════════════
           QUIZ
           ═══════════════════════════════════════════════ */
        .mp-quiz { margin-top: 0; }
        .mp-quiz-start { display: flex; justify-content: center; padding: 20px 0; }
        .mp-quiz-start-card {
          max-width: 480px; width: 100%; text-align: center;
          padding: 40px 32px; background: #FFFFFF; border: 1px solid #E8ECF2; border-radius: 16px;
          box-shadow: 0 4px 20px rgba(11, 30, 56, 0.04);
        }
        .mp-quiz-start-card > svg { color: #C9A84C; width: 40px; height: 40px; margin: 0 auto 16px; }
        .mp-quiz-start-card h2 { font-family: var(--font-editorial); font-size: 24px; font-weight: 500; color: #0B1E38; margin: 0 0 12px; }
        .mp-quiz-start-card p { font-size: 14.5px; color: #64748B; line-height: 1.7; margin: 0 0 20px; }
        .mp-quiz-start-card p strong { color: #0B1E38; }
        .mp-quiz-start-info { display: flex; justify-content: center; gap: 18px; flex-wrap: wrap; margin-bottom: 24px; }
        .mp-quiz-start-info span { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #64748B; font-weight: 600; }
        .mp-quiz-start-info svg { color: #C9A84C; width: 15px; height: 15px; }

        .mp-quiz-progress {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 24px; padding: 12px 18px;
          background: #FFFFFF; border: 1px solid #E8ECF2; border-radius: 12px;
          box-shadow: 0 2px 8px rgba(11, 30, 56, 0.02);
        }
        .mp-quiz-progress-track { flex: 1; height: 6px; background: #F0F3F8; border-radius: 4px; overflow: hidden; }
        .mp-quiz-progress-fill { height: 100%; background: linear-gradient(90deg, #C9A84C, #D4B05A); border-radius: 4px; transition: width 0.4s ease; }
        .mp-quiz-progress-label { font-size: 12.5px; font-weight: 700; color: #64748B; white-space: nowrap; }

        .mp-qitem {
          margin-bottom: 20px; padding: 20px 24px;
          background: #FFFFFF; border: 1px solid #E8ECF2; border-radius: 14px; transition: all 0.25s;
          box-shadow: 0 2px 8px rgba(11, 30, 56, 0.01);
        }
        .mp-qitem--done { border-color: rgba(201,168,76,0.25); box-shadow: 0 4px 12px rgba(201,168,76,0.03); }
        .mp-qitem-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .mp-qitem-num { font-size: 10px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #C9A84C; }
        .mp-qitem-check { display: flex; align-items: center; gap: 4px; font-size: 10.5px; font-weight: 700; color: #22C55E; }
        .mp-qitem-text { font-size: 15px; font-weight: 700; color: #0B1E38; margin: 0 0 16px; line-height: 1.55; }
        .mp-qitem-opts { display: flex; flex-direction: column; gap: 8px; }
        .mp-opt {
          display: flex; align-items: center; gap: 14px; width: 100%;
          padding: 12px 16px; background: #fff; border: 1px solid #E8ECF2;
          border-radius: 12px; color: #475569; font-size: 14px;
          font-weight: 600; cursor: pointer; text-align: left;
          transition: all 0.2s var(--ease-out-quart); font-family: var(--font-sans);
        }
        .mp-opt:hover { background: #F8FAFC; border-color: #CBD5E1; }
        .mp-opt--sel { background: rgba(201,168,76,0.04); border-color: #C9A84C; color: #0B1E38; box-shadow: 0 0 0 1.5px rgba(201,168,76,0.12); }
        .mp-opt-radio { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #CBD5E1; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
        .mp-opt-radio--sel { border-color: #C9A84C; }
        .mp-opt-dot { width: 8px; height: 8px; border-radius: 50%; background: #C9A84C; }

        .mp-btn-primary {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 12px 24px; background: linear-gradient(135deg, #C9A84C, #D4B05A);
          color: #07152A; font-size: 13.5px; font-weight: 750; border: none; border-radius: 12px;
          cursor: pointer; transition: all 0.25s var(--ease-out-quart); font-family: var(--font-sans);
          text-decoration: none; box-shadow: 0 4px 14px rgba(201,168,76,0.25);
        }
        .mp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,168,76,0.35); }
        .mp-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
        .mp-btn-submit { width: 100%; padding: 14px; margin-top: 8px; }
        .mp-btn-hint { font-weight: 600; opacity: 0.8; font-size: 12.5px; }
        .mp-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 20px; background: #F1F4F9; border: 1px solid #E8ECF2;
          border-radius: 12px; color: #64748B; font-size: 13.5px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; font-family: var(--font-sans); text-decoration: none;
        }
        .mp-btn-ghost:hover { background: #E8ECF2; color: #0B1E38; }

        .mp-quiz-result {
          padding: 36px 32px; background: #FFFFFF; border: 1px solid #E8ECF2;
          border-radius: 16px; text-align: center; max-width: 640px; margin: 0 auto;
          box-shadow: 0 4px 24px rgba(11, 30, 56, 0.04);
        }
        .mp-quiz-result--pass { border-color: rgba(34,197,94,0.25); }
        .mp-quiz-result--fail { border-color: rgba(239,68,68,0.2); }

        .mp-result-score { position: relative; width: 110px; height: 110px; margin: 0 auto 20px; }
        .mp-result-ring { width: 110px; height: 110px; }
        .mp-result-pct { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .mp-result-num { font-size: 30px; font-weight: 850; color: #0B1E38; line-height: 1; font-variant-numeric: tabular-nums; }
        .mp-result-label { font-size: 11.5px; color: #94A3B8; font-weight: 600; margin-top: 3px; }

        .mp-result-title { font-family: var(--font-editorial); font-size: 23px; font-weight: 500; color: #0B1E38; margin: 0 0 10px; }
        .mp-result-desc { font-size: 14.5px; color: #64748B; line-height: 1.65; margin: 0 0 24px; max-width: 400px; margin-left: auto; margin-right: auto; }

        .mp-result-details { text-align: left; margin-bottom: 24px; padding-top: 20px; border-top: 1px solid #E8ECF2; }
        .mp-result-item { padding: 16px; background: #FAFBFC; border: 1px solid #E8ECF2; border-radius: 12px; margin-bottom: 12px; }
        .mp-result-item:last-child { margin-bottom: 0; }
        .mp-result-item-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .mp-result-q-num { font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #94A3B8; }
        .mp-result-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 9.5px; font-weight: 800; letter-spacing: 0.04em; padding: 3px 9px; border-radius: 100px; }
        .mp-result-badge--ok { background: rgba(34,197,94,0.08); color: #16A34A; }
        .mp-result-badge--err { background: rgba(239,68,68,0.08); color: #EF4444; }
        .mp-result-q-text { font-size: 14px; font-weight: 700; color: #0B1E38; margin: 0 0 10px; line-height: 1.45; }
        .mp-result-answers { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
        .mp-result-answer { display: flex; align-items: center; gap: 8px; font-size: 12.5px; }
        .mp-result-answer-label { color: #94A3B8; flex-shrink: 0; }
        .mp-result-answer-val { font-weight: 700; padding: 2.5px 8px; border-radius: 5px; }
        .mp-result-answer-val--ok { background: rgba(34,197,94,0.06); color: #16A34A; }
        .mp-result-answer-val--err { background: rgba(239,68,68,0.06); color: #EF4444; }
        .mp-result-explanation { display: flex; align-items: flex-start; gap: 7px; padding: 8px 10px; background: rgba(59,130,246,0.03); border: 1px solid rgba(59,130,246,0.08); border-radius: 8px; }
        .mp-result-explanation svg { color: #3B82F6; flex-shrink: 0; margin-top: 2px; }
        .mp-result-explanation span { font-size: 12px; color: #4A6FA5; line-height: 1.5; }
        .mp-result-actions { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }

        /* ── Premium Custom Cards ── */
        .lp-case-study-card {
          background: rgba(201, 168, 76, 0.02);
          border: 1px solid rgba(201, 168, 76, 0.15);
          border-left: 4px solid #C9A84C;
          border-radius: 12px;
          padding: 22px 26px;
          margin: 24px 0;
          box-shadow: 0 4px 16px rgba(201, 168, 76, 0.02);
        }
        .lp-case-study-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          color: #987C30;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .lp-case-study-body {
          font-size: 15px;
          color: #334155;
          line-height: 1.75;
        }
        .lp-case-study-text {
          margin-bottom: 14px;
          font-weight: 500;
        }
        .lp-case-study-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 8px;
          padding-left: 4px;
        }
        .lp-case-study-bullet {
          color: #C9A84C;
          margin-top: 4px;
          flex-shrink: 0;
        }

        .lp-mindmap-card {
          background: rgba(8, 145, 178, 0.02);
          border: 1px solid rgba(8, 145, 178, 0.12);
          border-left: 4px solid #0891B2;
          border-radius: 12px;
          padding: 22px 26px;
          margin: 24px 0;
          box-shadow: 0 4px 16px rgba(8, 145, 178, 0.02);
        }
        .lp-mindmap-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          color: #0E7490;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .lp-mindmap-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .lp-mindmap-item {
          display: flex;
          align-items: baseline;
          gap: 12px;
          padding: 12px 16px;
          background: #FFFFFF;
          border: 1px solid rgba(8, 145, 178, 0.1);
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(8, 145, 178, 0.01);
        }
        .lp-mindmap-label {
          font-weight: 700;
          color: #164E63;
          font-size: 14.5px;
          flex-shrink: 0;
          min-width: 120px;
        }
        .lp-mindmap-sep {
          color: #0891B2;
          font-weight: 700;
          opacity: 0.7;
        }
        .lp-mindmap-summary {
          font-size: 14.5px;
          color: #334155;
          line-height: 1.6;
        }

        .lp-professor-tip-card {
          background: rgba(19, 52, 102, 0.02);
          border: 1px solid rgba(19, 52, 102, 0.12);
          border-left: 4px solid #133466;
          border-radius: 12px;
          padding: 22px 26px;
          margin: 24px 0;
          box-shadow: 0 4px 16px rgba(19, 52, 102, 0.02);
        }
        .lp-professor-tip-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          color: #133466;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .lp-professor-tip-body {
          font-size: 15px;
          line-height: 1.8;
          color: #334155;
        }

        .lp-biblio-card {
          background: rgba(100, 116, 139, 0.02);
          border: 1px solid rgba(100, 116, 139, 0.12);
          border-left: 4px solid #64748B;
          border-radius: 12px;
          padding: 22px 26px;
          margin: 24px 0;
          box-shadow: 0 4px 16px rgba(100, 116, 139, 0.02);
        }
        .lp-biblio-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          color: #475569;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .lp-biblio-body {
          font-size: 14.5px;
          line-height: 1.75;
          color: #475569;
          font-style: italic;
        }

        .lp-checklist-card {
          background: rgba(22, 163, 74, 0.02);
          border: 1px solid rgba(22, 163, 74, 0.12);
          border-left: 4px solid #16A34A;
          border-radius: 12px;
          padding: 22px 26px;
          margin: 24px 0;
          box-shadow: 0 4px 16px rgba(22, 163, 74, 0.02);
        }
        .lp-checklist-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          color: #15803D;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .lp-checklist-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .lp-checklist-item-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14.5px;
          color: #334155;
          line-height: 1.6;
        }
        .lp-checklist-box {
          width: 16px;
          height: 16px;
          border: 2px solid #16A34A;
          border-radius: 4px;
          margin-top: 3px;
          flex-shrink: 0;
          position: relative;
        }
        .lp-checklist-box.checked::after {
          content: '✓';
          position: absolute;
          top: -2px;
          left: 2.5px;
          font-size: 11px;
          font-weight: 900;
          color: #16A34A;
        }

        /* ═══════════════════════════════════════════════
           RESPONSIVE
           ═══════════════════════════════════════════════ */
        @media (max-width: 1024px) {
          .mp-sidebar { width: 200px; }
          .mp-main-area { margin-left: 200px; }
          .mp-sidebar-sections-title { font-size: 8px; }
          .mp-sec-nav-label { font-size: 10px; }
        }
        @media (max-width: 768px) {
          .mp-sidebar { display: none; }
          .mp-main-area { margin-left: 0; }
          .mp-main { padding: 0 16px 48px; }
          .mp-topbar-inner { padding: 0 16px; }
          .mp-topbar-breadcrumb a, .mp-breadcrumb-sep { display: none; }
          .mp-breadcrumb-current { display: block; font-size: 12px; }
          .mp-hero { padding: 24px 0 20px; }
          .mp-hero-title { font-size: 24px; }
          .mp-section-body { padding-left: 0; }
          .mp-section-divider { margin-left: 0; }
          .mp-summary-card { padding: 18px 16px; }
          .mp-quiz-result { padding: 20px 16px; }
          .mp-qitem { padding: 14px; }
          .mp-bottom-nav { flex-direction: column; }
          .mp-nav-btn { width: 100%; }
        }
        @media (max-width: 480px) {
          .mp-topbar-progress-dots { display: none; }
          .mp-topbar-status { display: none; }
          .mp-hero-meta { flex-direction: column; align-items: flex-start; gap: 6px; }
          .mp-hero-actions { flex-direction: column; align-items: stretch; }
          .mp-objectives { padding: 14px; }
          .mp-objectives-list li { font-size: 12px; }
          .mp-quiz-start-info { flex-direction: column; align-items: center; gap: 6px; }
        }
      `}</style>
    </AppShell>
  );
}
