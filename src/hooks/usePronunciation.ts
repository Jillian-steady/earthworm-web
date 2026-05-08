import { useState, useCallback, useMemo } from "react";

export enum PronunciationType {
  American = "American",
  British = "British",
}

export const pronunciationLabels: { [key in PronunciationType]: string } = {
  [PronunciationType.American]: "美音",
  [PronunciationType.British]: "英音",
};

const PRONUNCIATION_TYPE = "pronunciationType";

export function usePronunciation() {
  const [pronunciation, setPronunciation] = useState<PronunciationType>(() => {
    if (typeof window === "undefined") return PronunciationType.American;
    const stored = localStorage.getItem(PRONUNCIATION_TYPE) as PronunciationType | null;
    const value = stored || PronunciationType.American;
    localStorage.setItem(PRONUNCIATION_TYPE, value);
    return value;
  });

  const getPronunciationType = useCallback((): number => {
    return pronunciation === PronunciationType.American ? 2 : 1;
  }, [pronunciation]);

  const getPronunciationOptions = useMemo(() => {
    return Object.entries(pronunciationLabels).map(([key, value]) => ({
      label: value,
      value: key,
    }));
  }, []);

  const getPronunciationUrl = useCallback(
    (english: string | undefined): string => {
      const type = pronunciation === PronunciationType.American ? 2 : 1;
      return `https://dict.youdao.com/dictvoice?type=${type}&audio=${english}`;
    },
    [pronunciation],
  );

  const togglePronunciation = useCallback(
    (type: PronunciationType) => {
      if (type !== pronunciation) {
        setPronunciation(type);
        localStorage.setItem(PRONUNCIATION_TYPE, type);
      }
    },
    [pronunciation],
  );

  return {
    pronunciation,
    getPronunciationType,
    getPronunciationOptions,
    getPronunciationUrl,
    togglePronunciation,
  };
}
