export interface PackVisualTheme {
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  accentBorder: string;
  glowClass?: string;
}

const DEFAULT_THEME: PackVisualTheme = {
  badgeBg: 'bg-blue-950',
  badgeBorder: 'border-blue-800',
  badgeText: 'text-blue-300',
  accentBorder: 'border-blue-900/50',
};

const THEMES: Record<string, PackVisualTheme> = {
  'Zombie Apocalypse': {
    badgeBg: 'bg-zinc-950/90',
    badgeBorder: 'border-red-900/80',
    badgeText: 'text-red-400',
    accentBorder: 'hover:border-red-700/60',
  },
  'If I Were a Millionaire': {
    badgeBg: 'bg-amber-950/80',
    badgeBorder: 'border-amber-500/70',
    badgeText: 'text-amber-300',
    accentBorder: 'hover:border-amber-500/60',
  },
  'Cartoon Kingdom': {
    badgeBg: 'bg-fuchsia-950/80',
    badgeBorder: 'border-fuchsia-500/70',
    badgeText: 'text-fuchsia-300',
    accentBorder: 'hover:border-fuchsia-500/60',
  },
  'Animal Kingdom': {
    badgeBg: 'bg-emerald-950/80',
    badgeBorder: 'border-emerald-500/70',
    badgeText: 'text-emerald-300',
    accentBorder: 'hover:border-emerald-500/60',
  },
  'Street Food Battle': {
    badgeBg: 'bg-orange-950/80',
    badgeBorder: 'border-orange-500/70',
    badgeText: 'text-orange-300',
    accentBorder: 'hover:border-orange-500/60',
  },
  'Around the Philippines': {
    badgeBg: 'bg-sky-950/80',
    badgeBorder: 'border-sky-500/70',
    badgeText: 'text-sky-300',
    accentBorder: 'hover:border-sky-500/60',
  },
  'Superpower Showdown': {
    badgeBg: 'bg-rose-950/80',
    badgeBorder: 'border-rose-500/70',
    badgeText: 'text-rose-300',
    accentBorder: 'hover:border-rose-500/60',
  },
  'Movie Mania': {
    badgeBg: 'bg-purple-950/80',
    badgeBorder: 'border-purple-500/70',
    badgeText: 'text-purple-300',
    accentBorder: 'hover:border-purple-500/60',
  },
  'Ocean Adventures': {
    badgeBg: 'bg-cyan-950/80',
    badgeBorder: 'border-cyan-500/70',
    badgeText: 'text-cyan-300',
    accentBorder: 'hover:border-cyan-500/60',
  },
  'Video Game Legends': {
    badgeBg: 'bg-indigo-950/80',
    badgeBorder: 'border-indigo-500/70',
    badgeText: 'text-indigo-300',
    accentBorder: 'hover:border-indigo-500/60',
  },
  'Things That Scare Us': {
    badgeBg: 'bg-violet-950/90',
    badgeBorder: 'border-violet-700/80',
    badgeText: 'text-violet-300',
    accentBorder: 'hover:border-violet-600/60',
  },
  'Stranded on an Island': {
    badgeBg: 'bg-teal-950/80',
    badgeBorder: 'border-teal-500/70',
    badgeText: 'text-teal-300',
    accentBorder: 'hover:border-teal-500/60',
  },
};

/**
 * Returns distinct visual styling tokens matching the pack title or category.
 */
export function getPackTheme(title?: string): PackVisualTheme {
  if (!title) return DEFAULT_THEME;
  return THEMES[title] || DEFAULT_THEME;
}
