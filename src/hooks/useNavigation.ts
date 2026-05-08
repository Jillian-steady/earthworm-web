"use client";

import { useRouter } from "next/navigation";

export function useNavigation() {
  const router = useRouter();

  function gotoCourseList(coursePackId: string) {
    router.push(`/course-pack/${coursePackId}`);
  }

  function gotoGame(coursePackId: string, courseId: string) {
    router.push(`/game/${coursePackId}/${courseId}`);
  }

  return {
    gotoCourseList,
    gotoGame,
  };
}
