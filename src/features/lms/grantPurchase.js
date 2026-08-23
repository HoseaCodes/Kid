import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export const grantPurchase = async ({ userId, courseId }) => {
  if (!userId || !courseId) {
    throw new Error("grantPurchase requires userId and courseId");
  }

  const ref = doc(db, "purchases", `${userId}_${courseId}`);
  const existing = await getDoc(ref);
  if (existing.exists()) return ref.id;

  await setDoc(ref, {
    userId,
    courseId,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};
