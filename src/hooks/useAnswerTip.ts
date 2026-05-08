import { useCallback } from "react";
import { create } from "zustand";

interface AnswerTipState {
  answerTip: boolean;
  setAnswerTip: (value: boolean) => void;
}

const useAnswerTipStore = create<AnswerTipState>((set) => ({
  answerTip: false,
  setAnswerTip: (value: boolean) => set({ answerTip: value }),
}));

export function useAnswerTip() {
  const { answerTip, setAnswerTip } = useAnswerTipStore();

  const showAnswerTip = useCallback(() => {
    setAnswerTip(true);
  }, [setAnswerTip]);

  const hiddenAnswerTip = useCallback(() => {
    setAnswerTip(false);
  }, [setAnswerTip]);

  const toggleAnswerTip = useCallback(() => {
    const current = useAnswerTipStore.getState().answerTip;
    setAnswerTip(!current);
  }, [setAnswerTip]);

  const isAnswerTip = useCallback(() => {
    return useAnswerTipStore.getState().answerTip;
  }, []);

  return {
    answerTip,
    showAnswerTip,
    hiddenAnswerTip,
    isAnswerTip,
    toggleAnswerTip,
  };
}
