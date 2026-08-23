import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

const fetchReviewsForMySubmission = async ({ submissionId, uid }) => {
  if (!submissionId || !uid) return [];
  const q = query(
    collection(db, "peerReviews"),
    where("submissionId", "==", submissionId),
    where("status", "==", "submitted")
  );
  const snap = await getDocs(q);
  // Defensive: filter to reviews where the calling user is the author.
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((r) => r.authorId === uid);
};

const useGetReviewsForMySubmission = ({ submissionId, uid }) => {
  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ["peer", "submissionReviews", submissionId, uid],
    queryFn: () => fetchReviewsForMySubmission({ submissionId, uid }),
    enabled: !!submissionId && !!uid,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
  return { reviews, isLoading, error };
};

export default useGetReviewsForMySubmission;
