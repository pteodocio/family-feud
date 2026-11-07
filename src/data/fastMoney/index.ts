import { FAST_MONEY_SETS, type FastMoneySet } from './fastMoneySets';

export { FAST_MONEY_SETS, type FastMoneySet } from './fastMoneySets';

/**
 * Find a Fast Money set by its unique ID (e.g. 'fm_set_01')
 */
export function getFastMoneySetById(id: string): FastMoneySet | undefined {
  return FAST_MONEY_SETS.find((set) => set.id === id);
}

/**
 * Get a random Fast Money set, optionally avoiding recently played sets.
 */
export function getRandomFastMoneySet(playedSetIds: string[] = []): FastMoneySet {
  const available = FAST_MONEY_SETS.filter((set) => !playedSetIds.includes(set.id));
  const pool = available.length > 0 ? available : FAST_MONEY_SETS;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

/**
 * Validation result for a Fast Money set.
 */
export interface FastMoneyValidationReport {
  valid: boolean;
  totalSets: number;
  totalQuestions: number;
  errors: string[];
}

/**
 * Validates all Fast Money sets against TV show rules:
 * - Exactly 20 sets
 * - Exactly 5 questions per set (100 total questions)
 * - Each question must have 5-8 answers
 * - Answer points must be in descending order (or equal for ties)
 * - Total points per question must equal exactly 100
 */
export function validateAllFastMoneySets(): FastMoneyValidationReport {
  const errors: string[] = [];
  let totalQuestions = 0;

  if (FAST_MONEY_SETS.length !== 20) {
    errors.push(`Expected 20 Fast Money sets, found ${FAST_MONEY_SETS.length}`);
  }

  FAST_MONEY_SETS.forEach((set, sIdx) => {
    if (!set.id) errors.push(`Set at index ${sIdx} is missing an ID`);
    if (!set.title) errors.push(`Set ${set.id} is missing a title`);
    if (!set.questions || set.questions.length !== 5) {
      errors.push(`Set ${set.id} has ${set.questions?.length ?? 0} questions (expected 5)`);
    }

    set.questions?.forEach((q, qIdx) => {
      totalQuestions += 1;
      if (!q.id) errors.push(`Question at ${set.id}[${qIdx}] is missing an ID`);
      if (!q.prompt) errors.push(`Question ${q.id || qIdx} is missing a prompt`);
      if (!q.answers || q.answers.length < 5 || q.answers.length > 8) {
        errors.push(`Question ${q.id} has ${q.answers?.length ?? 0} answers (expected 5-8)`);
      }

      const sumPoints = q.answers?.reduce((sum, a) => sum + (a.points || 0), 0) ?? 0;
      if (sumPoints !== 100) {
        errors.push(`Question ${q.id} points sum to ${sumPoints} (expected exactly 100)`);
      }

      // Check descending points order
      if (q.answers) {
        for (let i = 0; i < q.answers.length - 1; i++) {
          if (q.answers[i].points < q.answers[i + 1].points) {
            errors.push(
              `Question ${q.id} answers not in descending points order: answer ${i} has ${q.answers[i].points} pts, but answer ${i + 1} has ${q.answers[i + 1].points} pts`
            );
          }
        }
      }
    });
  });

  return {
    valid: errors.length === 0,
    totalSets: FAST_MONEY_SETS.length,
    totalQuestions,
    errors,
  };
}
