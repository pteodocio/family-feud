import Dexie, { type Table } from 'dexie';
import type { GameSession, QuestionPack, GameConfig } from '../types/game';

export interface AppSettings {
  id: string; // 'global_settings'
  soundEnabled: boolean;
  masterVolume: number; // 0.0 - 1.0
  effectsVolume: number;
  bgmVolume: number;
  autoRevealOnAllDone: boolean;
  strikeSoundKey: string;
  keyboardShortcutsEnabled: boolean;
  highContrastMode: boolean;
  tvAspectRatio: '16:9' | '4:3' | 'auto';
  defaultConfig: GameConfig;
}

export const DEFAULT_SETTINGS: AppSettings = {
  id: 'global_settings',
  soundEnabled: true,
  masterVolume: 0.8,
  effectsVolume: 0.9,
  bgmVolume: 0.5,
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

  constructor() {
    super('FamilyFeudGameShowDB');

    // Schema versioning with migration logic
    this.version(1).stores({
      questionPacks: 'id, title, category, isBuiltIn, updatedAt',
      gameSessions: 'id, updatedAt, phase',
      settings: 'id',
    });
  }
}

export const db = new FeudDatabase();

/**
 * Initializes database and ensures default settings exist.
 * Does not seed any default packs (all packs removed).
 * Automatically purges any previously stored packs once.
 */
export async function initializeDatabase(): Promise<void> {
  try {
    const purgeKey = 'feud_packs_purged_v3';
    const isPurged = typeof window !== 'undefined' ? window.localStorage?.getItem(purgeKey) : null;
    if (!isPurged) {
      await db.questionPacks.clear();
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(purgeKey, 'true');
      }
    }

    const currentSettings = await db.settings.get('global_settings');
    if (!currentSettings) {
      await db.settings.put(DEFAULT_SETTINGS);
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
    return packs.sort((a, b) => a.title.localeCompare(b.title));
  } catch (err) {
    console.error('Failed to list question packs:', err);
    return [];
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
  return await db.questionPacks.get(id);
}

/**
 * Deletes a question pack.
 */
export async function deleteQuestionPack(id: string): Promise<boolean> {
  const pack = await db.questionPacks.get(id);
  if (!pack) return false;
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
    if (!data || !Array.isArray(data.packs)) {
      return { success: false, count: 0, error: 'Invalid backup file format: missing packs array' };
    }

    let count = 0;
    for (const pack of data.packs) {
      if (pack.id && pack.title && Array.isArray(pack.questions)) {
        await db.questionPacks.put(pack);
        count++;
      }
    }

    if (data.settings) {
      await db.settings.put({ ...DEFAULT_SETTINGS, ...data.settings, id: 'global_settings' });
    }

    return { success: true, count };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown parsing error';
    return { success: false, count: 0, error: message };
  }
}
