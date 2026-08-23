import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "../../Checkbox";
import Button from "./Button";
import { cn } from "../../../utils/helperfunctions";
import { setChapter } from "../../../features/lms/setChapter";

const ChapterAccessForm = ({ initialData, courseId, chapterId }) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isFree, setIsFree] = useState(initialData.isFree || false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (updates) => setChapter({ courseId, chapterId, updates }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chapterAdmin", courseId, chapterId],
      });
    },
  });

  const toggleEdit = () => setIsEditing((v) => !v);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await mutateAsync({ isFree });
      toggleEdit();
    } catch (err) {
      console.error("[CHAPTER_ACCESS_SAVE]", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter access
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <span className="mr-2">✏️</span>
              Edit access
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.isFree && "text-slate-500 italic"
          )}
        >
          {initialData.isFree
            ? "This chapter is free for preview."
            : "This chapter is not free."}
        </p>
      )}
      {isEditing && (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <Checkbox checked={isFree} onChange={setIsFree} />
            <div className="space-y-1 leading-none">
              <p>
                Check this box if you want to make this chapter free for preview
              </p>
            </div>
          </div>
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

export default ChapterAccessForm;
