import { useCallback, useRef } from "react";

import { useAnswerTip } from "@/hooks/useAnswerTip";
import { useErrorTip } from "@/hooks/useErrorTip";
import { usePlayTipSound } from "./useTypingSound";

let wrongTimes = 0;

export function useAnswerError() {
  const { playErrorSound } = usePlayTipSound();
  const { isShowErrorTip } = useErrorTip();
  const { showAnswerTip, hiddenAnswerTip } = useAnswerTip();

  const handleAnswerError = useCallback(() => {
    playErrorSound();
    wrongTimes++;
    if (isShowErrorTip() && wrongTimes >= 3) {
      showAnswerTip();
    }
  }, [playErrorSound, isShowErrorTip, showAnswerTip]);

  const resetCloseTip = useCallback(() => {
    wrongTimes = 0;
    hiddenAnswerTip();
  }, [hiddenAnswerTip]);

  return {
    handleAnswerError,
    resetCloseTip,
  };
}
