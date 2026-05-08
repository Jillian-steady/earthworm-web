"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check } from "lucide-react";

import { useGameMode } from "@/hooks/useGameMode";
import { usePronunciation } from "@/hooks/usePronunciation";
import { useCourseStore } from "@/stores/course";

import ModalHeader from "../common/ModalHeader";

interface CourseContentsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CourseContents({ isOpen, onClose }: CourseContentsProps) {
  const [filterOption, setFilterOption] = useState("all");
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const currentCourse = useCourseStore((s) => s.currentCourse);
  const statementIndex = useCourseStore((s) => s.statementIndex);
  const toSpecificStatement = useCourseStore((s) => s.toSpecificStatement);
  const { showQuestion } = useGameMode();
  const { getPronunciationUrl } = usePronunciation();

  const contentsList = useMemo(
    () => currentCourse?.statements || [],
    [currentCourse],
  );

  const filteredContentsList = useMemo(() => {
    if (filterOption === "mastered") {
      return contentsList.filter((item) => item.isMastered);
    } else if (filterOption === "notMastered") {
      return contentsList.filter((item) => !item.isMastered);
    }
    return contentsList;
  }, [contentsList, filterOption]);

  // Scroll to current item when modal opens
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        const targetElement = itemRefs.current[statementIndex];
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  }, [isOpen, statementIndex]);

  const jumpTo = useCallback(
    (index: number, item: any) => {
      if (item.isMastered) return;
      showQuestion();
      onClose();
      toSpecificStatement(index);
    },
    [showQuestion, onClose, toSpecificStatement],
  );

  const handlePlayEnglishSound = useCallback(
    (event: React.MouseEvent, english: string) => {
      event.stopPropagation();
      const url = getPronunciationUrl(english);
      const audio = new Audio(url);
      audio.play().catch(() => {});
    },
    [getPronunciationUrl],
  );

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative flex h-[80vh] max-h-[880px] w-[90vw] max-w-[880px] flex-col rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <ModalHeader title="课程目录" onClose={onClose} />

        {/* Filter menu */}
        <div className="mb-4 flex justify-end">
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="select select-bordered select-sm dark:bg-gray-700 dark:text-white"
          >
            <option value="all">全部</option>
            <option value="mastered">已经掌握</option>
            <option value="notMastered">未掌握</option>
          </select>
        </div>

        <div className="h-full space-y-3 overflow-y-auto">
          {filteredContentsList.map((item, index) => (
            <div
              key={item.id || index}
              ref={(el) => { itemRefs.current[index] = el; }}
              className={`flex items-center justify-between rounded-lg bg-purple-100 p-4 transition-colors duration-300 hover:bg-purple-200 dark:bg-purple-700 dark:hover:bg-purple-600 ${
                item.isMastered ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={() => jumpTo(index, item)}
            >
              <div className="group flex w-full flex-grow">
                <div className="mr-4 flex w-6 flex-shrink-0 flex-col items-center justify-center">
                  <span className="text-lg font-semibold text-purple-600 dark:text-purple-300">
                    {index + 1}
                  </span>
                  {item.isMastered && (
                    <Check className="mt-1 h-5 w-5 text-green-700 dark:text-green-500" />
                  )}
                </div>
                <div className="flex-grow overflow-hidden">
                  <div className="truncate text-lg font-bold text-purple-800 group-hover:text-clip group-hover:whitespace-normal dark:text-white">
                    {item.english}
                  </div>
                  <div className="truncate text-lg text-purple-600 group-hover:text-clip group-hover:whitespace-normal dark:text-purple-300">
                    {item.chinese}
                  </div>
                  <div className="truncate text-lg text-gray-500 group-hover:text-clip group-hover:whitespace-normal dark:text-gray-400">
                    {item.soundmark}
                  </div>
                </div>
                <div
                  className="flex w-11 flex-shrink-0 cursor-pointer items-center justify-center transition-transform duration-300 hover:scale-110"
                >
                  <button
                    title="播放发音"
                    onClick={(e) => handlePlayEnglishSound(e, item.english)}
                  >
                    <svg
                      className="ml-1 inline-block h-7 w-7 cursor-pointer"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                    >
                      <path d="M155.51,24.81a8,8,0,0,0-8.42.88L77.25,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.25l69.84,54.31A8,8,0,0,0,160,224V32A8,8,0,0,0,155.51,24.81ZM144,207.64,84.91,161.69A7.94,7.94,0,0,0,80,160H32V96H80a7.94,7.94,0,0,0,4.91-1.69L144,48.36ZM192,104v48a8,8,0,0,0,16,0V104a8,8,0,0,0-16,0Zm32-16v80a8,8,0,0,0,16,0V88a8,8,0,0,0-16,0Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
