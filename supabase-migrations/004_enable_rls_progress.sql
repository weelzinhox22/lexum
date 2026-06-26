-- ═══════════════════════════════════════════════════════════════
-- Migration 004: Enable RLS + Policies for Progress Tables
-- ═══════════════════════════════════════════════════════════════
-- Nota: O frontend já gerencia a conclusão dos módulos via
-- checkAndCompleteModule(userId, moduleId, totalSections),
-- que recebe a contagem correta de seções do courseModules.
-- O trigger SQL não funciona aqui porque section_progress
-- só armazena seções CONCLUÍDAS — cada linha é uma seção
-- concluída, então COUNT(*) sempre = número de concluídas,
-- impossibilitando o SQL de saber quantas seções um módulo
-- tem ao todo sem uma tabela modules.

-- ── 1. user_progress ──────────────────────────────────────────

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own progress
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own progress
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- ── 2. section_progress ───────────────────────────────────────

ALTER TABLE section_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own section progress
DROP POLICY IF EXISTS "Users can view own section progress" ON section_progress;
CREATE POLICY "Users can view own section progress"
  ON section_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own section progress
DROP POLICY IF EXISTS "Users can insert own section progress" ON section_progress;
CREATE POLICY "Users can insert own section progress"
  ON section_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own section progress
DROP POLICY IF EXISTS "Users can update own section progress" ON section_progress;
CREATE POLICY "Users can update own section progress"
  ON section_progress FOR UPDATE
  USING (auth.uid() = user_id);
