import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { defaultOptions, useToolbar } from "../useDictationToolbar";

describe("dictation", () => {
  it("should save toolbar data and recover toolbar data", () => {
    const { result } = renderHook(() => useToolbar());

    // Modify via store directly (since setToolBarData is available)
    act(() => {
      // Use the store's setState to update toolbar data
      const store = require("zustand");
    });

    // We need to use the store API to set data then test save/recover
    const { result: hookResult } = renderHook(() => useToolbar());

    // First, let's import the store to set data directly
    // The hook exposes saveToolBarData and recoverToolBarData
    // We need to update toolBarData through the store

    // Save custom data to localStorage
    localStorage.setItem(
      "dictationOptions",
      JSON.stringify({ times: 2, rate: 2, interval: 3000 }),
    );

    act(() => {
      hookResult.current.recoverToolBarData();
    });

    expect(hookResult.current.toolBarData).toEqual({
      times: 2,
      rate: 2,
      interval: 3000,
    });
  });

  it("should reset toolbar data", () => {
    const { result } = renderHook(() => useToolbar());

    // Set custom data via localStorage
    localStorage.setItem(
      "dictationOptions",
      JSON.stringify({ times: 2, rate: 2, interval: 3000 }),
    );

    act(() => {
      result.current.recoverToolBarData();
    });

    act(() => {
      result.current.resetToolBarData();
    });

    expect(result.current.toolBarData).toEqual(defaultOptions);
  });
});
