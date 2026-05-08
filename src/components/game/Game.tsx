"use client";

import { useEffect } from "react";

import { useGamePlayMode } from "@/hooks/useGamePlayMode";
import { isAuthenticated } from "@/services/auth";
import { useGameStore } from "@/stores/game";
import { courseTimer } from "@/hooks/useCourseTimer";

import DictationMode from "./mode/DictationMode";
import ChineseToEnglishMode from "./mode/ChineseToEnglishMode";
import LearningTimer from "./LearningTimer";
import Tips from "./Tips";
import Summary from "./Summary";
import Share from "./Share";
import GamePauseModal from "./GamePauseModal";
import GameSettingModal from "./GameSettingModal";

export default function Game() {
  const { isDictationMode, isChineseToEnglishMode } = useGamePlayMode();
  const startGame = useGameStore((s) => s.startGame);
  const exitGame = useGameStore((s) => s.exitGame);

  useEffect(() => {
    courseTimer.reset();
    startGame();

    return () => {
      exitGame();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isDictationMode() && <DictationMode />}
      {isChineseToEnglishMode() && <ChineseToEnglishMode />}

      {isAuthenticated() && <LearningTimer />}
      <Tips />
      <Summary />
      <Share />
      {isAuthenticated() && <GamePauseModal />}
      <GameSettingModal />
    </>
  );
}
