import { useCallback, useRef } from "react";

import { useAnswerTip } from "@/hooks/useAnswerTip";
import { usePlayTipSound } from "@/hooks/useTypingSound";

export function useAnswerError() {
  const { playErrorSound } = usePlayTipSound();
  const { showAnswerTip, hiddenAnswerTip } = useAnswerTip();
  const wrongTimesRef = useRef(0);

  // TODO: integrate with a user setting for error tip threshold
  const isShowErrorTip = useCallback(() => {
    return true;
  }, []);

  const handleAnswerError = useCallback(() => {
    playErrorSound();
    wrongTimesRef.current++;
    if (isShowErrorTip() && wrongTimesRef.current >= 3) {
      showAnswerTip();
    }
  }, [playErrorSound, isShowErrorTip, showAnswerTip]);

  const resetCloseTip = useCallback(() => {
    wrongTimesRef.current = 0;
    hiddenAnswerTip();
  }, [hiddenAnswerTip]);

  return {
    handleAnswerError,
    resetCloseTip,
  };
}
