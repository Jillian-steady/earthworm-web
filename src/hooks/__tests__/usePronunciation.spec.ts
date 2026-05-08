import { beforeEach, describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { PronunciationType, usePronunciation } from "../usePronunciation";

const PRONUNCIATION_TYPE = "pronunciationType";

describe("pronunciation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("get default pronunciation if it was stored", () => {
    localStorage.setItem(PRONUNCIATION_TYPE, PronunciationType.British);

    const { result } = renderHook(() => usePronunciation());

    expect(result.current.pronunciation).toBe(PronunciationType.British);
    expect(localStorage.getItem(PRONUNCIATION_TYPE)).toBe(PronunciationType.British);
  });

  it("get default pronunciation if it wasn't stored", () => {
    const { result } = renderHook(() => usePronunciation());

    expect(result.current.pronunciation).toBe(PronunciationType.American);
    expect(localStorage.getItem(PRONUNCIATION_TYPE)).toBe(PronunciationType.American);
  });

  it("get pronunciation options", () => {
    const { result } = renderHook(() => usePronunciation());

    expect(result.current.getPronunciationOptions).toEqual([
      { label: "美音", value: "American" },
      { label: "英音", value: "British" },
    ]);
  });

  it("toggle pronunciation", () => {
    const { result } = renderHook(() => usePronunciation());

    act(() => {
      result.current.togglePronunciation(PronunciationType.British);
    });

    expect(result.current.pronunciation).toBe(PronunciationType.British);
    expect(localStorage.getItem(PRONUNCIATION_TYPE)).toBe(PronunciationType.British);
  });
});
