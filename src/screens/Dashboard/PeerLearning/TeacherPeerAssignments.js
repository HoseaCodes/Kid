import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Dashboard/Layout";
import useUserData from "../../../hooks/useUserData";
import useGetPeerAssignments from "../../../hooks/useGetPeerAssignments";

const fmtDate = (ts) => {
  if (!ts?.seconds) return "—";
  return new Date(ts.seconds * 1000).toLocaleDateString();
};

export default function TeacherPeerAssignments() {
  const navigate = useNavigate();
  const { currentUser, loading } = useUserData();
  const role = currentUser?.isAdmin ? "admin" : "teacher";
  const { assignments, isLoading } = useGetPeerAssignments({
    role,
    uid: currentUser?.uid,
  });

  if (loading) {
    return (
      <Layout>
        <div className="p-6">Loading…</div>
      </Layout>
    );
  }
  if (!currentUser || (!currentUser.isTeacher && !currentUser.isAdmin)) {
    return (
      <Layout>
        <div className="p-6">Teachers only.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 flex-1 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Peer Assignments</h1>
          <button
            onClick={() => navigate("/dashboard/peer-learning/teacher/assignments/new")}
            className="px-4 py-2 bg-[#F38315] text-white rounded-full font-bold hover:opacity-80"
          >
            + New
          </button>
        </div>

        {isLoading ? (
          <p className="text-gray-500">Loading…</p>
        ) : assignments.length === 0 ? (
          <div className="p-8 bg-white rounded-md shadow-sm text-center">
            <p className="text-gray-600 mb-4">You haven't created any peer assignments yet.</p>
            <button
              onClick={() => navigate("/dashboard/peer-learning/teacher/assignments/new")}
              className="px-4 py-2 bg-[#F38315] text-white rounded-full font-bold hover:opacity-80"
            >
              Create your first one
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-md shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-left">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Cohort</th>
                  <th className="p-3">Reviewers / sub</th>
                  <th className="p-3">Submission due</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => (
                  <tr key={a.id} className="border-t border-gray-100">
                    <td className="p-3 font-semibold text-gray-800">{a.title}</td>
                    <td className="p-3 capitalize text-gray-700">{a.status}</td>
                    <td className="p-3 text-gray-700">{a.cohortUserIds?.length || 0}</td>
                    <td className="p-3 text-gray-700">{a.reviewersPerSubmission}</td>
                    <td className="p-3 text-gray-700">{fmtDate(a.submissionDeadline)}</td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/peer-learning/teacher/assignments/${a.id}/manage`
                          )
                        }
                        className="px-3 py-1 bg-[#F38315] text-white rounded-full text-xs font-bold hover:opacity-80"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
