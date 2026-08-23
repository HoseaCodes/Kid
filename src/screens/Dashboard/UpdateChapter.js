import React, { lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaArrowLeftLong } from "react-icons/fa6";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaEye, FaVideo } from "react-icons/fa";
import IconBadge from "../../components/IconBadge";
import Banner from "../../components/Banner";
import Layout from "../../components/Dashboard/Layout";
import { getChapterById } from "../../features/lms/getChapterById";

const ChapterActions = lazy(() =>
  import("../../components/Form/Chapter/ChapterActions")
);
const ChapterAccessForm = lazy(() =>
  import("../../components/Form/Chapter/ChapterAccessForm")
);
const ChapterTitleForm = lazy(() =>
  import("../../components/Form/Chapter/ChapterTitleForm")
);
const ChapterDescriptionForm = lazy(() =>
  import("../../components/Form/Chapter/ChapterDescriptionForm")
);
const ChapterVideoForm = lazy(() =>
  import("../../components/Form/Chapter/ChapterVideoForm")
);

const UpdateChapter = () => {
  const location = useLocation();
  const match = location.pathname.match(
    /\/course\/([^/]+)\/chapters\/([^/]+)/
  );
  const courseId = match?.[1];
  const chapterId = match?.[2];

  const {
    data: chapter,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chapterAdmin", courseId, chapterId],
    queryFn: () => getChapterById(courseId, chapterId),
    enabled: !!courseId && !!chapterId,
    staleTime: 30 * 1000,
  });

  if (!match) return <div>Invalid chapter URL</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!chapter) return <div>Chapter not found</div>;

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <Layout>
      <>
        {!chapter.isPublished && (
          <Banner
            variant="warning"
            label="This chapter is unpublished. It will not be visible in the course"
          />
        )}
        <div style={{ overflow: "scroll" }} className="p-6">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <button
                onClick={() => {
                  window.location.href = `/dashboard/admin/courses/edit/${courseId}`;
                }}
                className="flex items-center text-sm hover:opacity-75 transition-none mb-6"
              >
                <FaArrowLeftLong className="h-4 w-4 mr-2" />
                Back to course setup
              </button>
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-y-2">
                  <h1 className="text-2xl font-medium">Chapter Creation</h1>
                  <span className="text-sm text-slate-700">
                    Complete all fields {completionText}
                  </span>
                </div>
                <Suspense fallback={<div>Loading actions...</div>}>
                  <ChapterActions
                    disabled={!isComplete}
                    courseId={courseId}
                    chapterId={chapterId}
                    isPublished={chapter.isPublished}
                  />
                </Suspense>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={LuLayoutDashboard} />
                  <h2 className="text-xl">Customize your chapter</h2>
                </div>
                <Suspense fallback={<div>Loading title form...</div>}>
                  <ChapterTitleForm
                    initialData={chapter}
                    courseId={courseId}
                    chapterId={chapterId}
                  />
                </Suspense>
                <Suspense fallback={<div>Loading description form...</div>}>
                  <ChapterDescriptionForm
                    initialData={chapter}
                    courseId={courseId}
                    chapterId={chapterId}
                  />
                </Suspense>
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={FaEye} />
                  <h2 className="text-xl">Access Settings</h2>
                </div>
                <Suspense fallback={<div>Loading access form...</div>}>
                  <ChapterAccessForm
                    initialData={chapter}
                    courseId={courseId}
                    chapterId={chapterId}
                  />
                </Suspense>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={FaVideo} />
                <h2 className="text-xl">Add a video</h2>
              </div>
              <Suspense fallback={<div>Loading video form...</div>}>
                <ChapterVideoForm
                  initialData={chapter}
                  chapterId={chapterId}
                  courseId={courseId}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </>
    </Layout>
  );
};

export default UpdateChapter;
