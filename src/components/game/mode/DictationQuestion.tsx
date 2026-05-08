"use client";

import { useEffect, useRef } from "react";

import { usePronunciation } from "@/hooks/usePronunciation";
import { useCourseStore } from "@/stores/course";

import QuestionInput from "../QuestionInput";

export default function DictationQuestion() {
  const { getPronunciationUrl } = usePronunciation();
  const currentStatement = useCourseStore((s) => s.getCurrentStatement());
  const statementIndex = useCourseStore((s) => s.statementIndex);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = () => {
    if (!currentStatement?.english) return;
    const url = getPronunciationUrl(currentStatement.english);

    // Stop previous audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play().catch(() => {});
    return () => {
      audio.pause();
    };
  };

  // Play sound when statement becomes available or changes
  useEffect(() => {
    const cleanup = playSound();
    return () => {
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStatement?.english]);

  return (
    <div>
      <QuestionInput />
    </div>
  );
}
