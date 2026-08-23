import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";

export const getProgress = async (userId, courseId) => {
  if (!userId || !courseId) return 0;

  try {
    const publishedSnap = await getDocs(
      query(
        collection(db, "courses", courseId, "chapters"),
        where("isPublished", "==", true)
      )
    );
    const total = publishedSnap.size;
    if (total === 0) return 0;

    const publishedIds = new Set(publishedSnap.docs.map((d) => d.id));

    const completedSnap = await getDocs(
      query(
        collection(db, "userProgress"),
        where("userId", "==", userId),
        where("courseId", "==", courseId),
        where("isCompleted", "==", true)
      )
    );

    const validCompleted = completedSnap.docs.filter((d) =>
      publishedIds.has(d.data().chapterId)
    ).length;

    return (validCompleted / total) * 100;
  } catch (err) {
    console.error("[GET_PROGRESS]", err);
    return 0;
  }
};
