import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

const fetchPeerAssignments = async ({ role, uid }) => {
  if (!uid) return [];
  const col = collection(db, "peerAssignments");
  let q;
  if (role === "teacher" || role === "admin") {
    q = role === "admin" ? col : query(col, where("ownerId", "==", uid));
  } else {
    q = query(col, where("cohortUserIds", "array-contains", uid));
  }
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  items.sort((a, b) => {
    const aTime = a.createdAt?.seconds || 0;
    const bTime = b.createdAt?.seconds || 0;
    return bTime - aTime;
  });
  return items;
};

const useGetPeerAssignments = ({ role, uid }) => {
  const { data: assignments = [], isLoading, error } = useQuery({
    queryKey: ["peer", "assignments", { role, uid }],
    queryFn: () => fetchPeerAssignments({ role, uid }),
    enabled: !!uid,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
  return { assignments, isLoading, error };
};

export default useGetPeerAssignments;
