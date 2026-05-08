import { beforeEach, describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";

import {
  AUTO_PLAYENGLISH,
  AUTO_PRONUNCIATION,
  KEYBOARD_SOUND_KEY,
  useAutoPlayEnglish,
  useAutoPronunciation,
  useKeyboardSound,
} from "../useSound";

describe("auto play sound", () => {
  beforeEach(() => {
    localStorage.removeItem(AUTO_PRONUNCIATION);
  });

  it("should be true if no cache", () => {
    const { result } = renderHook(() => useAutoPronunciation());

    expect(result.current.isAutoPlaySound()).toBe(true);
  });

  it("should be equal to cache value if it exists", () => {
    localStorage.setItem(AUTO_PRONUNCIATION, "false");

    const { result } = renderHook(() => useAutoPronunciation());

    expect(result.current.isAutoPlaySound()).toBe(false);
  });

  it("should be toggle value", () => {
    const { result } = renderHook(() => useAutoPronunciation());

    expect(result.current.isAutoPlaySound()).toBe(true);

    act(() => {
      result.current.toggleAutoPlaySound();
    });

    expect(result.current.isAutoPlaySound()).toBe(false);
  });
});

describe("keyboard sound", () => {
  beforeEach(() => {
    localStorage.removeItem(KEYBOARD_SOUND_KEY);
  });

  it("should be true if no cache", () => {
    const { result } = renderHook(() => useKeyboardSound());

    expect(result.current.isKeyboardSoundEnabled()).toBe(true);
  });

  it("should be equal to cache value if it exists", () => {
    localStorage.setItem(KEYBOARD_SOUND_KEY, "false");

    const { result } = renderHook(() => useKeyboardSound());

    expect(result.current.isKeyboardSoundEnabled()).toBe(false);
  });

  it("should be toggle value", () => {
    const { result } = renderHook(() => useKeyboardSound());

    expect(result.current.isKeyboardSoundEnabled()).toBe(true);

    act(() => {
      result.current.toggleKeyboardSound();
    });

    expect(result.current.isKeyboardSoundEnabled()).toBe(false);
  });
});

describe("auto play english", () => {
  beforeEach(() => {
    localStorage.removeItem(AUTO_PLAYENGLISH);
  });

  it("should be true if no cache", () => {
    const { result } = renderHook(() => useAutoPlayEnglish());

    expect(result.current.isAutoPlayEnglish()).toBe(true);
  });

  it("should be equal to cache value if it exists", () => {
    localStorage.setItem(AUTO_PLAYENGLISH, "false");
    const { result } = renderHook(() => useAutoPlayEnglish());

    expect(result.current.isAutoPlayEnglish()).toBe(false);
  });

  it("should be toggle value", () => {
    const { result } = renderHook(() => useAutoPlayEnglish());

    expect(result.current.isAutoPlayEnglish()).toBe(true);

    act(() => {
      result.current.toggleAutoPlayEnglish();
    });

    expect(result.current.isAutoPlayEnglish()).toBe(false);
  });
});
