import { useCallback, useEffect, useRef } from "react";

import type { PlayOptions } from "@/utils/audio";
import {
  getPronunciationUrl,
  play,
  updateSource,
} from "@/utils/audio";
import { useCourseStore } from "@/stores/course";
import { useToolbar } from "@/hooks/useDictationToolbar";

export function useCurrentStatementEnglishSound() {
  const lastUrlRef = useRef("");
  const { toolBarData } = useToolbar();

  // Sync audio source with current statement
  useEffect(() => {
    const update = () => {
      const currentStatement = useCourseStore.getState().getCurrentStatement();
      const word = currentStatement?.english;
      const pronunciationUrl = getPronunciationUrl(word);
      if (lastUrlRef.current !== pronunciationUrl) {
        updateSource(pronunciationUrl);
      }
      lastUrlRef.current = pronunciationUrl;
    };

    // Initial update
    update();

    // Subscribe to course store changes
    const unsubscribe = useCourseStore.subscribe(update);
    return () => unsubscribe();
  }, []);

  const playSound = useCallback(
    (options?: PlayOptions) => {
      // For now, always use toolbar data (dictation mode can be extended)
      return play(options || {
        times: toolBarData.times,
        rate: toolBarData.rate,
        interval: toolBarData.interval,
      });
    },
    [toolBarData],
  );

  return {
    playSound,
  };
}

export function readOneSentencePerDayAloud(str: string) {
  const pronunciationUrl = getPronunciationUrl(str);
  updateSource(pronunciationUrl);
  play();
}

export function playEnglish(english: string) {
  const pronunciationUrl = getPronunciationUrl(english);
  updateSource(pronunciationUrl);
  play();
}
