import { create } from 'zustand';
import { GamePhase } from '../types/game';
import type { GameSession, SoundEffectName, BgmTrackName } from '../types/game';
import { DEFAULT_SETTINGS, saveGameSession, loadGameSession, loadSettings, saveSettings } from '../db/database';
import type { AppSettings } from '../db/database';
import {
  revealAnswer as engineRevealAnswer,
  hideAnswer as engineHideAnswer,
  revealAllRemainingAnswers as engineRevealAll,
  recordStrike as engineRecordStrike,
  clearStrike as engineClearStrike,
  resolveFaceOff as engineResolveFaceOff,
  resolveSteal as engineResolveSteal,
  awardRoundBank as engineAwardBank,
  advanceToNextRound as engineAdvanceRound,
  navigateToRound as engineNavigateToRound,
  previousRound as enginePreviousRound,
  restartCurrentRound as engineRestartRound,
  endGame as engineEndGame,
  adjustTeamScore as engineAdjustScore,
  submitFastMoneyAnswer as engineSubmitFastMoney,
  revealFastMoneyAnswer as engineRevealFastMoneyAnswer,
  revealFastMoneyPoints as engineRevealFastMoneyPoints,
  resolveFastMoney as engineResolveFastMoney,
} from '../engine/gameEngine';
import { soundManager } from '../audio/soundManager';
import { syncBus } from '../sync/broadcast';

interface StrikeOverlayState {
  show: boolean;
  count: number;
}

interface GameStoreState {
  session: GameSession | null;
  undoStack: GameSession[];
  settings: AppSettings;
  strikeOverlay: StrikeOverlayState;
  fastMoneyTimer: {
    running: boolean;
    remaining: number;
  };
  isLoading: boolean;

  // Actions
  setSession: (session: GameSession | null) => void;
  loadSession: (id: string) => Promise<boolean>;
  loadGlobalSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;

  // Game Engine Actions (Host)
  revealAnswer: (answerId: string) => void;
  hideAnswer: (answerId: string) => void;
  revealAllRemainingAnswers: () => void;
  recordStrike: () => void;
  clearStrike: () => void;
  resolveFaceOff: (winnerTeamId: string, decision: 'play' | 'pass') => void;
  resolveSteal: (isSuccessful: boolean) => void;
  awardRoundBank: (teamId: string) => void;
  advanceRound: () => void;
  navigateToRound: (targetIndex: number) => void;
  previousRound: () => void;
  restartRound: () => void;
  endGame: () => void;
  adjustScore: (teamId: string, delta: number, reason: string) => void;
  undo: () => void;

  // Fast Money Actions
  submitFastMoneyAnswer: (
    playerNum: 1 | 2,
    questionIndex: number,
    text: string,
    points: number,
    matchedId?: string | null,
    isAccepted?: boolean
  ) => void;
  revealFastMoneyAnswer: (playerNum: 1 | 2, questionIndex: number) => void;
  revealFastMoneyPoints: (playerNum: 1 | 2, questionIndex: number) => void;
  resolveFastMoney: () => void;
  startFastMoneyTimer: (seconds: number) => void;
  pauseFastMoneyTimer: () => void;
  resetFastMoneyTimer: (seconds: number) => void;
  tickFastMoneyTimer: () => void;

  // Audio & Multi-screen State
  tvConnected: boolean;
  setTvConnected: (connected: boolean) => void;
  playSound: (sound: SoundEffectName) => void;
  playBgm: (track: BgmTrackName) => void;
  stopBgm: () => void;
}

const MAX_UNDO_STACK = 25;

export const useGameStore = create<GameStoreState>((set, get) => ({
  session: null,
  undoStack: [],
  settings: DEFAULT_SETTINGS,
  strikeOverlay: { show: false, count: 0 },
  fastMoneyTimer: { running: false, remaining: 20 },
  isLoading: false,
  tvConnected: false,

  setTvConnected: (connected: boolean) => set({ tvConnected: connected }),

  setSession: (session) => {
    set({ session });
    if (session) {
      saveGameSession(session);
      syncBus.broadcastState(session);
    }
  },

  loadSession: async (id: string) => {
    set({ isLoading: true });
    try {
      const s = await loadGameSession(id);
      if (s) {
        set({ session: s, isLoading: false, undoStack: [] });
        return true;
      }
    } catch (e) {
      console.error('Failed to load session:', e);
    }
    set({ isLoading: false });
    return false;
  },

  loadGlobalSettings: async () => {
    const s = await loadSettings();
    soundManager.setMasterVolume(s.masterVolume);
    soundManager.setEffectsVolume(s.effectsVolume);
    soundManager.setBgmVolume(s.bgmVolume);
    soundManager.setMuted(!s.soundEnabled);
    soundManager.setEffectsEnabled(s.effectsEnabled ?? true);
    soundManager.setBgmEnabled(s.bgmEnabled ?? true);
    set({ settings: s });
  },

  updateSettings: async (newSettings) => {
    const current = get().settings;
    const merged = { ...current, ...newSettings };
    soundManager.setMasterVolume(merged.masterVolume);
    soundManager.setEffectsVolume(merged.effectsVolume);
    soundManager.setBgmVolume(merged.bgmVolume);
    soundManager.setMuted(!merged.soundEnabled);
    soundManager.setEffectsEnabled(merged.effectsEnabled ?? true);
    soundManager.setBgmEnabled(merged.bgmEnabled ?? true);
    await saveSettings(merged);
    set({ settings: merged });
  },

  revealAnswer: (answerId: string) => {
    const { session, undoStack } = get();
    if (!session) return;

    const round = session.rounds[session.currentRoundIndex];
    if (round.revealedAnswerIds.includes(answerId)) return;

    const nextUndo = [...undoStack.slice(-MAX_UNDO_STACK), session];
    const newSession = engineRevealAnswer(session, answerId);

    set({ session: newSession, undoStack: nextUndo });
    saveGameSession(newSession);
    syncBus.broadcastState(newSession);

    get().playSound('reveal');
    // slight delay for correct chime
    setTimeout(() => get().playSound('correct'), 300);
  },

  hideAnswer: (answerId: string) => {
    const { session, undoStack } = get();
    if (!session) return;

    const round = session.rounds[session.currentRoundIndex];
    if (!round || !round.revealedAnswerIds.includes(answerId)) return;

    const nextUndo = [...undoStack.slice(-MAX_UNDO_STACK), session];
    const newSession = engineHideAnswer(session, answerId);

    set({ session: newSession, undoStack: nextUndo });
    saveGameSession(newSession);
    syncBus.broadcastState(newSession);
  },

  revealAllRemainingAnswers: () => {
    const { session, undoStack } = get();
    if (!session) return;

    const nextUndo = [...undoStack.slice(-MAX_UNDO_STACK), session];
    const newSession = engineRevealAll(session);

    set({ session: newSession, undoStack: nextUndo });
    saveGameSession(newSession);
    syncBus.broadcastState(newSession);
    get().playSound('reveal');
  },

  recordStrike: () => {
    const { session, undoStack } = get();
    if (!session) return;

    const round = session.rounds[session.currentRoundIndex];
    if (round.strikes >= 3 || session.phase === GamePhase.ROUND_SUMMARY) return;

    const nextUndo = [...undoStack.slice(-MAX_UNDO_STACK), session];
    const newSession = engineRecordStrike(session);
    const newRound = newSession.rounds[newSession.currentRoundIndex];

    set({
      session: newSession,
      undoStack: nextUndo,
      strikeOverlay: { show: true, count: newRound.strikes },
    });

    saveGameSession(newSession);
    syncBus.broadcastState(newSession);

    if (newRound.strikes >= 3) {
      get().playSound('strike3');
    } else {
      get().playSound('strike');
    }

    // Dismiss strike graphic after 1.4s
    setTimeout(() => {
      set((prev) => ({
        strikeOverlay: { ...prev.strikeOverlay, show: false },
      }));
    }, 1400);
  },

  clearStrike: () => {
    const { session, undoStack } = get();
    if (!session) return;

    const nextUndo = [...undoStack.slice(-MAX_UNDO_STACK), session];
    const newSession = engineClearStrike(session);

    set({ session: newSession, undoStack: nextUndo });
    saveGameSession(newSession);
    syncBus.broadcastState(newSession);
  },

  resolveFaceOff: (winnerTeamId: string, decision: 'play' | 'pass') => {
    const { session, undoStack } = get();
    if (!session) return;

    const nextUndo = [...undoStack.slice(-MAX_UNDO_STACK), session];
    const newSession = engineResolveFaceOff(session, winnerTeamId, decision);

    set({ session: newSession, undoStack: nextUndo });
    saveGameSession(newSession);
    syncBus.broadcastState(newSession);
    get().playSound('correct');
  },

  resolveSteal: (isSuccessful: boolean) => {
    const { session, undoStack } = get();
    if (!session) return;

    const nextUndo = [...undoStack.slice(-MAX_UNDO_STACK), session];
    const newSession = engineResolveSteal(session, isSuccessful);

    set({ session: newSession, undoStack: nextUndo });
    saveGameSession(newSession);
    syncBus.broadcastState(newSession);

    if (isSuccessful) {
      get().playSound('round_win');
    } else {
      get().playSound('wrong');
    }
  },

  awardRoundBank: (teamId: string) => {
    const { session, undoStack } = get();
    if (!session) return;

    const nextUndo = [...undoStack.slice(-MAX_UNDO_STACK), session];
    const newSession = engineAwardBank(session, teamId);

    set({ session: newSession, undoStack: nextUndo });
    saveGameSession(newSession);
    syncBus.broadcastState(newSession);
    get().stopBgm();
    get().playSound('round_win');
  },

  advanceRound: () => {
    const { session, undoStack } = get();
    if (!session) return;

    const nextUndo = [...undoStack.slice(-MAX_UNDO_STACK), session];
    const newSession = engineAdvanceRound(session);

    set({ session: newSession, undoStack: nextUndo });
    saveGameSession(newSession);
    syncBus.broadcastState(newSession);

    if (newSession.phase === GamePhase.FAST_MONEY) {
      get().playSound('intro');
      get().playBgm('theme');
    } else if (newSession.phase === GamePhase.FINAL_RESULTS) {
      get().stopBgm();
      get().playSound('game_win');
    } else {
      get().playSound('reveal');
      get().playBgm('theme');
    }
  },

  navigateToRound: (targetIndex: number) => {
    const { session, undoStack } = get();
    if (!session) return;

    const nextUndo = [...undoStack.slice(-MAX_UNDO_STACK), session];
    const newSession = engineNavigateToRound(session, targetIndex);

    set({ session: newSession, undoStack: nextUndo });
    saveGameSession(newSession);
    syncBus.broadcastState(newSession);
    get().playSound('reveal');
  },

  previousRound: () => {
    const { session, undoStack } = get();
    if (!session) return;

    const nextUndo = [...undoStack.slice(-MAX_UNDO_STACK), session];
    const newSession = enginePreviousRound(session);

    set({ session: newSession, undoStack: nextUndo });
    saveGameSession(newSession);
    syncBus.broadcastState(newSession);
    get().playSound('reveal');
  },

  restartRound: () => {
    const { session, undoStack } = get();
    if (!session) return;

    const nextUndo = [...undoStack.slice(-MAX_UNDO_STACK), session];
    const newSession = engineRestartRound(session);

    set({ session: newSession, undoStack: nextUndo });
    saveGameSession(newSession);
    syncBus.broadcastState(newSession);
  },

  endGame: () => {
    const { session, undoStack } = get();
    if (!session) return;

    const nextUndo = [...undoStack.slice(-MAX_UNDO_STACK), session];
    const newSession = engineEndGame(session);

    set({ session: newSession, undoStack: nextUndo });
    saveGameSession(newSession);
    syncBus.broadcastState(newSession);
    get().stopBgm();
    get().playSound('game_win');
  },

  adjustScore: (teamId: string, delta: number, reason: string) => {
    const { session, undoStack } = get();
    if (!session) return;

    const nextUndo = [...undoStack.slice(-MAX_UNDO_STACK), session];
    const newSession = engineAdjustScore(session, teamId, delta, reason);

    set({ session: newSession, undoStack: nextUndo });
    saveGameSession(newSession);
    syncBus.broadcastState(newSession);
    get().playSound('reveal');
  },

  undo: () => {
    const { undoStack, session } = get();
    if (undoStack.length === 0 || !session) return;

    const previousState = undoStack[undoStack.length - 1];
    const newStack = undoStack.slice(0, -1);

    set({ session: previousState, undoStack: newStack });
    saveGameSession(previousState);
    syncBus.broadcastState(previousState);
  },

  submitFastMoneyAnswer: (playerNum, questionIndex, text, points, matchedId = null, isAccepted = true) => {
    const { session, undoStack } = get();
    if (!session) return;

    const nextUndo = [...undoStack.slice(-MAX_UNDO_STACK), session];
    const newSession = engineSubmitFastMoney(
      session,
      playerNum,
      questionIndex,
      text,
      points,
      matchedId,
      isAccepted
    );

    set({ session: newSession, undoStack: nextUndo });
    saveGameSession(newSession);
    syncBus.broadcastState(newSession);
  },

  revealFastMoneyAnswer: (playerNum, questionIndex) => {
    const { session, undoStack } = get();
    if (!session) return;

    const nextUndo = [...undoStack.slice(-MAX_UNDO_STACK), session];
    const newSession = engineRevealFastMoneyAnswer(session, playerNum, questionIndex);

    set({ session: newSession, undoStack: nextUndo });
    saveGameSession(newSession);
    syncBus.broadcastState(newSession);
    get().playSound('reveal');
  },

  revealFastMoneyPoints: (playerNum, questionIndex) => {
    const { session, undoStack } = get();
    if (!session || !session.fastMoney) return;

    const playerKey = playerNum === 1 ? 'player1' : 'player2';
    const ans = session.fastMoney[playerKey].answers[questionIndex];

    const nextUndo = [...undoStack.slice(-MAX_UNDO_STACK), session];
    const newSession = engineRevealFastMoneyPoints(session, playerNum, questionIndex);

    set({ session: newSession, undoStack: nextUndo });
    saveGameSession(newSession);
    syncBus.broadcastState(newSession);

    if (ans && ans.points > 0) {
      get().playSound('correct');
    } else {
      get().playSound('wrong');
    }
  },

  resolveFastMoney: () => {
    const { session, undoStack } = get();
    if (!session) return;

    const nextUndo = [...undoStack.slice(-MAX_UNDO_STACK), session];
    const newSession = engineResolveFastMoney(session);

    set({ session: newSession, undoStack: nextUndo });
    saveGameSession(newSession);
    syncBus.broadcastState(newSession);

    if (newSession.fastMoney?.won) {
      get().playSound('game_win');
    } else {
      get().playSound('wrong');
    }
  },

  startFastMoneyTimer: (seconds: number) => {
    set({ fastMoneyTimer: { running: true, remaining: seconds } });
    syncBus.broadcastTimer(seconds, true);
  },

  pauseFastMoneyTimer: () => {
    const remaining = get().fastMoneyTimer.remaining;
    set((prev) => ({
      fastMoneyTimer: { ...prev.fastMoneyTimer, running: false },
    }));
    syncBus.broadcastTimer(remaining, false);
  },

  resetFastMoneyTimer: (seconds: number) => {
    set({ fastMoneyTimer: { running: false, remaining: seconds } });
    syncBus.broadcastTimer(seconds, false);
  },

  tickFastMoneyTimer: () => {
    const { fastMoneyTimer } = get();
    if (!fastMoneyTimer.running) return;

    if (fastMoneyTimer.remaining <= 1) {
      set({ fastMoneyTimer: { running: false, remaining: 0 } });
      syncBus.broadcastTimer(0, false);
      get().playSound('wrong');
    } else {
      const next = fastMoneyTimer.remaining - 1;
      set({ fastMoneyTimer: { running: true, remaining: next } });
      syncBus.broadcastTimer(next, true);
    }
  },

  playSound: (sound: SoundEffectName) => {
    const { settings, tvConnected } = get();
    const destination = settings.audioDestination || 'auto';

    // Broadcast to sync bus so TV Display receives the sound event
    syncBus.broadcastSound(sound);

    // Audio destination routing for host device:
    // If 'tv_only': host remains silent (played exclusively on TV)
    // If 'auto': if TV is connected, host remains silent to prevent duplicate audio echo; if TV is disconnected, host plays locally
    // If 'host_only' or 'both': host plays locally
    const shouldPlayOnHost =
      destination === 'host_only' ||
      destination === 'both' ||
      (destination === 'auto' && !tvConnected);

    if (shouldPlayOnHost) {
      soundManager.play(sound);
    }
  },

  playBgm: (track: BgmTrackName) => {
    const { settings, tvConnected } = get();
    const destination = settings.audioDestination || 'auto';

    syncBus.broadcastBgm(track, 'play');

    const shouldPlayOnHost =
      destination === 'host_only' ||
      destination === 'both' ||
      (destination === 'auto' && !tvConnected);

    if (shouldPlayOnHost) {
      soundManager.playBgm(track);
    }
  },

  stopBgm: () => {
    syncBus.broadcastBgm('none', 'stop');
    soundManager.stopBgm();
  },
}));
