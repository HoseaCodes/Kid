import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const fetchPeerAssignment = async (id) => {
  if (!id) return null;
  const snap = await getDoc(doc(db, "peerAssignments", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

const useGetPeerAssignment = (id) => {
  const { data: assignment = null, isLoading, error } = useQuery({
    queryKey: ["peer", "assignment", id],
    queryFn: () => fetchPeerAssignment(id),
    enabled: !!id,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
  return { assignment, isLoading, error };
};

export default useGetPeerAssignment;
