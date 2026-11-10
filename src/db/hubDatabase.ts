import { db } from './database';
import type { HubPlayer, HubTeam, HubGameHistoryEntry } from '../types/hub';

/**
 * Saves or updates a player in the shared player roster.
 */
export async function saveHubPlayer(player: HubPlayer): Promise<void> {
  await db.players.put(player);
}

/**
 * Lists all players ordered by creation date.
 */
export async function listHubPlayers(): Promise<HubPlayer[]> {
  return await db.players.toArray();
}

/**
 * Deletes a player from the shared roster.
 */
export async function deleteHubPlayer(id: string): Promise<void> {
  await db.players.delete(id);
}

/**
 * Saves or updates a team.
 */
export async function saveHubTeam(team: HubTeam): Promise<void> {
  await db.teams.put(team);
}

/**
 * Lists all configured teams.
 */
export async function listHubTeams(): Promise<HubTeam[]> {
  return await db.teams.toArray();
}

/**
 * Deletes a team.
 */
export async function deleteHubTeam(id: string): Promise<void> {
  await db.teams.delete(id);
}

/**
 * Records a completed game match into the game history ledger.
 */
export async function recordGameHistory(entry: HubGameHistoryEntry): Promise<void> {
  await db.gameHistory.put(entry);
}

/**
 * Lists all recorded game history entries, most recent first.
 */
export async function listGameHistory(): Promise<HubGameHistoryEntry[]> {
  const all = await db.gameHistory.toArray();
  return all.sort((a, b) => new Date(b.datePlayed).getTime() - new Date(a.datePlayed).getTime());
}

/**
 * Clears the entire game history ledger.
 */
export async function clearGameHistory(): Promise<void> {
  await db.gameHistory.clear();
}
