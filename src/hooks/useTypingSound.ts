import { useCallback, useRef } from "react";

// Sound file paths - adjust these to your project's asset paths
const rightSoundPath = "/sounds/right.mp3";
const errorSoundPath = "/sounds/error.mp3";
const typingSoundPath = "/sounds/typing.mp3";

// Singleton audio instances for tip sounds
const rightAudio =
  typeof window !== "undefined" ? new Audio(rightSoundPath) : null;
const errorAudio =
  typeof window !== "undefined" ? new Audio(errorSoundPath) : null;

export function usePlayTipSound() {
  const playRightSound = useCallback(() => {
    rightAudio?.play();
  }, []);

  const playErrorSound = useCallback(() => {
    errorAudio?.play();
  }, []);

  return {
    playRightSound,
    playErrorSound,
  };
}

const PLAY_INTERVAL_TIME = 60;
let audioCtxRef: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;

async function loadAudioContext() {
  audioCtxRef = new AudioContext();
  const response = await fetch(typingSoundPath);
  const arrayBuffer = await response.arrayBuffer();
  if (!audioCtxRef) return;
  const decodedAudioData = await audioCtxRef.decodeAudioData(arrayBuffer);
  if (decodedAudioData) {
    audioBuffer = decodedAudioData;
  }
}

// Preload audio context
if (typeof window !== "undefined" && !audioCtxRef) {
  loadAudioContext();
}

export function useTypingSound() {
  const lastPlayTimeRef = useRef(0);

  const playTypingSound = useCallback(() => {
    const now = Date.now();
    if (now - lastPlayTimeRef.current < PLAY_INTERVAL_TIME) return;
    if (!audioCtxRef || !audioBuffer) return;

    const source = audioCtxRef.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtxRef.destination);
    source.start();
    lastPlayTimeRef.current = now;

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
