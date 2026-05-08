import { useCallback } from "react";

import { courseTimer } from "@/hooks/useCourseTimer";
import { useGameMode } from "@/hooks/useGameMode";
import { useSummary } from "@/hooks/useSummary";
import { useAutoNextQuestion } from "@/hooks/useAutoNext";
import { useKeyboardSound } from "@/hooks/useSound";
import { useSpaceSubmitAnswer } from "@/hooks/useSubmitKey";
import { useCourseStore } from "@/stores/course";
import { useQuestionInput } from "./useQuestionInput";
import { useInputLogic, useInputLogicStore } from "./useInputLogic";
import { useAnswerError } from "./useAnswerError";
import { useTypingSound, usePlayTipSound } from "./useTypingSound";

export function useWrapperQuestionInput() {
  const { showAnswer } = useGameMode();
  const { showSummary } = useSummary();
  const { setInputCursorPosition, getInputCursorPosition, blurInput, focusInput } =
    useQuestionInput();
  const { isKeyboardSoundEnabled } = useKeyboardSound();
  const { checkPlayTypingSound, playTypingSound } = useTypingSound();
  const { handleAnswerError } = useAnswerError();
  const { playRightSound } = usePlayTipSound();
  const { isAutoNextQuestion } = useAutoNextQuestion();
  const { isUseSpaceSubmitAnswer } = useSpaceSubmitAnswer();

  const inputChangedCallback = useCallback(
    (e: KeyboardEvent) => {
      if (isKeyboardSoundEnabled() && checkPlayTypingSound(e)) {
        playTypingSound();
      }
    },
    [isKeyboardSoundEnabled, checkPlayTypingSound, playTypingSound],
  );

  const {
    initialize: initializeQuestionInput,
    findWordById,
    submitAnswer: rawSubmitAnswer,
    setInputValue,
    handleKeyboardInput: rawHandleKeyboardInput,
    isFixMode,
    isFixInputMode,
  } = useInputLogic({
    source: () => useCourseStore.getState().getCurrentStatement()?.english || "",
    setInputCursorPosition,
    getInputCursorPosition,
    inputChangedCallback,
  });

  const handleAnswerRight = useCallback(() => {
    const state = useCourseStore.getState();
    courseTimer.timeEnd(String(state.statementIndex));
    playRightSound();

    if (isAutoNextQuestion()) {
      if (state.isAllDone()) {
        blurInput();
        showSummary();
      }
      state.toNextStatement();
    } else {
      showAnswer();
    }
  }, [playRightSound, isAutoNextQuestion, blurInput, showSummary, showAnswer]);

  const submitAnswer = useCallback(() => {
    rawSubmitAnswer(handleAnswerRight, handleAnswerError);
    focusInput();
  }, [rawSubmitAnswer, handleAnswerRight, handleAnswerError, focusInput]);

  const handleKeyboardInput = useCallback(
    (e: KeyboardEvent) => {
      rawHandleKeyboardInput(e, {
        useSpaceSubmitAnswer: {
          enable: isUseSpaceSubmitAnswer(),
          rightCallback: handleAnswerRight,
          errorCallback: handleAnswerError,
        },
      });
    },
    [rawHandleKeyboardInput, isUseSpaceSubmitAnswer, handleAnswerRight, handleAnswerError],
  );

  return {
    initializeQuestionInput,
    isFixMode,
    isFixInputMode,
    findWordById,
    inputValue: useInputLogicStore((s) => s.inputValue),
    setInputValue,
    submitAnswer,
    handleKeyboardInput,
  };
}
