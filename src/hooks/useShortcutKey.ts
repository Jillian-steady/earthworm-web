import { useState, useCallback, useMemo } from "react";

export enum SHORTCUT_KEY_TYPES {
  SOUND = "sound",
  ANSWER = "answer",
  SKIP = "skip",
  PREVIOUS = "previous",
  MASTERED = "mastered",
  PAUSE = "pause",
}

export const SHORTCUT_KEYS = "shortcutKeys";
export const DEFAULT_SHORTCUT_KEYS: { [key: string]: string } = {
  sound: "Ctrl+'",
  answer: "Ctrl+;",
  skip: "Ctrl+.",
  previous: "Ctrl+,",
  mastered: "Ctrl+m",
  pause: "Ctrl+p",
};

export const KEYBOARD = {
  ESC: "Esc",
  ALT: "Alt",
  CTRL: "Ctrl",
  META: "Meta",
  SHIFT: "Shift",
  ENTER: "Enter",
  COMMAND: "Command",
  CONTROL: "Control",
};

export const SPECIAL_KEYS = new Map([
  [KEYBOARD.ALT, true],
  [KEYBOARD.CTRL, true],
  [KEYBOARD.CONTROL, true],
  [KEYBOARD.SHIFT, true],
  [KEYBOARD.META, true],
  [KEYBOARD.COMMAND, true],
]);

export function convertMacKey(key: string): string {
  return (
    ({
      [KEYBOARD.CONTROL]: KEYBOARD.CTRL,
      [KEYBOARD.META]: KEYBOARD.COMMAND,
    } as Record<string, string>)[key] || key
  );
}

export function parseShortcut(shortcut: string): string[] {
  return shortcut
    .split("+")
    .map((key) => key.trim().charAt(0).toUpperCase() + key.slice(1).toLowerCase());
}

function loadShortcutKeysFromStorage(): { [key: string]: string } {
  if (typeof window === "undefined") return { ...DEFAULT_SHORTCUT_KEYS };
  const localKeys = localStorage.getItem(SHORTCUT_KEYS);
  if (localKeys) {
    return { ...DEFAULT_SHORTCUT_KEYS, ...JSON.parse(localKeys) };
  }
  localStorage.setItem(SHORTCUT_KEYS, JSON.stringify(DEFAULT_SHORTCUT_KEYS));
  return { ...DEFAULT_SHORTCUT_KEYS };
}

export function useShortcutKeyMode() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentKeyType, setCurrentKeyType] = useState<SHORTCUT_KEY_TYPES | "">("");
  const [shortcutKeyStr, setShortcutKeyStr] = useState<string>("");
  const [shortcutKeys, setShortcutKeys] = useState<{ [key: string]: string }>(
    loadShortcutKeysFromStorage,
  );
  const [hasSameShortcutKey, setHasSameShortcutKey] = useState<boolean>(false);

  const shortcutKeyTip = useMemo(() => {
    return shortcutKeyStr.replace(/\+/g, "+");
  }, [shortcutKeyStr]);

  const handleEdit = useCallback((type: SHORTCUT_KEY_TYPES) => {
    setShowModal(true);
    setShortcutKeyStr("");
    setCurrentKeyType(type);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setShowModal(false);
    setHasSameShortcutKey(false);
  }, []);

  const getKeyModifier = useCallback((e: KeyboardEvent): string => {
    if (e.altKey) return KEYBOARD.ALT;
    if (e.shiftKey) return KEYBOARD.SHIFT;
    if (e.ctrlKey) return KEYBOARD.CTRL;
    if (e.metaKey) return KEYBOARD.COMMAND;
    return "";
  }, []);

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (!showModal) return;

      e.preventDefault();

      if (e.key === "Escape") {
        handleCloseDialog();
        return;
      }

      const mainKey = getKeyModifier(e);
      if (!mainKey && e.key === KEYBOARD.ENTER) {
        const keys = Object.values(shortcutKeys);
        const currentShortcutKey = shortcutKeys[currentKeyType];
        const hasSame = keys.some(
          (x) => x === shortcutKeyStr && x !== currentShortcutKey,
        );

        if (hasSame) {
          setHasSameShortcutKey(true);
        } else {
          // Save
          const trimmed = shortcutKeyStr.trim();
          if (trimmed) {
            const newKeys = { ...shortcutKeys, [currentKeyType]: trimmed };
            setShortcutKeys(newKeys);
            localStorage.setItem(SHORTCUT_KEYS, JSON.stringify(newKeys));
          }
          handleCloseDialog();
        }
        return;
      }

      const key = convertMacKey(e.key);
      if (SPECIAL_KEYS.has(e.key) || !mainKey) {
        setShortcutKeyStr(key);
      } else {
        setShortcutKeyStr(`${mainKey}+${key}`);
      }
    },
    [
      showModal,
      shortcutKeys,
      currentKeyType,
      shortcutKeyStr,
      handleCloseDialog,
      getKeyModifier,
    ],
  );

  const reset = useCallback(() => {
    setShowModal(false);
    setCurrentKeyType("");
    setShortcutKeyStr("");
    setShortcutKeys({ ...DEFAULT_SHORTCUT_KEYS });
    setHasSameShortcutKey(false);
    localStorage.removeItem(SHORTCUT_KEYS);
  }, []);

  return {
    showModal,
    shortcutKeys,
    shortcutKeyStr,
    shortcutKeyTip,
    hasSameShortcutKey,
    handleKeydown,
    handleEdit,
    handleCloseDialog,
    reset,
  };
}
