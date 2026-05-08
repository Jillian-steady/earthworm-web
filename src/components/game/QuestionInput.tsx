"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useMemo } from "react";

import { courseTimer } from "@/hooks/useCourseTimer";
import { useAnswerTip } from "@/hooks/useAnswerTip";
import { useShowWordsWidth } from "@/hooks/useShowWordsWidth";
import { usePronunciation } from "@/hooks/usePronunciation";
import { useCourseStore } from "@/stores/course";
import { isWindows } from "@/utils/platform";
import {
  useQuestionInput,
  useQuestionInputStore,
  getWordWidth,
  isWord,
} from "./hooks/useQuestionInput";
import { useWrapperQuestionInput } from "./hooks/useWrapperQuestionInput";
import { useAnswerError } from "./hooks/useAnswerError";
import { useInputLogicStore } from "./hooks/useInputLogic";

import MasteredBtn from "./MasteredBtn";

export default function QuestionInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false);

  const currentStatement = useCourseStore((s) => s.getCurrentStatement());
  const statementIndex = useCourseStore((s) => s.statementIndex);
  const words = useMemo(() => currentStatement?.english.split(" ") || [], [currentStatement]);
  const setInputEl = useQuestionInputStore((s) => s.setInputEl);
  const focusing = useQuestionInputStore((s) => s.focusing);

  const { focusInput, blurInput } = useQuestionInput();
  const {
    initializeQuestionInput,
    findWordById,
    isFixMode,
    inputValue,
    submitAnswer,
    handleKeyboardInput,
    setInputValue,
  } = useWrapperQuestionInput();

  const { isShowWordsWidth } = useShowWordsWidth();
  const { toggleAnswerTip, isAnswerTip } = useAnswerTip();
  const { resetCloseTip } = useAnswerError();

  const userInputWords = useInputLogicStore((s) => s.userInputWords);

  // Set the input element ref in the store
  useEffect(() => {
    if (inputRef.current) {
      setInputEl(inputRef.current);
    }
    return () => {
      setInputEl(null);
    };
  }, [setInputEl]);

  // Initialize on mount
  useEffect(() => {
    initializeQuestionInput();
    focusInput();
    resetCloseTip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-initialize when statement changes
  useEffect(() => {
    initializeQuestionInput();
    focusInput();
    resetCloseTip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statementIndex]);

  // Focus input when window receives focus
  useEffect(() => {
    const handleFocus = () => {
      focusInput();
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [focusInput]);

  // Handle input value change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      courseTimer.time(String(statementIndex));
    },
    [setInputValue, statementIndex],
  );

  const { getPronunciationUrl } = usePronunciation();
  const handlePlaySound = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const english = useCourseStore.getState().getCurrentStatement()?.english;
      if (english) {
        const url = getPronunciationUrl(english);
        const audio = new Audio(url);
        audio.play().catch(() => {});
      }
    },
    [getPronunciationUrl],
  );

  const handleShowAnswerTip = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      toggleAnswerTip();
    },
    [toggleAnswerTip],
  );

  const handleSubmitAnswer = useCallback(() => {
    submitAnswer();
  }, [submitAnswer]);

  const getWordsClassNames = useCallback(
    (index: number) => {
      const word = userInputWords.find((w) => w.id === index);
      if (!word) return "text-[#20202099] border-b-gray-300 dark:text-gray-300 dark:border-b-gray-400";

      if (word.isActive && focusing) {
        return "text-fuchsia-500 border-b-fuchsia-500";
      }

      if (word.incorrect && focusing) {
        return `text-red-500 border-b-red-500 ${isFixMode() ? "animate-shake" : ""}`;
      }

      return "text-[#20202099] border-b-gray-300 dark:text-gray-300 dark:border-b-gray-400";
    },
    [userInputWords, focusing, isFixMode],
  );

  const getInputWidth = useCallback(
    (word: string) => {
      if (!isShowWordsWidth()) {
        return 4;
      }
      return getWordWidth(word);
    },
    [isShowWordsWidth],
  );

  const handleKeydown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Windows ctrl+backspace support
      if (e.code === "Backspace" && e.ctrlKey && isWindows()) {
        e.preventDefault();
        deletePreviousWordOnWin();
        return;
      }

      // Prevent ctrl key from interfering with IME
      if (e.ctrlKey) {
        e.preventDefault();
        return;
      }

      if (e.code === "Enter" && !isComposingRef.current) {
        e.stopPropagation();
        submitAnswer();
        return;
      }

      handleKeyboardInput(e.nativeEvent);
    },
    [submitAnswer, handleKeyboardInput],
  );

  const deletePreviousWordOnWin = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;

    let start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    if (end === 0) return;

    const currentVal = useInputLogicStore.getState().inputValue;

    while (start > 0 && currentVal[start - 1] === " ") {
      start--;
    }
    const valueToCursor = currentVal.substring(0, start);
    const newEnd = valueToCursor.lastIndexOf(" ") + 1 || 0;
    const newVal = currentVal.substring(0, newEnd);
    setInputValue(newVal);
    input.setSelectionRange(newEnd, newEnd);
  }, [setInputValue]);

  const preventCursorMove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      focusInput();
    },
    [focusInput],
  );

  // Use the memoized words for rendering
  const courseWords = words;

  return (
    <div className="text-center">
      <div className="relative flex flex-wrap justify-center gap-2 transition-all">
        {courseWords.map((w, i) =>
          isWord(w) ? (
            <div
              key={i}
              className={`h-[4rem] rounded-[2px] border-b-2 border-solid text-[3em] leading-none transition-all ${getWordsClassNames(i)}`}
              style={{ minWidth: `${getInputWidth(w)}ch` }}
            >
              {userInputWords.find((uw) => uw.id === i)?.userInput || ""}
            </div>
          ) : (
            <div
              key={i}
              className="h-[4rem] rounded-[2px] text-[3em] leading-none transition-all"
            >
              {w}
            </div>
          ),
        )}
        <input
          lang="en"
          ref={inputRef}
          className="absolute h-full w-full opacity-0"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeydown}
          onFocus={() => useQuestionInputStore.getState().setFocusing(true)}
          onBlur={() => useQuestionInputStore.getState().setFocusing(false)}
          onDoubleClick={(e) => e.preventDefault()}
          onMouseDown={preventCursorMove}
          onCompositionStart={() => {
            isComposingRef.current = true;
          }}
          onCompositionEnd={() => {
            isComposingRef.current = false;
          }}
          autoFocus
        />
      </div>
      <div className="mt-12 flex flex-col items-center justify-center gap-4 md:hidden">
        <button
          className="btn btn-outline btn-sm"
          onClick={handleSubmitAnswer}
        >
          提交
        </button>
        <div className="flex gap-4">
          <button
            className="btn btn-outline btn-sm"
            onClick={handleShowAnswerTip}
          >
            {isAnswerTip() ? "隐藏" : "显示"}答案
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={handlePlaySound}
          >
            播放声音
          </button>
        </div>
        <MasteredBtn />
      </div>
    </div>
  );
}
