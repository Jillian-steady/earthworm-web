import { useRef, useState, useCallback } from "react";
import { create } from "zustand";

// Shared state for question input focus
interface QuestionInputState {
  inputEl: HTMLInputElement | null;
  focusing: boolean;
  setInputEl: (el: HTMLInputElement | null) => void;
  setFocusing: (val: boolean) => void;
}

export const useQuestionInputStore = create<QuestionInputState>((set) => ({
  inputEl: null,
  focusing: true,
  setInputEl: (el) => set({ inputEl: el }),
  setFocusing: (val) => set({ focusing: val }),
}));

export function useQuestionInput() {
  const focusInput = useCallback(() => {
    const { inputEl } = useQuestionInputStore.getState();
    useQuestionInputStore.getState().setFocusing(true);
    inputEl?.focus();
  }, []);

  const blurInput = useCallback(() => {
    const { inputEl } = useQuestionInputStore.getState();
    useQuestionInputStore.getState().setFocusing(false);
    inputEl?.blur();
  }, []);

  const setInputCursorPosition = useCallback((position: number) => {
    const { inputEl } = useQuestionInputStore.getState();
    inputEl?.setSelectionRange(position, position);
  }, []);

  const getInputCursorPosition = useCallback(() => {
    const { inputEl } = useQuestionInputStore.getState();
    return inputEl?.selectionStart || 0;
  }, []);

  return {
    focusInput,
    blurInput,
    setInputCursorPosition,
    getInputCursorPosition,
  };
}

export function getWordWidth(word: string) {
  const ZERO_POINT_FIVE = 0.5;
  const ZERO_POINT_SIX = 0.6;
  const ZERO_POINT_SEVEN = 0.7;
  const ZERO_POINT_EIGHT = 0.8;
  const ZERO_POINT_NINE = 0.9;
  const ONE_POINT_ONE = 1.1;
  const ONE_POINT_FIVE = 1.5;
  const OTHER_LETTER_WIDTH = 1;

  const letterWidths: { [key: string]: number } = {
    w: ONE_POINT_FIVE,
    m: ONE_POINT_FIVE,
    s: ZERO_POINT_EIGHT,
    t: ZERO_POINT_SEVEN,
    r: ZERO_POINT_SEVEN,
    f: ZERO_POINT_SEVEN,
    j: ZERO_POINT_SIX,
    i: ZERO_POINT_FIVE,
    l: ZERO_POINT_FIVE,
    u: ONE_POINT_ONE,
    o: ONE_POINT_ONE,
    p: ONE_POINT_ONE,
    q: ONE_POINT_ONE,
    n: ONE_POINT_ONE,
    h: ONE_POINT_ONE,
    g: ONE_POINT_ONE,
    d: ONE_POINT_ONE,
    b: ONE_POINT_ONE,
    z: ZERO_POINT_NINE,
    y: ZERO_POINT_NINE,
    x: ZERO_POINT_NINE,
    v: ZERO_POINT_NINE,
    c: ZERO_POINT_NINE,
    "'": ZERO_POINT_FIVE,
  };

  const width = word
    .toLocaleLowerCase()
    .split("")
    .reduce(
      (totalWidth, letter) =>
        totalWidth + (letterWidths[letter] || OTHER_LETTER_WIDTH),
      0,
    );

  return width + 1;
}

export function isWord(content: string) {
  return /[a-zA-Z0-9]/.test(content);
}
