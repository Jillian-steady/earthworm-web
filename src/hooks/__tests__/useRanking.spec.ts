import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import type { ProgressRank } from "@/types";
import { useRanking } from "../useRanking";

vi.mock("@/utils/fetcher");

import { getFetcher } from "@/utils/fetcher";

const weeklyList: ProgressRank = {
  list: [{ username: "user1", count: 1 }],
  self: { username: "user1", count: 1, rank: 1 },
  period: "weekly",
};

const monthlyList: ProgressRank = {
  list: [{ username: "user2", count: 2 }],
  self: { username: "user2", count: 2, rank: 1 },
  period: "monthly",
};

const yearlyList: ProgressRank = {
  list: [{ username: "user3", count: 3 }],
  self: { username: "user3", count: 3, rank: 1 },
  period: "yearly",
};

function rankList(period: string): ProgressRank {
  return period === "weekly" ? weeklyList : period === "monthly" ? monthlyList : yearlyList;
}

describe("rank list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getFetcher).mockImplementation(async (path: string) => {
      const period = path.split("/").pop() || "weekly";
      return rankList(period);
    });
  });

  describe("rank modal", () => {
    it("initial the weekly rank list when the modal was showed", async () => {
      const { result } = renderHook(() => useRanking());

      await act(async () => {
        await result.current.showRankModal();
      });

      expect(result.current.rankModal).toBe(true);
      expect(result.current.rankingList).toEqual(weeklyList.list);
      expect(result.current.rankingSelf).toEqual(weeklyList.self);
    });

    it("hide the modal", async () => {
      const { result } = renderHook(() => useRanking());

      await act(async () => {
        await result.current.showRankModal();
      });

      act(() => {
        result.current.hideRankModal();
      });

      expect(result.current.rankModal).toBe(false);
    });
  });

  describe("toggle period", () => {
    it("toggle monthly period", async () => {
      const { result } = renderHook(() => useRanking());

      // Show modal first to initialize
      await act(async () => {
        await result.current.showRankModal();
      });

      act(() => {
        result.current.togglePeriod("monthly");
      });

      // Wait for the useEffect to fetch monthly data
      await vi.waitFor(() => {
        expect(result.current.currentPeriod).toBe("monthly");
        expect(result.current.rankingList).toEqual(monthlyList.list);
      });
    });
  });
});
