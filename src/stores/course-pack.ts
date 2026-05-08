import { create } from "zustand";

import type { CoursePack, CourseHistory, CoursePacksItem } from "@/types";
import { getFetcher } from "@/utils/fetcher";

interface CoursePackState {
  coursePacks: CoursePacksItem[];
  currentCoursePack: CoursePack | undefined;
  setupCoursePacks: () => Promise<void>;
  setupCoursePack: (coursePackId: string) => Promise<void>;
  updateCoursesCompleteCount: (coursePackId: string) => Promise<void>;
}

export const useCoursePackStore = create<CoursePackState>((set, get) => ({
  coursePacks: [],
  currentCoursePack: undefined,

  setupCoursePacks: async () => {
    const res = await getFetcher<CoursePacksItem[]>("/api/course-pack");
    set({ coursePacks: res });
  },

  setupCoursePack: async (coursePackId: string) => {
    if (coursePackId === get().currentCoursePack?.id) return;
    const res = await getFetcher<CoursePack>(`/api/course-pack/${coursePackId}`);
    set({ currentCoursePack: res });
  },

  updateCoursesCompleteCount: async (coursePackId: string) => {
    const courseHistory = await getFetcher<CourseHistory[]>(`/api/course-history/${coursePackId}`);
    const { currentCoursePack } = get();
    if (!currentCoursePack) return;

    const find = (courseId: string) =>
      courseHistory.find((history) => history.courseId === courseId);

    const updatedCourses = currentCoursePack.courses.map((course) => {
      const matchCourseHistory = find(course.id);
      return matchCourseHistory
        ? { ...course, completionCount: matchCourseHistory.completionCount }
        : course;
    });

    set({
      currentCoursePack: { ...currentCoursePack, courses: updatedCourses },
    });
  },
}));
