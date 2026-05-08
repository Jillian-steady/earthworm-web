"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/stores/user";
import { getFetcher } from "@/utils/fetcher";
import type { UserLearningDailyTime } from "@/types";
import MembershipBadge from "@/components/layout/MembershipBadge";
import RecentCoursePack from "./RecentCoursePack";
import CalendarGraph from "./CalendarGraph";

export default function Home() {
  const user = useUserStore((state) => state.user);
  const [learningDailyTimeList, setLearningDailyTimeList] = useState<
    UserLearningDailyTime[]
  >([]);
  const [learningDailyTotalTime, setLearningDailyTotalTime] = useState(0);

  async function setupLearningDailyTime() {
    const [timeList, totalTime] = await Promise.all([
      getFetcher<UserLearningDailyTime[]>("/api/user-learning-activities", { activityType: "daily_total" }),
      getFetcher<number>("/api/user-learning-activities/total", { activityType: "daily_total" }),
    ]);
    setLearningDailyTimeList(timeList);
    setLearningDailyTotalTime(totalTime);
  }

  function handleToggleYear(_year?: number) {
    // TODO: support multi-year switching
    setupLearningDailyTime();
  }

  useEffect(() => {
    setupLearningDailyTime();
  }, []);

  return (
    <div className="mt-8 flex w-full justify-between">
      {/* Left avatar area */}
      <div className="mr-16 hidden w-72 md:block">
        <div className="mx-auto h-56 w-56 overflow-hidden rounded-full border-2 border-gray-300 bg-gray-300 dark:border-gray-700 dark:bg-gray-700">
          <img
            className="h-full object-cover"
            src={user?.avatar}
            alt="avatar"
          />
        </div>
        <div className="mt-4 truncate">
          <div className="flex gap-2">
            <div className="text-3xl font-medium">{user?.username}</div>
            <MembershipBadge />
          </div>
          <div className="text-md text-gray-400">{user?.name}</div>
        </div>
        <hr className="my-5 dark:border-gray-700" />
      </div>

      {/* Right course pack area */}
      <div className="min-w-0 flex-1">
        <div className="mb-4 flex justify-between border-b pb-2 dark:border-gray-700">
          <div className="text-xl font-medium">最近使用的课程包</div>
          <Link
            href="/course-pack"
            className="link text-blue-500 no-underline hover:opacity-75"
          >
            更多课程包
          </Link>
        </div>
        <RecentCoursePack />
        <CalendarGraph
          className="mt-10"
          data={learningDailyTimeList}
          totalLearningTime={learningDailyTotalTime}
          onToggleYear={handleToggleYear}
        />
      </div>
    </div>
  );
}
