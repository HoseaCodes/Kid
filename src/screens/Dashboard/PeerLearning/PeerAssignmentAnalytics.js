import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../../components/Dashboard/Layout";
import PeerAnalyticsChart from "../../../components/PeerLearning/PeerAnalyticsChart";
import useUserData from "../../../hooks/useUserData";
import useGetPeerAssignment from "../../../hooks/useGetPeerAssignment";
import useGetReviewsForAssignment from "../../../hooks/useGetReviewsForAssignment";
import useGetAssignmentSubmissions from "../../../hooks/useGetAssignmentSubmissions";
import { buildClassAvgChart, tagFrequency } from "../../../utils/peerAnalytics";
import { PEER_FEEDBACK_TAGS } from "../../../constants/peerReviewFeedback";

const TAG_LABELS = Object.fromEntries(PEER_FEEDBACK_TAGS.map((t) => [t.id, t.label]));

export default function PeerAssignmentAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, loading } = useUserData();
  const { assignment, isLoading } = useGetPeerAssignment(id);
  const { reviews } = useGetReviewsForAssignment(id);
  const { submissions } = useGetAssignmentSubmissions(id);

  if (loading || isLoading) {
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
  if (!assignment) {
    return (
      <Layout>
        <div className="p-6">Assignment not found.</div>
      </Layout>
    );
  }

  const submittedReviews = reviews.filter((r) => r.status === "submitted");
  const chartData = buildClassAvgChart({
    rubric: assignment.rubric || [],
    allAssignmentReviews: submittedReviews,
  });
  const tagCounts = tagFrequency(submittedReviews);
  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  const gradedCount = submissions.filter((s) => s.status === "graded").length;
  const averageGrade =
    gradedCount === 0
      ? 0
      : submissions
          .filter((s) => s.status === "graded")
          .reduce((sum, s) => sum + Number(s.finalGrade || 0), 0) / gradedCount;

  return (
    <Layout>
      <div className="p-6 flex-1 overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-800">Analytics: {assignment.title}</h1>
          <button
            onClick={() =>
              navigate(`/dashboard/peer-learning/teacher/assignments/${id}/manage`)
            }
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back to manage
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6 capitalize">Status: {assignment.status}</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-xs text-gray-500">Submissions</p>
            <p className="text-2xl font-bold text-gray-800">{submissions.length}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-xs text-gray-500">Reviews submitted</p>
            <p className="text-2xl font-bold text-gray-800">
              {submittedReviews.length} / {reviews.length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-xs text-gray-500">Graded</p>
            <p className="text-2xl font-bold text-gray-800">{gradedCount}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-xs text-gray-500">Avg final grade</p>
            <p className="text-2xl font-bold text-gray-800">
              {gradedCount === 0 ? "—" : averageGrade.toFixed(1)}
            </p>
          </div>
        </div>

        <section className="bg-white p-4 rounded-md shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-700 mb-3">Class avg per criterion</h2>
          <PeerAnalyticsChart data={chartData} />
        </section>

        <section className="bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-lg font-bold text-gray-700 mb-3">Most-picked feedback tags</h2>
          {sortedTags.length === 0 ? (
            <p className="text-gray-500 italic">No tags chosen yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500">
                <tr>
                  <th className="pb-2">Tag</th>
                  <th className="pb-2 text-right">Count</th>
                </tr>
              </thead>
              <tbody>
                {sortedTags.map(([tagId, count]) => (
                  <tr key={tagId} className="border-t border-gray-100">
                    <td className="py-2">{TAG_LABELS[tagId] || tagId}</td>
                    <td className="py-2 text-right font-semibold">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </Layout>
  );
}
