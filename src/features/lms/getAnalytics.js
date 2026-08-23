import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";

const EMPTY = { data: [], totalRevenue: 0, totalSales: 0 };

export const getAnalytics = async (teacherId) => {
  try {
    const coursesQuery = teacherId
      ? query(collection(db, "courses"), where("instructor", "==", teacherId))
      : collection(db, "courses");
    const coursesSnap = await getDocs(coursesQuery);
    if (coursesSnap.empty) return EMPTY;

    const courses = coursesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const priceById = new Map(
      courses.map((c) => [c.id, parseFloat(c.price) || 0])
    );
    const nameById = new Map(
      courses.map((c) => [
        c.id,
        c.courseName || c.course_name || c.title || "(untitled)",
      ])
    );

    const purchaseSnaps = await Promise.all(
      courses.map((c) =>
        getDocs(
          query(collection(db, "purchases"), where("courseId", "==", c.id))
        )
      )
    );

    const grouped = new Map();
    let totalSales = 0;

    purchaseSnaps.forEach((snap, idx) => {
      const courseId = courses[idx].id;
      const courseName = nameById.get(courseId);
      const price = priceById.get(courseId);
      totalSales += snap.size;
      grouped.set(courseName, (grouped.get(courseName) || 0) + snap.size * price);
    });

    const data = Array.from(grouped, ([name, total]) => ({ name, total }));
    const totalRevenue = data.reduce((acc, c) => acc + c.total, 0);

    return { data, totalRevenue, totalSales };
  } catch (err) {
    console.error("[GET_ANALYTICS]", err);
    return EMPTY;
  }
};
