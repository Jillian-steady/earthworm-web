"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Loading from "@/components/common/Loading";
import { useActiveCourseMap } from "@/hooks/useActiveCourse";
import { useCoursePackStore } from "@/stores/course-pack";

export default function CoursePackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const coursePackId = params.id as string;

  const currentCoursePack = useCoursePackStore((s) => s.currentCoursePack);
  const setupCoursePack = useCoursePackStore((s) => s.setupCoursePack);
  const { updateActiveCourseMap } = useActiveCourseMap();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function setup() {
      setIsLoading(true);
      await setupCoursePack(coursePackId);
      setIsLoading(false);
    }
    setup();
  }, [coursePackId, setupCoursePack]);

  function handleChangeCourse(courseId: string) {
    updateActiveCourseMap(coursePackId, courseId);
    router.push(`/game/${coursePackId}/${courseId}`);
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex w-full flex-col">
      <h2 className="mb-4 text-center text-3xl dark:border-gray-600">
        {currentCoursePack?.title}
      </h2>
      <div className="h-full scrollbar-hide">
        <div className="grid h-[79vh] grid-cols-1 justify-start gap-8 overflow-y-auto overflow-x-hidden pb-96 pl-0 pr-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentCoursePack?.courses.map((course) => (
            <div
              key={course.id}
              className="cursor-pointer rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-lg dark:border-gray-700"
              onClick={() => handleChangeCourse(course.id)}
            >
              <h3 className="text-lg font-semibold">{course.title}</h3>
              {course.description && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {course.description}
                </p>
              )}
              {course.completionCount > 0 && (
                <span className="mt-2 inline-block rounded bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-200">
                  已完成 {course.completionCount} 次
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
