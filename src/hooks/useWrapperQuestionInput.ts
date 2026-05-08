import { useCallback } from "react";

import { useGameMode } from "@/hooks/useGameMode";
import { useInput } from "@/hooks/useQuestionInput";
import { useSummary } from "@/hooks/useSummary";
import { useAnswerError } from "@/hooks/useAnswerError";
import { usePlayTipSound, useTypingSound } from "@/hooks/useTypingSound";
import { useQuestionInputElement } from "@/utils/questionInputHelper";
import { useCourseStore } from "@/stores/course";

export function useWrapperQuestionInput() {
  const { showAnswer } = useGameMode();
  const { showSummary } = useSummary();
  const {
    setInputCursorPosition,
    getInputCursorPosition,
    blurInput,
    focusInput,
  } = useQuestionInputElement();
  const { checkPlayTypingSound, playTypingSound } = useTypingSound();
  const { handleAnswerError } = useAnswerError();
  const { playRightSound } = usePlayTipSound();

  // TODO: integrate with user settings for keyboard sound, auto next, space submit
  const isKeyboardSoundEnabled = useCallback(() => true, []);
  const isAutoNextQuestion = useCallback(() => false, []);
  const isUseSpaceSubmitAnswer = useCallback(() => true, []);

  function inputChangedCallback(e: KeyboardEvent) {
    if (isKeyboardSoundEnabled() && checkPlayTypingSound(e)) {
      playTypingSound();
    }
  }

  const {
    initialize: initializeQuestionInput,
    findWordById,
    inputValue,
    submitAnswer: rawSubmitAnswer,
    setInputValue,
    handleKeyboardInput: rawHandleKeyboardInput,
    isFixMode,
    isFixInputMode,
  } = useInput({
    source: () =>
      useCourseStore.getState().getCurrentStatement()?.english ?? "",
    setInputCursorPosition,
    getInputCursorPosition,
    inputChangedCallback,
  });

  const handleAnswerRight = useCallback(() => {
    playRightSound();

    if (isAutoNextQuestion()) {
      const courseStore = useCourseStore.getState();
      if (courseStore.isAllDone()) {
        blurInput();
        showSummary();
      }
      courseStore.toNextStatement();
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
    [
      rawHandleKeyboardInput,
      isUseSpaceSubmitAnswer,
      handleAnswerRight,
      handleAnswerError,
    ],
  );

  return {
    initializeQuestionInput,
    isFixMode,
    isFixInputMode,
    findWordById,
    inputValue,
    setInputValue,
    submitAnswer,
    handleKeyboardInput,
  };
}
