/**
 * Reads host-customized content saved during GameSetupHubPage for a given gameId.
 */
export function loadCustomHubContent<T>(gameId: string): T[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(`hub_custom_content_${gameId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as T[]) : null;
  } catch {
    return null;
  }
}
