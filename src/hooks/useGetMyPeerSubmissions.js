import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

const fetchMyPeerSubmissions = async (uid) => {
  if (!uid) return [];
  const q = query(collection(db, "peerSubmissions"), where("authorId", "==", uid));
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  items.sort((a, b) => (b.submittedAt?.seconds || 0) - (a.submittedAt?.seconds || 0));
  return items;
};

const useGetMyPeerSubmissions = (uid) => {
  const { data: submissions = [], isLoading, error } = useQuery({
    queryKey: ["peer", "mySubmissions", uid],
    queryFn: () => fetchMyPeerSubmissions(uid),
    enabled: !!uid,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
  return { submissions, isLoading, error };
};

export default useGetMyPeerSubmissions;
