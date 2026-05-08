"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import confetti from "canvas-confetti";

import { courseTimer } from "@/hooks/useCourseTimer";
import { useGameMode } from "@/hooks/useGameMode";
import { useNavigation } from "@/hooks/useNavigation";
import { useActiveCourseMap } from "@/hooks/useActiveCourse";
import { usePronunciation } from "@/hooks/usePronunciation";
import { useSummary } from "@/hooks/useSummary";
import { isAuthenticated, signIn } from "@/services/auth";
import { useCourseStore } from "@/stores/course";
import { useCoursePackStore } from "@/stores/course-pack";
import { useGameStore } from "@/stores/game";
import {
  permitSaveStatement,
  preventSaveStatement,
} from "@/stores/statement";
import { formatSecondsToTime } from "@/utils/date";
import {
  registerShortcut,
  cancelShortcut,
} from "@/utils/keyboardShortcuts";

export default function Summary() {
  const { showModal, hideSummary: hideSummaryFromStore } = useSummary();
  const [enSentence, setEnSentence] = useState("");
  const [zhSentence, setZhSentence] = useState("");
  const [nextCourseId, setNextCourseId] = useState("");
  const [totalSeconds, setTotalSeconds] = useState(0);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

  const { showQuestion } = useGameMode();
  const { gotoCourseList, gotoGame } = useNavigation();
  const { updateActiveCourseMap } = useActiveCourseMap();
  const { getPronunciationUrl } = usePronunciation();

  const currentCourse = useCourseStore((s) => s.currentCourse);
  const isAllMastered = useCourseStore((s) => s.isAllMastered);
  const doAgain = useCourseStore((s) => s.doAgain);
  const resetStatementIndex = useCourseStore((s) => s.resetStatementIndex);
  const completeCourse = useCourseStore((s) => s.completeCourse);
  const startGame = useGameStore((s) => s.startGame);
  const completeLevel = useGameStore((s) => s.completeLevel);
  const updateCoursesCompleteCount = useCoursePackStore(
    (s) => s.updateCoursesCompleteCount,
  );

  const totalMinutes = Math.ceil(totalSeconds / 60);
  const formattedMinutes = Math.max(totalMinutes, 1).toString();

  // Fetch daily sentence
  useEffect(() => {
    if (showModal) {
      fetchDailySentence();
    }
  }, [showModal]);

  const fetchDailySentence = async () => {
    try {
      const res = await fetch(
        "https://open.iciba.com/dsapi/?date=" +
          new Date().toISOString().slice(0, 10),
      );
      const data = await res.json();
      setEnSentence(data.content || "");
      setZhSentence(data.note || "");
    } catch {
      setEnSentence("The best time to plant a tree was 20 years ago. The second best time is now.");
      setZhSentence("种一棵树最好的时间是二十年前，其次是现在。");
    }
  };

  const soundSentence = useCallback(() => {
    if (enSentence) {
      const url = getPronunciationUrl(enSentence);
      const audio = new Audio(url);
      audio.play().catch(() => {});
    }
  }, [enSentence, getPronunciationUrl]);

  const playConfetti = useCallback(() => {
    if (confettiCanvasRef.current) {
      const myConfetti = confetti.create(confettiCanvasRef.current, {
        resize: true,
      });
      myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, []);

  // Handle modal open
  useEffect(() => {
    if (showModal) {
      preventSaveStatement();
      soundSentence();
      completeLevel();

      // Complete course
      (async () => {
        if (isAuthenticated() && currentCourse) {
          const { coursePackId } = currentCourse;
          const { nextCourse } = await completeCourse();
          updateCoursesCompleteCount(coursePackId);

          if (nextCourse) {
            setNextCourseId(nextCourse.id);
            updateActiveCourseMap(coursePackId, nextCourse.id);
          } else {
            setNextCourseId("");
            updateActiveCourseMap(coursePackId, "");
          }
        }
      })();

      setTimeout(() => {
        playConfetti();
      }, 300);

      const handleEnter = () => {
        goToNextCourse();
      };
      registerShortcut("enter", handleEnter);

      return () => {
        cancelShortcut("enter", handleEnter);
        permitSaveStatement();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  const hideSummary = useCallback(() => {
    hideSummaryFromStore();
  }, [hideSummaryFromStore]);

  const handleDoAgain = useCallback(async () => {
    if (isAllMastered()) {
      toast.info("你已经全部都掌握 自动帮你跳转到课程列表啦", {
        duration: 1500,
        onAutoClose: () => {
          handleGoToCourseList();
        },
      });
      return;
    }
    doAgain();
    hideSummary();
    showQuestion();
    courseTimer.reset();
    startGame();
  }, [isAllMastered, doAgain, hideSummary, showQuestion, startGame]);

  const handleGoToCourseList = useCallback(() => {
    hideSummary();
    if (currentCourse) {
      gotoCourseList(currentCourse.coursePackId);
    }
  }, [hideSummary, currentCourse, gotoCourseList]);

  const goToNextCourse = useCallback(() => {
    if (!isAuthenticated()) {
      // Prompt to sign in
      toast.info("注册后可以进行下一课学习", {
        action: {
          label: "立即注册",
          onClick: () => {
            resetStatementIndex();
            showQuestion();
            signIn();
          },
        },
      });
      return;
    }

    hideSummary();

    if (!nextCourseId) {
      toast.info("已经是最后一课 自动帮你跳转到课程列表啦", {
        duration: 1500,
        onAutoClose: () => {
          handleGoToCourseList();
        },
      });
      return;
    }

    if (currentCourse) {
      gotoGame(currentCourse.coursePackId, nextCourseId);
    }
  }, [
    hideSummary,
    nextCourseId,
    currentCourse,
    gotoGame,
    handleGoToCourseList,
    resetStatementIndex,
    showQuestion,
  ]);

  const toShare = useCallback(() => {
    window.dispatchEvent(new CustomEvent("showShareModal"));
  }, []);

  if (!showModal) return (
    <canvas
      ref={confettiCanvasRef}
      className="pointer-events-none absolute left-0 top-0 z-[1000] h-full w-full"
    />
  );

  return (
    <>
      {createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-[90vw] max-w-[780px] rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="flex justify-between">
              <h3 className="mb-4 text-lg font-bold">🎉 恭喜!</h3>
              <button
                tabIndex={0}
                className="btn btn-ghost btn-sm mx-1 h-7 w-7 rounded-md p-0"
                onClick={soundSentence}
              >
                <svg
                  className="h-full w-full"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                >
                  <path d="M155.51,24.81a8,8,0,0,0-8.42.88L77.25,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.25l69.84,54.31A8,8,0,0,0,160,224V32A8,8,0,0,0,155.51,24.81ZM144,207.64,84.91,161.69A7.94,7.94,0,0,0,80,160H32V96H80a7.94,7.94,0,0,0,4.91-1.69L144,48.36ZM192,104v48a8,8,0,0,0,16,0V104a8,8,0,0,0-16,0Zm32-16v80a8,8,0,0,0,16,0V88a8,8,0,0,0-16,0Z" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col">
              <div className="flex">
                <span className="text-3xl font-bold sm:text-4xl lg:text-6xl">
                  &ldquo;
                </span>
                <div className="flex-1 text-center text-sm leading-loose sm:text-base lg:text-xl">
                  {enSentence}
                </div>
                <span className="invisible text-3xl font-bold sm:text-4xl lg:text-6xl">
                  &rdquo;
                </span>
              </div>

              <div className="flex">
                <span className="invisible text-3xl font-bold sm:text-4xl lg:text-6xl">
                  &ldquo;
                </span>
                <div className="flex-1 text-center text-sm leading-loose sm:text-base lg:text-xl">
                  {zhSentence}
                </div>
                <span className="text-3xl font-bold sm:text-4xl lg:text-6xl">
                  &rdquo;
                </span>
              </div>
              <p className="text-right text-xs text-gray-200 sm:text-sm">
                —— 金山词霸「每日一句」
              </p>
              <p className="pl-2 text-xs leading-loose text-gray-600 sm:pl-4 sm:text-sm lg:pl-14 lg:text-base">
                {`恭喜您一共完成 ${courseTimer.totalRecordNumber()} 道题，用时 ${formatSecondsToTime(courseTimer.calculateTotalTime())} `}
              </p>
              {isAuthenticated() && (
                <p className="pl-2 text-xs leading-loose text-gray-400 sm:pl-4 sm:text-sm lg:pl-14 lg:text-base">
                  今天一共学习{" "}
                  <span className="text-purple-500">{formattedMinutes}分钟</span>{" "}
                  啦！
                  {totalMinutes >= 30 && (
                    <span>太强了，给自己来点掌声 😄</span>
                  )}
                </p>
              )}
            </div>
            <div className="modal-action flex flex-col justify-center gap-2 sm:flex-row sm:justify-end">
              <button
                className="btn btn-primary w-full sm:w-auto"
                onClick={toShare}
              >
                生成打卡图
              </button>
              <button
                className="btn w-full sm:w-auto"
                onClick={handleDoAgain}
              >
                再来一次
              </button>
              <button
                className="btn w-full sm:w-auto"
                onClick={handleGoToCourseList}
              >
                课程列表
              </button>
              <button
                className="btn w-full sm:w-auto"
                onClick={goToNextCourse}
              >
                下一课
                <kbd className="kbd kbd-sm ml-1">↵</kbd>
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      <canvas
        ref={confettiCanvasRef}
        className="pointer-events-none absolute left-0 top-0 z-[1000] h-full w-full"
      />
    </>
  );
}
