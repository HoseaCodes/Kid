import React from "react";
import { useQuery } from "@tanstack/react-query";
import { CourseProgress } from "./CourseProgress";
import CourseSidebarItem from "./CourseSidebarItem";
import { getPurchase } from "../../features/lms/getPurchase";
import { getCompletedChapterIds } from "../../features/lms/getCompletedChapterIds";

const CourseSidebar = ({
  setChapterId,
  course,
  currentUser,
  progressCount,
  courseId,
}) => {
  const userId = currentUser?.uid;

  const { data: purchase } = useQuery({
    queryKey: ["purchase", userId, courseId],
    queryFn: () => getPurchase(userId, courseId),
    enabled: !!userId && !!courseId,
    staleTime: 60 * 1000,
  });

  const { data: completedChapterIds = [] } = useQuery({
    queryKey: ["completedChapterIds", userId, courseId],
    queryFn: () => getCompletedChapterIds(userId, courseId),
    enabled: !!userId && !!courseId,
    staleTime: 30 * 1000,
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-[27.5px] flex flex-col border-b">
        <h1 className="font-semibold">{course?.title}</h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters &&
          course.chapters.map((chapter) => (
            <CourseSidebarItem
              key={chapter.id}
              id={chapter.id}
              label={chapter.title}
              isCompleted={completedChapterIds.includes(chapter.id)}
              courseId={courseId}
              isLocked={!chapter.isFree && !purchase}
              setChapterId={setChapterId}
            />
          ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
