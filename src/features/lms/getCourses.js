import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { getProgress } from "./getProgress";

const titleOf = (c) =>
  c.courseName || c.course_name || c.title || "";

export const getCourses = async ({
  userId,
  title,
  categoryId,
  gradeLevel,
  subject,
  hidePurchased = false,
} = {}) => {
  try {
    const coursesSnap = await getDocs(collection(db, "courses"));
    let courses = coursesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    courses = courses.filter((c) => c.isPublished === true);

    if (categoryId) {
      courses = courses.filter((c) => c.categoryId === categoryId);
    }
    if (gradeLevel) {
      courses = courses.filter(
        (c) => String(c.gradeLevel) === String(gradeLevel)
      );
    }
    if (subject) {
      courses = courses.filter((c) => c.subject === subject);
    }
    if (title) {
      const q = title.toLowerCase();
      courses = courses.filter((c) => titleOf(c).toLowerCase().includes(q));
    }

    if (userId) {
      const purchasesSnap = await getDocs(
        query(collection(db, "purchases"), where("userId", "==", userId))
      );
      const purchasedIds = new Set(
        purchasesSnap.docs.map((d) => d.data().courseId)
      );

      courses = await Promise.all(
        courses.map(async (c) => {
          const isPurchased = purchasedIds.has(c.id);
          const progress = isPurchased ? await getProgress(userId, c.id) : null;
          return { ...c, isPurchased, progress };
        })
      );

      if (hidePurchased) {
        courses = courses.filter((c) => !c.isPurchased);
      }
    }

    courses.sort((a, b) => {
      const aTime = a.createdAt?.seconds ?? 0;
      const bTime = b.createdAt?.seconds ?? 0;
      return bTime - aTime;
    });

    return courses;
  } catch (err) {
    console.error("[GET_COURSES]", err);
    return [];
  }
};
