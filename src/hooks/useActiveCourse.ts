"use client";

import { useState } from "react";

export const ACTIVE_COURSE_MAP = "activeCourseMap";

function getActiveCourseMapFromStorage(): Record<string, string> {
  if (typeof window === "undefined") return {};
  return JSON.parse(localStorage.getItem(ACTIVE_COURSE_MAP) || "{}");
}

export function useActiveCourseMap() {
  const [activeCourseMap, setActiveCourseMap] = useState<Record<string, string>>(
    getActiveCourseMapFromStorage
  );

  function updateActiveCourseMap(coursePackId: string, courseId: string) {
    const current = getActiveCourseMapFromStorage();
    current[coursePackId] = courseId;
    localStorage.setItem(ACTIVE_COURSE_MAP, JSON.stringify(current));
    setActiveCourseMap({ ...current });
  }

  function removeActiveCourseMap(coursePackId: string) {
    const current = getActiveCourseMapFromStorage();
    delete current[coursePackId];
    localStorage.setItem(ACTIVE_COURSE_MAP, JSON.stringify(current));
    setActiveCourseMap({ ...current });
  }

  function resetActiveCourseMap() {
    localStorage.removeItem(ACTIVE_COURSE_MAP);
    setActiveCourseMap({});
  }

  return {
    activeCourseMap,
    resetActiveCourseMap,
    updateActiveCourseMap,
    removeActiveCourseMap,
  };
}
