import { useCallback } from "react";
import { create } from "zustand";

import { getFetcher } from "@/utils/fetcher";
import type { UserLearningDailyTime } from "@/types";

interface LearningDailyTimeState {
  learningDailyTimeList: UserLearningDailyTime[];
  learningDailyTotalTime: number;
  setLearningDailyTimeList: (list: UserLearningDailyTime[]) => void;
  setLearningDailyTotalTime: (time: number) => void;
}

const useLearningDailyTimeStore = create<LearningDailyTimeState>((set) => ({
  learningDailyTimeList: [],
  learningDailyTotalTime: 0,
  setLearningDailyTimeList: (list: UserLearningDailyTime[]) =>
    set({ learningDailyTimeList: list }),
  setLearningDailyTotalTime: (time: number) =>
    set({ learningDailyTotalTime: time }),
}));

export function useLearningDailyTime() {
  const {
    learningDailyTimeList,
    learningDailyTotalTime,
    setLearningDailyTimeList,
    setLearningDailyTotalTime,
  } = useLearningDailyTimeStore();

  const setupLearningDailyTime = useCallback(async () => {
    const [list, total] = await Promise.all([
      getFetcher<UserLearningDailyTime[]>("/api/user-learning-activities", { activityType: "daily_total" }),
      getFetcher<number>("/api/user-learning-activities/total", { activityType: "daily_total" }),
    ]);
    setLearningDailyTimeList(list);
    setLearningDailyTotalTime(total);
  }, [setLearningDailyTimeList, setLearningDailyTotalTime]);

  return {
    learningDailyTimeList,
    learningDailyTotalTime,
    setupLearningDailyTime,
  };
}
