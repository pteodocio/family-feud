import { db, type HubContentHistoryEntry } from '../db/database';

/**
 * Normalizes and hashes item text to detect duplicates and near-matches.
 */
export function computeItemHash(text: string): string {
  const normalized = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Records an item that was actually played in a game session.
 */
export async function recordContentUsage(entry: {
  gameId: string;
  itemTitle: string;
  category: string;
  difficulty?: string;
}): Promise<void> {
  try {
    const hash = computeItemHash(entry.itemTitle);
    const id = `${entry.gameId}_${hash}`;
    const record: HubContentHistoryEntry = {
      id,
      gameId: entry.gameId,
      itemHash: hash,
      itemTitle: entry.itemTitle,
      category: entry.category,
      difficulty: entry.difficulty,
      usedAt: new Date().toISOString(),
    };
    await db.contentHistory.put(record);
  } catch (err) {
    console.warn('Failed to record content usage in history:', err);
  }
}

/**
 * Checks if a specific item was recently played for the given game.
 */
export async function isContentRecentlyUsed(gameId: string, itemTitle: string): Promise<boolean> {
  try {
    const hash = computeItemHash(itemTitle);
    const id = `${gameId}_${hash}`;
    const found = await db.contentHistory.get(id);
    return !!found;
  } catch {
    return false;
  }
}

/**
 * Returns a Set of recently used item hashes for a given game.
 */
export async function getRecentContentHashes(gameId: string, limit: number = 300): Promise<Set<string>> {
  try {
    const records = await db.contentHistory
      .where('gameId')
      .equals(gameId)
      .reverse()
      .sortBy('usedAt');
    const hashes = new Set<string>();
    for (const rec of records.slice(0, limit)) {
      hashes.add(rec.itemHash);
    }
    return hashes;
  } catch {
    return new Set<string>();
  }
}

/**
 * Clears recorded content history.
 * If gameId is supplied, only clears for that specific game.
 * If omitted, clears all games (excluding Family Feud, which never writes here).
 */
export async function clearContentHistory(gameId?: string): Promise<number> {
  try {
    if (gameId) {
      const records = await db.contentHistory.where('gameId').equals(gameId).toArray();
      await db.contentHistory.bulkDelete(records.map((r) => r.id));
      return records.length;
    } else {
      const count = await db.contentHistory.count();
      await db.contentHistory.clear();
      return count;
    }
  } catch {
    return 0;
  }
}

/**
 * Returns the count of history items recorded for a game.
 */
export async function getContentHistoryCount(gameId?: string): Promise<number> {
  try {
    if (gameId) {
      return await db.contentHistory.where('gameId').equals(gameId).count();
    }
    return await db.contentHistory.count();
  } catch {
    return 0;
  }
}
