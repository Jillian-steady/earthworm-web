import { beforeEach, describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { AUTO_NEXT_QUESTION, useAutoNextQuestion } from "../useAutoNext";

describe("use auto next question", () => {
  beforeEach(() => {
    localStorage.removeItem(AUTO_NEXT_QUESTION);
  });

  it("should return false when localStorage is not defined", () => {
    const { result } = renderHook(() => useAutoNextQuestion());

    expect(result.current.isAutoNextQuestion()).toBeFalsy();
  });

  it("should be equal to cache value if it exists", () => {
    localStorage.setItem(AUTO_NEXT_QUESTION, "true");

    const { result } = renderHook(() => useAutoNextQuestion());

    expect(result.current.isAutoNextQuestion()).toBeTruthy();
  });

  it("should be toggle value", () => {
    const { result } = renderHook(() => useAutoNextQuestion());

    expect(result.current.isAutoNextQuestion()).toBeFalsy();

    act(() => {
      result.current.toggleAutoQuestion();
    });

    expect(result.current.isAutoNextQuestion()).toBeTruthy();
  });
});
