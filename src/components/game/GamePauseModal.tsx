"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { useShortcutKeyMode } from "@/hooks/useShortcutKey";
import { useGameStore } from "@/stores/game";
import {
  registerShortcut,
  cancelShortcut,
} from "@/utils/keyboardShortcuts";
import { useQuestionInput } from "./hooks/useQuestionInput";

const messages = [
  "别忘了回来继续练习哦，我在等着你呢！",
  "休息一下没关系，但别让我等太久！",
  "快点回来吧，你的英语能力正在蓄势待发！",
];

export default function GamePauseModal() {
  const [showModal, setShowModal] = useState(false);
  const [randomMessage, setRandomMessage] = useState("");

  const { shortcutKeys } = useShortcutKeyMode();
  const isGamePaused = useGameStore((s) => s.isGamePaused);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const { focusInput } = useQuestionInput();

  // Listen for pauseGame event
  useEffect(() => {
    const handlePause = () => {
      const paused = pauseGame();
      if (paused) {
        setShowModal(true);
        setRandomMessage(
          messages[Math.floor(Math.random() * messages.length)],
        );
      }
    };
    window.addEventListener("pauseGame", handlePause);
    return () => window.removeEventListener("pauseGame", handlePause);
  }, [pauseGame]);

  const handleClose = useCallback(() => {
    resumeGame();
    setShowModal(false);
    setTimeout(() => {
      focusInput();
    }, 300);
  }, [resumeGame, focusInput]);

  // Register shortcut for pause/resume
  useEffect(() => {
    const handleGamePause = (e: KeyboardEvent) => {
      e.preventDefault();
      if (isGamePaused()) {
        resumeGame();
        setShowModal(false);
        setTimeout(() => {
          focusInput();
        }, 300);
      } else {
        const paused = pauseGame();
        if (paused) {
          setShowModal(true);
          setRandomMessage(
            messages[Math.floor(Math.random() * messages.length)],
          );
        }
      }
    };

    registerShortcut(shortcutKeys.pause, handleGamePause);

    return () => {
      cancelShortcut(shortcutKeys.pause, handleGamePause);
    };
  }, [shortcutKeys.pause, isGamePaused, resumeGame, pauseGame, focusInput]);

  if (!showModal) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full rounded-lg bg-white shadow-xl sm:max-w-lg dark:bg-gray-800">
        <div className="flex h-52 flex-col justify-between p-6 text-gray-900 dark:text-white">
          <h2 className="mb-8 text-2xl font-bold">游戏暂停</h2>
          <p className="mb-8 max-w-sm text-base text-gray-700 dark:text-gray-300">
            {randomMessage}
          </p>
          <div className="flex w-full justify-end">
            <button className="btn btn-primary px-6" onClick={handleClose}>
              继续游戏
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
