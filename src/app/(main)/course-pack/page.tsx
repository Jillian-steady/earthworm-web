"use client";

import { useEffect, useState } from "react";

import type { CoursePacksItem } from "@/types";
import Loading from "@/components/common/Loading";
import { useNavigation } from "@/hooks/useNavigation";
import { useCoursePackStore } from "@/stores/course-pack";

export default function CoursePackListPage() {
  const coursePacks = useCoursePackStore((s) => s.coursePacks)
    || [];
  const setupCoursePacks = useCoursePackStore((s) => s.setupCoursePacks);
  const { gotoCourseList } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function setup() {
      // Course packs don't update often, only fetch once
      if (coursePacks.length === 0) {
        setIsLoading(true);
        await setupCoursePacks();
        setIsLoading(false);
      }
    }
    setup();
  }, [coursePacks.length, setupCoursePacks]);

  function handleGoToCoursePack(coursePack: CoursePacksItem) {
    if (coursePack.isFree) {
      gotoCourseList(coursePack.id);
    } else {
      // TODO: Check membership status
      console.log("需要是会员");
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex w-full flex-col">
      <h2 className="mb-4 text-center text-3xl dark:border-gray-600">
        课程包列表
      </h2>
      <div className="h-[79vh] overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="grid auto-rows-fr grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-0 md:grid-cols-3 lg:grid-cols-4">
          {coursePacks.map((coursePack) => (
            <div
              key={coursePack.id}
              className="cursor-pointer rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-lg dark:border-gray-700"
              onClick={() => handleGoToCoursePack(coursePack)}
            >
              {coursePack.cover && (
                <img
                  src={coursePack.cover}
                  alt={coursePack.title}
                  className="mb-2 h-32 w-full rounded object-cover"
                />
              )}
              <h3 className="text-lg font-semibold">{coursePack.title}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {coursePack.description}
              </p>
              {!coursePack.isFree && (
                <span className="mt-2 inline-block rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
                  会员
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
