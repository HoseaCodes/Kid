import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfirmModal } from "../../Modal/Confirm";
import Button from "./Button";
import { setChapter } from "../../../features/lms/setChapter";
import { deleteChapter } from "../../../features/lms/deleteChapter";

const Trash = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 7l-.867 12.142A2 2 0 0116.136 21H7.864a2 2 0 01-1.997-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h10"
    />
  </svg>
);

const ChapterActions = ({ disabled, courseId, chapterId, isPublished }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const togglePublishMutation = useMutation({
    mutationFn: () =>
      setChapter({
        courseId,
        chapterId,
        updates: { isPublished: !isPublished },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chapterAdmin", courseId, chapterId],
      });
      queryClient.invalidateQueries({ queryKey: ["chapters", courseId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteChapter({ courseId, chapterId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters", courseId] });
      navigate(`/dashboard/courses/${courseId}`);
    },
  });

  const isLoading =
    togglePublishMutation.isPending || deleteMutation.isPending;

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={() => togglePublishMutation.mutate()}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={() => deleteMutation.mutate()}>
        <Button size="sm" disabled={isLoading} variant="destructive">
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default ChapterActions;
