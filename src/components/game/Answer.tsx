"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

import { usePronunciation } from "@/hooks/usePronunciation";
import { useAutoPronunciation } from "@/hooks/useSound";
import { useGameMode } from "@/hooks/useGameMode";
import { useCourseStore } from "@/stores/course";
import { registerShortcut, cancelShortcut } from "@/utils/keyboardShortcuts";
import { useAnswerHook } from "@/components/game/hooks/useAnswer";

import MasteredBtn from "./MasteredBtn";

export default function Answer() {
  const currentStatement = useCourseStore((s) => s.getCurrentStatement());
  const { showQuestion } = useGameMode();
  const { goToNextQuestion } = useAnswerHook();
  const { isAutoPlaySound } = useAutoPronunciation();
  const { getPronunciationUrl } = usePronunciation();

  const words = useMemo(
    () => currentStatement?.english.split(" ") || [],
    [currentStatement?.english],
  );

  // Play english sound
  const playSound = useCallback(() => {
    if (!currentStatement?.english) return;
    const url = getPronunciationUrl(currentStatement.english);
    const audio = new Audio(url);
    audio.play();
  }, [currentStatement?.english, getPronunciationUrl]);

  // Play individual word sound
  const handlePlayWordSound = useCallback(
    (word: string) => {
      const url = getPronunciationUrl(word);
      const audio = new Audio(url);
      audio.play();
    },
    [getPronunciationUrl],
  );

  // Auto play on mount
  useEffect(() => {
    if (isAutoPlaySound()) {
      playSound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Register shortcut keys for next question
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      e.preventDefault();
      goToNextQuestion();
    };

    registerShortcut(" ", handleKeydown);
    registerShortcut("enter", handleKeydown);

    return () => {
      cancelShortcut(" ", handleKeydown);
      cancelShortcut("enter", handleKeydown);
    };
  }, [goToNextQuestion]);

  return (
    <div className="text-center">
      <div className="ml-8 inline-flex flex-wrap items-center justify-center gap-1 text-5xl">
        {words.map((word, index) => (
          <span
            key={index}
            className="cursor-pointer p-1 hover:text-fuchsia-500"
            onClick={() => handlePlayWordSound(word)}
          >
            {word}
          </span>
        ))}
        <button
          className="ml-1 inline-block cursor-pointer text-gray-500 hover:text-fuchsia-500"
          onClick={playSound}
        >
          <svg className="h-7 w-7" viewBox="0 0 256 256" fill="currentColor">
            <path d="M155.51,24.81a8,8,0,0,0-8.42.88L77.25,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.25l69.84,54.31A8,8,0,0,0,160,224V32A8,8,0,0,0,155.51,24.81ZM144,207.64,84.91,161.69A7.94,7.94,0,0,0,80,160H32V96H80a7.94,7.94,0,0,0,4.91-1.69L144,48.36ZM192,104v48a8,8,0,0,0,16,0V104a8,8,0,0,0-16,0Zm32-16v80a8,8,0,0,0,16,0V88a8,8,0,0,0-16,0Z" />
          </svg>
        </button>
      </div>
      <div className="my-6 text-xl text-gray-500">
        {currentStatement?.soundmark}
      </div>
      <div className="my-6 text-xl text-gray-500">
        {currentStatement?.chinese}
      </div>
      <div className="space-y-3">
        <div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => showQuestion()}
          >
            再来一次
          </button>
          <button
            className="btn btn-outline btn-sm ml-6"
            onClick={() => goToNextQuestion()}
          >
            下一题
          </button>
        </div>
        <div className="md:hidden">
          <MasteredBtn />
        </div>
      </div>
    </div>
  );
}
