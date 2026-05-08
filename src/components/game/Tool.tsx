"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  Maximize2,
  Settings,
  Pause,
  RotateCcw,
  Trophy,
} from "lucide-react";

import { courseTimer } from "@/hooks/useCourseTimer";
import { useGameMode } from "@/hooks/useGameMode";
import { useGamePlayMode } from "@/hooks/useGamePlayMode";
import { useShortcutKeyMode, parseShortcut } from "@/hooks/useShortcutKey";
import { isAuthenticated } from "@/services/auth";
import { useCourseStore } from "@/stores/course";

import StudyVideoLink from "./StudyVideoLink";
import CourseContents from "./CourseContents";
import ProgressBar from "../common/ProgressBar";

export default function Tool() {
  const [isOpenCourseContents, setIsOpenCourseContents] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const { shortcutKeys } = useShortcutKeyMode();
  const { isDictationMode } = useGamePlayMode();
  const { showQuestion } = useGameMode();
  const currentCourse = useCourseStore((s) => s.currentCourse);
  const visibleStatementIndex = useCourseStore((s) => s.getVisibleStatementIndex());
  const visibleStatementsCount = useCourseStore((s) => s.getVisibleStatementsCount());
  const isAllDone = useCourseStore((s) => s.isAllDone);
  const doAgainFn = useCourseStore((s) => s.doAgain);

  const currentSchedule = visibleStatementIndex + 1;

  const currentCourseInfo = `${currentCourse?.title || ""}（${currentSchedule}/${visibleStatementsCount}）`;

  const currentPercentage = useMemo(() => {
    if (isAllDone()) return 100;
    return Number(
      ((visibleStatementIndex / visibleStatementsCount) * 100).toFixed(2),
    );
  }, [visibleStatementIndex, visibleStatementsCount, isAllDone]);

  const openCourseContents = useCallback(() => {
    setIsOpenCourseContents(true);
  }, []);

  const handleDoAgain = useCallback(() => {
    setShowResetDialog(true);
  }, []);

  const handleTipConfirm = useCallback(() => {
    doAgainFn();
    showQuestion();
    courseTimer.reset();
    setShowResetDialog(false);
  }, [doAgainFn, showQuestion]);

  const pauseGame = useCallback(() => {
    window.dispatchEvent(new CustomEvent("pauseGame"));
  }, []);

  const openGameSettingModal = useCallback(() => {
    window.dispatchEvent(new CustomEvent("openGameSetting"));
  }, []);

  return (
    <>
      <div className="relative flex items-center justify-between border-t border-solid border-gray-300 pb-3 pt-4 text-base dark:border-gray-600">
        {/* Left side */}
        <div className="flex items-center">
          {currentCourse?.coursePackId && (
            <Link
              className="flex cursor-pointer select-none items-center justify-center hover:text-fuchsia-500"
              href={`/course-pack/${currentCourse.coursePackId}`}
              title="课程列表"
            >
              <Maximize2 className="h-7 w-7" />
            </Link>
          )}
          <div
            className="ml-4 cursor-pointer select-none hover:text-fuchsia-500"
            onClick={openCourseContents}
            title="课程题目列表"
          >
            {currentCourseInfo}
          </div>
          <StudyVideoLink video={currentCourse?.video} />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {isDictationMode() && (
            <div
              onClick={openGameSettingModal}
              className="cursor-pointer select-none hover:text-fuchsia-500"
              title="游戏设置"
            >
              <Settings className="h-6 w-6" />
            </div>
          )}

          {isAuthenticated() && (
            <div
              onClick={pauseGame}
              className="cursor-pointer select-none hover:text-fuchsia-500"
              title={`暂停游戏 (${shortcutKeys.pause})`}
            >
              <Pause className="h-6 w-6" />
            </div>
          )}

          <div
            onClick={handleDoAgain}
            className="cursor-pointer select-none hover:text-fuchsia-500"
            title="重置当前课程进度"
          >
            <RotateCcw className="h-6 w-6" />
          </div>
          <div
            className="cursor-pointer select-none hover:text-fuchsia-500"
            title="排行榜"
          >
            <Trophy className="h-6 w-6" />
          </div>
        </div>

        <CourseContents
          isOpen={isOpenCourseContents}
          onClose={() => setIsOpenCourseContents(false)}
        />
      </div>

      <ProgressBar percentage={currentPercentage} />

      {/* Reset dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowResetDialog(false)}
          />
          <div className="relative rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-bold dark:text-white">重置进度</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              是否确认重置当前课程进度？
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="btn btn-ghost"
                onClick={() => setShowResetDialog(false)}
              >
                取消
              </button>
              <button
                className="btn btn-primary"
                onClick={handleTipConfirm}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
