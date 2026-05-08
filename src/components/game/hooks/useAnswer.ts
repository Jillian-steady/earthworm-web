import { useCallback } from "react";

import { useGameMode } from "@/hooks/useGameMode";
import { useSummary } from "@/hooks/useSummary";
import { useCourseStore } from "@/stores/course";

export function useAnswerHook() {
  const { showQuestion } = useGameMode();
  const { showSummary } = useSummary();

  const goToNextQuestion = useCallback(() => {
    const { isAllDone, toNextStatement } = useCourseStore.getState();

    if (isAllDone()) {
      showSummary();
      return;
    }

    toNextStatement();
    showQuestion();
  }, [showQuestion, showSummary]);

  return {
    goToNextQuestion,
  };
}
