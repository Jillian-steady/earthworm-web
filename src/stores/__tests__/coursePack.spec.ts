import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Course, CoursePack } from "@/types";
import { useCoursePackStore } from "../course-pack";

vi.mock("@/utils/fetcher");

import { getFetcher } from "@/utils/fetcher";

describe("course pack store", () => {
  beforeEach(() => {
    useCoursePackStore.setState({ coursePacks: [], currentCoursePack: undefined });
  });

  it("should setup course pack and update completion counts from history", async () => {
    const coursePack: CoursePack = {
      id: "coursePackId",
      title: "课程包1",
      description: "这是一个课程包",
      isFree: true,
      courses: [],
      cover: "",
    };

    const firstCourse: Course = {
      id: "1",
      title: "第一课",
      description: "",
      video: "",
      order: 1,
      coursePackId: coursePack.id,
      completionCount: 0,
      statementIndex: 0,
      statements: [
        { id: "1", order: 1, english: "I", chinese: "我", soundmark: "/aɪ/", isMastered: false },
        {
          id: "2",
          order: 2,
          english: "like",
          chinese: "喜欢",
          soundmark: "/laɪk/",
          isMastered: false,
        },
      ],
    };

    const secondCourse: Course = {
      id: "2",
      title: "第二课",
      order: 2,
      description: "",
      video: "",
      coursePackId: coursePack.id,
      completionCount: 0,
      statementIndex: 0,
      statements: [
        { id: "1", order: 1, english: "I", chinese: "我", soundmark: "/aɪ/", isMastered: false },
        {
          id: "2",
          order: 2,
          english: "like",
          chinese: "喜欢",
          soundmark: "/laɪk/",
          isMastered: false,
        },
      ],
    };

    coursePack.courses = [firstCourse, secondCourse];

    vi.mocked(getFetcher).mockImplementation(async (path: string) => {
      if (path.includes("/api/course-pack/")) {
        return coursePack;
      }
      if (path.includes("/api/course-history/")) {
        return [
          {
            completionCount: 5,
            courseId: firstCourse.id,
          },
        ];
      }
      return {};
    });

    await useCoursePackStore.getState().setupCoursePack(coursePack.id);
    await useCoursePackStore.getState().updateCoursesCompleteCount(coursePack.id);

    expect(useCoursePackStore.getState().currentCoursePack?.courses[0].completionCount).toBe(5);
    expect(useCoursePackStore.getState().currentCoursePack?.courses[1].completionCount).toBe(0);
  });
});
