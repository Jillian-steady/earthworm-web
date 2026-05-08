import { useCallback } from "react";

import { useGameMode } from "@/hooks/useGameMode";
import { useSummary } from "@/hooks/useSummary";
import { useCourseStore } from "@/stores/course";

export function useAnswer() {
  const { showQuestion } = useGameMode();
  const { showSummary } = useSummary();

  const goToNextQuestion = useCallback(() => {
    const courseStore = useCourseStore.getState();

    if (courseStore.isAllDone()) {
      showSummary();
      return;
    }

    courseStore.toNextStatement();
    showQuestion();
  }, [showQuestion, showSummary]);

  return {
    goToNextQuestion,
  };
}
