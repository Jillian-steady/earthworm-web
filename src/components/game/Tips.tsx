"use client";

import { useCallback, useEffect, useMemo } from "react";

import { useAnswerTip } from "@/hooks/useAnswerTip";
import { useGameMode } from "@/hooks/useGameMode";
import { useShortcutKeyMode } from "@/hooks/useShortcutKey";
import { usePronunciation } from "@/hooks/usePronunciation";
import { useCourseStore } from "@/stores/course";
import { useMasteredElementsStore } from "@/stores/mastered-elements";
import { isAuthenticated } from "@/services/auth";
import {
  registerShortcut,
  cancelShortcut,
  parseShortcutKeys,
} from "@/utils/keyboardShortcuts";
import { toast } from "sonner";

import { useWrapperQuestionInput } from "./hooks/useWrapperQuestionInput";
import { useAnswerHook } from "./hooks/useAnswer";
import PrevAndNextBtn from "./PrevAndNextBtn";

export default function Tips() {
  const { toggleAnswerTip, isAnswerTip } = useAnswerTip();
  const { shortcutKeys } = useShortcutKeyMode();
  const { isQuestion, isAnswer, showQuestion } = useGameMode();
  const { submitAnswer } = useWrapperQuestionInput();
  const { goToNextQuestion } = useAnswerHook();
  const { getPronunciationUrl } = usePronunciation();

  // Play sound
  const playSound = useCallback(() => {
    const english = useCourseStore.getState().getCurrentStatement()?.english;
    if (english) {
      const url = getPronunciationUrl(english);
      const audio = new Audio(url);
      audio.play().catch(() => {});
    }
  }, [getPronunciationUrl]);

  // Mastered
  const markStatementAsMastered = useCallback(async () => {
    if (!isAuthenticated()) {
      toast.warning("请先登录后再操作");
      return;
    }
    const currentStatement = useCourseStore.getState().getCurrentStatement();
    if (!currentStatement) return;

    const { addElement } = useMasteredElementsStore.getState();
    const undoFn = await addElement({
      english: currentStatement.english,
    });

    useCourseStore.getState().updateMarketedStatements();
    useCourseStore.getState().toNextStatement();
    showQuestion();

    toast.success("已掌握该内容", {
      action: {
        label: "撤销",
        onClick: () => {
          undoFn();
          useCourseStore.getState().updateMarketedStatements();
        },
      },
    });
  }, [showQuestion]);

  // Register shortcuts
  useEffect(() => {
    const playSoundCommand = (e: KeyboardEvent) => {
      e.preventDefault();
      playSound();
    };

    const handleShowAnswer = (e: KeyboardEvent) => {
      e.preventDefault();
      if (isAnswer()) {
        showQuestion();
      } else {
        toggleAnswerTip();
      }
    };

    const handleMastered = () => {
      markStatementAsMastered();
    };

    registerShortcut(shortcutKeys.sound, playSoundCommand);
    registerShortcut(shortcutKeys.answer, handleShowAnswer);
    registerShortcut(shortcutKeys.mastered, handleMastered);

    return () => {
      cancelShortcut(shortcutKeys.sound, playSoundCommand);
      cancelShortcut(shortcutKeys.answer, handleShowAnswer);
      cancelShortcut(shortcutKeys.mastered, handleMastered);
    };
  }, [shortcutKeys, playSound, toggleAnswerTip, isAnswer, showQuestion, markStatementAsMastered]);

  const keybindings = useMemo(() => {
    const questionItems = [
      {
        keys: "Enter",
        text: "提交",
        eventFn: () => submitAnswer(),
      },
      {
        keys: shortcutKeys.answer,
        text: isAnswerTip() ? "隐藏答案" : "显示答案",
        eventFn: () => toggleAnswerTip(),
      },
    ];

    const answerItems = [
      {
        keys: "Enter",
        text: "下一题",
        eventFn: () => goToNextQuestion(),
      },
      {
        keys: shortcutKeys.answer,
        text: "再来一次",
        eventFn: () => showQuestion(),
      },
    ];

    const normalItems = [
      {
        keys: shortcutKeys.sound,
        text: "播放发音",
        eventFn: playSound,
      },
      {
        keys: shortcutKeys.mastered,
        text: "掌握",
        eventFn: markStatementAsMastered,
      },
    ];

    const resultItems = [...normalItems];

    if (isQuestion()) {
      resultItems.push(...questionItems);
    } else {
      resultItems.push(...answerItems);
    }

    return resultItems;
  }, [
    shortcutKeys,
    isQuestion,
    isAnswerTip,
    submitAnswer,
    toggleAnswerTip,
    goToNextQuestion,
    showQuestion,
    playSound,
    markStatementAsMastered,
  ]);

  return (
    <div className="relative flex h-32 items-center justify-center">
      <div className="z-10 hidden items-center justify-center min-[780px]:flex">
        {keybindings.map((keybinding, index) => (
          <button
            key={index}
            onClick={keybinding.eventFn}
            className="btn btn-ghost"
          >
            <div className="flex items-center gap-0.5">
              {parseShortcutKeys(keybinding.keys).map((keyStr, ki) => (
                <kbd key={ki} className="kbd kbd-sm">
                  {keyStr}
                </kbd>
              ))}
            </div>
            <span>{keybinding.text}</span>
          </button>
        ))}
      </div>

      <PrevAndNextBtn />
    </div>
  );
}
