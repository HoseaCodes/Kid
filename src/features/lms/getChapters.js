import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";

export const getChapters = async (
  courseId,
  { includeUnpublished = false } = {}
) => {
  if (!courseId) return [];

  try {
    const base = collection(db, "courses", courseId, "chapters");
    const q = includeUnpublished
      ? query(base, orderBy("position", "asc"))
      : query(
          base,
          where("isPublished", "==", true),
          orderBy("position", "asc")
        );

    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("[GET_CHAPTERS]", err);
    return [];
  }
};
