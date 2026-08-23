import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export const getChapterById = async (courseId, chapterId) => {
  if (!courseId || !chapterId) return null;

  try {
    const snap = await getDoc(
      doc(db, "courses", courseId, "chapters", chapterId)
    );
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (err) {
    console.error("[GET_CHAPTER_BY_ID]", err);
    return null;
  }
};
