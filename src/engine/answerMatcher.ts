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

/**
 * Checks if two answer strings are duplicates after text normalization
 * (handles case, punctuation, extra spacing).
 */
export function isDuplicateFastMoneyAnswer(ans1: string, ans2: string): boolean {
  const norm1 = normalizeText(ans1);
  const norm2 = normalizeText(ans2);
  if (!norm1 || !norm2) return false;
  return norm1 === norm2;
}

/**
 * Checks whether Player 2's answer duplicates Player 1's answer for that question,
 * either by matching the same canonical question answer or by having matching normalized text.
 */
export function checkFastMoneyDuplicate(
  player1SubmittedText: string,
  player1MatchedAnswerId: string | null,
  player2InputText: string,
  player2MatchedAnswerId: string | null
): boolean {
  if (!player2InputText || !player2InputText.trim()) return false;

  // 1. If both contestants matched the exact same canonical answer option
  if (
    player1MatchedAnswerId &&
    player2MatchedAnswerId &&
    player1MatchedAnswerId === player2MatchedAnswerId
  ) {
    return true;
  }

  // 2. If their raw submitted answers normalize to the same text
  if (player1SubmittedText && isDuplicateFastMoneyAnswer(player1SubmittedText, player2InputText)) {
    return true;
  }

  return false;
}

