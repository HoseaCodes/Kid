import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";

export const getCompletedChapterIds = async (userId, courseId) => {
  if (!userId || !courseId) return [];

  try {
    const snap = await getDocs(
      query(
        collection(db, "userProgress"),
        where("userId", "==", userId),
        where("courseId", "==", courseId),
        where("isCompleted", "==", true)
      )
    );
    return snap.docs.map((d) => d.data().chapterId);
  } catch (err) {
    console.error("[GET_COMPLETED_CHAPTER_IDS]", err);
    return [];
  }
};
