import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { db, storage } from "../../lib/firebase";

const EMPTY = {
  chapter: null,
  course: null,
  muxData: null,
  attachments: [],
  nextChapter: null,
  userProgress: null,
  purchase: null,
};

const listCourseAttachments = async (courseId) => {
  try {
    const res = await listAll(ref(storage, `courseAttachments/${courseId}`));
    return Promise.all(
      res.items.map(async (item) => ({
        id: item.fullPath,
        name: item.name,
        url: await getDownloadURL(item),
      }))
    );
  } catch (err) {
    console.error("[GET_CHAPTER_ATTACHMENTS]", err);
    return [];
  }
};

export const getChapter = async ({ userId, courseId, chapterId }) => {
  if (!userId || !courseId || !chapterId) return EMPTY;

  try {
    const [purchaseSnap, courseSnap, chapterSnap, progressSnap] =
      await Promise.all([
        getDoc(doc(db, "purchases", `${userId}_${courseId}`)),
        getDoc(doc(db, "courses", courseId)),
        getDoc(doc(db, "courses", courseId, "chapters", chapterId)),
        getDoc(doc(db, "userProgress", `${userId}_${chapterId}`)),
      ]);

    if (!courseSnap.exists() || courseSnap.data().isPublished !== true) {
      throw new Error("Course not found or unpublished");
    }
    if (!chapterSnap.exists() || chapterSnap.data().isPublished !== true) {
      throw new Error("Chapter not found or unpublished");
    }

    const purchase = purchaseSnap.exists()
      ? { id: purchaseSnap.id, ...purchaseSnap.data() }
      : null;
    const course = { id: courseSnap.id, ...courseSnap.data() };
    const chapter = { id: chapterSnap.id, ...chapterSnap.data() };
    const userProgress = progressSnap.exists()
      ? { id: progressSnap.id, ...progressSnap.data() }
      : null;

    let attachments = [];
    let nextChapter = null;

    if (purchase) {
      attachments = await listCourseAttachments(courseId);
    }

    if (chapter.isFree || purchase) {
      const nextSnap = await getDocs(
        query(
          collection(db, "courses", courseId, "chapters"),
          where("isPublished", "==", true),
          where("position", ">", chapter.position),
          orderBy("position", "asc"),
          limit(1)
        )
      );
      if (!nextSnap.empty) {
        const d = nextSnap.docs[0];
        nextChapter = { id: d.id, ...d.data() };
      }
    }

    return {
      chapter,
      course,
      muxData: null,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (err) {
    console.error("[GET_CHAPTER]", err);
    return EMPTY;
  }
};
