import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Editor from "../../Editor";
import Preview from "../../Preview";
import Button from "./Button";
import { cn } from "../../../utils/helperfunctions";
import { setChapter } from "../../../features/lms/setChapter";

const ChapterDescriptionForm = ({ initialData, courseId, chapterId }) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData?.description || "");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (updates) => setChapter({ courseId, chapterId, updates }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chapterAdmin", courseId, chapterId],
      });
    },
  });

  const toggleEdit = () => setIsEditing((v) => !v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value) return;
    try {
      await mutateAsync({ description: value });
      toggleEdit();
    } catch (err) {
      console.error("[CHAPTER_DESCRIPTION_SAVE]", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Description
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <span className="mr-2">✏️</span>
              Edit Description
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.description && "text-slate-500 italic"
          )}
        >
          {!initialData.description ? (
            "No description"
          ) : (
            <Preview value={initialData.description} />
          )}
        </div>
      )}
      {isEditing && (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Editor value={value} onChange={setValue} />
          <div className="flex items-center gap-x-2">
            <Button disabled={isPending} type="submit">
              Save
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ChapterDescriptionForm;
