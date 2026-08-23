import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

const fetchReviewsForAssignment = async (assignmentId) => {
  if (!assignmentId) return [];
  const q = query(
    collection(db, "peerReviews"),
    where("assignmentId", "==", assignmentId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

const useGetReviewsForAssignment = (assignmentId) => {
  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ["peer", "assignmentReviews", assignmentId],
    queryFn: () => fetchReviewsForAssignment(assignmentId),
    enabled: !!assignmentId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
  return { reviews, isLoading, error };
};

export default useGetReviewsForAssignment;
