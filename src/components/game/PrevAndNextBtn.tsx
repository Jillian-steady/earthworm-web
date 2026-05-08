"use client";

import { useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useGameMode } from "@/hooks/useGameMode";
import { useShortcutKeyMode, parseShortcut } from "@/hooks/useShortcutKey";
import { useCourseStore } from "@/stores/course";
import {
  registerShortcut,
  cancelShortcut,
} from "@/utils/keyboardShortcuts";

export default function PrevAndNextBtn() {
  const { shortcutKeys } = useShortcutKeyMode();
  const { showQuestion } = useGameMode();
  const visibleStatementIndex = useCourseStore((s) => s.getVisibleStatementIndex());
  const visibleStatementsCount = useCourseStore((s) => s.getVisibleStatementsCount());
  const toNextStatement = useCourseStore((s) => s.toNextStatement);
  const toPreviousStatement = useCourseStore((s) => s.toPreviousStatement);

  const goToNextQuestion = useCallback(() => {
    toNextStatement();
    showQuestion();
  }, [toNextStatement, showQuestion]);

  const goToPreviousQuestion = useCallback(() => {
    toPreviousStatement();
    showQuestion();
  }, [toPreviousStatement, showQuestion]);

  // Register shortcut keys
  useEffect(() => {
    registerShortcut(shortcutKeys.previous, goToPreviousQuestion);
    registerShortcut(shortcutKeys.skip, goToNextQuestion);

    return () => {
      cancelShortcut(shortcutKeys.previous, goToPreviousQuestion);
      cancelShortcut(shortcutKeys.skip, goToNextQuestion);
    };
  }, [shortcutKeys, goToNextQuestion, goToPreviousQuestion]);

  return (
    <div className="absolute flex w-full items-center justify-between">
      <div className="h-12 w-12">
        {visibleStatementIndex !== 0 && (
          <button
            className="text-[#475569] transition-transform duration-150 ease-in-out hover:text-[#d946ef] active:scale-95 dark:text-[#cbd5e1] dark:hover:text-[#d946ef]"
            onClick={goToPreviousQuestion}
            title={`上一题 (${shortcutKeys.previous})`}
          >
            <ChevronLeft className="h-12 w-12" />
          </button>
        )}
      </div>

      <div className="h-12 w-12">
        {visibleStatementIndex + 1 !== visibleStatementsCount && (
          <button
            className="text-[#475569] transition-transform duration-150 ease-in-out hover:text-[#d946ef] active:scale-95 dark:text-[#cbd5e1] dark:hover:text-[#d946ef]"
            onClick={goToNextQuestion}
            title={`下一题 (${shortcutKeys.skip})`}
          >
            <ChevronRight className="h-12 w-12" />
          </button>
        )}
      </div>
    </div>
  );
}
