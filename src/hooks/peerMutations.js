import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebase";
import {
  PEER_FEEDBACK_TAG_IDS,
  MAX_FEEDBACK_TAGS_PER_REVIEW,
  DEFAULT_RUBRIC,
  FLAG_REASON_CODES,
} from "../constants/peerReviewFeedback";
import { assignReviewers } from "../utils/peerAssign";

const sanitizeRubric = (rubric) => {
  const list = Array.isArray(rubric) && rubric.length > 0 ? rubric : DEFAULT_RUBRIC;
  return list
    .filter((r) => r && r.criterionId && r.label)
    .map((r) => ({
      criterionId: String(r.criterionId).slice(0, 60),
      label: String(r.label).slice(0, 80),
      maxStars: 5,
    }));
};

const sanitizeRatings = (rubric, ratings) => {
  const out = {};
  for (const r of rubric) {
    const v = ratings?.[r.criterionId];
    const n = Number(v);
    if (Number.isInteger(n) && n >= 1 && n <= 5) {
      out[r.criterionId] = n;
    }
  }
  return out;
};

const sanitizeTagIds = (tagIds) => {
  if (!Array.isArray(tagIds)) return [];
  return tagIds
    .filter((t) => PEER_FEEDBACK_TAG_IDS.includes(t))
    .slice(0, MAX_FEEDBACK_TAGS_PER_REVIEW);
};

const toDateOrNull = (val) => {
  if (!val) return null;
  if (val instanceof Date) return Timestamp.fromDate(val);
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  return Timestamp.fromDate(d);
};

export const useCreatePeerAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      instructions,
      ownerId,
      ownerName,
      courseId = null,
      chapterId = null,
      rubric,
      reviewersPerSubmission = 2,
      submissionDeadline,
      reviewDeadline,
      cohortUserIds = [],
    }) => {
      if (!ownerId) throw new Error("ownerId is required");
      if (!title) throw new Error("title is required");
      const cleanRubric = sanitizeRubric(rubric);
      if (cleanRubric.length === 0) throw new Error("rubric must have at least one criterion");
      const reviewers = Math.max(1, Math.min(4, Number(reviewersPerSubmission) || 2));
      const docRef = await addDoc(collection(db, "peerAssignments"), {
        title: String(title).slice(0, 120),
        instructions: String(instructions || "").slice(0, 2000),
        ownerId,
        ownerName: ownerName || "",
        courseId,
        chapterId,
        rubric: cleanRubric,
        reviewersPerSubmission: reviewers,
        submissionDeadline: toDateOrNull(submissionDeadline),
        reviewDeadline: toDateOrNull(reviewDeadline),
        status: "open",
        cohortUserIds: Array.isArray(cohortUserIds) ? cohortUserIds.filter(Boolean) : [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await addDoc(collection(db, "peerActivityLog"), {
        actorId: ownerId,
        actorRole: "teacher",
        eventType: "ASSIGNMENT_CREATED",
        referenceId: docRef.id,
        assignmentId: docRef.id,
        description: `Assignment "${title}" created`,
        timestamp: serverTimestamp(),
      });
      return docRef.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["peer", "assignments"] });
    },
  });
};

const guessFileType = (file) => {
  if (!file) return "link";
  const t = file.type || "";
  if (t.startsWith("image/")) return "image";
  if (t === "application/pdf") return "pdf";
  if (t.startsWith("audio/")) return "audio";
  return "link";
};

export const useSubmitPeerWork = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      assignment,
      authorId,
      authorName,
      file,
      selfRating,
      selfFeedbackTags,
    }) => {
      if (!assignment?.id) throw new Error("assignment is required");
      if (!authorId) throw new Error("authorId is required");
      if (!file) throw new Error("Please attach a file before submitting");
      const path = `peer-submissions/${assignment.id}/${authorId}/${Date.now()}-${file.name}`;
      const fileRef = storageRef(storage, path);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);
      const docRef = await addDoc(collection(db, "peerSubmissions"), {
        assignmentId: assignment.id,
        authorId,
        authorName: authorName || "",
        fileUrl,
        fileType: guessFileType(file),
        selfRating: sanitizeRatings(assignment.rubric, selfRating),
        selfFeedbackTags: sanitizeTagIds(selfFeedbackTags),
        submittedAt: serverTimestamp(),
        status: "submitted",
        finalGrade: null,
        teacherNote: null,
      });
      await addDoc(collection(db, "peerActivityLog"), {
        actorId: authorId,
        actorRole: "student",
        eventType: "SUBMITTED",
        referenceId: docRef.id,
        assignmentId: assignment.id,
        description: `Submission by ${authorName || authorId}`,
        timestamp: serverTimestamp(),
      });
      return docRef.id;
    },
    onSuccess: (_id, vars) => {
      queryClient.invalidateQueries({ queryKey: ["peer", "mySubmissions", vars.authorId] });
      queryClient.invalidateQueries({
        queryKey: ["peer", "assignmentSubmissions", vars.assignment?.id],
      });
    },
  });
};

export const useAutoAssignReviewers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      assignmentId,
      assignmentTitle,
      reviewersPerSubmission,
      teacherId,
    }) => {
      if (!assignmentId) throw new Error("assignmentId required");
      if (!teacherId) throw new Error("teacherId required");
      const N = Math.max(1, Math.min(4, Number(reviewersPerSubmission) || 2));

      const subQ = query(
        collection(db, "peerSubmissions"),
        where("assignmentId", "==", assignmentId),
        where("status", "==", "submitted")
      );
      const snap = await getDocs(subQ);
      const submissions = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (submissions.length < N + 1) {
        throw new Error(
          `Need at least ${N + 1} submissions to assign ${N} reviewers each (got ${submissions.length}).`
        );
      }

      const pairs = assignReviewers(submissions, N);
      const subById = Object.fromEntries(submissions.map((s) => [s.id, s]));

      const chunkSize = 450;
      for (let start = 0; start < pairs.length; start += chunkSize) {
        const chunk = pairs.slice(start, start + chunkSize);
        const batch = writeBatch(db);
        for (const p of chunk) {
          const sub = subById[p.submissionId];
          const reviewRef = doc(collection(db, "peerReviews"));
          batch.set(reviewRef, {
            assignmentId,
            assignmentTitle: assignmentTitle || "",
            submissionId: p.submissionId,
            authorId: p.authorId,
            reviewerId: p.reviewerId,
            fileUrl: sub?.fileUrl || "",
            fileType: sub?.fileType || "link",
            ratings: {},
            feedbackTagIds: [],
            status: "pending",
            assignedAt: serverTimestamp(),
            submittedAt: null,
          });
        }
        await batch.commit();
      }

      await updateDoc(doc(db, "peerAssignments", assignmentId), {
        status: "reviewing",
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "peerActivityLog"), {
        actorId: teacherId,
        actorRole: "teacher",
        eventType: "AUTO_ASSIGNED",
        referenceId: assignmentId,
        assignmentId,
        description: `Assigned ${pairs.length} review slots across ${submissions.length} submissions`,
        timestamp: serverTimestamp(),
      });

      return { reviewCount: pairs.length, submissionCount: submissions.length };
    },
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["peer", "assignment", vars.assignmentId] });
      queryClient.invalidateQueries({ queryKey: ["peer", "assignments"] });
      queryClient.invalidateQueries({
        queryKey: ["peer", "assignmentReviews", vars.assignmentId],
      });
      queryClient.invalidateQueries({ queryKey: ["peer", "myReviews"] });
    },
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reviewId,
      reviewerId,
      assignmentId,
      rubric,
      ratings,
      feedbackTagIds,
    }) => {
      if (!reviewId) throw new Error("reviewId required");
      if (!reviewerId) throw new Error("reviewerId required");
      const cleanRatings = sanitizeRatings(rubric || [], ratings);
      const missing = (rubric || []).find((r) => !cleanRatings[r.criterionId]);
      if (missing) throw new Error(`Please rate "${missing.label}" before submitting.`);
      const cleanTags = sanitizeTagIds(feedbackTagIds);

      await updateDoc(doc(db, "peerReviews", reviewId), {
        ratings: cleanRatings,
        feedbackTagIds: cleanTags,
        status: "submitted",
        submittedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "peerActivityLog"), {
        actorId: reviewerId,
        actorRole: "student",
        eventType: "REVIEW_SUBMITTED",
        referenceId: reviewId,
        assignmentId: assignmentId || "",
        description: "Peer review submitted",
        timestamp: serverTimestamp(),
      });

      return reviewId;
    },
    onSuccess: (_id, vars) => {
      queryClient.invalidateQueries({ queryKey: ["peer", "myReviews", vars.reviewerId] });
      queryClient.invalidateQueries({ queryKey: ["peer", "review", vars.reviewId] });
      if (vars.assignmentId) {
        queryClient.invalidateQueries({
          queryKey: ["peer", "assignmentReviews", vars.assignmentId],
        });
      }
    },
  });
};

export const useFlagReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reviewId,
      submissionId,
      assignmentId,
      flaggerId,
      reasonCode,
    }) => {
      if (!reviewId || !submissionId || !assignmentId) {
        throw new Error("Missing required flag fields");
      }
      if (!FLAG_REASON_CODES.includes(reasonCode)) {
        throw new Error("Pick a reason from the list");
      }
      const docRef = await addDoc(collection(db, "peerFlags"), {
        reviewId,
        submissionId,
        assignmentId,
        flaggerId,
        reasonCode,
        status: "open",
        teacherNote: null,
        createdAt: serverTimestamp(),
        resolvedAt: null,
      });
      await addDoc(collection(db, "peerActivityLog"), {
        actorId: flaggerId,
        actorRole: "student",
        eventType: "FLAGGED",
        referenceId: docRef.id,
        assignmentId,
        description: `Review flagged: ${reasonCode}`,
        timestamp: serverTimestamp(),
      });
      return docRef.id;
    },
    onSuccess: (_id, vars) => {
      queryClient.invalidateQueries({ queryKey: ["peer", "flags", vars.assignmentId] });
    },
  });
};

export const useResolveFlag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ flagId, assignmentId, teacherId, status, teacherNote }) => {
      if (!flagId) throw new Error("flagId required");
      if (status !== "dismissed" && status !== "upheld") {
        throw new Error("status must be dismissed or upheld");
      }
      await updateDoc(doc(db, "peerFlags", flagId), {
        status,
        teacherNote: teacherNote ? String(teacherNote).slice(0, 500) : null,
        resolvedAt: serverTimestamp(),
      });
      await addDoc(collection(db, "peerActivityLog"), {
        actorId: teacherId,
        actorRole: "teacher",
        eventType: "FLAG_RESOLVED",
        referenceId: flagId,
        assignmentId,
        description: `Flag ${status}`,
        timestamp: serverTimestamp(),
      });
      return flagId;
    },
    onSuccess: (_id, vars) => {
      queryClient.invalidateQueries({ queryKey: ["peer", "flags", vars.assignmentId] });
    },
  });
};

export const useFinalizeGrade = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      submissionId,
      assignmentId,
      teacherId,
      finalGrade,
      teacherNote,
    }) => {
      if (!submissionId) throw new Error("submissionId required");
      const grade = Number(finalGrade);
      if (!Number.isFinite(grade) || grade < 0 || grade > 100) {
        throw new Error("Final grade must be 0-100");
      }
      await updateDoc(doc(db, "peerSubmissions", submissionId), {
        finalGrade: grade,
        teacherNote: teacherNote ? String(teacherNote).slice(0, 1000) : null,
        status: "graded",
      });
      await addDoc(collection(db, "peerActivityLog"), {
        actorId: teacherId,
        actorRole: "teacher",
        eventType: "FINALIZED",
        referenceId: submissionId,
        assignmentId: assignmentId || "",
        description: `Grade ${grade} finalized`,
        timestamp: serverTimestamp(),
      });
      return submissionId;
    },
    onSuccess: (_id, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["peer", "assignmentSubmissions", vars.assignmentId],
      });
      queryClient.invalidateQueries({ queryKey: ["peer", "mySubmissions"] });
    },
  });
};

export const useFinalizeAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ assignmentId, teacherId }) => {
      if (!assignmentId) throw new Error("assignmentId required");
      await updateDoc(doc(db, "peerAssignments", assignmentId), {
        status: "finalized",
        updatedAt: serverTimestamp(),
      });
      await addDoc(collection(db, "peerActivityLog"), {
        actorId: teacherId,
        actorRole: "teacher",
        eventType: "FINALIZED",
        referenceId: assignmentId,
        assignmentId,
        description: "Assignment finalized",
        timestamp: serverTimestamp(),
      });
      return assignmentId;
    },
    onSuccess: (_id, vars) => {
      queryClient.invalidateQueries({ queryKey: ["peer", "assignment", vars.assignmentId] });
      queryClient.invalidateQueries({ queryKey: ["peer", "assignments"] });
    },
  });
};
