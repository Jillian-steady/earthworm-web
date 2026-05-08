import { beforeEach, describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";

import {
  DEFAULT_SHORTCUT_KEYS,
  SHORTCUT_KEY_TYPES,
  SHORTCUT_KEYS,
  useShortcutKeyMode,
} from "@/hooks/useShortcutKey";

describe("user defined shortcut key", () => {
  beforeEach(() => {
    localStorage.removeItem(SHORTCUT_KEYS);
  });

  describe("shortcut key data", () => {
    it("should be the default shortcut key data if localStorage no cache", () => {
      const { result } = renderHook(() => useShortcutKeyMode());

      expect(result.current.shortcutKeys).toEqual(DEFAULT_SHORTCUT_KEYS);
    });

    it("should be equal to cache data if localStorage has cache", () => {
      const storeShortcutKeys = {
        sound: "Ctrl+s",
        previous: "Ctrl+,",
        answer: "Ctrl+8",
        skip: "Ctrl+.",
        mastered: "Ctrl+m",
        pause: "Ctrl+p",
      };

      localStorage.setItem(SHORTCUT_KEYS, JSON.stringify(storeShortcutKeys));
      const { result } = renderHook(() => useShortcutKeyMode());

      expect(result.current.shortcutKeys).toEqual(storeShortcutKeys);
    });
  });

  describe("shortcut dialog", () => {
    it("should be true when edit shortcut key", () => {
      const { result } = renderHook(() => useShortcutKeyMode());

      act(() => {
        result.current.handleEdit(SHORTCUT_KEY_TYPES.SOUND);
      });

      expect(result.current.showModal).toBeTruthy();
    });

    it("should be close the dialog when press Enter key", () => {
      const { result } = renderHook(() => useShortcutKeyMode());

      act(() => {
        result.current.handleEdit(SHORTCUT_KEY_TYPES.SOUND);
      });

      act(() => {
        result.current.handleKeydown({
          key: "Enter",
          preventDefault: () => {},
        } as KeyboardEvent);
      });

      expect(result.current.showModal).toBeFalsy();
    });
  });

  describe("shortcut key set", () => {
    it("should be the shortcut key set invalid when the dialog is not open", () => {
      const { result } = renderHook(() => useShortcutKeyMode());

      act(() => {
        result.current.handleKeydown({
          key: "s",
          ctrlKey: true,
          preventDefault: () => {},
        } as KeyboardEvent);
      });

      expect(result.current.shortcutKeyStr).toBe("");
    });

    it("should be the shortcut key is changed when the dialog is open", () => {
      const { result } = renderHook(() => useShortcutKeyMode());

      act(() => {
        result.current.handleEdit(SHORTCUT_KEY_TYPES.SOUND);
      });

      act(() => {
        result.current.handleKeydown({
          key: "s",
          ctrlKey: true,
          preventDefault: () => {},
        } as KeyboardEvent);
      });

      expect(result.current.shortcutKeyStr).toEqual("Ctrl+s");
      expect(result.current.shortcutKeyTip).toEqual("Ctrl+s");
    });

    it("should be the shortcut key is set successfully when the dialog is open (single key)", () => {
      const { result } = renderHook(() => useShortcutKeyMode());

      act(() => {
        result.current.handleEdit(SHORTCUT_KEY_TYPES.SOUND);
      });

      act(() => {
        result.current.handleKeydown({
          key: "Tab",
          preventDefault: () => {},
        } as KeyboardEvent);
      });
      act(() => {
        result.current.handleKeydown({
          key: "Enter",
          preventDefault: () => {},
        } as KeyboardEvent);
      });

      expect(result.current.shortcutKeys).toMatchObject({
        [SHORTCUT_KEY_TYPES.SOUND]: "Tab",
      });
      expect(localStorage.getItem(SHORTCUT_KEYS)).toMatchInlineSnapshot(
        `"{"sound":"Tab","answer":"Ctrl+;","skip":"Ctrl+.","previous":"Ctrl+,","mastered":"Ctrl+m","pause":"Ctrl+p"}"`,
      );
    });

    it("should be the shortcut key is set successfully when the dialog is open (combination key)", () => {
      const { result } = renderHook(() => useShortcutKeyMode());

      act(() => {
        result.current.handleEdit(SHORTCUT_KEY_TYPES.ANSWER);
      });

      act(() => {
        result.current.handleKeydown({
          key: "s",
          ctrlKey: true,
          preventDefault: () => {},
        } as KeyboardEvent);
      });
      act(() => {
        result.current.handleKeydown({
          key: "Enter",
          preventDefault: () => {},
        } as KeyboardEvent);
      });

      expect(result.current.shortcutKeys).toMatchObject({
        [SHORTCUT_KEY_TYPES.ANSWER]: "Ctrl+s",
      });
      expect(localStorage.getItem(SHORTCUT_KEYS)).toMatchInlineSnapshot(
        `"{"sound":"Ctrl+'","answer":"Ctrl+s","skip":"Ctrl+.","previous":"Ctrl+,","mastered":"Ctrl+m","pause":"Ctrl+p"}"`,
      );
    });

    it("should be not set successfully with the same shortcut", () => {
      const { result } = renderHook(() => useShortcutKeyMode());

      // First, set ANSWER to Command+s
      act(() => {
        result.current.handleEdit(SHORTCUT_KEY_TYPES.ANSWER);
      });
      act(() => {
        result.current.handleKeydown({
          key: "s",
          metaKey: true,
          preventDefault: () => {},
        } as KeyboardEvent);
      });
      act(() => {
        result.current.handleKeydown({
          key: "Enter",
          preventDefault: () => {},
        } as KeyboardEvent);
      });

      expect(result.current.hasSameShortcutKey).toBeFalsy();
      expect(result.current.showModal).toBeFalsy();
      expect(result.current.shortcutKeys).toMatchObject({
        [SHORTCUT_KEY_TYPES.ANSWER]: "Command+s",
      });

      // Now try to set SOUND to Command+s (same key - should fail)
      act(() => {
        result.current.handleEdit(SHORTCUT_KEY_TYPES.SOUND);
      });

      expect(result.current.showModal).toBeTruthy();

      act(() => {
        result.current.handleKeydown({
          key: "s",
          metaKey: true,
          preventDefault: () => {},
        } as KeyboardEvent);
      });
      act(() => {
        result.current.handleKeydown({
          key: "Enter",
          preventDefault: () => {},
        } as KeyboardEvent);
      });

      expect(result.current.hasSameShortcutKey).toBeTruthy();
      expect(result.current.showModal).toBeTruthy();
      expect(result.current.shortcutKeys).toMatchObject({
        [SHORTCUT_KEY_TYPES.ANSWER]: "Command+s",
        [SHORTCUT_KEY_TYPES.SOUND]: "Ctrl+'",
      });
    });

    it("should be the shortcut key is set successfully with the same key", () => {
      const { result } = renderHook(() => useShortcutKeyMode());

      act(() => {
        result.current.handleEdit(SHORTCUT_KEY_TYPES.ANSWER);
      });

      expect(result.current.showModal).toBeTruthy();

      act(() => {
        result.current.handleKeydown({
          key: ";",
          ctrlKey: true,
          preventDefault: () => {},
        } as KeyboardEvent);
      });
      act(() => {
        result.current.handleKeydown({
          key: "Enter",
          preventDefault: () => {},
        } as KeyboardEvent);
      });

      expect(result.current.hasSameShortcutKey).toBeFalsy();
      expect(result.current.showModal).toBeFalsy();
      expect(result.current.shortcutKeys).toMatchObject({
        [SHORTCUT_KEY_TYPES.ANSWER]: "Ctrl+;",
      });
    });
  });
});
