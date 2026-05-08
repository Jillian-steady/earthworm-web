"use client";

import { useCallback } from "react";
import { toast } from "sonner";

import { useCourseStore } from "@/stores/course";
import { useMasteredElementsStore } from "@/stores/mastered-elements";
import { useGameMode } from "@/hooks/useGameMode";
import { isAuthenticated } from "@/services/auth";

export default function MasteredBtn() {
  const { showQuestion } = useGameMode();
  const currentStatement = useCourseStore((s) => s.getCurrentStatement());
  const toNextStatement = useCourseStore((s) => s.toNextStatement);
  const updateMarketedStatements = useCourseStore((s) => s.updateMarketedStatements);
  const addElement = useMasteredElementsStore((s) => s.addElement);

  const markStatementAsMastered = useCallback(async () => {
    if (!isAuthenticated()) {
      toast.warning("请先登录后再操作");
      return;
    }

    if (!currentStatement) return;

    const undoFn = await addElement({
      english: currentStatement.english,
    });

    updateMarketedStatements();
    toNextStatement();
    showQuestion();

    toast.success("已掌握该内容", {
      action: {
        label: "撤销",
        onClick: () => {
          undoFn();
          updateMarketedStatements();
        },
      },
    });
  }, [currentStatement, addElement, updateMarketedStatements, toNextStatement, showQuestion]);

  return (
    <button
      className="btn btn-outline btn-sm"
      onClick={markStatementAsMastered}
    >
      掌握
    </button>
  );
}
