import { z } from 'zod';

// Answer Schema
export const AnswerSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1, 'Answer text cannot be empty'),
  points: z.number().int().min(0).max(100),
  acceptedVariants: z.array(z.string()).default([]),
  displayOrder: z.number().int().default(1),
});

export type Answer = z.infer<typeof AnswerSchema>;

// Question Schema
export const QuestionSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().min(3, 'Question prompt must be at least 3 characters'),
  category: z.string().min(1).default('General'),
  answers: z.array(AnswerSchema).min(2, 'Must have at least 2 answers').max(10),
  tags: z.array(z.string()).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  questionType: z.string().optional(),
  scriptureReference: z.string().optional(),
  scriptureExplanation: z.string().optional(),
  hostNotes: z.string().optional(),
});

export type Question = z.infer<typeof QuestionSchema>;

// Question Pack Schema
export const QuestionPackSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(2, 'Pack title must be at least 2 characters'),
  description: z.string().default(''),
  category: z.string().default('General'),
  isBuiltIn: z.boolean().default(false),
  questions: z.array(QuestionSchema).min(1, 'Pack must have at least 1 question'),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type QuestionPack = z.infer<typeof QuestionPackSchema>;

// Team Model
export const TeamSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Team name cannot be empty'),
  score: z.number().int().default(0),
  color: z.enum(['blue', 'red', 'gold', 'emerald']).default('blue'),
});

export type Team = z.infer<typeof TeamSchema>;

// Game Phase Enum
export const GamePhase = {
  SETUP: 'setup',
  FACEOFF: 'faceoff',
  REGULAR: 'regular',
  STEAL: 'steal',
  ROUND_SUMMARY: 'round_summary',
  FAST_MONEY: 'fast_money',
  FINAL_RESULTS: 'final_results',
} as const;

export type GamePhaseType = typeof GamePhase[keyof typeof GamePhase];

// Game Configuration
export const GameConfigSchema = z.object({
  roundsCount: z.number().int().min(1).max(7).default(4),
  multipliers: z.array(z.number().int().min(1).max(5)).default([1, 1, 2, 3]),
  targetScore: z.number().int().min(100).max(1000).default(300),
  fastMoneyTimer1: z.number().int().min(10).max(60).default(20),
  fastMoneyTimer2: z.number().int().min(10).max(60).default(25),
  fastMoneyTarget: z.number().int().min(50).max(500).default(200),
  faceOffTieRule: z.enum(['hostDecision', 'coinToss']).default('hostDecision'),
});

export type GameConfig = z.infer<typeof GameConfigSchema>;

// Round State
export interface RoundState {
  roundIndex: number;
  multiplier: number;
  question: Question;
  revealedAnswerIds: string[];
  roundBank: number;
  strikes: number;
  activeTeamId: string | null;
  controlTeamId: string | null;
  faceOffWinnerTeamId: string | null;
  stealTeamId: string | null;
  stealResult: 'success' | 'failure' | null;
  isBankAwarded: boolean;
  awardedToTeamId: string | null;
  awardedPoints: number;
}

// Fast Money Set Definition
export interface FastMoneySet {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

// Fast Money Answer Submission
export interface FastMoneyAnswerRecord {
  questionId: string;
  prompt: string;
  submittedText: string;
  points: number;
  matchedAnswerId: string | null;
  isAccepted: boolean;
  isRevealed: boolean;
  isPassed?: boolean;
  rawInput?: string;
}

// Fast Money Player State
export interface FastMoneyPlayerState {
  name: string;
  answers: FastMoneyAnswerRecord[];
  revealedAnswerIndices: number[];
  revealedPointsIndices: number[];
  timerRemaining: number;
  timerRunning: boolean;
  isFinished: boolean;
  totalScore: number;
}

// Fast Money Step / Flow State
export type FastMoneyStep =
  | 'setup'
  | 'player1_playing'
  | 'player1_review'
  | 'player2_playing'
  | 'player2_review'
  | 'reveal'
  | 'completed';

// Fast Money Round State
export interface FastMoneyState {
  questions: Question[];
  player1: FastMoneyPlayerState;
  player2: FastMoneyPlayerState;
  activePlayer: 1 | 2;
  winningTeamId: string | null;
  targetScore: number;
  totalScore: number;
  isCompleted: boolean;
  won: boolean | null;
  setId?: string;
  setTitle?: string;
  step?: FastMoneyStep;
  currentQuestionIndex?: number;
  passedIndices?: number[];
  duplicateWarning?: string | null;
}

// Score Adjustment Record
export interface ScoreAdjustment {
  timestamp: number;
  teamId: string;
  delta: number;
  reason: string;
}

// Full Game Session State
export interface GameSession {
  id: string;
  title: string;
  config: GameConfig;
  team1: Team;
  team2: Team;
  phase: GamePhaseType;
  packId: string;
  rounds: RoundState[];
  currentRoundIndex: number;
  fastMoney: FastMoneyState | null;
  winnerTeamId: string | null;
  scoreAdjustments: ScoreAdjustment[];
  actionLog: string[];
  createdAt: string;
  updatedAt: string;
}

// Broadcast Message Types for Multi-window Sync
export type SyncMessage =
  | { type: 'STATE_UPDATE'; state: GameSession }
  | { type: 'TRIGGER_SOUND'; sound: SoundEffectName; id?: string; timestamp?: number }
  | { type: 'TRIGGER_BGM'; track: BgmTrackName; action: 'play' | 'stop' | 'pause' }
  | { type: 'REQUEST_SYNC' }
  | { type: 'HEARTBEAT_PING'; timestamp: number }
  | { type: 'HEARTBEAT_PONG'; timestamp: number }
  | { type: 'REQUEST_FULLSCREEN' }
  | { type: 'CLOSE_DISPLAY' }
  | { type: 'TIMER_UPDATE'; remaining: number; running: boolean };

export type SoundEffectName =
  | 'strike'
  | 'strike3'
  | 'correct'
  | 'reveal'
  | 'wrong'
  | 'round_win'
  | 'game_win'
  | 'intro';

export type BgmTrackName = 'none' | 'theme' | 'gameplay';
