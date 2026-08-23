import React from "react";
import { useQuery } from "@tanstack/react-query";
import CourseNavbar from "./CourseNavbar";
import CourseSidebar from "./CourseSidebar";
import { getProgress } from "../../features/lms/getProgress";

export default function CourseLayout({
  children,
  setChapterId,
  course,
  currentUser,
  courseId,
}) {
  const userId = currentUser?.uid;

  const { data: progressCount = 0 } = useQuery({
    queryKey: ["courseProgress", userId, courseId],
    queryFn: () => getProgress(userId, courseId),
    enabled: !!userId && !!courseId,
    staleTime: 30 * 1000,
  });

  if (!course || !currentUser) return <h1>Loading...</h1>;

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar
          currentUser={currentUser}
          course={course}
          progressCount={progressCount}
        />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed z-50">
        <CourseSidebar
          currentUser={currentUser}
          setChapterId={setChapterId}
          course={course}
          progressCount={progressCount}
          courseId={courseId}
        />
      </div>
      <main className="overflow-scroll md:pl-80 h-full">{children}</main>
    </div>
  );
}
