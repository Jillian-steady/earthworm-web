import { useCallback, useEffect } from "react";
import { create } from "zustand";

import { getFetcher } from "@/utils/fetcher";

// --- Summary Modal ---

interface SummaryState {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

const useSummaryStore = create<SummaryState>((set) => ({
  showModal: false,
  setShowModal: (value: boolean) => set({ showModal: value }),
}));

export function useSummary() {
  const { showModal, setShowModal } = useSummaryStore();

  const showSummary = useCallback(() => {
    setShowModal(true);
  }, [setShowModal]);

  const hideSummary = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  return {
    showModal,
    showSummary,
    hideSummary,
  };
}

// --- Daily Sentence ---

export const defaultEnSentence =
  "To be, or not to be, that is the question.";
export const defaultZhSentence = "生存还是毁灭，这是一个问题。";

interface DailySentenceState {
  enSentence: string;
  zhSentence: string;
  hasLoadingDailySentence: boolean;
  setEnSentence: (value: string) => void;
  setZhSentence: (value: string) => void;
  setHasLoadingDailySentence: (value: boolean) => void;
}

const useDailySentenceStore = create<DailySentenceState>((set) => ({
  enSentence: defaultEnSentence,
  zhSentence: defaultZhSentence,
  hasLoadingDailySentence: false,
  setEnSentence: (value: string) => set({ enSentence: value }),
  setZhSentence: (value: string) => set({ zhSentence: value }),
  setHasLoadingDailySentence: (value: boolean) =>
    set({ hasLoadingDailySentence: value }),
}));

export const resetSentenceLoading = () =>
  useDailySentenceStore.getState().setHasLoadingDailySentence(false);

export function useDailySentence() {
  const {
    enSentence,
    zhSentence,
    hasLoadingDailySentence,
    setEnSentence,
    setZhSentence,
    setHasLoadingDailySentence,
  } = useDailySentenceStore();

  const getDailySentence = useCallback(async () => {
    const state = useDailySentenceStore.getState();
    if (!state.hasLoadingDailySentence) {
      setHasLoadingDailySentence(true);
      try {
        const { en, zh } = await getFetcher<{ en: string; zh: string }>("/api/tool/dailySentence");
        setEnSentence(en);
        setZhSentence(zh);
      } catch {
        setHasLoadingDailySentence(false);
      }
    }
  }, [setEnSentence, setZhSentence, setHasLoadingDailySentence]);

  useEffect(() => {
    getDailySentence();
  }, [getDailySentence]);

  return {
    enSentence,
    zhSentence,
    getDailySentence,
  };
}
