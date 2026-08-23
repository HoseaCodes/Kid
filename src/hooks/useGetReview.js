import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const fetchReview = async (id) => {
  if (!id) return null;
  const snap = await getDoc(doc(db, "peerReviews", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

const useGetReview = (id) => {
  const { data: review = null, isLoading, error } = useQuery({
    queryKey: ["peer", "review", id],
    queryFn: () => fetchReview(id),
    enabled: !!id,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
  return { review, isLoading, error };
};

export default useGetReview;
