import { useCallback, useRef } from "react";

// Tip sounds
let rightAudio: HTMLAudioElement | null = null;
let errorAudio: HTMLAudioElement | null = null;

function getRightAudio() {
  if (!rightAudio && typeof window !== "undefined") {
    rightAudio = new Audio("/sounds/right.mp3");
  }
  return rightAudio;
}

function getErrorAudio() {
  if (!errorAudio && typeof window !== "undefined") {
    errorAudio = new Audio("/sounds/error.mp3");
  }
  return errorAudio;
}

export function usePlayTipSound() {
  const playRightSound = useCallback(() => {
    const audio = getRightAudio();
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, []);

  const playErrorSound = useCallback(() => {
    const audio = getErrorAudio();
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, []);

  return {
    playRightSound,
    playErrorSound,
  };
}

// Typing sound
const PLAY_INTERVAL_TIME = 60;
let audioCtxRef: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;
let lastPlayTime = 0;

async function loadAudioContext() {
  audioCtxRef = new AudioContext();
  try {
    const response = await fetch("/sounds/typing.mp3");
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioCtxRef.decodeAudioData(arrayBuffer);
  } catch {
    // Silently fail if sound file not available
  }
}

export function useTypingSound() {
  // Initialize audio context on first use
  if (!audioCtxRef && typeof window !== "undefined") {
    loadAudioContext();
  }

  const playTypingSound = useCallback(async () => {
    const now = Date.now();
    if (now - lastPlayTime < PLAY_INTERVAL_TIME) return;
    if (!audioCtxRef || !audioBuffer) return;

    // Resume suspended AudioContext (browser autoplay policy)
    if (audioCtxRef.state === "suspended") {
      try {
        await audioCtxRef.resume();
      } catch {
        return;
      }
    }

    const source = audioCtxRef.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtxRef.destination);
    source.start();
    lastPlayTime = now;

    source.onended = () => {
      source.disconnect();
    };
  }, []);

  const checkPlayTypingSound = useCallback((e: KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return false;
    if (
      /^[a-zA-Z0-9]$/.test(e.key) ||
      ["Backspace", " ", "'"].includes(e.key)
    ) {
      return true;
    }
    return false;
  }, []);

  return {
    playTypingSound,
    checkPlayTypingSound,
  };
}
