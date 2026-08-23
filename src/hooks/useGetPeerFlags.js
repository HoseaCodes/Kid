import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

const fetchPeerFlags = async (assignmentId) => {
  if (!assignmentId) return [];
  const q = query(
    collection(db, "peerFlags"),
    where("assignmentId", "==", assignmentId)
  );
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  return items;
};

const useGetPeerFlags = (assignmentId) => {
  const { data: flags = [], isLoading, error } = useQuery({
    queryKey: ["peer", "flags", assignmentId],
    queryFn: () => fetchPeerFlags(assignmentId),
    enabled: !!assignmentId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
  return { flags, isLoading, error };
};

export default useGetPeerFlags;
