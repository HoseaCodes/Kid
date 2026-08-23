import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../../components/Dashboard/Layout";
import AutoAssignButton from "../../../components/PeerLearning/AutoAssignButton";
import useUserData from "../../../hooks/useUserData";
import useGetPeerAssignment from "../../../hooks/useGetPeerAssignment";
import useGetAssignmentSubmissions from "../../../hooks/useGetAssignmentSubmissions";
import useGetReviewsForAssignment from "../../../hooks/useGetReviewsForAssignment";
import useGetPeerFlags from "../../../hooks/useGetPeerFlags";
import {
  useAutoAssignReviewers,
  useResolveFlag,
  useFinalizeGrade,
  useFinalizeAssignment,
} from "../../../hooks/peerMutations";
import { FLAG_REASONS } from "../../../constants/peerReviewFeedback";
import { averageByCriterion } from "../../../utils/peerAnalytics";

const FLAG_REASON_LABELS = Object.fromEntries(FLAG_REASONS.map((r) => [r.code, r.label]));

const fmtTime = (ts) => {
  if (!ts?.seconds) return "—";
  return new Date(ts.seconds * 1000).toLocaleString();
};

export default function ManagePeerAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, loading } = useUserData();
  const { assignment, isLoading } = useGetPeerAssignment(id);
  const { submissions, isLoading: subsLoading } = useGetAssignmentSubmissions(id);
  const { reviews } = useGetReviewsForAssignment(id);
  const { flags } = useGetPeerFlags(id);
  const autoAssign = useAutoAssignReviewers();
  const resolveFlag = useResolveFlag();
  const finalizeGrade = useFinalizeGrade();
  const finalizeAssignment = useFinalizeAssignment();
  const [autoAssignError, setAutoAssignError] = useState("");
  const [gradeDrafts, setGradeDrafts] = useState({});
  const [gradeError, setGradeError] = useState({});

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

  const cohortCount = assignment.cohortUserIds?.length || 0;
  const submittedCount = submissions.length;
  const reviewersPerSub = assignment.reviewersPerSubmission || 2;
  const minNeeded = reviewersPerSub + 1;
  const enoughForAutoAssign = submittedCount >= minNeeded;
  const totalReviews = reviews.length;
  const submittedReviewCount = reviews.filter((r) => r.status === "submitted").length;
  const reviewProgress = totalReviews === 0 ? 0 : Math.round((submittedReviewCount / totalReviews) * 100);

  const handleAutoAssign = async () => {
    setAutoAssignError("");
    try {
      await autoAssign.mutateAsync({
        assignmentId: id,
        assignmentTitle: assignment.title,
        reviewersPerSubmission: reviewersPerSub,
        teacherId: currentUser.uid,
      });
    } catch (err) {
      setAutoAssignError(err.message || "Could not assign reviewers.");
    }
  };

  const handleResolveFlag = (flagId, status) => {
    resolveFlag.mutate({
      flagId,
      assignmentId: id,
      teacherId: currentUser.uid,
      status,
    });
  };

  const reviewsBySubmission = reviews.reduce((acc, r) => {
    if (r.status !== "submitted") return acc;
    (acc[r.submissionId] = acc[r.submissionId] || []).push(r);
    return acc;
  }, {});

  const handleFinalize = async (submission) => {
    const draft = gradeDrafts[submission.id];
    const grade = Number(draft);
    if (!Number.isFinite(grade) || grade < 0 || grade > 100) {
      setGradeError((prev) => ({ ...prev, [submission.id]: "Grade must be 0-100" }));
      return;
    }
    setGradeError((prev) => ({ ...prev, [submission.id]: "" }));
    try {
      await finalizeGrade.mutateAsync({
        submissionId: submission.id,
        assignmentId: id,
        teacherId: currentUser.uid,
        finalGrade: grade,
      });
    } catch (err) {
      setGradeError((prev) => ({
        ...prev,
        [submission.id]: err.message || "Could not save grade.",
      }));
    }
  };

  const openFlags = flags.filter((f) => f.status === "open");
  const allGraded = submissions.length > 0 && submissions.every((s) => s.status === "graded");

  return (
    <Layout>
      <div className="p-6 flex-1 overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-800">{assignment.title}</h1>
          <button
            onClick={() => navigate("/dashboard/peer-learning/teacher/assignments")}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back to list
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6 capitalize">Status: {assignment.status}</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-xs text-gray-500">Cohort</p>
            <p className="text-2xl font-bold text-gray-800">{cohortCount}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-xs text-gray-500">Submissions</p>
            <p className="text-2xl font-bold text-gray-800">{submittedCount}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-xs text-gray-500">Reviewers / sub</p>
            <p className="text-2xl font-bold text-gray-800">
              {assignment.reviewersPerSubmission}
            </p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-xs text-gray-500">Rubric criteria</p>
            <p className="text-2xl font-bold text-gray-800">{assignment.rubric?.length || 0}</p>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-700 mb-3">Submissions</h2>
          {subsLoading ? (
            <p className="text-gray-500">Loading submissions…</p>
          ) : submissions.length === 0 ? (
            <p className="text-gray-500 italic">No students have submitted yet.</p>
          ) : (
            <div className="bg-white rounded-md shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 text-left">
                  <tr>
                    <th className="p-3">Student</th>
                    <th className="p-3">Submitted</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">File</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s) => (
                    <tr key={s.id} className="border-t border-gray-100">
                      <td className="p-3 font-semibold text-gray-800">
                        {s.authorName || s.authorId}
                      </td>
                      <td className="p-3 text-gray-700">{fmtTime(s.submittedAt)}</td>
                      <td className="p-3 capitalize text-gray-700">{s.status}</td>
                      <td className="p-3">
                        {s.fileUrl ? (
                          <a
                            href={s.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#F38315] underline"
                          >
                            View
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-3">Next step</h2>
          <div className="bg-white p-4 rounded-md shadow-sm space-y-3">
            {assignment.status === "open" && (
              enoughForAutoAssign ? (
                <>
                  <p className="text-gray-700">
                    You have enough submissions. Closing the window now will randomly assign{" "}
                    <strong>{reviewersPerSub}</strong> peer reviewer
                    {reviewersPerSub === 1 ? "" : "s"} to each of the{" "}
                    <strong>{submittedCount}</strong> submissions.
                  </p>
                  <AutoAssignButton
                    isLoading={autoAssign.isPending}
                    onConfirm={handleAutoAssign}
                    submissionCount={submittedCount}
                    reviewersPerSubmission={reviewersPerSub}
                  />
                  {autoAssignError && (
                    <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded text-sm">
                      {autoAssignError}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-700">
                  Waiting on submissions. Need at least <strong>{minNeeded}</strong> submitted to
                  auto-assign reviewers (currently {submittedCount}).
                </p>
              )
            )}

            {assignment.status === "reviewing" && (
              <>
                <p className="text-gray-700">
                  Peer reviews are in progress. <strong>{submittedReviewCount}</strong> of{" "}
                  <strong>{totalReviews}</strong> reviews submitted ({reviewProgress}%).
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-[#F38315] transition-all"
                    style={{ width: `${reviewProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Once all reviews are in, you'll be able to finalize grades (coming in Phase C).
                </p>
              </>
            )}

            {(assignment.status === "closed" || assignment.status === "finalized") && (
              <p className="text-gray-700 capitalize">
                Assignment is {assignment.status}.
              </p>
            )}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-700">Flags</h2>
            <button
              onClick={() =>
                navigate(`/dashboard/peer-learning/teacher/assignments/${id}/analytics`)
              }
              className="text-sm text-[#F38315] hover:underline"
            >
              View analytics →
            </button>
          </div>
          {flags.length === 0 ? (
            <p className="text-gray-500 italic">No flags raised on this assignment.</p>
          ) : (
            <div className="bg-white rounded-md shadow-sm divide-y divide-gray-100">
              {flags.map((f) => (
                <div key={f.id} className="p-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {FLAG_REASON_LABELS[f.reasonCode] || f.reasonCode}
                    </p>
                    <p className="text-xs text-gray-500">
                      Flagged by {f.flaggerId} · review {f.reviewId}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {f.status === "open" ? (
                      <>
                        <button
                          onClick={() => handleResolveFlag(f.id, "dismissed")}
                          disabled={resolveFlag.isPending}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-bold hover:bg-gray-300 disabled:opacity-50"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleResolveFlag(f.id, "upheld")}
                          disabled={resolveFlag.isPending}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold hover:bg-red-200 disabled:opacity-50"
                        >
                          Uphold
                        </button>
                      </>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold capitalize">
                        {f.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {openFlags.length > 0 && (
            <p className="text-xs text-amber-700 mt-2">
              {openFlags.length} open flag{openFlags.length === 1 ? "" : "s"} - resolve before finalizing grades.
            </p>
          )}
        </section>

        {assignment.status === "reviewing" || assignment.status === "closed" || assignment.status === "finalized" ? (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-700 mb-3">Finalize grades</h2>
            {submissions.length === 0 ? (
              <p className="text-gray-500 italic">No submissions to grade.</p>
            ) : (
              <div className="bg-white rounded-md shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 text-left">
                    <tr>
                      <th className="p-3">Student</th>
                      <th className="p-3">Peer avg</th>
                      <th className="p-3">Final grade</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((s) => {
                      const received = reviewsBySubmission[s.id] || [];
                      const avgPerCriterion = averageByCriterion(
                        received,
                        assignment.rubric || []
                      );
                      const allCriteriaAvg =
                        (assignment.rubric || []).length === 0
                          ? 0
                          : Object.values(avgPerCriterion).reduce((a, b) => a + b, 0) /
                            (assignment.rubric || []).length;
                      const draft =
                        gradeDrafts[s.id] !== undefined
                          ? gradeDrafts[s.id]
                          : s.finalGrade != null
                          ? s.finalGrade
                          : "";
                      return (
                        <tr key={s.id} className="border-t border-gray-100">
                          <td className="p-3 font-semibold text-gray-800">
                            {s.authorName || s.authorId}
                          </td>
                          <td className="p-3 text-gray-700">
                            {received.length === 0
                              ? "—"
                              : `${allCriteriaAvg.toFixed(1)} / 5 (${received.length} review${received.length === 1 ? "" : "s"})`}
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              step={1}
                              value={draft}
                              onChange={(e) =>
                                setGradeDrafts((prev) => ({
                                  ...prev,
                                  [s.id]: e.target.value,
                                }))
                              }
                              className="w-20 p-1 border border-gray-300 rounded text-sm"
                              placeholder="0-100"
                            />
                            {gradeError[s.id] && (
                              <p className="text-xs text-red-600 mt-1">{gradeError[s.id]}</p>
                            )}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleFinalize(s)}
                              disabled={finalizeGrade.isPending}
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                s.status === "graded"
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-[#F38315] text-white hover:opacity-80"
                              } disabled:opacity-50`}
                            >
                              {s.status === "graded" ? "Update" : "Save grade"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {allGraded && assignment.status !== "finalized" && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-center justify-between">
                <p className="text-green-800">
                  All submissions have a final grade. You can lock the assignment now.
                </p>
                <button
                  onClick={() =>
                    finalizeAssignment.mutate({
                      assignmentId: id,
                      teacherId: currentUser.uid,
                    })
                  }
                  disabled={finalizeAssignment.isPending}
                  className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-bold hover:bg-green-700 disabled:opacity-50"
                >
                  {finalizeAssignment.isPending ? "Finalizing…" : "Finalize assignment"}
                </button>
              </div>
            )}
          </section>
        ) : null}
      </div>
    </Layout>
  );
}
