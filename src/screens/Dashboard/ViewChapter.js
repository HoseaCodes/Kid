import React, { lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "../../components/Dashboard/Layout";
import { getChapter } from "../../features/lms/getChapter";
import { getChapters } from "../../features/lms/getChapters";

const Banner = lazy(() => import("../../components/Banner"));
const CourseLayout = lazy(() => import("../../components/Courses/CourseLayout"));
const VideoPlayer = lazy(() => import("../../components/VideoPlayer"));
const CourseProgressButton = lazy(() =>
  import("../../components/Chapters/CourseProgressButton")
);
const AttachmentList = lazy(() =>
  import("../../components/Chapters/AttachmentList")
);

const CourseEnrollButton = ({ price }) => (
  <button className="enroll-button">Enroll for ${price}</button>
);

const Separator = () => <hr className="separator" />;

const Preview = ({ value }) => <div className="preview">{value}</div>;

const ChapterIdPage = ({ currentUser }) => {
  const location = useLocation();
  const match = location.pathname.match(
    /\/courses\/([^/]+)\/chapters\/([^/]+)/
  );
  const courseId = match?.[1];
  const chapterId = match?.[2];
  const userId = currentUser?.uid;

  const { data, isLoading, error } = useQuery({
    queryKey: ["chapter", userId, courseId, chapterId],
    queryFn: () => getChapter({ userId, courseId, chapterId }),
    enabled: !!userId && !!courseId && !!chapterId,
    staleTime: 60 * 1000,
  });

  const { data: chapters = [] } = useQuery({
    queryKey: ["chapters", courseId],
    queryFn: () => getChapters(courseId),
    enabled: !!courseId,
    staleTime: 60 * 1000,
  });

  if (!match) return <div>Invalid chapter URL</div>;
  if (isLoading || !data) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { chapter, course, attachments, nextChapter, userProgress, purchase } =
    data;

  if (!chapter || !course) return <div>Chapter not found</div>;

  // CourseSidebar still consumes course.chapters as an array; attach the
  // subcollection result here so it keeps working without edits.
  const courseWithChapters = { ...course, chapters };

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <Layout>
      <Suspense fallback={<div>Loading course layout...</div>}>
        <CourseLayout
          courseId={courseId}
          currentUser={currentUser}
          course={courseWithChapters}
          setChapterId={() => {}}
        >
          <div>
            {userProgress?.isCompleted && (
              <Suspense fallback={<div>Loading banner...</div>}>
                <Banner
                  variant="success"
                  label="You already complete this chapter"
                />
              </Suspense>
            )}
            {isLocked && (
              <Suspense fallback={<div>Loading banner...</div>}>
                <Banner
                  variant="warning"
                  label="You need to purchase this course to watch this chapter"
                />
              </Suspense>
            )}
            <div className="flex flex-col max-w-4xl mx-auto pb-20">
              <div className="p-4">
                <Suspense fallback={<div>Loading video player...</div>}>
                  <VideoPlayer
                    chapter={chapter}
                    chapterId={chapter.id}
                    title={chapter.title}
                    courseId={courseId}
                    course={courseWithChapters}
                    nextChapterId={nextChapter?.id}
                    playbackId={null}
                    isLocked={isLocked}
                    completeOnEnd={completeOnEnd}
                  />
                </Suspense>
              </div>
              <div>
                <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                  <h2 className="text-2xl font-semibold mb-2">
                    {chapter.title}
                  </h2>
                  {purchase ? (
                    <Suspense fallback={<div>Loading progress button...</div>}>
                      <CourseProgressButton
                        chapterId={chapter.id}
                        courseId={courseId}
                        isCompleted={!!userProgress?.isCompleted}
                        nextChapterId={nextChapter?.id}
                      />
                    </Suspense>
                  ) : (
                    <Suspense fallback={<div>Loading enroll button...</div>}>
                      <CourseEnrollButton price={course.price} />
                    </Suspense>
                  )}
                </div>
                <Suspense fallback={<div>Loading separator...</div>}>
                  <Separator />
                </Suspense>
                <div>
                  <Suspense fallback={<div>Loading preview...</div>}>
                    <Preview value={chapter.description} />
                  </Suspense>
                </div>
                {!!attachments.length && (
                  <>
                    <Suspense fallback={<div>Loading separator...</div>}>
                      <Separator />
                    </Suspense>
                    <Suspense fallback={<div>Loading attachments...</div>}>
                      <AttachmentList attachments={attachments} />
                    </Suspense>
                  </>
                )}
              </div>
            </div>
          </div>
        </CourseLayout>
      </Suspense>
    </Layout>
  );
};

export default ChapterIdPage;
