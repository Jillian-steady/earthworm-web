import { useCallback } from "react";
import { create } from "zustand";

interface CourseContentsState {
  contentsVisible: boolean;
  setContentsVisible: (value: boolean) => void;
}

const useCourseContentsStore = create<CourseContentsState>((set) => ({
  contentsVisible: false,
  setContentsVisible: (value: boolean) => set({ contentsVisible: value }),
}));

export function useCourseContents() {
  const { contentsVisible, setContentsVisible } = useCourseContentsStore();

  const openCourseContents = useCallback(() => {
    setContentsVisible(true);
  }, [setContentsVisible]);

  const hideCourseContents = useCallback(() => {
    setContentsVisible(false);
  }, [setContentsVisible]);

  return {
    contentsVisible,
    openCourseContents,
    hideCourseContents,
  };
}
