export interface PlayOptions {
  times?: number;
  rate?: number;
  interval?: number;
}

const DefaultPlayOptions = {
  times: 1,
  rate: 1,
  interval: 500,
};

// Module-level audio instance for sentence playback
const audio = new Audio();

export function updateSource(src: string) {
  audio.src = src;
  audio.load();
}

export function play(playOptions?: PlayOptions): () => void {
  const { times, rate, interval } = Object.assign(
    {},
    DefaultPlayOptions,
    playOptions,
  );

  audio.playbackRate = rate;
  audio.play();

  if (times > 1) {
    audio.addEventListener("ended", handleEnded, false);
  }

  let index = 1;
  let timeoutId: ReturnType<typeof setTimeout>;

  function handleEnded() {
    timeoutId = setTimeout(() => {
      if (index < times) {
        audio.play();
        index++;
      } else {
        index = 1;
        audio.removeEventListener("ended", handleEnded);
      }
    }, interval);
  }

  return () => {
    audio.pause();
    audio.currentTime = 0;
    audio.removeEventListener("ended", handleEnded);
    if (timeoutId) clearTimeout(timeoutId);
  };
}

export function getPronunciationUrl(word?: string): string {
  if (!word) return "";
  // Use a standard TTS API; adjust based on actual backend
  return `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=1`;
}

export function createWordPlayer() {
  const wordAudio = new Audio();
  let lastWord = "";
  let isPlaying = false;

  wordAudio.onplay = () => {
    isPlaying = true;
  };

  wordAudio.onended = () => {
    isPlaying = false;
  };

  function handlePlayWordSound(word: string) {
    if (isPlaying && lastWord === word) {
      return;
    }
    lastWord = word;
    wordAudio.src = getPronunciationUrl(word);
    wordAudio.play();
  }

  return { handlePlayWordSound };
}
