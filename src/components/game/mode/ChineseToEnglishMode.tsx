"use client";

import { useAnswerTip } from "@/hooks/useAnswerTip";
import { useGameMode } from "@/hooks/useGameMode";

import Answer from "../Answer";
import AnswerTip from "../AnswerTip";
import ChineseToEnglishQuestion from "./ChineseToEnglishQuestion";

export default function ChineseToEnglishMode() {
  const { isAnswer, isQuestion } = useGameMode();
  const { isAnswerTip } = useAnswerTip();

  return (
    <div className="flex h-full items-center justify-center">
      {isQuestion() && (
        <>
          <ChineseToEnglishQuestion />
          {isAnswerTip() && <AnswerTip />}
        </>
      )}
      {isAnswer() && <Answer />}
    </div>
  );
}
