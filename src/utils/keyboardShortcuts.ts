export interface Shortcut {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  command: (keyboardEvent: KeyboardEvent) => void;
}

const shortcuts: Shortcut[] = [];

// Convert Mac special modifier keys
// Control -> Ctrl, Meta -> Command, others unchanged
function convertMacKey(key: string): string {
  return (
    {
      Control: "Ctrl",
      Meta: "Command",
    }[key] || key
  );
}

if (typeof window !== "undefined") {
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    const matchingShortcuts = findMatchingShortcut(e);

    matchingShortcuts.forEach((shortcut) => {
      shortcut.command(e);
    });
  });
}

function parseKey(keyString: string) {
  const keys = keyString.toLowerCase().split("+");

  const result = {
    key: keys[keys.length - 1],
    ctrlKey: keys.includes("ctrl"),
    metaKey: keys.includes("command"),
  };

  return result;
}

function findMatchingShortcut(event: KeyboardEvent): Shortcut[] {
  return shortcuts.filter((shortcut) => {
    const preciseMatching =
      shortcut.ctrlKey === event.ctrlKey &&
      shortcut.metaKey === event.metaKey &&
      shortcut.key === convertMacKey(event.key).toLowerCase();

    const anyMatching = shortcut.key === "*";

    return preciseMatching || anyMatching;
  });
}

export function parseShortcutKeys(shortcutKeys: string, separator: string = "+") {
  return shortcutKeys.split(separator).map((key) => (key.length === 1 ? key.toUpperCase() : key));
}

export function createShortcut(key: string, command: Shortcut["command"]): Shortcut {
  return {
    ...parseKey(key),
    command,
  };
}

export function registerShortcut(key: string, command: Shortcut["command"]) {
  const shortcut = createShortcut(key, command);
  shortcuts.push(shortcut);
  return shortcut;
}

export function cancelShortcut(key: string, command: Shortcut["command"]): void;
export function cancelShortcut(shortcut: Shortcut): void;
export function cancelShortcut(key: string): void;
export function cancelShortcut(keyOrShortcut: string | Shortcut, command?: Shortcut["command"]) {
  function normalizeShortcut(): Shortcut | Partial<Shortcut> {
    if (typeof keyOrShortcut === "object") {
      return keyOrShortcut;
    }
    return command ? createShortcut(keyOrShortcut, command) : parseKey(keyOrShortcut);
  }

  const normalShortcut = normalizeShortcut();

  if (typeof keyOrShortcut === "string" && !command) {
    for (let i = shortcuts.length - 1; i >= 0; i--) {
      if (
        shortcuts[i].key === normalShortcut!.key &&
        shortcuts[i].ctrlKey === normalShortcut!.ctrlKey &&
        shortcuts[i].metaKey === normalShortcut!.metaKey
      ) {
        shortcuts.splice(i, 1);
      }
    }
    return;
  }

  const index = shortcuts.findIndex(({ key, command, ctrlKey, metaKey }) => {
    return (
      key === normalShortcut.key &&
      ctrlKey === normalShortcut.ctrlKey &&
      metaKey === normalShortcut.metaKey &&
      command === normalShortcut.command
    );
  });

  if (index !== -1) {
    shortcuts.splice(index, 1);
  }
}

export function cleanAllShortcut() {
  shortcuts.length = 0;
}
