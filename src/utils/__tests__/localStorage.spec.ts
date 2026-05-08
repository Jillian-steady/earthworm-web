import { beforeEach, describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useLocalStorageBoolean } from "../localStorage";

describe("localStorage boolean", () => {
  const key = "localStorageBooleanTest";

  beforeEach(() => {
    localStorage.removeItem(key);
  });

  it("should be true if no cache", () => {
    const { result } = renderHook(() => useLocalStorageBoolean(key, true));

    expect(result.current.isTrue()).toBe(true);
  });

  it("should be false if no cache", () => {
    const { result } = renderHook(() => useLocalStorageBoolean(key, false));

    expect(result.current.isTrue()).toBe(false);
  });

  it("should be equal to cache value if it exists", () => {
    localStorage.setItem(key, "false");

    const { result } = renderHook(() => useLocalStorageBoolean(key, true));

    expect(result.current.value).toBe(false);
  });

  it("should be toggle value", () => {
    const { result } = renderHook(() => useLocalStorageBoolean(key, true));

    expect(result.current.value).toBe(true);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.value).toBe(false);
  });
});
