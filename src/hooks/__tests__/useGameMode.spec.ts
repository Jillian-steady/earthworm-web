import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useGameMode } from "../useGameMode";

// Reset the store between tests
import { create } from "zustand";

describe("Game Mode Composable", () => {
  it("changes game mode to Answer", () => {
    const { result } = renderHook(() => useGameMode());

    act(() => {
      result.current.showAnswer();
    });

    expect(result.current.isAnswer()).toBe(true);
  });

  it("changes game mode back to Question", () => {
    const { result } = renderHook(() => useGameMode());

    act(() => {
      result.current.showAnswer();
    });
    act(() => {
      result.current.showQuestion();
    });

    expect(result.current.isQuestion()).toBe(true);
  });

  it("confirms isAnswer returns true only when game mode is Answer", () => {
    const { result } = renderHook(() => useGameMode());

    act(() => {
      result.current.showAnswer();
    });

    expect(result.current.isAnswer()).toBe(true);
    expect(result.current.isQuestion()).toBe(false);
  });

  it("confirms isQuestion returns true only when game mode is Question", () => {
    const { result } = renderHook(() => useGameMode());

    act(() => {
      result.current.showQuestion();
    });

    expect(result.current.isQuestion()).toBe(true);
    expect(result.current.isAnswer()).toBe(false);
  });
});
