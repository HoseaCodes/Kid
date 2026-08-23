import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "./Button";
import { setChapter } from "../../../features/lms/setChapter";

const Input = ({ disabled, placeholder, value, onChange }) => (
  <input
    type="text"
    disabled={disabled}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="input-class"
  />
);

const ChapterTitleForm = ({ initialData, courseId, chapterId }) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(initialData.title || "");
  const [formErrors, setFormErrors] = useState({});

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (updates) => setChapter({ courseId, chapterId, updates }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chapterAdmin", courseId, chapterId],
      });
      queryClient.invalidateQueries({ queryKey: ["chapters", courseId] });
    },
  });

  const toggleEdit = () => setIsEditing((v) => !v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue) {
      setFormErrors({ title: "Title is required" });
      return;
    }
    try {
      await mutateAsync({ title: inputValue });
      setFormErrors({});
      toggleEdit();
    } catch (err) {
      console.error("[CHAPTER_TITLE_SAVE]", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Title
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <span className="mr-2">✏️</span>
              Edit Title
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-2">{initialData.title}</p>}
      {isEditing && (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Input
              disabled={isPending}
              placeholder="e.g 'Introduction to the course'"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {formErrors.title && (
              <p className="form-error">{formErrors.title}</p>
            )}
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

export default ChapterTitleForm;
