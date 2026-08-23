import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

const fetchReviewsAssignedToMe = async (uid) => {
  if (!uid) return [];
  const q = query(collection(db, "peerReviews"), where("reviewerId", "==", uid));
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  items.sort((a, b) => (b.assignedAt?.seconds || 0) - (a.assignedAt?.seconds || 0));
  return items;
};

const useGetReviewsAssignedToMe = (uid) => {
  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ["peer", "myReviews", uid],
    queryFn: () => fetchReviewsAssignedToMe(uid),
    enabled: !!uid,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
  return { reviews, isLoading, error };
};

export default useGetReviewsAssignedToMe;
