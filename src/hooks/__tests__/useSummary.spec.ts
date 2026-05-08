import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { resetSentenceLoading, useDailySentence, useSummary } from "../useSummary";

vi.mock("@/utils/fetcher");

import { getFetcher } from "@/utils/fetcher";

describe("summary", () => {
  describe("summary sentence", () => {
    const dummyRes = {
      en: "en",
      zh: "zh",
    };

    beforeEach(() => {
      resetSentenceLoading();
      vi.mocked(getFetcher).mockResolvedValue(dummyRes);
      return () => {
        resetSentenceLoading();
        vi.resetAllMocks();
      };
    });

    it("should load the daily sentence", async () => {
      const { result } = renderHook(() => useDailySentence());

      // Wait for async effect to complete and store to update
      await vi.waitFor(() => {
        expect(result.current.zhSentence).toBe(dummyRes.zh);
      });

      expect(result.current.enSentence).toBe(dummyRes.en);
    });

    it("should only load sentence once", async () => {
      renderHook(() => useDailySentence());

      await vi.waitFor(() => {
        expect(getFetcher).toBeCalledTimes(1);
      });

      renderHook(() => useDailySentence());

      // Should still only be called once
      expect(getFetcher).toBeCalledTimes(1);
    });
  });

  describe("summary modal control", () => {
    it("should show summary modal", () => {
      const { result } = renderHook(() => useSummary());

      act(() => {
        result.current.showSummary();
      });

      expect(result.current.showModal).toBeTruthy();
    });

    it("should hide summary modal", () => {
      const { result } = renderHook(() => useSummary());

      act(() => {
        result.current.hideSummary();
      });

      expect(result.current.showModal).toBeFalsy();
    });

    it("should return a same value in different hook", () => {
      const { result: result1 } = renderHook(() => useSummary());

      act(() => {
        result1.current.showSummary();
      });

      const { result: result2 } = renderHook(() => useSummary());
      expect(result2.current.showModal).toBeTruthy();
    });
  });
});
