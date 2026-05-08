import { create } from "zustand";

import type { Course, Statement } from "@/types";
import { getFetcher, postFetcher } from "@/utils/fetcher";
import { isAuthenticated } from "@/services/auth";
import { useMasteredElementsStore } from "./mastered-elements";
import {
  getStatementIndex,
  setStatementIndex,
  setupAutoSaveProgress,
} from "./statement";

interface CourseState {
  currentCourse: Course | undefined;
  statementIndex: number;

  getCurrentStatement: () => Statement | undefined;
  getWords: () => string[];
  getVisibleStatementsCount: () => number;
  getVisibleStatementIndex: () => number;
  getTotalQuestionsCount: () => number;

  toSpecificStatement: (index: number) => void;
  toPreviousStatement: () => void;
  toNextStatement: () => void;
  resetStatementIndex: () => void;
  isAllDone: () => boolean;
  isLastStatement: () => boolean;
  isAllMastered: () => boolean;
  updateMarketedStatements: () => void;
  doAgain: () => void;
  completeCourse: () => Promise<{ nextCourse: Course | undefined }>;
  setup: (coursePackId: string, courseId: string) => Promise<void>;
}

function markMasteredElements(statements: Statement[]): Statement[] {
  const { checkMastered } = useMasteredElementsStore.getState();
  return statements.map((statement) => ({
    ...statement,
    isMastered: checkMastered(statement.english),
  }));
}

function findNextUnmasteredIndex(
  statements: Statement[],
  currentIndex: number,
  direction: 1 | -1,
): number {
  let index = currentIndex;
  while (index >= 0 && index < statements.length) {
    index += direction;
    if (index >= 0 && index < statements.length && !statements[index].isMastered) {
      return index;
    }
  }
  return -1;
}

function findFirstUnmasteredIndex(course: Course | undefined): number {
  if (!course) return 0;
  const idx = course.statements.findIndex((s) => !s.isMastered);
  return idx === -1 ? 0 : idx;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  currentCourse: undefined,
  statementIndex: 0,

  getCurrentStatement: () => {
    const { currentCourse, statementIndex } = get();
    return currentCourse?.statements[statementIndex];
  },

  getWords: () => {
    const statement = get().getCurrentStatement();
    return statement?.english.split(" ") || [];
  },

  getVisibleStatementsCount: () => {
    const { currentCourse } = get();
    return currentCourse?.statements.filter((s) => !s.isMastered).length || 0;
  },

  getVisibleStatementIndex: () => {
    const { currentCourse, statementIndex } = get();
    const visibleCount = get().getVisibleStatementsCount();
    let masteredCount = 0;
    currentCourse?.statements.forEach((statement, index) => {
      if (index < statementIndex && statement.isMastered) {
        masteredCount++;
      }
    });
    if (statementIndex - masteredCount >= visibleCount) {
      return statementIndex - masteredCount - 1;
    }
    return statementIndex - masteredCount;
  },

  getTotalQuestionsCount: () => {
    return get().currentCourse?.statements.length || 0;
  },

  toSpecificStatement: (index: number) => {
    setStatementIndex(index);
    set({ statementIndex: index });
  },

  toPreviousStatement: () => {
    const { currentCourse, statementIndex } = get();
    if (!currentCourse) return;
    const prevIndex = findNextUnmasteredIndex(currentCourse.statements, statementIndex, -1);
    if (prevIndex !== -1) {
      setStatementIndex(prevIndex);
      set({ statementIndex: prevIndex });
    }
  },

  toNextStatement: () => {
    const { currentCourse, statementIndex } = get();
    if (!currentCourse) return;
    const nextIndex = findNextUnmasteredIndex(currentCourse.statements, statementIndex, 1);
    if (nextIndex !== -1) {
      setStatementIndex(nextIndex);
      set({ statementIndex: nextIndex });
    }
  },

  resetStatementIndex: () => {
    const { currentCourse } = get();
    const firstIndex = findFirstUnmasteredIndex(currentCourse);
    if (firstIndex !== -1) {
      setStatementIndex(firstIndex);
      set({ statementIndex: firstIndex });
    }
  },

  isAllDone: () => {
    return get().getVisibleStatementIndex() >= get().getVisibleStatementsCount() - 1;
  },

  isLastStatement: () => {
    return get().getVisibleStatementIndex() + 1 === get().getVisibleStatementsCount();
  },

  isAllMastered: () => {
    return get().getVisibleStatementsCount() === 0;
  },

  updateMarketedStatements: () => {
    const { currentCourse } = get();
    if (currentCourse) {
      set({
        currentCourse: {
          ...currentCourse,
          statements: markMasteredElements(currentCourse.statements),
        },
      });
    }
  },

  doAgain: () => {
    get().resetStatementIndex();
  },

  completeCourse: async () => {
    const { currentCourse } = get();
    const coursePackId = currentCourse?.coursePackId!;
    const res = await postFetcher<{ nextCourse: Course | undefined }>(
      `/api/course-pack/${coursePackId}/courses/${currentCourse?.id!}/complete`,
    );
    return { nextCourse: res.nextCourse };
  },

  setup: async (coursePackId: string, courseId: string) => {
    const course = await getFetcher<Course>(`/api/course-pack/${coursePackId}/courses/${courseId}`);
    course.statements = markMasteredElements(course.statements);

    set({ currentCourse: course });

    if (isAuthenticated()) {
      const { debouncedSave } = setupAutoSaveProgress(course);
      const idx = getStatementIndex();
      set({ statementIndex: idx });

      // If at the beginning, skip to the first unmastered statement
      if (idx === 0) {
        get().resetStatementIndex();
      }

      // Subscribe to statementIndex changes for debounced save
      useCourseStore.subscribe((state, prevState) => {
        if (state.statementIndex !== prevState.statementIndex) {
          setStatementIndex(state.statementIndex);
          if (isAuthenticated()) {
            debouncedSave();
          }
        }
      });
    }
  },
}));
