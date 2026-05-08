import { create } from "zustand";

import { isAuthenticated } from "@/services/auth";

export enum GameStatus {
  NOT_PLAYED = "not_played",
  STARTED = "started",
  PAUSED = "paused",
  LEVEL_COMPLETED = "level_completed",
}

interface GameState {
  gameStatus: GameStatus;
  startTracking: (() => void) | null;
  stopTracking: (() => void) | null;

  setTracker: (start: () => void, stop: () => void) => void;
  startGame: () => void;
  exitGame: () => void;
  pauseGame: () => boolean;
  resumeGame: () => void;
  completeLevel: () => void;
  isGameNotPlayed: () => boolean;
  isGameStarted: () => boolean;
  isGamePaused: () => boolean;
  isLevelCompleted: () => boolean;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameStatus: GameStatus.NOT_PLAYED,
  startTracking: null,
  stopTracking: null,

  setTracker: (start, stop) => {
    set({ startTracking: start, stopTracking: stop });
  },

  startGame: () => {
    set({ gameStatus: GameStatus.STARTED });
    if (isAuthenticated()) {
      get().startTracking?.();
    }
  },

  exitGame: () => {
    set({ gameStatus: GameStatus.NOT_PLAYED });
    if (isAuthenticated()) {
      get().stopTracking?.();
    }
  },

  pauseGame: () => {
    const { gameStatus } = get();
    if (gameStatus === GameStatus.STARTED) {
      set({ gameStatus: GameStatus.PAUSED });
      if (isAuthenticated()) {
        get().stopTracking?.();
      }
      return true;
    }
    return false;
  },

  resumeGame: () => {
    const { gameStatus } = get();
    if (gameStatus === GameStatus.PAUSED) {
      set({ gameStatus: GameStatus.STARTED });
      if (isAuthenticated()) {
        get().startTracking?.();
      }
    }
  },

  completeLevel: () => {
    const { gameStatus } = get();
    if (gameStatus === GameStatus.STARTED) {
      set({ gameStatus: GameStatus.LEVEL_COMPLETED });
      if (isAuthenticated()) {
        get().stopTracking?.();
      }
    }
  },

  isGameNotPlayed: () => get().gameStatus === GameStatus.NOT_PLAYED,
  isGameStarted: () => get().gameStatus === GameStatus.STARTED,
  isGamePaused: () => get().gameStatus === GameStatus.PAUSED,
  isLevelCompleted: () => get().gameStatus === GameStatus.LEVEL_COMPLETED,
}));
