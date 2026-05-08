import { useCallback, useRef } from "react";
import { create } from "zustand";

import { isWord } from "./useQuestionInput";

// Word interface
export interface Word {
  text: string;
  isActive: boolean;
  userInput: string;
  incorrect: boolean;
  end: number;
  start: number;
  position: number;
  id: number;
}

enum Mode {
  Input = "input",
  Fix = "fix",
  Fix_Input = "fix-input",
}

const separator = " ";

// Global state for question input
interface InputLogicState {
  inputValue: string;
  mode: Mode;
  userInputWords: Word[];
  currentEditWordId: number | null;
  setInputValue: (val: string) => void;
  setMode: (mode: Mode) => void;
  setUserInputWords: (words: Word[]) => void;
  setCurrentEditWordId: (id: number | null) => void;
}

export const useInputLogicStore = create<InputLogicState>((set) => ({
  inputValue: "",
  mode: Mode.Input,
  userInputWords: [],
  currentEditWordId: null,
  setInputValue: (val) => set({ inputValue: val }),
  setMode: (mode) => set({ mode }),
  setUserInputWords: (words) => set({ userInputWords: words }),
  setCurrentEditWordId: (id) => set({ currentEditWordId: id }),
}));

interface InputOptions {
  source: () => string;
  setInputCursorPosition: (position: number) => void;
  getInputCursorPosition: () => number;
  inputChangedCallback?: (e: KeyboardEvent) => void;
}

export function useInputLogic({
  source,
  setInputCursorPosition,
  getInputCursorPosition,
  inputChangedCallback,
}: InputOptions) {
  const store = useInputLogicStore;

  function createWord(word: string, id: number): Word {
    return {
      text: word,
      isActive: false,
      userInput: "",
      incorrect: false,
      start: 0,
      end: 0,
      position: 0,
      id,
    };
  }

  function setupUserInputWords() {
    const english = source();
    if (!english) return;

    const words: Word[] = [];
    let inputWordIndex = 0;

    english.split(separator).forEach((text, index) => {
      if (isWord(text)) {
        const word = createWord(text, index);
        words[inputWordIndex] = word;
        if (inputWordIndex === 0) {
          words[0].isActive = true;
        }
        inputWordIndex++;
      }
    });

    store.getState().setUserInputWords(words);
  }

  function initialize() {
    store.getState().setMode(Mode.Input);
    store.getState().setUserInputWords([]);
    store.getState().setInputValue("");
    setupUserInputWords();
    updateActiveWord(getInputCursorPosition());
  }

  function setInputValueAndSync(val: string) {
    store.getState().setInputValue(val);
    resetAllWordUserInput();
    inputSyncUserInputWords(val);
    updateActiveWord(val ? getInputCursorPosition() : 0);
  }

  function userInputWordsSyncInput() {
    const words = store.getState().userInputWords;
    const newValue = words.map(({ userInput }) => userInput).join(separator);
    store.getState().setInputValue(newValue);
  }

  function inputSyncUserInputWords(val?: string) {
    const inputVal = val ?? store.getState().inputValue;
    const words = [...store.getState().userInputWords];
    let position = 0;

    inputVal.split(separator).forEach((input, index) => {
      if (words[index]) {
        words[index] = {
          ...words[index],
          userInput: input,
          start: position,
          end: position + input.length,
        };
      }
      position += input.length + 1;
    });

    store.getState().setUserInputWords(words);
  }

  function resetAllWordUserInput() {
    const words = store.getState().userInputWords.map((w) => ({
      ...w,
      userInput: "",
    }));
    store.getState().setUserInputWords(words);
  }

  function resetAllWordActive() {
    const words = store.getState().userInputWords.map((w) => ({
      ...w,
      isActive: false,
    }));
    store.getState().setUserInputWords(words);
  }

  function updateActiveWord(position: number) {
    const words = store.getState().userInputWords.map((w) => ({
      ...w,
      isActive: false,
    }));

    for (let i = 0; i < words.length; i++) {
      if (position >= words[i].start && position <= words[i].end) {
        words[i].isActive = true;
        break;
      }
    }

    store.getState().setUserInputWords(words);
  }

  function checkWordCorrect() {
    return store.getState().userInputWords.every((w) => !w.incorrect);
  }

  function formatInputText(word: string) {
    return word.toLocaleLowerCase().replace(/\u2018|\u2019|\u201C|\u201D|\u0022/g, "'");
  }

  function formatLastWordUserInput(word: Word, index: number, words: Word[]) {
    const isLastWord = words.length - 1 === index;
    if (isLastWord && word.userInput.endsWith(".")) {
      return { ...word, userInput: word.userInput.slice(0, -1) };
    }
    return word;
  }

  function markIncorrectWord() {
    const words = store.getState().userInputWords.map((word, index) => {
      const formatted = formatLastWordUserInput(
        word,
        index,
        store.getState().userInputWords,
      );
      const formattedInput = formatInputText(formatted.userInput);
      const incorrect =
        formattedInput !== formatted.text.toLocaleLowerCase();
      return { ...formatted, incorrect };
    });
    store.getState().setUserInputWords(words);
  }

  function lastWordIsActive() {
    const words = store.getState().userInputWords;
    return words[words.length - 1]?.isActive;
  }

  function getCurrentEditWord(): Word | undefined {
    const id = store.getState().currentEditWordId;
    if (id === null) return undefined;
    return store.getState().userInputWords.find((w) => w.id === id);
  }

  function findNextIncorrectWordNew(): Word | undefined {
    const currentWord = getCurrentEditWord();
    if (!currentWord) return undefined;

    const words = store.getState().userInputWords;
    const wordIndex = words.findIndex((w) => w.id === currentWord.id);

    for (let i = wordIndex + 1; i < words.length; i++) {
      if (words[i].incorrect) {
        return words[i];
      }
    }
    return undefined;
  }

  function isLastIncorrectWord() {
    return !findNextIncorrectWordNew();
  }

  function getFirstIncorrectWord(): Word | undefined {
    return store.getState().userInputWords.find((w) => w.incorrect);
  }

  function clearNextIncorrectWord(word: Word) {
    const words = store.getState().userInputWords.map((w) =>
      w.id === word.id ? { ...w, userInput: "" } : w,
    );
    store.getState().setUserInputWords(words);
    store.getState().setCurrentEditWordId(word.id);

    // Sync input value
    const newValue = words.map(({ userInput }) => userInput).join(separator);
    store.getState().setInputValue(newValue);

    // Use requestAnimationFrame to set cursor after DOM update
    requestAnimationFrame(() => {
      setInputCursorPosition(word.start);
      updateActiveWord(word.start);
    });
  }

  function submitAnswer(
    correctCallback?: () => void,
    wrongCallback?: () => void,
  ) {
    if (store.getState().mode === Mode.Fix) return;

    resetAllWordActive();
    markIncorrectWord();

    if (checkWordCorrect()) {
      store.getState().setMode(Mode.Input);
      correctCallback?.();
      store.getState().setInputValue("");
    } else {
      store.getState().setMode(Mode.Fix);
      wrongCallback?.();
    }
  }

  function fixFirstIncorrectWord() {
    if (store.getState().mode === Mode.Fix) {
      store.getState().setMode(Mode.Fix_Input);
      const firstIncorrect = getFirstIncorrectWord();
      if (firstIncorrect) {
        clearNextIncorrectWord(firstIncorrect);
      }
    }
  }

  function fixNextIncorrectWord() {
    if (store.getState().mode === Mode.Fix_Input) {
      const next = findNextIncorrectWordNew();
      if (next) {
        clearNextIncorrectWord(next);
      }
    }
  }

  function fixIncorrectWord() {
    if (store.getState().mode === Mode.Fix) {
      fixFirstIncorrectWord();
    } else if (store.getState().mode === Mode.Fix_Input) {
      fixNextIncorrectWord();
    }
  }

  function isEmptyOfCurrentEditWord() {
    const word = getCurrentEditWord();
    return word ? word.userInput.length <= 0 : true;
  }

  function findPreviousIncorrectWord(): Word | undefined {
    const currentWord = getCurrentEditWord();
    if (!currentWord) return undefined;

    const words = store.getState().userInputWords;
    const wordIndex = words.findIndex((w) => w.id === currentWord.id);

    for (let i = wordIndex - 1; i >= 0; i--) {
      if (words[i].incorrect) {
        return words[i];
      }
    }
    return undefined;
  }

  function activePreviousIncorrectWord() {
    const prev = findPreviousIncorrectWord();
    if (prev) {
      store.getState().setCurrentEditWordId(prev.id);
      requestAnimationFrame(() => {
        updateActiveWord(prev.end);
        setInputCursorPosition(prev.end);
      });
    }
  }

  interface KeyboardInputOptions {
    useSpaceSubmitAnswer?: {
      enable: boolean;
      rightCallback?: () => void;
      errorCallback?: () => void;
    };
  }

  function handleSpaceSubmitAnswer(
    useSpaceSubmitAnswer: KeyboardInputOptions["useSpaceSubmitAnswer"],
  ) {
    if (useSpaceSubmitAnswer?.enable) {
      submitAnswer(
        () => useSpaceSubmitAnswer.rightCallback?.(),
        () => useSpaceSubmitAnswer.errorCallback?.(),
      );
    }
  }

  function handleKeyboardInput(
    e: KeyboardEvent,
    options?: KeyboardInputOptions,
  ) {
    // Prevent arrow key movement
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)
    ) {
      e.preventDefault();
      return;
    }

    const currentMode = store.getState().mode;

    // Fix_Input/Input: space submit at last word
    if (
      currentMode !== Mode.Fix &&
      e.code === "Space" &&
      lastWordIsActive()
    ) {
      e.preventDefault();
      e.stopPropagation();
      handleSpaceSubmitAnswer(options?.useSpaceSubmitAnswer);
      return;
    }

    // Fix mode: any key fixes first incorrect word
    if (currentMode === Mode.Fix) {
      if (e.code === "Space" || e.code === "Backspace") {
        e.preventDefault();
      }
      fixFirstIncorrectWord();
      inputChangedCallback?.(e);
      return;
    }

    // Fix_Input: space submit at last incorrect word
    if (
      currentMode === Mode.Fix_Input &&
      e.code === "Space" &&
      isLastIncorrectWord()
    ) {
      e.preventDefault();
      e.stopPropagation();
      handleSpaceSubmitAnswer(options?.useSpaceSubmitAnswer);
      return;
    }

    // Fix_Input: backspace on empty current word goes to previous incorrect
    if (
      currentMode === Mode.Fix_Input &&
      e.code === "Backspace" &&
      isEmptyOfCurrentEditWord()
    ) {
      e.preventDefault();
      activePreviousIncorrectWord();
      inputChangedCallback?.(e);
      return;
    }

    // Space fixes word in Fix/Fix_Input modes
    if (currentMode !== Mode.Input && e.code === "Space") {
      e.preventDefault();
      fixIncorrectWord();
      inputChangedCallback?.(e);
      return;
    }

    inputChangedCallback?.(e);
  }

  function isFixMode() {
    return store.getState().mode === Mode.Fix;
  }

  function isFixInputMode() {
    return store.getState().mode === Mode.Fix_Input;
  }

  function findWordById(id: number): Word | undefined {
    return store.getState().userInputWords.find((word) => word.id === id);
  }

  return {
    initialize,
    findWordById,
    submitAnswer,
    setInputValue: setInputValueAndSync,
    handleKeyboardInput,
    isFixMode,
    isFixInputMode,
  };
}
