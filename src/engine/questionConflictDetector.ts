import type { Question, FastMoneySet } from '../types/game';

// Common synonyms and concept groups for Filipino Family Feud gameplay
const CONCEPT_SYNONYM_GROUPS: string[][] = [
  ['breakfast', 'morning meal', 'almusal', 'morning food', 'agahan'],
  ['sleep', 'bedtime', 'tulog', 'bed', 'sleeping', 'nighttime routine', 'bago matulog'],
  ['late', 'tardiness', 'huli', 'delay', 'nahuli', 'nalate'],
  ['pet', 'domestic animal', 'alaga', 'alagang hayop', 'household pet'],
  ['refrigerator', 'fridge', 'ref', 'freezer', 'palamigan'],
  ['wallet', 'purse', 'bag', 'pocket', 'bulsa', 'pitaka'],
  ['supermarket', 'grocery', 'market', 'palengke', 'groceries', 'pamilihan'],
  ['school', 'classroom', 'student', 'teacher', 'eskwela', 'study', 'aral', 'paaralan'],
  ['bath', 'shower', 'banyo', 'cr', 'toilet', 'washroom', 'paliligo', 'ligo'],
  ['phone', 'cellphone', 'mobile', 'gadget', 'smartphone', 'telepono'],
  ['doctor', 'hospital', 'clinic', 'nurse', 'gamot', 'medicine', 'sick', 'sakit', 'ospital'],
  ['money', 'pera', 'cash', 'bank', 'savings', 'rich', 'millionaire', 'yaman', 'sweldo'],
  ['party', 'birthday', 'celebration', 'handaan', 'fiesta', 'kaarawan', 'handa'],
  ['movie', 'cinema', 'sine', 'theater', 'film', 'sinehan', 'pelikula'],
  ['vehicle', 'car', 'sasakyan', 'traffic', 'drive', 'kotse', 'tsikot'],
  ['island', 'beach', 'isla', 'dagat', 'sea', 'ocean', 'dalampasigan'],
  ['food', 'ulam', 'kain', 'dish', 'meal', 'snack', 'pagkain'],
  ['fruit', 'prutas', 'vegetable', 'gulay'],
  ['clothes', 'clothing', 'damit', 'suot', 'garment', 'apparel'],
  ['chores', 'cleaning', 'linis', 'household chores', 'gawaing bahay'],
];

const STOP_WORDS = new Set([
  'name', 'something', 'people', 'thing', 'things', 'that', 'you', 'find', 'when',
  'with', 'where', 'what', 'common', 'commonly', 'their', 'which', 'during', 'before',
  'after', 'inside', 'around', 'para', 'mga', 'ang', 'ng', 'sa', 'na', 'is', 'a',
  'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'have', 'who',
  'would', 'often', 'usually', 'typical', 'most', 'some', 'one', 'items', 'item'
]);

/**
 * Normalizes text by removing non-alphanumeric characters, lowering case, and collapsing whitespace.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts meaningful content tokens from a prompt.
 */
export function extractContentTokens(prompt: string): Set<string> {
  const words = normalizeText(prompt).split(' ');
  const tokens = new Set<string>();
  for (const w of words) {
    if (w.length > 2 && !STOP_WORDS.has(w)) {
      tokens.add(w);
    }
  }
  return tokens;
}

/**
 * Maps prompt words to conceptual synonym groups.
 */
export function getConceptGroups(prompt: string): Set<string> {
  const words = normalizeText(prompt).split(' ');
  const groups = new Set<string>();

  for (const word of words) {
    if (word.length <= 2) continue;
    for (let idx = 0; idx < CONCEPT_SYNONYM_GROUPS.length; idx++) {
      const synList = CONCEPT_SYNONYM_GROUPS[idx];
      if (synList.some((syn) => syn === word || (syn.length > 4 && (word.includes(syn) || syn.includes(word))))) {
        groups.add(`concept_${idx}`);
      }
    }
  }
  return groups;
}

export interface PlayedQuestionRecord {
  id: string;
  prompt: string;
  answers?: string[];
}

/**
 * Checks whether a candidate question duplicates or semantically conflicts with any question in the played questions list.
 */
export function isQuestionConflicting(
  candidate: Question,
  playedQuestions: PlayedQuestionRecord[]
): { isConflict: boolean; reason?: string; conflictingQuestion?: PlayedQuestionRecord } {
  if (!playedQuestions || playedQuestions.length === 0) {
    return { isConflict: false };
  }

  const candidateNorm = normalizeText(candidate.prompt);
  const candidateTokens = extractContentTokens(candidate.prompt);
  const candidateConcepts = getConceptGroups(candidate.prompt);
  const candidateAnswers = candidate.answers.map((a) => normalizeText(a.text));

  for (const played of playedQuestions) {
    // 1. Exact ID match
    if (candidate.id === played.id) {
      return {
        isConflict: true,
        reason: `Exact question ID match (${candidate.id})`,
        conflictingQuestion: played,
      };
    }

    const playedNorm = normalizeText(played.prompt);

    // 2. Exact or near-exact prompt wording match
    if (candidateNorm === playedNorm) {
      return {
        isConflict: true,
        reason: `Identical prompt wording`,
        conflictingQuestion: played,
      };
    }

    // 3. Token Jaccard overlap (word-level similarity)
    const playedTokens = extractContentTokens(played.prompt);
    const sharedTokens = [...candidateTokens].filter((t) => playedTokens.has(t));
    const unionTokens = new Set([...candidateTokens, ...playedTokens]);
    const jaccard = unionTokens.size > 0 ? sharedTokens.length / unionTokens.size : 0;

    if (jaccard >= 0.35 || sharedTokens.length >= 3) {
      return {
        isConflict: true,
        reason: `Substantial wording overlap (shared: ${sharedTokens.join(', ')})`,
        conflictingQuestion: played,
      };
    }

    // 4. Conceptual intent overlap + shared synonyms
    const playedConcepts = getConceptGroups(played.prompt);
    const sharedConcepts = [...candidateConcepts].filter((c) => playedConcepts.has(c));

    // 5. Answer overlap check
    const playedAnswers = (played.answers || []).map((a) => normalizeText(a));
    const sharedAnswers = candidateAnswers.filter((ca) =>
      playedAnswers.some((pa) => pa === ca || (ca.length > 4 && (pa.includes(ca) || ca.includes(pa))))
    );

    if (sharedConcepts.length >= 2) {
      return {
        isConflict: true,
        reason: `Semantic concept match in question intent`,
        conflictingQuestion: played,
      };
    }

    if (sharedConcepts.length >= 1 && sharedAnswers.length >= 2) {
      return {
        isConflict: true,
        reason: `Semantic intent overlap with shared answer expectations (${sharedAnswers.join(', ')})`,
        conflictingQuestion: played,
      };
    }

    if (sharedAnswers.length >= 3) {
      return {
        isConflict: true,
        reason: `Multiple identical expected answers (${sharedAnswers.join(', ')})`,
        conflictingQuestion: played,
      };
    }
  }

  return { isConflict: false };
}

/**
 * Validates a Fast Money set against played regular-round questions.
 * Replaces any conflicting questions with unused, clean questions from the full bank.
 * If unable to produce 5 valid questions, returns error.
 */
export function resolveFastMoneyConflicts(
  targetSet: FastMoneySet,
  playedQuestions: PlayedQuestionRecord[],
  allFastMoneySets: FastMoneySet[]
): {
  resolvedSet: FastMoneySet | null;
  replacedCount: number;
  replacedQuestions: Array<{ originalPrompt: string; replacementPrompt: string; reason: string }>;
  error?: string;
} {
  if (!allFastMoneySets || allFastMoneySets.length === 0) {
    return {
      resolvedSet: null,
      replacedCount: 0,
      replacedQuestions: [],
      error: 'Fast Money question bank is unavailable or empty. Cannot load regular-round questions.',
    };
  }

  const currentQuestions = [...targetSet.questions];
  const replacedQuestions: Array<{ originalPrompt: string; replacementPrompt: string; reason: string }> = [];

  // Pool of candidate replacements from other sets
  const candidatePool: Question[] = allFastMoneySets
    .flatMap((s) => s.questions)
    .filter((q) => !currentQuestions.some((cq) => cq.id === q.id));

  let poolIndex = 0;

  for (let i = 0; i < currentQuestions.length; i++) {
    const q = currentQuestions[i];
    const check = isQuestionConflicting(q, playedQuestions);

    if (check.isConflict) {
      // Find a clean replacement from the candidate pool
      let replacement: Question | null = null;

      while (poolIndex < candidatePool.length) {
        const candidate = candidatePool[poolIndex++];
        // Must not conflict with played questions
        const candCheck = isQuestionConflicting(candidate, playedQuestions);
        // Must not conflict with any question already in currentQuestions
        const internalCheck = isQuestionConflicting(
          candidate,
          currentQuestions.map((cq) => ({ id: cq.id, prompt: cq.prompt, answers: cq.answers.map((a) => a.text) }))
        );

        if (!candCheck.isConflict && !internalCheck.isConflict) {
          replacement = candidate;
          break;
        }
      }

      if (!replacement) {
        return {
          resolvedSet: null,
          replacedCount: replacedQuestions.length,
          replacedQuestions,
          error: `Unable to find a non-conflicting replacement for question: "${q.prompt}". Fast Money round cannot start.`,
        };
      }

      replacedQuestions.push({
        originalPrompt: q.prompt,
        replacementPrompt: replacement.prompt,
        reason: check.reason || 'Semantic conflict with played round',
      });

      currentQuestions[i] = replacement;
    }
  }

  const resolvedSet: FastMoneySet = {
    ...targetSet,
    questions: currentQuestions,
  };

  return {
    resolvedSet,
    replacedCount: replacedQuestions.length,
    replacedQuestions,
  };
}
