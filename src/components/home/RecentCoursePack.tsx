"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getFetcher } from "@/utils/fetcher";
import type { UserRecentCoursePack } from "@/types";
import CoursePackCard from "@/components/course/CoursePackCard";

export default function RecentCoursePack() {
  const router = useRouter();
  const [coursePacks, setCoursePacks] = useState<UserRecentCoursePack[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (coursePacks.length === 0) {
        setIsLoading(true);
      }
      try {
        const data = await getFetcher<UserRecentCoursePack[]>("/api/user-course-progress/recent-course-packs");
        setCoursePacks(data);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function gotoCourseList(coursePackId: string) {
    router.push(`/course-pack/${coursePackId}`);
  }

  function gotoGame(coursePackId: string, courseId: string) {
    router.push(`/game/${coursePackId}/${courseId}`);
  }

  return (
    <div className="flex min-h-[350px]">
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <span className="loading loading-dots loading-md"></span>
        </div>
      ) : (
        <div className="w-full">
          {coursePacks.length > 0 ? (
            <div className="grid w-full grid-cols-1 gap-4 min-[500px]:grid-cols-2 md:grid-cols-1 min-[850px]:grid-cols-2 xl:grid-cols-3">
              {coursePacks.map((coursePack) => (
                <CoursePackCard
                  key={coursePack.coursePackId}
                  coursePack={{
                    id: coursePack.coursePackId,
                    title: coursePack.title,
                    description: coursePack.description,
                    cover: coursePack.cover,
                    isFree: coursePack.isFree,
                  }}
                  actions={
                    <div className="mt-2 flex justify-between">
                      <button
                        className="btn btn-sm tw-btn-blue"
                        onClick={(e) => {
                          e.stopPropagation();
                          gotoCourseList(coursePack.coursePackId);
                        }}
                      >
                        课程列表
                      </button>
                      <button
                        className="btn btn-success btn-sm text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          gotoGame(coursePack.coursePackId, coursePack.courseId);
                        }}
                      >
                        继续游戏
                      </button>
                    </div>
                  }
                />
              ))}
            </div>
          ) : (
            <div className="flex h-full w-full flex-1 items-center justify-center text-slate-500">
              暂无记录，
              <Link
                href="/course-pack"
                className="link text-blue-500 no-underline hover:opacity-75"
              >
                先学习一课，
              </Link>
              再来看看吧~
            </div>
          )}
        </div>
      )}
    </div>
  );
}
