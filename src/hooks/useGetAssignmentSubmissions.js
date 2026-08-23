import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

const fetchAssignmentSubmissions = async (assignmentId) => {
  if (!assignmentId) return [];
  const q = query(
    collection(db, "peerSubmissions"),
    where("assignmentId", "==", assignmentId)
  );
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  items.sort((a, b) => (b.submittedAt?.seconds || 0) - (a.submittedAt?.seconds || 0));
  return items;
};

const useGetAssignmentSubmissions = (assignmentId) => {
  const { data: submissions = [], isLoading, error } = useQuery({
    queryKey: ["peer", "assignmentSubmissions", assignmentId],
    queryFn: () => fetchAssignmentSubmissions(assignmentId),
    enabled: !!assignmentId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
  return { submissions, isLoading, error };
};

export default useGetAssignmentSubmissions;
