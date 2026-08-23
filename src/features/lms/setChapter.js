import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export const setChapter = async ({ courseId, chapterId, updates }) => {
  if (!courseId || !chapterId) {
    throw new Error("setChapter requires courseId and chapterId");
  }
  await updateDoc(doc(db, "courses", courseId, "chapters", chapterId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};
