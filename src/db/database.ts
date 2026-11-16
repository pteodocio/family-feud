import Dexie, { type Table } from 'dexie';
import {
  QuestionPackSchema,
  GameConfigSchema,
  type GameSession,
  type QuestionPack,
  type GameConfig,
} from '../types/game';
import type { HubPlayer, HubTeam, HubGameHistoryEntry } from '../types/hub';
import { FILIPINO_BUILTIN_PACKS } from '../data/filipinoPacks';

const BUILTIN_PACK_IDS = new Set(FILIPINO_BUILTIN_PACKS.map((p) => p.id));

function clampUnit(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(1, Math.max(0, value))
    : fallback;
}

function sanitizeImportedSettings(raw: unknown): AppSettings {
  if (!raw || typeof raw !== 'object') return DEFAULT_SETTINGS;
  const obj = raw as Record<string, unknown>;
  const audioDestinations: AppSettings['audioDestination'][] = ['auto', 'tv_only', 'host_only', 'both'];
  const aspectRatios: AppSettings['tvAspectRatio'][] = ['16:9', '4:3', 'auto'];
  const parsedConfig = GameConfigSchema.safeParse(obj.defaultConfig);

  return {
    id: 'global_settings',
    soundEnabled: typeof obj.soundEnabled === 'boolean' ? obj.soundEnabled : DEFAULT_SETTINGS.soundEnabled,
    masterVolume: clampUnit(obj.masterVolume, DEFAULT_SETTINGS.masterVolume),
    effectsVolume: clampUnit(obj.effectsVolume, DEFAULT_SETTINGS.effectsVolume),
    bgmVolume: clampUnit(obj.bgmVolume, DEFAULT_SETTINGS.bgmVolume),
    bgmEnabled: typeof obj.bgmEnabled === 'boolean' ? obj.bgmEnabled : DEFAULT_SETTINGS.bgmEnabled,
    effectsEnabled: typeof obj.effectsEnabled === 'boolean' ? obj.effectsEnabled : DEFAULT_SETTINGS.effectsEnabled,
    audioDestination: audioDestinations.includes(obj.audioDestination as AppSettings['audioDestination'])
      ? (obj.audioDestination as AppSettings['audioDestination'])
      : DEFAULT_SETTINGS.audioDestination,
    autoRevealOnAllDone:
      typeof obj.autoRevealOnAllDone === 'boolean'
        ? obj.autoRevealOnAllDone
        : DEFAULT_SETTINGS.autoRevealOnAllDone,
    strikeSoundKey:
      typeof obj.strikeSoundKey === 'string' && obj.strikeSoundKey.trim()
        ? obj.strikeSoundKey
        : DEFAULT_SETTINGS.strikeSoundKey,
    keyboardShortcutsEnabled:
      typeof obj.keyboardShortcutsEnabled === 'boolean'
        ? obj.keyboardShortcutsEnabled
        : DEFAULT_SETTINGS.keyboardShortcutsEnabled,
    highContrastMode:
      typeof obj.highContrastMode === 'boolean' ? obj.highContrastMode : DEFAULT_SETTINGS.highContrastMode,
    tvAspectRatio: aspectRatios.includes(obj.tvAspectRatio as AppSettings['tvAspectRatio'])
      ? (obj.tvAspectRatio as AppSettings['tvAspectRatio'])
      : DEFAULT_SETTINGS.tvAspectRatio,
    defaultConfig: parsedConfig.success ? parsedConfig.data : DEFAULT_SETTINGS.defaultConfig,
  };
}

export interface AppSettings {
  id: string; // 'global_settings'
  soundEnabled: boolean;
  masterVolume: number; // 0.0 - 1.0
  effectsVolume: number;
  bgmVolume: number;
  bgmEnabled: boolean;
  effectsEnabled: boolean;
  audioDestination: 'auto' | 'tv_only' | 'host_only' | 'both';
  autoRevealOnAllDone: boolean;
  strikeSoundKey: string;
  keyboardShortcutsEnabled: boolean;
  highContrastMode: boolean;
  tvAspectRatio: '16:9' | '4:3' | 'auto';
  geminiApiKey?: string;
  defaultConfig: GameConfig;
}

export interface HubContentHistoryEntry {
  id: string; // `${gameId}_${itemHash}`
  gameId: string;
  itemHash: string;
  itemTitle: string;
  category: string;
  difficulty?: string;
  usedAt: string; // ISO date string
}

export const DEFAULT_SETTINGS: AppSettings = {
  id: 'global_settings',
  soundEnabled: true,
  masterVolume: 0.8,
  effectsVolume: 0.9,
  bgmVolume: 0.5,
  bgmEnabled: true,
  effectsEnabled: true,
  audioDestination: 'auto',
  autoRevealOnAllDone: true,
  strikeSoundKey: 'buzzer',
  keyboardShortcutsEnabled: true,
  highContrastMode: false,
  tvAspectRatio: '16:9',
  defaultConfig: {
    roundsCount: 4,
    multipliers: [1, 1, 2, 3],
    targetScore: 300,
    fastMoneyTimer1: 20,
    fastMoneyTimer2: 25,
    fastMoneyTarget: 200,
    faceOffTieRule: 'hostDecision',
  },
};

export class FeudDatabase extends Dexie {
  questionPacks!: Table<QuestionPack, string>;
  gameSessions!: Table<GameSession, string>;
  settings!: Table<AppSettings, string>;
  players!: Table<HubPlayer, string>;
  teams!: Table<HubTeam, string>;
  gameHistory!: Table<HubGameHistoryEntry, string>;
  contentHistory!: Table<HubContentHistoryEntry, string>;

  constructor() {
    super('FamilyFeudGameShowDB');

    // Schema versioning with migration logic
    this.version(1).stores({
      questionPacks: 'id, title, category, isBuiltIn, updatedAt',
      gameSessions: 'id, updatedAt, phase',
      settings: 'id',
    });

    this.version(2).stores({
      players: 'id, name, teamId, createdAt',
      teams: 'id, name, color, score',
      gameHistory: 'id, gameId, gameTitle, datePlayed, winnerName',
    });

    this.version(3).stores({
      contentHistory: 'id, gameId, itemHash, usedAt, category',
    });
  }
}

export const db = new FeudDatabase();

/**
 * Initializes database and ensures default settings and built-in Filipino packs exist.
 */
export async function initializeDatabase(forceResetBuiltIns: boolean = false): Promise<void> {
  try {
    const currentSettings = await db.settings.get('global_settings');
    if (forceResetBuiltIns || !currentSettings) {
      await db.settings.put(DEFAULT_SETTINGS);
    }

    // Seed built-in Filipino question packs if not yet present (or explicitly reset)
    for (const pack of FILIPINO_BUILTIN_PACKS) {
      const existing = forceResetBuiltIns ? undefined : await db.questionPacks.get(pack.id);
      if (!existing) {
        await db.questionPacks.put(pack);
      }
    }

    // Seed default starter teams for Hub games if none configured yet
    const teamCount = await db.teams.count();
    if (teamCount === 0) {
      await db.teams.bulkPut([
        { id: 'team_santos', name: 'Santos Family', color: 'blue', score: 0, playerIds: [] },
        { id: 'team_reyes', name: 'Reyes Family', color: 'red', score: 0, playerIds: [] },
      ]);
    }
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

/**
 * Saves or updates a game session (for autosave and state persistence).
 */
export async function saveGameSession(session: GameSession): Promise<void> {
  try {
    session.updatedAt = new Date().toISOString();
    await db.gameSessions.put(session);
  } catch (err) {
    console.error('Failed to autosave game session:', err);
  }
}

/**
 * Loads a game session by ID.
 */
export async function loadGameSession(id: string): Promise<GameSession | undefined> {
  try {
    return await db.gameSessions.get(id);
  } catch (err) {
    console.error(`Failed to load game session ${id}:`, err);
    return undefined;
  }
}

/**
 * Lists all saved game sessions ordered by most recently updated.
 */
export async function listGameSessions(): Promise<GameSession[]> {
  try {
    return await db.gameSessions.orderBy('updatedAt').reverse().toArray();
  } catch (err) {
    console.error('Failed to list game sessions:', err);
    return [];
  }
}

/**
 * Deletes a game session.
 */
export async function deleteGameSession(id: string): Promise<void> {
  try {
    await db.gameSessions.delete(id);
  } catch (err) {
    console.error(`Failed to delete game session ${id}:`, err);
  }
}

/**
 * Loads all question packs.
 */
export async function listQuestionPacks(): Promise<QuestionPack[]> {
  try {
    const packs = await db.questionPacks.toArray();
    if (packs.length === 0) {
      return [...FILIPINO_BUILTIN_PACKS].sort((a, b) => a.title.localeCompare(b.title));
    }
    const packIds = new Set(packs.map((p) => p.id));
    for (const builtin of FILIPINO_BUILTIN_PACKS) {
      if (!packIds.has(builtin.id)) {
        packs.push(builtin);
        await db.questionPacks.put(builtin).catch(() => {});
      }
    }
    return packs.sort((a, b) => a.title.localeCompare(b.title));
  } catch (err) {
    console.error('Failed to list question packs:', err);
    return [...FILIPINO_BUILTIN_PACKS].sort((a, b) => a.title.localeCompare(b.title));
  }
}

/**
 * Saves a question pack.
 */
export async function saveQuestionPack(pack: QuestionPack): Promise<void> {
  pack.updatedAt = new Date().toISOString();
  await db.questionPacks.put(pack);
}

/**
 * Loads a specific question pack.
 */
export async function loadQuestionPack(id: string): Promise<QuestionPack | undefined> {
  const pack = await db.questionPacks.get(id);
  if (pack) return pack;
  return FILIPINO_BUILTIN_PACKS.find((p) => p.id === id);
}

/**
 * Deletes a question pack.
 */
export async function deleteQuestionPack(id: string): Promise<boolean> {
  const pack = await db.questionPacks.get(id);
  if (!pack || pack.isBuiltIn || BUILTIN_PACK_IDS.has(pack.id)) return false;
  await db.questionPacks.delete(id);
  return true;
}

/**
 * Loads app settings.
 */
export async function loadSettings(): Promise<AppSettings> {
  try {
    const s = await db.settings.get('global_settings');
    return s || DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Saves app settings.
 */
export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await db.settings.put(settings);
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

/**
 * Full export of user question packs and settings to a JSON string.
 */
export async function exportUserData(): Promise<string> {
  const packs = await db.questionPacks.toArray();
  const settings = await loadSettings();
  const exportPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    packs,
    settings,
  };
  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Safe restore of user data from JSON string.
 */
export async function importUserData(jsonString: string): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== 'object' || !Array.isArray(data.packs)) {
      return { success: false, count: 0, error: 'Invalid backup file format: missing packs array' };
    }

    const validPacks: QuestionPack[] = [];
    for (const rawPack of data.packs) {
      const parsed = QuestionPackSchema.safeParse(rawPack);
      if (parsed.success) {
        validPacks.push({
          ...parsed.data,
          // Never allow imported custom packs to mark themselves immutable/built-in
          isBuiltIn: BUILTIN_PACK_IDS.has(parsed.data.id),
        });
      }
    }

    if (data.packs.length > 0 && validPacks.length === 0) {
      return { success: false, count: 0, error: 'Backup contains no valid question packs' };
    }

    for (const pack of validPacks) {
      await db.questionPacks.put(pack);
    }

    if (data.settings) {
      await db.settings.put(sanitizeImportedSettings(data.settings));
    }

    return { success: true, count: validPacks.length };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown parsing error';
    return { success: false, count: 0, error: message };
  }
}
