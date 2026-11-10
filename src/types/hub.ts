import { z } from 'zod';

export const HubPlayerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Player name cannot be empty'),
  teamId: z.string().nullable().optional(),
  avatarColor: z.string().default('#38bdf8'),
  createdAt: z.string(),
});

export type HubPlayer = z.infer<typeof HubPlayerSchema>;

export const HubTeamSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Team name cannot be empty'),
  color: z.enum(['blue', 'red', 'gold', 'emerald', 'purple', 'amber']).default('blue'),
  score: z.number().int().default(0),
  playerIds: z.array(z.string()).default([]),
});

export type HubTeam = z.infer<typeof HubTeamSchema>;

export const HubGameHistoryParticipantSchema = z.object({
  id: z.string(),
  name: z.string(),
  score: z.number().int(),
  isWinner: z.boolean(),
});

export const HubGameHistoryEntrySchema = z.object({
  id: z.string().min(1),
  gameId: z.string().min(1),
  gameTitle: z.string().min(1),
  datePlayed: z.string(),
  durationSeconds: z.number().int().min(0).default(0),
  gameMode: z.enum(['individual', 'team']).default('team'),
  participants: z.array(HubGameHistoryParticipantSchema),
  winnerName: z.string(),
  winnerScore: z.number().int(),
});

export type HubGameHistoryEntry = z.infer<typeof HubGameHistoryEntrySchema>;

export type GameCatalogId =
  | 'family-feud'
  | 'family-trivia'
  | 'charades'
  | 'pictionary'
  | 'family-bingo'
  | 'guess-the-word';

export interface GameCatalogItem {
  id: GameCatalogId;
  name: string;
  tagline: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  estimatedMinutes: string;
  category: string;
  badgeColor: string;
  accentColor: string;
  isAvailable: boolean;
  rules: string[];
}
