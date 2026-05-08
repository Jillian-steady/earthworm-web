import { beforeEach, describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { SHOW_WORDS_WIDTH, useShowWordsWidth } from "../useShowWordsWidth";

describe("use words", () => {
  beforeEach(() => {
    localStorage.removeItem(SHOW_WORDS_WIDTH);
  });

  it("should return true when localStorage is not defined", () => {
    const { result } = renderHook(() => useShowWordsWidth());

    expect(result.current.isShowWordsWidth()).toBeTruthy();
  });

  it("should be equal to cache value if it exists", () => {
    localStorage.setItem(SHOW_WORDS_WIDTH, "false");

    const { result } = renderHook(() => useShowWordsWidth());

    expect(result.current.isShowWordsWidth()).toBeFalsy();
  });

  it("should be toggle value", () => {
    const { result } = renderHook(() => useShowWordsWidth());

    expect(result.current.isShowWordsWidth()).toBeTruthy();

    act(() => {
      result.current.toggleAutoWordsWidth();
    });

    expect(result.current.isShowWordsWidth()).toBeFalsy();
  });
});
