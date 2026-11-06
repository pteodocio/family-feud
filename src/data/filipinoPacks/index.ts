import type { QuestionPack } from '../../types/game';
import { PACKS_1_TO_5 } from './pack1to5';
import { PACKS_6_TO_10 } from './pack6to10';
import { PACKS_11_TO_15 } from './pack11to15';
import { PACKS_16_TO_20 } from './pack16to20';
import { PACKS_21_TO_25 } from './pack21to25';
import { PACKS_26_TO_31 } from './pack26to31';
import { PACKS_32_TO_39 } from './pack32to39';
import { PACKS_40_TO_49 } from './pack40to49';
import { PACKS_50_TO_61 } from './pack50to61';

export const FILIPINO_NEW_6_PACKS: QuestionPack[] = PACKS_26_TO_31;
export const FILIPINO_NEW_8_PACKS: QuestionPack[] = PACKS_32_TO_39;
export const FILIPINO_SCENARIO_10_PACKS: QuestionPack[] = PACKS_40_TO_49;
export const VARIETY_12_PACKS: QuestionPack[] = PACKS_50_TO_61;

export const FILIPINO_BUILTIN_PACKS: QuestionPack[] = [
  ...PACKS_1_TO_5,
  ...PACKS_6_TO_10,
  ...PACKS_11_TO_15,
  ...PACKS_16_TO_20,
  ...PACKS_21_TO_25,
  ...PACKS_26_TO_31,
  ...PACKS_32_TO_39,
  ...PACKS_40_TO_49,
  ...PACKS_50_TO_61,
];

// Alias for backwards compatibility
export const FILIPINO_25_PACKS: QuestionPack[] = FILIPINO_BUILTIN_PACKS;

export function validateQuestionPackIntegrity(packs: QuestionPack[]): {
  isValid: boolean;
  packCount: number;
  questionCount: number;
  answerCount: number;
  errors: string[];
} {
  const errors: string[] = [];
  let totalQuestions = 0;
  let totalAnswers = 0;
  const seenPackIds = new Set<string>();
  const seenQuestionIds = new Set<string>();

  for (const pack of packs) {
    if (seenPackIds.has(pack.id)) {
      errors.push(`Duplicate pack ID: ${pack.id}`);
    }
    seenPackIds.add(pack.id);

    if (pack.questions.length !== 5) {
      errors.push(`Pack ${pack.id} (${pack.title}) does not have exactly 5 questions (has ${pack.questions.length})`);
    }

    for (const q of pack.questions) {
      totalQuestions++;
      if (seenQuestionIds.has(q.id)) {
        errors.push(`Duplicate question ID: ${q.id}`);
      }
      seenQuestionIds.add(q.id);

      if (q.answers.length < 3 || q.answers.length > 6) {
        errors.push(`Question ${q.id} has ${q.answers.length} answers, expected 3 to 6`);
      }

      const sumPoints = q.answers.reduce((acc, a) => acc + a.points, 0);
      if (sumPoints !== 100) {
        errors.push(`Question ${q.id} in pack ${pack.title} points sum to ${sumPoints}, expected 100`);
      }

      for (let i = 0; i < q.answers.length - 1; i++) {
        if (q.answers[i].points < q.answers[i + 1].points) {
          errors.push(
            `Question ${q.id} answers not sorted descending: answer ${i} (${q.answers[i].points}) < answer ${i + 1} (${q.answers[i + 1].points})`
          );
        }
      }

      totalAnswers += q.answers.length;
    }
  }

  return {
    isValid: errors.length === 0,
    packCount: packs.length,
    questionCount: totalQuestions,
    answerCount: totalAnswers,
    errors,
  };
}
