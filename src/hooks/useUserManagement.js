
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db, updateFireStoreDoc } from "../lib/firebase";
import { generateUsername } from "../utils/helperfunctions";


const useUserManagement = () => {
  const queryClient = useQueryClient();

  const addUser = useMutation({
    mutationFn: async (newUser) => {
      const userData = {
        name: newUser.name,
        email: newUser.email,
        username: generateUsername(),
        isAdmin: newUser.role === "admin",
        isTeacher: newUser.role === "instructor",
        isStudent: newUser.role === "student",
        avatar:
          "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
        phone: null,
        pendingCourses: [],
        cart: {},
        courses: [],
        transactions: [],
        pendingTransactions: [],
        announcements: {},
        tutoringSessions: [],
        completedCourses: [],
        forPaymentCourses: [],
        deniedCourses: [],
      };
      await addDoc(collection(db, "users"), userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId) => {
      await deleteDoc(doc(db, "users", userId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const updateUser = useMutation({
    mutationFn: async ({ userId, editingUser }) => {
      const updatedUser = {
        name: editingUser.name,
        email: editingUser.email,
        isAdmin: editingUser.role === "admin" || editingUser.isAdmin,
        isTeacher: editingUser.role === "instructor" || editingUser.isTeacher,
        isStudent: editingUser.role === "student" || editingUser.isStudent,
      };
      await updateFireStoreDoc("users", userId, updatedUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return {
    addUser,
    deleteUser,
    updateUser,
  };
};

export default useUserManagement;
