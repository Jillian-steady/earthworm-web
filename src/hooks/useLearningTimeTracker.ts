import { useCallback, useEffect, useRef } from "react";
import { create } from "zustand";

import { postFetcher } from "@/utils/fetcher";
import { useUserStore } from "@/stores/user";

interface LearningTimeTrackerState {
  totalSeconds: number;
  isTracking: boolean;
  setTotalSeconds: (value: number) => void;
  incrementTotalSeconds: () => void;
  setIsTracking: (value: boolean) => void;
}

const useLearningTimeTrackerStore = create<LearningTimeTrackerState>(
  (set, get) => ({
    totalSeconds: 0,
    isTracking: false,
    setTotalSeconds: (value: number) => set({ totalSeconds: value }),
    incrementTotalSeconds: () =>
      set({ totalSeconds: get().totalSeconds + 1 }),
    setIsTracking: (value: boolean) => set({ isTracking: value }),
  }),
);

export function useLearningTimeTracker() {
  const {
    totalSeconds,
    isTracking,
    setTotalSeconds,
    incrementTotalSeconds,
    setIsTracking,
  } = useLearningTimeTrackerStore();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTotalSecondsRef = useRef(0);

  const userId = useUserStore.getState().user?.id || "";

  const getStorageKey = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    return `learningTime_${userId}_${today}`;
  }, [userId]);

  const setupLearningTime = useCallback(
    (duration: number) => {
      localStorage.setItem(getStorageKey(), duration.toString());
    },
    [getStorageKey],
  );

  const loadTime = useCallback(() => {
    const savedTime = localStorage.getItem(getStorageKey());
    setTotalSeconds(savedTime ? parseInt(savedTime) : 0);
  }, [getStorageKey, setTotalSeconds]);

  const uploadTime = useCallback(() => {
    const state = useLearningTimeTrackerStore.getState();
    const duration = state.totalSeconds - lastTotalSecondsRef.current;
    if (duration < 0) return;

    postFetcher("/api/user-learning-activities", {
      date: new Date().toISOString().split("T")[0],
      duration,
      activityType: "daily_total",
    });
  }, []);

  const saveTime = useCallback(() => {
    const state = useLearningTimeTrackerStore.getState();
    localStorage.setItem(getStorageKey(), state.totalSeconds.toString());
    uploadTime();
  }, [getStorageKey, uploadTime]);

  const startTracking = useCallback(() => {
    const state = useLearningTimeTrackerStore.getState();
    if (state.isTracking) return;

    // Load time
    const savedTime = localStorage.getItem(getStorageKey());
    const loaded = savedTime ? parseInt(savedTime) : 0;
    setTotalSeconds(loaded);

    if (loaded === 0) {
      localStorage.setItem(getStorageKey(), "0");
      uploadTime();
    }

    setIsTracking(true);
    lastTotalSecondsRef.current = loaded;

    timerRef.current = setInterval(() => {
      incrementTotalSeconds();
      const current = useLearningTimeTrackerStore.getState().totalSeconds;
      if (current % 30 === 0) {
        const s = useLearningTimeTrackerStore.getState();
        localStorage.setItem(getStorageKey(), s.totalSeconds.toString());
        const dur = s.totalSeconds - lastTotalSecondsRef.current;
        if (dur >= 0) {
          postFetcher("/api/user-learning-activities", {
            date: new Date().toISOString().split("T")[0],
            duration: dur,
            activityType: "daily_total",
          });
        }
        lastTotalSecondsRef.current = s.totalSeconds;
      }
    }, 1000);
  }, [
    getStorageKey,
    setTotalSeconds,
    setIsTracking,
    incrementTotalSeconds,
    uploadTime,
  ]);

  const stopTracking = useCallback(() => {
    const state = useLearningTimeTrackerStore.getState();
    if (!state.isTracking) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsTracking(false);
    saveTime();
  }, [setIsTracking, saveTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    totalSeconds,
    isTracking,
    startTracking,
    stopTracking,
    setupLearningTime,
  };
}
