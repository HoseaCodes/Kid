import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export const deleteChapter = async ({ courseId, chapterId }) => {
  if (!courseId || !chapterId) {
    throw new Error("deleteChapter requires courseId and chapterId");
  }
  await deleteDoc(doc(db, "courses", courseId, "chapters", chapterId));
};
