import { useState, useCallback, useMemo } from "react";

export enum GamePlayMode {
  Dictation = "DICTATION",
  ChineseToEnglish = "CHINESE_TO_ENGLISH",
}

export const gamePlayModeLabels: { [key in GamePlayMode]: string } = {
  [GamePlayMode.ChineseToEnglish]: "中译英",
  [GamePlayMode.Dictation]: "听写",
};

const GamePlayModeKey = "gamePlayMode";

export function useGamePlayMode() {
  const [currentGamePlayMode, setCurrentGamePlayMode] = useState<GamePlayMode>(() => {
    if (typeof window === "undefined") return GamePlayMode.ChineseToEnglish;
    const stored = localStorage.getItem(GamePlayModeKey) as GamePlayMode | null;
    return stored || GamePlayMode.ChineseToEnglish;
  });

  const getGamePlayModeOptions = useMemo(() => {
    return Object.entries(gamePlayModeLabels).map(([key, value]) => ({
      label: value,
      value: key,
    }));
  }, []);

  const toggleGamePlayMode = useCallback((mode: GamePlayMode) => {
    setCurrentGamePlayMode(mode);
    localStorage.setItem(GamePlayModeKey, mode);
  }, []);

  const isDictationMode = useCallback(() => {
    return currentGamePlayMode === GamePlayMode.Dictation;
  }, [currentGamePlayMode]);

  const isChineseToEnglishMode = useCallback(() => {
    return currentGamePlayMode === GamePlayMode.ChineseToEnglish;
  }, [currentGamePlayMode]);

  return {
    currentGamePlayMode,
    toggleGamePlayMode,
    getGamePlayModeOptions,
    isDictationMode,
    isChineseToEnglishMode,
  };
}
