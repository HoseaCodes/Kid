import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export const getPurchase = async (userId, courseId) => {
  if (!userId || !courseId) return null;

  try {
    const snap = await getDoc(
      doc(db, "purchases", `${userId}_${courseId}`)
    );
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (err) {
    console.error("[GET_PURCHASE]", err);
    return null;
  }
};
