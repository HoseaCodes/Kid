import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebase";
import { useConfettiStore } from "../../hooks/useConfettiStore";
import { setChapterProgress } from "../../features/lms/setChapterProgress";

const CourseProgressButton = ({
  chapterId,
  courseId,
  nextChapterId,
  isCompleted,
}) => {
  const navigate = useNavigate();
  const confetti = useConfettiStore();
  const queryClient = useQueryClient();
  const [user] = useAuthState(auth);
  const userId = user?.uid;

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      setChapterProgress({
        userId,
        courseId,
        chapterId,
        isCompleted: !isCompleted,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chapter", userId, courseId, chapterId],
      });
      queryClient.invalidateQueries({
        queryKey: ["courseProgress", userId, courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["completedChapterIds", userId, courseId],
      });

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }
      if (!isCompleted && nextChapterId) {
        navigate(`/dashboard/courses/${courseId}/chapters/${nextChapterId}`);
      }
    },
    onError: (err) => {
      console.error("[MARK_CHAPTER_PROGRESS]", err);
    },
  });

  const disabled = isPending || !userId || !courseId || !chapterId;

  return (
    <span onClick={() => !disabled && mutate()}>
      {isCompleted ? <span>⭕️</span> : <span>✅</span>}
      &nbsp;
      <button
        disabled={disabled}
        className={isCompleted ? "outline" : "success"}
      >
        {isCompleted ? "Not completed" : "Mark as complete"}
      </button>
    </span>
  );
};

export default CourseProgressButton;
