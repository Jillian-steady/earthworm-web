import { beforeEach, describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { SPACE_SUBMIT_ANSWER, useSpaceSubmitAnswer } from "../useSubmitKey";

describe("submit shortcut", () => {
  beforeEach(() => {
    localStorage.removeItem(SPACE_SUBMIT_ANSWER);
  });

  it("should be false if no cache", () => {
    const { result } = renderHook(() => useSpaceSubmitAnswer());

    expect(result.current.isUseSpaceSubmitAnswer()).toBe(false);
  });

  it("should be equal to cache value if it exists", () => {
    localStorage.setItem(SPACE_SUBMIT_ANSWER, "true");

    const { result } = renderHook(() => useSpaceSubmitAnswer());

    expect(result.current.isUseSpaceSubmitAnswer()).toBe(true);
  });

  it("should be toggle value", () => {
    const { result } = renderHook(() => useSpaceSubmitAnswer());

    expect(result.current.isUseSpaceSubmitAnswer()).toBe(false);

    act(() => {
      result.current.toggleUseSpaceSubmitAnswer();
    });

    expect(result.current.isUseSpaceSubmitAnswer()).toBe(true);
  });
});
