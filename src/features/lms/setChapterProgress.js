import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export const setChapterProgress = async ({
  userId,
  courseId,
  chapterId,
  isCompleted,
}) => {
  if (!userId || !courseId || !chapterId) {
    throw new Error("Missing required IDs for progress update");
  }

  await setDoc(
    doc(db, "userProgress", `${userId}_${chapterId}`),
    {
      userId,
      courseId,
      chapterId,
      isCompleted: Boolean(isCompleted),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};
