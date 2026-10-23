import type { Answer, Question } from '../types/game';

/**
 * Normalizes input text by:
 * - Lowercasing
 * - Trimming leading/trailing whitespace
 * - Collapsing multiple consecutive spaces into single space
 * - Removing basic punctuation (dots, commas, quotes, hyphens, exclamation marks)
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface MatchResult {
  isMatch: boolean;
  matchedAnswer: Answer | null;
  points: number;
}

/**
 * Checks if a user's answer text matches any answer or accepted variant in a question.
 */
export function matchAnswer(question: Question, input: string): MatchResult {
  const normalizedInput = normalizeText(input);
  if (!normalizedInput) {
    return { isMatch: false, matchedAnswer: null, points: 0 };
  }

  for (const answer of question.answers) {
    const normalizedPrimary = normalizeText(answer.text);
    if (normalizedPrimary === normalizedInput) {
      return { isMatch: true, matchedAnswer: answer, points: answer.points };
    }

    if (answer.acceptedVariants && Array.isArray(answer.acceptedVariants)) {
      for (const variant of answer.acceptedVariants) {
        if (normalizeText(variant) === normalizedInput) {
          return { isMatch: true, matchedAnswer: answer, points: answer.points };
        }
      }
    }
  }

  return { isMatch: false, matchedAnswer: null, points: 0 };
}
