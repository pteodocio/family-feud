import {
  generateAiTrivia,
  generateAiCharades,
  generateAiPictionary,
  generateAiGuessWord,
  hasAiApiKey,
} from './aiGenerator';
import { generateProceduralTrivia } from './localGenerators/triviaGenerator';
import { generateProceduralCharades } from './localGenerators/charadesGenerator';
import { generateProceduralPictionary } from './localGenerators/pictionaryGenerator';
import { generateBingoCards, type GeneratedBingoCard } from './localGenerators/bingoGenerator';
import { generateProceduralGuessWord } from './localGenerators/guessWordGenerator';
import { getContentHistoryCount, clearContentHistory } from './contentHistory';
import type { TriviaQuestion } from '../data/hubData/triviaQuestions';
import type { CharadesWord } from '../data/hubData/charadesWords';
import type { PictionaryWord } from '../data/hubData/pictionaryWords';
import type { WordCluePuzzle } from '../data/hubData/wordClues';

export interface GenerationRequestBase {
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'all';
  count: number;
  language?: 'en' | 'fil';
  preferAi?: boolean;
  topicPrompt?: string;
  avoidRecent?: boolean;
}

export interface EngineStatus {
  hasAiKey: boolean;
  activeMode: 'ai' | 'local';
  historyCount: number;
}

/**
 * Checks the active generation engine status.
 */
export async function getEngineStatus(gameId?: string): Promise<EngineStatus> {
  const hasKey = hasAiApiKey();
  const historyCount = await getContentHistoryCount(gameId);
  return {
    hasAiKey: hasKey,
    activeMode: hasKey ? 'ai' : 'local',
    historyCount,
  };
}

/**
 * Generates fresh Trivia questions via AI (if preferred & available) or Local Procedural Engine.
 */
export async function generateTriviaContent(
  req: GenerationRequestBase
): Promise<{ questions: TriviaQuestion[]; source: 'ai' | 'local' }> {
  if (req.preferAi && hasAiApiKey()) {
    try {
      const aiResults = await generateAiTrivia({
        category: req.category,
        difficulty: req.difficulty,
        count: req.count,
        language: req.language,
        topicPrompt: req.topicPrompt,
      });

      if (aiResults && aiResults.length > 0) {
        return {
          questions: aiResults.map((q) => ({
            id: q.id,
            category: q.category,
            prompt: q.prompt,
            options: q.options,
            correctOptionIndex: q.correctOptionIndex,
            explanation: q.explanation,
            type: 'multiple_choice',
          })),
          source: 'ai',
        };
      }
    } catch (err) {
      console.warn('AI Trivia generation failed, falling back to local procedural engine:', err);
    }
  }

  // Local procedural engine
  const localQuestions = await generateProceduralTrivia({
    category: req.category,
    difficulty: req.difficulty,
    count: req.count,
    language: req.language,
    avoidRecent: req.avoidRecent !== false,
  });

  return { questions: localQuestions, source: 'local' };
}

/**
 * Regenerates a single Trivia question.
 */
export async function regenerateSingleTriviaItem(
  req: Omit<GenerationRequestBase, 'count'>
): Promise<TriviaQuestion | null> {
  const res = await generateTriviaContent({ ...req, count: 1 });
  return res.questions[0] || null;
}

/**
 * Generates fresh Charades prompts via AI or Local Engine.
 */
export async function generateCharadesContent(
  req: GenerationRequestBase
): Promise<{ words: CharadesWord[]; source: 'ai' | 'local' }> {
  if (req.preferAi && hasAiApiKey()) {
    try {
      const aiResults = await generateAiCharades({
        category: req.category,
        difficulty: req.difficulty,
        count: req.count,
        language: req.language,
        topicPrompt: req.topicPrompt,
      });

      if (aiResults && aiResults.length > 0) {
        return { words: aiResults, source: 'ai' };
      }
    } catch (err) {
      console.warn('AI Charades generation failed, falling back to local engine:', err);
    }
  }

  const localWords = await generateProceduralCharades({
    category: req.category,
    difficulty: req.difficulty,
    count: req.count,
    language: req.language,
    avoidRecent: req.avoidRecent !== false,
  });

  return { words: localWords, source: 'local' };
}

/**
 * Regenerates a single Charades prompt.
 */
export async function regenerateSingleCharadesItem(
  req: Omit<GenerationRequestBase, 'count'>
): Promise<CharadesWord | null> {
  const res = await generateCharadesContent({ ...req, count: 1 });
  return res.words[0] || null;
}

/**
 * Generates fresh Pictionary prompts via AI or Local Engine.
 */
export async function generatePictionaryContent(
  req: GenerationRequestBase
): Promise<{ words: PictionaryWord[]; source: 'ai' | 'local' }> {
  if (req.preferAi && hasAiApiKey()) {
    try {
      const aiResults = await generateAiPictionary({
        category: req.category,
        difficulty: req.difficulty,
        count: req.count,
        language: req.language,
        topicPrompt: req.topicPrompt,
      });

      if (aiResults && aiResults.length > 0) {
        return { words: aiResults, source: 'ai' };
      }
    } catch (err) {
      console.warn('AI Pictionary generation failed, falling back to local engine:', err);
    }
  }

  const localWords = await generateProceduralPictionary({
    category: req.category,
    difficulty: req.difficulty,
    count: req.count,
    language: req.language,
    avoidRecent: req.avoidRecent !== false,
  });

  return { words: localWords, source: 'local' };
}

/**
 * Regenerates a single Pictionary prompt.
 */
export async function regenerateSinglePictionaryItem(
  req: Omit<GenerationRequestBase, 'count'>
): Promise<PictionaryWord | null> {
  const res = await generatePictionaryContent({ ...req, count: 1 });
  return res.words[0] || null;
}

/**
 * Generates unique Bingo cards (Traditional 75-Ball or Themed Word Bingo).
 */
export function generateBingoContent(options: {
  theme?: string;
  cardCount: number;
  playerNames?: string[];
}): { cards: GeneratedBingoCard[]; source: 'local' } {
  const cards = generateBingoCards(options);
  return { cards, source: 'local' };
}

/**
 * Generates fresh Guess the Word puzzles via AI or Local Engine.
 */
export async function generateGuessWordContent(
  req: GenerationRequestBase
): Promise<{ puzzles: WordCluePuzzle[]; source: 'ai' | 'local' }> {
  if (req.preferAi && hasAiApiKey()) {
    try {
      const aiResults = await generateAiGuessWord({
        category: req.category,
        difficulty: req.difficulty,
        count: req.count,
        language: req.language,
        topicPrompt: req.topicPrompt,
      });

      if (aiResults && aiResults.length > 0) {
        return { puzzles: aiResults, source: 'ai' };
      }
    } catch (err) {
      console.warn('AI GuessWord generation failed, falling back to local engine:', err);
    }
  }

  const localPuzzles = await generateProceduralGuessWord({
    category: req.category,
    difficulty: req.difficulty,
    count: req.count,
    language: req.language,
    avoidRecent: req.avoidRecent !== false,
  });

  return { puzzles: localPuzzles, source: 'local' };
}

/**
 * Regenerates a single Guess the Word puzzle.
 */
export async function regenerateSingleGuessWordItem(
  req: Omit<GenerationRequestBase, 'count'>
): Promise<WordCluePuzzle | null> {
  const res = await generateGuessWordContent({ ...req, count: 1 });
  return res.puzzles[0] || null;
}

export { clearContentHistory };
