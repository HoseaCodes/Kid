import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { getProgress } from "./getProgress";

const EMPTY = { coursesInProgress: [], completedCourses: [] };

export const getDashboardCourses = async (userId) => {
  if (!userId) return EMPTY;

  try {
    const purchasesSnap = await getDocs(
      query(collection(db, "purchases"), where("userId", "==", userId))
    );
    if (purchasesSnap.empty) return EMPTY;

    const courseIds = purchasesSnap.docs.map((d) => d.data().courseId);

    const courseSnaps = await Promise.all(
      courseIds.map((id) => getDoc(doc(db, "courses", id)))
    );

    const existing = courseSnaps.filter((snap) => snap.exists());

    const courses = await Promise.all(
      existing.map(async (snap) => ({
        id: snap.id,
        ...snap.data(),
        progress: await getProgress(userId, snap.id),
      }))
    );

    return {
      coursesInProgress: courses.filter((c) => (c.progress ?? 0) < 100),
      completedCourses: courses.filter((c) => c.progress === 100),
    };
  } catch (err) {
    console.error("[GET_DASHBOARD_COURSES]", err);
    return EMPTY;
  }
};
