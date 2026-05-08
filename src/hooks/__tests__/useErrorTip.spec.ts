import { beforeEach, describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { SHOW_ERROR_TIP, useErrorTip } from "../useErrorTip";

describe("use errorTip", () => {
  beforeEach(() => {
    localStorage.removeItem(SHOW_ERROR_TIP);
  });

  it("should return true when localStorage is not defined", () => {
    const { result } = renderHook(() => useErrorTip());
    expect(result.current.isShowErrorTip()).toBeTruthy();
  });

  it("should be equal to cache value if it exists", () => {
    localStorage.setItem(SHOW_ERROR_TIP, "showErrorTip");
    const { result } = renderHook(() => useErrorTip());
    expect(result.current.isShowErrorTip()).toBeFalsy();
  });

  it("should be toggle value", () => {
    const { result } = renderHook(() => useErrorTip());
    expect(result.current.isShowErrorTip()).toBeTruthy();

    act(() => {
      result.current.toggleShowErrorTip();
    });

    expect(result.current.isShowErrorTip()).toBeFalsy();
  });
});
