import { debounce } from "lodash-es";

import type { Course } from "@/types";
import { putFetcher } from "@/utils/fetcher";
import { isAuthenticated } from "@/services/auth";

const DEBOUNCE_TIME = 5000;
const INTERVAL_TIME = 60 * 1000 * 5;

let lastSavedIndex = 0;
let isSaveStatement = true;
let currentStatementIndex = 0;
let cleanupFns: (() => void)[] = [];

export function getStatementIndex() {
  return currentStatementIndex;
}

export function setStatementIndex(index: number) {
  currentStatementIndex = index;
}

export function setupAutoSaveProgress(course: Course) {
  // Cleanup previous listeners
  cleanupFns.forEach((fn) => fn());
  cleanupFns = [];

  if (course.statementIndex >= course.statements.length) {
    currentStatementIndex = 0;
  } else {
    currentStatementIndex = course.statementIndex || 0;
  }

  const saveProgress = () => {
    if (!isSaveStatement) return;
    if (currentStatementIndex !== lastSavedIndex) {
      putFetcher("/api/user-course-progress", {
        coursePackId: course.coursePackId,
        courseId: course.id,
        statementIndex: currentStatementIndex,
      });
      lastSavedIndex = currentStatementIndex;
    }
  };

  const debouncedSave = debounce(saveProgress, DEBOUNCE_TIME);

  const handleBeforeUnload = () => saveProgress();
  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      saveProgress();
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  const intervalId = setInterval(saveProgress, INTERVAL_TIME);

  cleanupFns.push(
    () => window.removeEventListener("beforeunload", handleBeforeUnload),
    () => document.removeEventListener("visibilitychange", handleVisibilityChange),
    () => clearInterval(intervalId),
  );

  return { debouncedSave, cleanup: () => cleanupFns.forEach((fn) => fn()) };
}

export function permitSaveStatement() {
  isSaveStatement = true;
}

export function preventSaveStatement() {
  isSaveStatement = false;
}
