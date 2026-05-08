import { describe, expect, it, vi } from "vitest";

import { isWord } from "../useQuestionInput";
import { useInputLogic, useInputLogicStore } from "../useInputLogic";

// Mock requestAnimationFrame to execute immediately
vi.stubGlobal("requestAnimationFrame", (cb: Function) => cb());

describe("question", () => {
  function getWords() {
    return useInputLogicStore.getState().userInputWords;
  }

  it("should parse user input correctly", () => {
    const setInputCursorPosition = () => {};
    const getInputCursorPosition = () => 0;

    const { setInputValue, initialize } = useInputLogic({
      source: () => "i eat",
      setInputCursorPosition,
      getInputCursorPosition,
    });
    initialize();
    setInputValue("i eat");

    expect(getWords()).toMatchInlineSnapshot(`
      [
        {
          "end": 1,
          "id": 0,
          "incorrect": false,
          "isActive": true,
          "position": 0,
          "start": 0,
          "text": "i",
          "userInput": "i",
        },
        {
          "end": 5,
          "id": 1,
          "incorrect": false,
          "isActive": false,
          "position": 0,
          "start": 2,
          "text": "eat",
          "userInput": "eat",
        },
      ]
    `);
  });

  it("should filter all symbol", () => {
    const setInputCursorPosition = () => {};
    const getInputCursorPosition = () => 0;
    const { initialize } = useInputLogic({
      source: () => `i " like " the food ?`,
      setInputCursorPosition,
      getInputCursorPosition,
    });

    initialize();
    expect(getWords().length).toBe(4);
  });

  it("should find word by id", () => {
    const setInputCursorPosition = () => {};
    const getInputCursorPosition = () => 0;
    const { findWordById, initialize } = useInputLogic({
      source: () => `i " like " the food ?`,
      setInputCursorPosition,
      getInputCursorPosition,
    });
    initialize();

    expect(findWordById(0)?.text).toBe("i");
    expect(findWordById(2)?.text).toBe("like");
    expect(findWordById(4)?.text).toBe("the");
    expect(findWordById(5)?.text).toBe("food");
  });

  it("should be correct when checked the answer", () => {
    const setInputCursorPosition = () => {};
    const getInputCursorPosition = () => 0;

    const { setInputValue, submitAnswer, initialize } = useInputLogic({
      source: () => "i eat",
      setInputCursorPosition,
      getInputCursorPosition,
    });
    initialize();
    setInputValue("i eat");

    const correctCallback = vi.fn();
    const wrongCallback = vi.fn();
    submitAnswer(correctCallback, wrongCallback);

    expect(correctCallback).toBeCalled();
    expect(wrongCallback).not.toBeCalled();
  });

  it("A full stop at the end of a sentence will be ignored without affecting the result", () => {
    const setInputCursorPosition = () => {};
    const getInputCursorPosition = () => 0;

    const { setInputValue, submitAnswer, initialize } = useInputLogic({
      source: () => "i eat",
      setInputCursorPosition,
      getInputCursorPosition,
    });

    initialize();
    setInputValue("i eat.");

    const correctCallback = vi.fn();
    const wrongCallback = vi.fn();
    submitAnswer(correctCallback, wrongCallback);

    expect(correctCallback).toBeCalled();
    expect(wrongCallback).not.toBeCalled();
  });

  it("should be incorrect when checked the answer", () => {
    const setInputCursorPosition = () => {};
    const getInputCursorPosition = () => 0;

    const { setInputValue, submitAnswer, initialize } = useInputLogic({
      source: () => "i eat",
      setInputCursorPosition,
      getInputCursorPosition,
    });

    initialize();
    setInputValue("i like");

    const correctCallback = vi.fn();
    const wrongCallback = vi.fn();
    submitAnswer(correctCallback, wrongCallback);

    expect(correctCallback).not.toBeCalled();
    expect(wrongCallback).toBeCalled();
    expect(getWords()[1].incorrect).toBe(true);
  });

  it.each(["i don't", "i don\u2019t", "i don\u201Ct", `i don"t`, `i don\u201Dt`])(
    "should be correct when input '%s'",
    (input) => {
      const setInputCursorPosition = () => {};
      const getInputCursorPosition = () => 0;

      const { setInputValue, submitAnswer, initialize } = useInputLogic({
        source: () => "i don't",
        setInputCursorPosition,
        getInputCursorPosition,
      });

      initialize();
      setInputValue(input);

      const correctCallback = vi.fn();
      const wrongCallback = vi.fn();
      submitAnswer(correctCallback, wrongCallback);

      expect(correctCallback).toBeCalled();
      expect(wrongCallback).not.toBeCalled();
    },
  );

  it("should be the first word should be active", () => {
    const setInputCursorPosition = () => {};
    const getInputCursorPosition = () => 0;

    const { initialize } = useInputLogic({
      source: () => "i eat",
      setInputCursorPosition,
      getInputCursorPosition,
    });

    initialize();

    expect(getWords()[0].isActive).toBe(true);
  });

  it("should be changed the activated word based on the user's input", () => {
    const setInputCursorPosition = () => {};
    const getInputCursorPosition = vi.fn();

    const { setInputValue, initialize } = useInputLogic({
      source: () => "i eat",
      setInputCursorPosition,
      getInputCursorPosition,
    });
    initialize();

    getInputCursorPosition.mockReturnValue(1);
    setInputValue("i");
    expect(getWords()[0].isActive).toBe(true);

    getInputCursorPosition.mockReturnValue(2);
    setInputValue("i ");
    expect(getWords()[1].isActive).toBe(true);

    getInputCursorPosition.mockReturnValue(3);
    setInputValue("i e");
    expect(getWords()[1].isActive).toBe(true);

    getInputCursorPosition.mockReturnValue(3);
    setInputValue("iea");
    expect(getWords()[0].isActive).toBe(true);
  });

  it("should prevent move", () => {
    const setInputCursorPosition = () => {};
    const getInputCursorPosition = () => 0;

    const { setInputValue, handleKeyboardInput, initialize } = useInputLogic({
      source: () => "i eat apple",
      setInputCursorPosition,
      getInputCursorPosition,
    });

    initialize();
    setInputValue("i ea ap");

    const preventDefaultLeft = vi.fn();
    handleKeyboardInput({
      code: "ArrowLeft",
      preventDefault: preventDefaultLeft,
    } as any as KeyboardEvent);
    expect(preventDefaultLeft).toBeCalled();

    const preventDefaultRight = vi.fn();
    handleKeyboardInput({
      code: "ArrowRight",
      preventDefault: preventDefaultRight,
    } as any as KeyboardEvent);
    expect(preventDefaultRight).toBeCalled();
  });

  it("should prevent space when focus on last word", () => {
    const setInputCursorPosition = () => {};
    const getInputCursorPosition = vi.fn();

    const { setInputValue, handleKeyboardInput, initialize } = useInputLogic({
      source: () => "i eat apple",
      setInputCursorPosition,
      getInputCursorPosition,
    });

    initialize();
    const inputValue = "i eat apple";
    getInputCursorPosition.mockReturnValue(inputValue.length);
    setInputValue(inputValue);

    const preventDefault = vi.fn();
    const stopPropagation = vi.fn();
    handleKeyboardInput({
      code: "Space",
      preventDefault,
      stopPropagation,
    } as any as KeyboardEvent);

    expect(preventDefault).toBeCalled();
    expect(stopPropagation).toBeCalled();
  });

  it("should submit answer when enable use space", () => {
    const setInputCursorPosition = () => {};
    const getInputCursorPosition = vi.fn();

    const { setInputValue, handleKeyboardInput, initialize } = useInputLogic({
      source: () => "i eat apple",
      setInputCursorPosition,
      getInputCursorPosition,
    });

    initialize();
    const inputValue = "i eat apple";
    getInputCursorPosition.mockReturnValue(inputValue.length);
    setInputValue(inputValue);

    const submitAnswerCallback = vi.fn();

    handleKeyboardInput(
      {
        code: "Space",
        preventDefault: () => {},
        stopPropagation: () => {},
      } as any as KeyboardEvent,
      {
        useSpaceSubmitAnswer: {
          enable: true,
          rightCallback: submitAnswerCallback,
        },
      },
    );

    expect(submitAnswerCallback).toBeCalled();
  });

  it("should enter fix mode and fix incorrect words via keyboard", () => {
    const setInputCursorPosition = () => {};
    const getInputCursorPosition = () => 0;

    const { setInputValue, submitAnswer, handleKeyboardInput, initialize, isFixMode } =
      useInputLogic({
        source: () => "i eat",
        setInputCursorPosition,
        getInputCursorPosition,
      });

    initialize();
    setInputValue("he eat");
    submitAnswer();

    expect(isFixMode()).toBe(true);

    // Pressing a key in Fix mode should trigger fixFirstIncorrectWord
    handleKeyboardInput({
      code: "KeyI",
      preventDefault: vi.fn(),
    } as any as KeyboardEvent);

    // After fixing, the first incorrect word should be cleared
    expect(getWords()[0].userInput).toBe("");
    expect(getWords()[0].isActive).toBe(true);
  });
});

describe("isWord", () => {
  it("should return true for a string containing an English letter", () => {
    expect(isWord("hello")).toBe(true);
    expect(isWord("Hello")).toBe(true);
    expect(isWord("123word")).toBe(true);
    expect(isWord("18")).toBe(true);
  });

  it("should return false for a string without any English letters", () => {
    expect(isWord("—")).toBe(false);
    expect(isWord("！@#$%^&*()")).toBe(false);
    expect(isWord("こんにちは")).toBe(false);
  });

  it("should return false for an empty string", () => {
    expect(isWord("")).toBe(false);
  });

  it("should correctly identify single English letter", () => {
    expect(isWord("a")).toBe(true);
    expect(isWord("A")).toBe(true);
  });

  it("should return false for strings with only non-alphabetic characters", () => {
    expect(isWord(". ,;:!")).toBe(false);
  });
});
