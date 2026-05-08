import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useLearningTimeTracker } from "../useLearningTimeTracker";

vi.mock("@/stores/user", () => ({
  useUserStore: Object.assign(
    vi.fn(() => ({
      user: { id: "testUser" },
    })),
    {
      getState: () => ({
        user: { id: "testUser" },
      }),
    },
  ),
}));

vi.mock("@/utils/fetcher", () => ({
  postFetcher: vi.fn(),
  getFetcher: vi.fn(),
  putFetcher: vi.fn(),
}));

import { postFetcher } from "@/utils/fetcher";

describe("useLearningTimeTracker", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should initialize with zero seconds and not tracking", () => {
    const { result } = renderHook(() => useLearningTimeTracker());

    expect(result.current.totalSeconds).toBe(0);
    expect(result.current.isTracking).toBe(false);
  });

  it("should start tracking when startTracking is called", () => {
    const { result } = renderHook(() => useLearningTimeTracker());

    act(() => {
      result.current.startTracking();
    });

    expect(result.current.isTracking).toBe(true);

    // Clean up
    act(() => {
      result.current.stopTracking();
    });
  });

  it("should stop tracking when stopTracking is called", () => {
    const { result } = renderHook(() => useLearningTimeTracker());

    act(() => {
      result.current.startTracking();
    });
    act(() => {
      result.current.stopTracking();
    });

    expect(result.current.isTracking).toBe(false);
  });

  it("should increment totalSeconds every second when tracking", () => {
    const { result } = renderHook(() => useLearningTimeTracker());

    act(() => {
      result.current.startTracking();
    });
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.totalSeconds).toBe(3);

    act(() => {
      result.current.stopTracking();
    });
  });

  it("should save time to localStorage every 30 seconds", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    const { result } = renderHook(() => useLearningTimeTracker());

    act(() => {
      result.current.startTracking();
    });
    act(() => {
      vi.advanceTimersByTime(30000);
    });

    expect(setItemSpy).toHaveBeenCalledWith(expect.any(String), "30");

    act(() => {
      result.current.stopTracking();
    });
  });

  it("should load time from localStorage when starting tracking", () => {
    const date = new Date().toISOString().split("T")[0];
    localStorage.setItem(`learningTime_testUser_${date}`, "50");

    const { result } = renderHook(() => useLearningTimeTracker());

    act(() => {
      result.current.startTracking();
    });

    expect(result.current.totalSeconds).toBe(50);

    act(() => {
      result.current.stopTracking();
    });
  });

  it("should not start tracking if already tracking", () => {
    const { result } = renderHook(() => useLearningTimeTracker());

    act(() => {
      result.current.startTracking();
    });

    const initialSeconds = result.current.totalSeconds;

    act(() => {
      result.current.startTracking(); // try to start again
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.totalSeconds).toBe(initialSeconds + 1); // only increased by 1

    act(() => {
      result.current.stopTracking();
    });
  });

  it("should upload time when stopping tracking", () => {
    const { result } = renderHook(() => useLearningTimeTracker());

    act(() => {
      result.current.startTracking();
    });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    act(() => {
      result.current.stopTracking();
    });

    expect(postFetcher).toHaveBeenCalledWith(
      "/api/user-learning-activities",
      expect.objectContaining({
        date: expect.any(String),
        duration: 5,
      }),
    );
  });

  it("should reset totalSeconds to zero when a new day starts", () => {
    const day1 = new Date("2023-07-23T12:00:00");
    vi.setSystemTime(day1);

    const { result } = renderHook(() => useLearningTimeTracker());

    act(() => {
      result.current.startTracking();
    });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    act(() => {
      result.current.stopTracking();
    });

    expect(result.current.totalSeconds).toBe(5);

    // Move to next day
    const day2 = new Date("2023-07-24T12:00:00");
    vi.setSystemTime(day2);

    act(() => {
      result.current.startTracking();
    });

    // Should reset to 0 for the new day
    expect(result.current.totalSeconds).toBe(0);

    act(() => {
      result.current.stopTracking();
    });
  });
});
