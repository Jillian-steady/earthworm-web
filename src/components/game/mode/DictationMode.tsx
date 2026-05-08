"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useAnswerTip } from "@/hooks/useAnswerTip";
import { useGameMode } from "@/hooks/useGameMode";
import { useDevice } from "@/utils/detectDevice";
import {
  registerShortcut,
  cancelShortcut,
} from "@/utils/keyboardShortcuts";

import Answer from "../Answer";
import AnswerTip from "../AnswerTip";
import DictationQuestion from "./DictationQuestion";

export default function DictationMode() {
  const [isStart, setIsStart] = useState(false);
  const { isMobile } = useDevice();
  const { isAnswer, isQuestion } = useGameMode();
  const { isAnswerTip } = useAnswerTip();

  const startGame = useCallback(() => {
    setIsStart(true);
  }, []);

  // Register any key to start game
  useEffect(() => {
    const handleKeyup = (e: KeyboardEvent) => {
      e.preventDefault();
      startGame();
      cancelShortcut("*", handleKeyup);
    };

    registerShortcut("*", handleKeyup);

    return () => {
      cancelShortcut("*", handleKeyup);
    };
  }, [startGame]);

  return (
    <div className="flex h-full items-center justify-center">
      {!isStart ? (
        <div>
          {isMobile ? (
            <button className="btn" onClick={startGame}>
              准备好了吗？ 点我开始
            </button>
          ) : (
            <p>准备好了吗？(按任意键开启游戏)</p>
          )}
        </div>
      ) : (
        <div>
          {isQuestion() && (
            <>
              <DictationQuestion />
              {isAnswerTip() && <AnswerTip />}
            </>
          )}
          {isAnswer() && <Answer />}
        </div>
      )}
    </div>
  );
}
