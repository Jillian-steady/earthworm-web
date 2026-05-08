import { useCallback, useMemo } from "react";
import { create } from "zustand";

export enum GameMode {
  Question = "question",
  Answer = "answer",
}

interface GameModeState {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
}

const useGameModeStore = create<GameModeState>((set) => ({
  gameMode: GameMode.Question,
  setGameMode: (mode: GameMode) => set({ gameMode: mode }),
}));

export function useGameMode() {
  const { gameMode, setGameMode } = useGameModeStore();

  const showAnswer = useCallback(() => {
    setGameMode(GameMode.Answer);
  }, [setGameMode]);

  const showQuestion = useCallback(() => {
    setGameMode(GameMode.Question);
  }, [setGameMode]);

  const isAnswer = useCallback(() => {
    return useGameModeStore.getState().gameMode === GameMode.Answer;
  }, []);

  const isQuestion = useCallback(() => {
    return useGameModeStore.getState().gameMode === GameMode.Question;
  }, []);

  return {
    gameMode,
    isAnswer,
    isQuestion,
    showAnswer,
    showQuestion,
  };
}
