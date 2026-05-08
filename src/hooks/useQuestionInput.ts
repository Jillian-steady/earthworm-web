import { useCallback, useRef } from "react";
import { create } from "zustand";

// --- Word types ---

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

interface InputOptions {
  source: () => string;
  setInputCursorPosition: (position: number) => void;
  getInputCursorPosition: () => number;
  inputChangedCallback?: (e: KeyboardEvent) => void;
}

enum Mode {
  Input = "input",
  Fix = "fix",
  Fix_Input = "fix-input",
}

const separator = " ";

// --- Global input store ---

interface QuestionInputState {
  inputValue: string;
  setInputValue: (value: string) => void;
}

const useQuestionInputStore = create<QuestionInputState>((set) => ({
  inputValue: "",
  setInputValue: (value: string) => set({ inputValue: value }),
}));

export function clearQuestionInput() {
  useQuestionInputStore.getState().setInputValue("");
}

export function isWord(content: string) {
  return /[a-zA-Z0-9]/.test(content);
}

// --- Keyboard input options ---

export interface KeyboardInputOptions {
  useSpaceSubmitAnswer?: {
    enable: boolean;
    rightCallback?: () => void;
    errorCallback?: () => void;
  };
}

// --- Main useInput hook ---

export function useInput({
  source,
  setInputCursorPosition,
  getInputCursorPosition,
  inputChangedCallback,
}: InputOptions) {
  const { inputValue, setInputValue: setStoreInputValue } =
    useQuestionInputStore();

  const modeRef = useRef<Mode>(Mode.Input);
  const currentEditWordRef = useRef<Word | null>(null);
  const userInputWordsRef = useRef<Word[]>([]);

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

    userInputWordsRef.current = words;
  }

  function resetAllWordActive() {
    userInputWordsRef.current.forEach((word) => {
      word.isActive = false;
    });
  }

  function resetAllWordUserInput() {
    userInputWordsRef.current.forEach((word) => {
      word.userInput = "";
    });
  }

  function updateActiveWord(position: number) {
    resetAllWordActive();
    for (let i = 0; i < userInputWordsRef.current.length; i++) {
      const word = userInputWordsRef.current[i];
      if (position >= word.start && position <= word.end) {
        word.isActive = true;
        break;
      }
    }
  }

  function userInputWordsSyncInput() {
    const val = userInputWordsRef.current
      .map(({ userInput }) => userInput)
      .join(separator);
    setStoreInputValue(val);
  }

  function inputSyncUserInputWords(val: string) {
    let position = 0;
    val.split(separator).forEach((input, index) => {
      if (userInputWordsRef.current[index]) {
        userInputWordsRef.current[index].userInput = input;
        userInputWordsRef.current[index].start = position;
        userInputWordsRef.current[index].end = position + input.length;
        position += input.length + 1;
      }
    });
  }

  function formatInputText(word: string) {
    return word.toLocaleLowerCase().replace(/\u2018|\u2019|\u201C|\u201D|"/g, "'");
  }

  function formatLastWordUserInput(word: Word, index: number) {
    const isLastWord = userInputWordsRef.current.length - 1 === index;
    if (isLastWord) {
      if (word.userInput.endsWith(".")) {
        word.userInput = word.userInput.slice(0, -1);
      }
    }
  }

  function markIncorrectWord() {
    userInputWordsRef.current.forEach((word, index) => {
      formatLastWordUserInput(word, index);
      const formattedWord = formatInputText(word.userInput);
      if (formattedWord !== word.text.toLocaleLowerCase()) {
        word.incorrect = true;
      } else {
        word.incorrect = false;
      }
    });
  }

  function checkWordCorrect() {
    return userInputWordsRef.current.every((w) => !w.incorrect);
  }

  function lastWordIsActive() {
    const len = userInputWordsRef.current.length;
    return userInputWordsRef.current[len - 1]?.isActive ?? false;
  }

  function findNextIncorrectWordNew() {
    if (!currentEditWordRef.current) return;
    const wordIndex = userInputWordsRef.current.findIndex(
      (w) => w.id === currentEditWordRef.current!.id,
    );
    const len = userInputWordsRef.current.length;
    for (let i = wordIndex + 1; i < len; i++) {
      if (userInputWordsRef.current[i].incorrect) {
        return userInputWordsRef.current[i];
      }
    }
  }

  function isLastIncorrectWord() {
    return !findNextIncorrectWordNew();
  }

  function getFirstIncorrectWord() {
    return userInputWordsRef.current.find((w) => w.incorrect);
  }

  function clearNextIncorrectWord(word: Word) {
    word.userInput = "";
    currentEditWordRef.current = word;
    userInputWordsSyncInput();

    // Use setTimeout(0) as a React-compatible alternative to Vue's nextTick
    setTimeout(() => {
      setInputCursorPosition(word.start);
      updateActiveWord(word.start);
    }, 0);
  }

  function findPreviousIncorrectWord() {
    if (!currentEditWordRef.current) return;
    const wordIndex = userInputWordsRef.current.findIndex(
      (w) => w.id === currentEditWordRef.current!.id,
    );
    for (let i = wordIndex - 1; i >= 0; i--) {
      if (userInputWordsRef.current[i].incorrect) {
        return userInputWordsRef.current[i];
      }
    }
  }

  function activePreviousIncorrectWord() {
    const previousIncorrectWord = findPreviousIncorrectWord();
    if (previousIncorrectWord) {
      currentEditWordRef.current = previousIncorrectWord;
      setTimeout(() => {
        updateActiveWord(previousIncorrectWord.end);
        setInputCursorPosition(previousIncorrectWord.end);
      }, 0);
    }
  }

  // --- Public API ---

  const initialize = useCallback(() => {
    modeRef.current = Mode.Input;
    userInputWordsRef.current = [];
    setupUserInputWords();
    updateActiveWord(getInputCursorPosition());
  }, []);

  const setInputValueFn = useCallback(
    (val: string) => {
      setStoreInputValue(val);
      resetAllWordUserInput();
      inputSyncUserInputWords(val);
      updateActiveWord(val ? getInputCursorPosition() : 0);
    },
    [setStoreInputValue],
  );

  function handleSpaceSubmitAnswer(
    useSpaceSubmitAnswer: KeyboardInputOptions["useSpaceSubmitAnswer"],
  ) {
    if (useSpaceSubmitAnswer?.enable) {
      submitAnswer(
        () => useSpaceSubmitAnswer?.rightCallback?.(),
        () => useSpaceSubmitAnswer?.errorCallback?.(),
      );
    }
  }

  function submitAnswer(
    correctCallback?: () => void,
    wrongCallback?: () => void,
  ) {
    if (modeRef.current === Mode.Fix) return;
    resetAllWordActive();
    markIncorrectWord();

    if (checkWordCorrect()) {
      modeRef.current = Mode.Input;
      correctCallback?.();
      setStoreInputValue("");
    } else {
      modeRef.current = Mode.Fix;
      wrongCallback?.();
    }
  }

  function fixFirstIncorrectWord() {
    if (modeRef.current === Mode.Fix) {
      modeRef.current = Mode.Fix_Input;
      const firstIncorrect = getFirstIncorrectWord();
      if (firstIncorrect) {
        clearNextIncorrectWord(firstIncorrect);
      }
    }
  }

  function fixNextIncorrectWord() {
    if (modeRef.current === Mode.Fix_Input) {
      const next = findNextIncorrectWordNew();
      if (next) {
        clearNextIncorrectWord(next);
      }
    }
  }

  function fixIncorrectWord() {
    if (modeRef.current === Mode.Fix) {
      fixFirstIncorrectWord();
    } else if (modeRef.current === Mode.Fix_Input) {
      fixNextIncorrectWord();
    }
  }

  function isEmptyOfCurrentEditWord() {
    return (currentEditWordRef.current?.userInput.length ?? 0) <= 0;
  }

  function handleKeyboardInput(
    e: KeyboardEvent,
    options?: KeyboardInputOptions,
  ) {
    // Block arrow keys
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)
    ) {
      e.preventDefault();
      return;
    }

    // Space submit in Input/Fix_Input mode on last word
    if (
      modeRef.current !== Mode.Fix &&
      e.code === "Space" &&
      lastWordIsActive()
    ) {
      e.preventDefault();
      e.stopPropagation();
      handleSpaceSubmitAnswer(options?.useSpaceSubmitAnswer);
      return;
    }

    // Fix mode: any key to start fixing first incorrect word
    if (modeRef.current === Mode.Fix) {
      if (e.code === "Space" || e.code === "Backspace") {
        e.preventDefault();
      }
      fixFirstIncorrectWord();
      inputChangedCallback?.(e);
      return;
    }

    // Fix_Input: space submit on last incorrect word
    if (
      modeRef.current === Mode.Fix_Input &&
      e.code === "Space" &&
      isLastIncorrectWord()
    ) {
      e.preventDefault();
      e.stopPropagation();
      handleSpaceSubmitAnswer(options?.useSpaceSubmitAnswer);
      return;
    }

    // Fix_Input: backspace on empty word to go to previous incorrect
    if (
      modeRef.current === Mode.Fix_Input &&
      e.code === "Backspace" &&
      isEmptyOfCurrentEditWord()
    ) {
      e.preventDefault();
      activePreviousIncorrectWord();
      inputChangedCallback?.(e);
      return;
    }

    // Space to fix words
    if (modeRef.current !== Mode.Input && e.code === "Space") {
      e.preventDefault();
      fixIncorrectWord();
      inputChangedCallback?.(e);
      return;
    }

    inputChangedCallback?.(e);
  }

  function resetUserInputWords() {
    modeRef.current = Mode.Input;
    setStoreInputValue("");
    userInputWordsRef.current = [];
  }

  function isFixInputMode() {
    return modeRef.current === Mode.Fix_Input;
  }

  function isFixMode() {
    return modeRef.current === Mode.Fix;
  }

  function findWordById(id: number) {
    return userInputWordsRef.current.find((word) => word.id === id);
  }

  return {
    inputValue,
    userInputWords: userInputWordsRef.current,
    submitAnswer,
    setInputValue: setInputValueFn,
    activePreviousIncorrectWord,
    handleKeyboardInput,
    fixIncorrectWord,
    fixFirstIncorrectWord,
    resetUserInputWords,
    isFixInputMode,
    isFixMode,
    findWordById,
    initialize,
  };
}
