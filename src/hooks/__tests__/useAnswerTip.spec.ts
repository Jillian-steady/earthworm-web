import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useAnswerTip } from "../useAnswerTip";

describe("answer tip", () => {
  it("show answer tip modal", () => {
    const { result } = renderHook(() => useAnswerTip());

    act(() => {
      result.current.showAnswerTip();
    });

    expect(result.current.isAnswerTip()).toBe(true);
  });

  it("hidden answer tip modal", () => {
    const { result } = renderHook(() => useAnswerTip());

    act(() => {
      result.current.hiddenAnswerTip();
    });

    expect(result.current.isAnswerTip()).toBe(false);
  });
});
