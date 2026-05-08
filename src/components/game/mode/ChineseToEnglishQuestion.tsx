"use client";

import { useEffect } from "react";

import { usePronunciation } from "@/hooks/usePronunciation";
import { useAutoPlayEnglish } from "@/hooks/useSound";
import { useCourseStore } from "@/stores/course";

import QuestionInput from "../QuestionInput";

export default function ChineseToEnglishQuestion() {
  const currentStatement = useCourseStore((s) => s.getCurrentStatement());
  const statementIndex = useCourseStore((s) => s.statementIndex);
  const { getPronunciationUrl } = usePronunciation();
  const { isAutoPlayEnglish } = useAutoPlayEnglish();

  // Auto play when statement becomes available or changes
  useEffect(() => {
    if (isAutoPlayEnglish() && currentStatement?.english) {
      const url = getPronunciationUrl(currentStatement.english);
      const audio = new Audio(url);
      audio.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStatement?.english]);

  return (
    <div className="text-center">
      <div className="mb-4 mt-10 text-2xl dark:text-gray-50">
        {currentStatement?.chinese || "生存还是毁灭，这是一个问题"}
      </div>
      <QuestionInput />
    </div>
  );
}
