"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import Loading from "@/components/common/Loading";
import Game from "@/components/game/Game";
import Tool from "@/components/game/Tool";
import { useGameMode } from "@/hooks/useGameMode";
import { useNavigation } from "@/hooks/useNavigation";
import { checkAuthenticated } from "@/services/auth";
import { useCourseStore } from "@/stores/course";
import { useCoursePackStore } from "@/stores/course-pack";
import { useMasteredElementsStore } from "@/stores/mastered-elements";

export default function GamePage() {
  const params = useParams();
  const coursePackId = params.coursePackId as string;
  const courseId = params.id as string;

  const courseSetup = useCourseStore((s) => s.setup);
  const setupCoursePack = useCoursePackStore((s) => s.setupCoursePack);
  const masteredElementsSetup = useMasteredElementsStore((s) => s.setup);
  const { gotoCourseList } = useNavigation();
  const { showQuestion } = useGameMode();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    showQuestion();
  }, [showQuestion]);

  useEffect(() => {
    async function init() {
      if (await checkAuthenticated()) {
        await masteredElementsSetup();
      }
      await courseSetup(coursePackId, courseId);
      await setupCoursePack(coursePackId);

      if (useCourseStore.getState().isAllMastered()) {
        toast.info("你已经全部都掌握 自动帮你跳转到课程列表啦", {
          duration: 1500,
          onAutoClose: () => {
            gotoCourseList(coursePackId);
          },
        });
        return;
      }
      setIsLoading(false);
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coursePackId, courseId]);

  if (isLoading) {
    return (
      <div className="h-full min-h-screen w-full bg-white text-slate-600 transition-colors dark:bg-[#111111] dark:text-slate-300">
        <div className="flex h-screen w-full items-center justify-center">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-screen w-full bg-white text-slate-600 transition-colors dark:bg-[#111111] dark:text-slate-300">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col px-5 pt-2">
        <Tool />
        <Game />
      </div>
    </div>
  );
}
