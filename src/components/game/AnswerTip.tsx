"use client";

import { X } from "lucide-react";

import { useAnswerTip } from "@/hooks/useAnswerTip";
import { useCourseStore } from "@/stores/course";

export default function AnswerTip() {
  const currentStatement = useCourseStore((s) => s.getCurrentStatement());
  const { hiddenAnswerTip } = useAnswerTip();

  return (
    <div className="absolute left-1/2 top-36 flex w-3/4 translate-x-[-50%] items-center justify-center text-xl dark:text-gray-50">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body relative">
          <div className="absolute right-2 top-1 mt-0">
            <button
              className="btn btn-ghost btn-sm dark:hover:bg-gray-600"
              onClick={hiddenAnswerTip}
              tabIndex={-1}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="text-3xl">{currentStatement?.english}</div>
        </div>
      </div>
    </div>
  );
}
