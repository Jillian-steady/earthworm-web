import { useCallback, useEffect, useRef } from "react";
import { create } from "zustand";
import { debounce } from "lodash-es";

import { useCourseStore } from "@/stores/course";
import { useGameStore } from "@/stores/game";

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in ms

interface GamePauseState {
  showGamePauseModal: boolean;
  setShowGamePauseModal: (value: boolean) => void;
}

const useGamePauseStore = create<GamePauseState>((set) => ({
  showGamePauseModal: false,
  setShowGamePauseModal: (value: boolean) =>
    set({ showGamePauseModal: value }),
}));

export function useGamePause() {
  const { showGamePauseModal, setShowGamePauseModal } = useGamePauseStore();
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const disableAutoPauseCheck = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
  }, []);

  const pauseGame = useCallback(() => {
    const pauseResult = useGameStore.getState().pauseGame();
    if (pauseResult) {
      setShowGamePauseModal(true);
      disableAutoPauseCheck();
    } else {
      console.log("Game not started, cannot pause");
    }
  }, [setShowGamePauseModal, disableAutoPauseCheck]);

  const resetInactivityTimer = useCallback(() => {
    disableAutoPauseCheck();
    inactivityTimerRef.current = setTimeout(() => {
      pauseGame();
    }, INACTIVITY_TIMEOUT);
  }, [disableAutoPauseCheck, pauseGame]);

  const resumeGame = useCallback(() => {
    setShowGamePauseModal(false);
    useGameStore.getState().resumeGame();
    resetInactivityTimer();
  }, [setShowGamePauseModal, resetInactivityTimer]);

  const enableAutoPauseCheck = useCallback(() => {
    const debouncedReset = debounce(resetInactivityTimer, 500);

    // Subscribe to course store statementIndex changes
    const unsubCourse = useCourseStore.subscribe((state, prevState) => {
      if (state.statementIndex !== prevState.statementIndex) {
        debouncedReset();
      }
    });

    // Initial timer start
    resetInactivityTimer();

    // Return cleanup function
    return () => {
      unsubCourse();
      debouncedReset.cancel();
      disableAutoPauseCheck();
    };
  }, [resetInactivityTimer, disableAutoPauseCheck]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disableAutoPauseCheck();
    };
  }, [disableAutoPauseCheck]);

  return {
    showGamePauseModal,
    resumeGame,
    pauseGame,
    enableAutoPauseCheck,
    disableAutoPauseCheck,
  };
}
