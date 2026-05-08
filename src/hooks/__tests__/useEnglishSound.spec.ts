import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCourseStore } from "@/stores/course";

vi.mock("@/utils/audio", () => {
  return {
    updateSource: vi.fn(),
    play: vi.fn(),
    getPronunciationUrl: vi.fn((word: string) => `https://dict.youdao.com/dictvoice?type=2&audio=${word}`),
  };
});

import { play, updateSource } from "@/utils/audio";

describe("useCurrentStatementEnglishSound", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useCourseStore.setState({
      currentCourse: {
        id: "1",
        title: "Test",
        description: "",
        order: 1,
        coursePackId: "pack1",
        completionCount: 0,
        statementIndex: 0,
        video: "",
        statements: [
          {
            id: "1",
            order: 1,
            english: "I",
            soundmark: "/I/",
            chinese: "我",
            isMastered: false,
          },
        ],
      },
      statementIndex: 0,
    });
  });

  it("plays sound", async () => {
    // Import dynamically to ensure mocks are applied
    const { useCurrentStatementEnglishSound } = await import("../useEnglishSound");
    const { renderHook } = await import("@testing-library/react");

    const { result } = renderHook(() => useCurrentStatementEnglishSound());

    result.current.playSound();

    expect(play).toHaveBeenCalled();
  });

  it("should update audio source when statement changes", async () => {
    const { useCurrentStatementEnglishSound } = await import("../useEnglishSound");
    const { renderHook } = await import("@testing-library/react");

    renderHook(() => useCurrentStatementEnglishSound());

    // The initial mount should call updateSource
    expect(updateSource).toHaveBeenCalled();

    vi.clearAllMocks();

    // Update the course store to change current statement
    useCourseStore.setState({
      currentCourse: {
        id: "1",
        title: "Test",
        description: "",
        order: 1,
        coursePackId: "pack1",
        completionCount: 0,
        statementIndex: 0,
        video: "",
        statements: [
          {
            id: "1",
            order: 1,
            english: "I",
            soundmark: "/I/",
            chinese: "我",
            isMastered: false,
          },
          {
            id: "2",
            order: 2,
            english: "like",
            soundmark: "/like/",
            chinese: "喜欢",
            isMastered: false,
          },
        ],
      },
      statementIndex: 1,
    });

    // The subscription should trigger updateSource
    expect(updateSource).toHaveBeenCalled();
  });
});
