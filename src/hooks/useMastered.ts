import { useCallback, useRef } from "react";
import { toast } from "sonner";

import { useGameMode } from "@/hooks/useGameMode";
import { useSummary } from "@/hooks/useSummary";
import { isAuthenticated } from "@/services/auth";
import { useCourseStore } from "@/stores/course";
import { useMasteredElementsStore } from "@/stores/mastered-elements";

export function useMastered() {
  const toastIdRef = useRef<string | number | undefined>(undefined);
  const addLoadingRef = useRef(false);
  const { showQuestion } = useGameMode();
  const { showSummary } = useSummary();

  const markStatementAsMastered = useCallback(async () => {
    if (!isAuthenticated()) {
      toast.warning("需要登录哦");
      return;
    }

    if (addLoadingRef.current) return;

    const courseStore = useCourseStore.getState();
    const masteredElements = useMasteredElementsStore.getState();

    // Record isLastStatement before update
    const isLastStatement = courseStore.isLastStatement();
    addLoadingRef.current = true;

    const currentStatement = courseStore.getCurrentStatement();
    const undoMasteredElements = await masteredElements.addElement({
      english: currentStatement?.english!,
    });

    // Handle toast with undo
    function dismissToastIfExists() {
      if (toastIdRef.current !== undefined) {
        toast.dismiss(toastIdRef.current);
      }
    }

    dismissToastIfExists();

    toastIdRef.current = toast("成功添加到掌握列表中", {
      action: {
        label: "撤销",
        onClick: () => {
          undoMasteredElements();
          useCourseStore.getState().updateMarketedStatements();
          dismissToastIfExists();
        },
      },
    });

    addLoadingRef.current = false;
    useCourseStore.getState().updateMarketedStatements();

    if (isLastStatement) {
      showSummary();
    } else {
      // Check if all mastered after update
      if (useCourseStore.getState().isAllMastered()) {
        showSummary();
        return;
      }
      useCourseStore.getState().toNextStatement();
      showQuestion();
    }
  }, [showQuestion, showSummary]);

  return {
    markStatementAsMastered,
  };
}
