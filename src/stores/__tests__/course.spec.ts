import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCourseStore } from "../course";
import { useMasteredElementsStore } from "../mastered-elements";

vi.mock("@/utils/fetcher");
vi.mock("@/services/auth");
vi.mock("../statement");

import { getFetcher, postFetcher } from "@/utils/fetcher";
import { isAuthenticated } from "@/services/auth";
import { setupAutoSaveProgress, getStatementIndex } from "../statement";

const mockCourse = {
  id: "1",
  title: "Test Course",
  description: "A test course",
  order: 1,
  statements: [
    {
      id: "1",
      order: 1,
      english: "Hello",
      chinese: "你好",
      soundmark: "/heləʊ/",
      isMastered: false,
    },
    {
      id: "2",
      order: 2,
      english: "World",
      chinese: "世界",
      soundmark: "/wɜːld/",
      isMastered: false,
    },
    { id: "3", order: 3, english: "Test", chinese: "测试", soundmark: "/test/", isMastered: false },
    {
      id: "4",
      order: 4,
      english: "Unit",
      chinese: "单元",
      soundmark: "/ˈjuːnɪt/",
      isMastered: false,
    },
    { id: "5", order: 5, english: "Case", chinese: "案例", soundmark: "/keɪs/", isMastered: false },
  ],
  coursePackId: "pack1",
  completionCount: 0,
  statementIndex: 0,
  video: "https://example.com/test-video.mp4",
};

describe("CourseStore", () => {
  beforeEach(async () => {
    vi.mocked(getFetcher).mockImplementation(async (path: string) => {
      if (path.includes("/api/course-pack/")) {
        return JSON.parse(JSON.stringify(mockCourse));
      }
      if (path.includes("/api/mastered-elements")) {
        return [
          { content: { english: "World" }, masteredAt: new Date().toISOString(), id: "1" },
        ];
      }
      return {};
    });

    vi.mocked(postFetcher).mockImplementation(async (path: string, body?: unknown) => {
      if (path.includes("/api/mastered-elements")) {
        return {
          content: body && (body as any).content,
          masteredAt: new Date().toISOString(),
          id: String(Math.random()),
        };
      }
      return {};
    });

    vi.mocked(isAuthenticated).mockReturnValue(true);
    vi.mocked(setupAutoSaveProgress).mockReturnValue({
      debouncedSave: vi.fn(),
      cleanup: vi.fn(),
    });
    vi.mocked(getStatementIndex).mockReturnValue(0);

    // Setup mastered elements first
    await useMasteredElementsStore.getState().setup();

    // Reset course store state and setup
    useCourseStore.setState({ currentCourse: undefined, statementIndex: 0 });
    await useCourseStore.getState().setup("pack1", "1");

    vi.clearAllMocks();
  });

  describe("Course initialization", () => {
    it("should correctly load the course and mark mastered elements", () => {
      const state = useCourseStore.getState();
      expect(state.currentCourse).toBeDefined();
      expect(state.currentCourse?.statements[1].isMastered).toBe(true); // World
      expect(state.currentCourse?.statements[0].isMastered).toBe(false); // Hello
    });

    it("should set up auto-save progress when user is authenticated", async () => {
      vi.mocked(isAuthenticated).mockReturnValue(true);
      vi.mocked(getFetcher).mockResolvedValue(JSON.parse(JSON.stringify(mockCourse)));
      vi.mocked(getStatementIndex).mockReturnValue(0);
      vi.mocked(setupAutoSaveProgress).mockReturnValue({
        debouncedSave: vi.fn(),
        cleanup: vi.fn(),
      });
      await useCourseStore.getState().setup("pack1", "1");
      expect(setupAutoSaveProgress).toHaveBeenCalled();
    });

    it("should not set up auto-save progress when user is not authenticated", async () => {
      vi.mocked(isAuthenticated).mockReturnValue(false);
      vi.mocked(getFetcher).mockResolvedValue(JSON.parse(JSON.stringify(mockCourse)));
      await useCourseStore.getState().setup("pack1", "1");
      expect(setupAutoSaveProgress).not.toHaveBeenCalled();
    });
  });

  describe("Statement navigation", () => {
    it("should navigate to the next unmastered statement", () => {
      useCourseStore.getState().toNextStatement();
      expect(useCourseStore.getState().statementIndex).toBe(2); // Skips "World" as it's mastered
    });

    it("should navigate to the previous unmastered statement", () => {
      useCourseStore.getState().toSpecificStatement(2);
      useCourseStore.getState().toPreviousStatement();
      expect(useCourseStore.getState().statementIndex).toBe(0); // Skips "World" as it's mastered
    });

    it("should handle navigation boundaries", () => {
      useCourseStore.getState().toPreviousStatement();
      expect(useCourseStore.getState().statementIndex).toBe(0);
      for (let i = 0; i < 10; i++) useCourseStore.getState().toNextStatement();
      expect(useCourseStore.getState().statementIndex).toBe(4);
    });
  });

  describe("Progress tracking", () => {
    it("should correctly identify when all statements are done", () => {
      expect(useCourseStore.getState().isAllDone()).toBe(false);
      useCourseStore.getState().toSpecificStatement(4);
      expect(useCourseStore.getState().isAllDone()).toBe(true);
    });

    it("should correctly identify the last statement", () => {
      expect(useCourseStore.getState().isLastStatement()).toBe(false);
      useCourseStore.getState().toSpecificStatement(4);
      expect(useCourseStore.getState().isLastStatement()).toBe(true);
    });

    it("should correctly identify when all statements are mastered", async () => {
      expect(useCourseStore.getState().isAllMastered()).toBe(false);

      vi.mocked(getFetcher).mockImplementation(async (path: string) => {
        if (path.includes("/api/mastered-elements")) {
          return mockCourse.statements.map((s, index) => ({
            content: { english: s.english },
            masteredAt: new Date().toISOString(),
            id: String(index),
          }));
        }
        return {};
      });

      await useMasteredElementsStore.getState().setup();
      useCourseStore.getState().updateMarketedStatements();
      expect(useCourseStore.getState().isAllMastered()).toBe(true);
    });
  });

  describe("Visible statements and index relationship", () => {
    it("should correctly calculate the number of visible statements", () => {
      expect(useCourseStore.getState().getVisibleStatementsCount()).toBe(4); // All except "World"
    });

    it("should have correct initial visibleStatementIndex", () => {
      expect(useCourseStore.getState().getVisibleStatementIndex()).toBe(0);
    });

    it("should update visibleStatementIndex when navigating to next statement", () => {
      useCourseStore.getState().toNextStatement();
      expect(useCourseStore.getState().getVisibleStatementIndex()).toBe(1);
    });

    it("should update visibleStatementIndex when navigating to previous statement", () => {
      useCourseStore.getState().toSpecificStatement(3);
      useCourseStore.getState().toPreviousStatement();
      expect(useCourseStore.getState().getVisibleStatementIndex()).toBe(1);
    });

    it("should update visibleStatementIndex when jumping to a specific index", () => {
      useCourseStore.getState().toSpecificStatement(3);
      expect(useCourseStore.getState().getVisibleStatementIndex()).toBe(2);
    });

    it("should reset visibleStatementIndex on doAgain", () => {
      useCourseStore.getState().toSpecificStatement(3);
      useCourseStore.getState().doAgain();
      expect(useCourseStore.getState().getVisibleStatementIndex()).toBe(0);
    });

    it("should update visibleStatementIndex when adding a new mastered element", async () => {
      vi.mocked(postFetcher).mockResolvedValue({
        content: { english: "Hello" },
        masteredAt: new Date().toISOString(),
        id: "new-1",
      });

      await useMasteredElementsStore.getState().addElement({ english: "Hello" });
      useCourseStore.getState().updateMarketedStatements();
      useCourseStore.getState().toNextStatement();
      expect(useCourseStore.getState().getVisibleStatementIndex()).toBe(0);
      expect(useCourseStore.getState().statementIndex).toBe(2); // Now points to "Test"
    });

    it("should handle visibleStatementIndex when all statements are mastered", async () => {
      vi.mocked(getFetcher).mockImplementation(async (path: string) => {
        if (path.includes("/api/mastered-elements")) {
          return mockCourse.statements.map((s, index) => ({
            content: { english: s.english },
            masteredAt: new Date().toISOString(),
            id: String(index),
          }));
        }
        return {};
      });

      await useMasteredElementsStore.getState().setup();
      useCourseStore.getState().updateMarketedStatements();
      expect(useCourseStore.getState().getVisibleStatementIndex()).toBe(-1);
      expect(useCourseStore.getState().getVisibleStatementsCount()).toBe(0);
    });
  });

  describe("Course reset and completion", () => {
    it("should reset course state on doAgain", () => {
      useCourseStore.getState().toSpecificStatement(3);
      useCourseStore.getState().doAgain();
      expect(useCourseStore.getState().statementIndex).toBe(0);
      expect(useCourseStore.getState().getVisibleStatementIndex()).toBe(0);
    });

    it("should complete the course and fetch the next course", async () => {
      vi.mocked(postFetcher).mockResolvedValue({ nextCourse: { ...mockCourse, id: "2" } });
      const result = await useCourseStore.getState().completeCourse();
      expect(result).toEqual({ nextCourse: { ...mockCourse, id: "2" } });
    });
  });

  describe("Computed properties", () => {
    it("should return the correct current statement", () => {
      expect(useCourseStore.getState().getCurrentStatement()).toEqual(mockCourse.statements[0]);
    });

    it("should correctly split the current statement's English words", () => {
      expect(useCourseStore.getState().getWords()).toEqual(["Hello"]);
    });

    it("should return the correct total number of questions", () => {
      expect(useCourseStore.getState().getTotalQuestionsCount()).toBe(5);
    });
  });

  describe("Edge cases", () => {
    it("should handle an empty course", async () => {
      vi.mocked(getFetcher).mockResolvedValue({ ...mockCourse, statements: [] });
      vi.mocked(isAuthenticated).mockReturnValue(true);
      vi.mocked(setupAutoSaveProgress).mockReturnValue({
        debouncedSave: vi.fn(),
        cleanup: vi.fn(),
      });
      vi.mocked(getStatementIndex).mockReturnValue(0);

      await useCourseStore.getState().setup("pack1", "1");
      expect(useCourseStore.getState().getVisibleStatementsCount()).toBe(0);
      expect(useCourseStore.getState().isAllDone()).toBe(true);
      expect(useCourseStore.getState().isAllMastered()).toBe(true);
    });

    it("should handle a course with only one statement", async () => {
      vi.mocked(getFetcher).mockResolvedValue({
        ...mockCourse,
        statements: [mockCourse.statements[0]],
      });
      vi.mocked(isAuthenticated).mockReturnValue(true);
      vi.mocked(setupAutoSaveProgress).mockReturnValue({
        debouncedSave: vi.fn(),
        cleanup: vi.fn(),
      });
      vi.mocked(getStatementIndex).mockReturnValue(0);

      await useCourseStore.getState().setup("pack1", "1");
      expect(useCourseStore.getState().getTotalQuestionsCount()).toBe(1);
      expect(useCourseStore.getState().isLastStatement()).toBe(true);
    });
  });
});
