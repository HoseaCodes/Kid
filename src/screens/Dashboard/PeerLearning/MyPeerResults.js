import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Dashboard/Layout";
import PeerAnalyticsChart from "../../../components/PeerLearning/PeerAnalyticsChart";
import ReviewCard from "../../../components/PeerLearning/ReviewCard";
import FlagReviewModal from "../../../components/PeerLearning/FlagReviewModal";
import useUserData from "../../../hooks/useUserData";
import useGetMyPeerSubmissions from "../../../hooks/useGetMyPeerSubmissions";
import useGetPeerAssignment from "../../../hooks/useGetPeerAssignment";
import useGetReviewsForMySubmission from "../../../hooks/useGetReviewsForMySubmission";
import useGetReviewsForAssignment from "../../../hooks/useGetReviewsForAssignment";
import { useFlagReview } from "../../../hooks/peerMutations";
import { buildSelfVsPeerVsClass } from "../../../utils/peerAnalytics";
import { PEER_FEEDBACK_TAGS } from "../../../constants/peerReviewFeedback";

const TAG_LABELS = Object.fromEntries(PEER_FEEDBACK_TAGS.map((t) => [t.id, t.label]));

const SubmissionResultPanel = ({ submission, uid }) => {
  const { assignment, isLoading: assignmentLoading } = useGetPeerAssignment(submission.assignmentId);
  const { reviews: myReceived, isLoading: receivedLoading } = useGetReviewsForMySubmission({
    submissionId: submission.id,
    uid,
  });
  const { reviews: allAssignmentReviews } = useGetReviewsForAssignment(submission.assignmentId);
  const flag = useFlagReview();

  const [flagState, setFlagState] = useState({ open: false, reviewId: null });
  const [flagError, setFlagError] = useState("");
  const [flaggedReviewIds, setFlaggedReviewIds] = useState(new Set());

  if (assignmentLoading || receivedLoading) {
    return (
      <div className="p-4 bg-white rounded-md shadow-sm">Loading {submission.id}…</div>
    );
  }
  if (!assignment) return null;

  const submittedClassReviews = allAssignmentReviews.filter((r) => r.status === "submitted");

  const chartData = buildSelfVsPeerVsClass({
    rubric: assignment.rubric || [],
    selfRating: submission.selfRating || {},
    myReceivedReviews: myReceived,
    allAssignmentReviews: submittedClassReviews,
  });

  const allTagCounts = {};
  for (const r of myReceived) {
    for (const t of r.feedbackTagIds || []) {
      allTagCounts[t] = (allTagCounts[t] || 0) + 1;
    }
  }
  const topTags = Object.entries(allTagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const handleFlagConfirm = async (reasonCode) => {
    setFlagError("");
    try {
      await flag.mutateAsync({
        reviewId: flagState.reviewId,
        submissionId: submission.id,
        assignmentId: submission.assignmentId,
        flaggerId: uid,
        reasonCode,
      });
      setFlaggedReviewIds((prev) => new Set(prev).add(flagState.reviewId));
      setFlagState({ open: false, reviewId: null });
    } catch (err) {
      setFlagError(err.message || "Could not send flag.");
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm p-5 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{assignment.title}</h3>
          <p className="text-xs text-gray-500 capitalize">
            Status: {submission.status}
            {submission.finalGrade != null && (
              <span className="ml-2 font-semibold text-green-700">
                Final grade: {submission.finalGrade}/100
              </span>
            )}
          </p>
        </div>
        {submission.fileUrl && (
          <a
            href={submission.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-[#F38315] underline"
          >
            My file
          </a>
        )}
      </div>

      {myReceived.length === 0 ? (
        <p className="text-gray-500 italic text-sm">
          No peer reviews back yet. Check back after your classmates finish reviewing.
        </p>
      ) : (
        <>
          <PeerAnalyticsChart data={chartData} />
          {topTags.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">
                Tags your classmates picked
              </h4>
              <div className="flex flex-wrap gap-2">
                {topTags.map(([tagId, count]) => (
                  <span
                    key={tagId}
                    className="px-3 py-1 bg-orange-50 text-[#F38315] text-xs rounded-full border border-orange-200"
                  >
                    {TAG_LABELS[tagId] || tagId} × {count}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2 text-sm">Reviews you got</h4>
            <div className="grid gap-3">
              {myReceived.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  rubric={assignment.rubric || []}
                  viewer="author"
                  rightAction={
                    flaggedReviewIds.has(review.id) ? (
                      <span className="text-xs text-gray-500">Sent to teacher</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setFlagState({ open: true, reviewId: review.id })}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Tell teacher
                      </button>
                    )
                  }
                />
              ))}
            </div>
            {flagError && (
              <div className="mt-2 p-3 bg-red-50 text-red-700 border border-red-200 rounded text-sm">
                {flagError}
              </div>
            )}
          </div>
        </>
      )}

      <FlagReviewModal
        open={flagState.open}
        isLoading={flag.isPending}
        onClose={() => setFlagState({ open: false, reviewId: null })}
        onConfirm={handleFlagConfirm}
      />
    </div>
  );
};

export default function MyPeerResults() {
  const navigate = useNavigate();
  const { currentUser, loading } = useUserData();
  const { submissions, isLoading } = useGetMyPeerSubmissions(currentUser?.uid);

  if (loading || isLoading) {
    return (
      <Layout>
        <div className="p-6">Loading…</div>
      </Layout>
    );
  }
  if (!currentUser) {
    return (
      <Layout>
        <div className="p-6">Please log in.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 flex-1 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Peer Results</h1>
          <button
            onClick={() => navigate("/dashboard/peer-learning")}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
        </div>

        {submissions.length === 0 ? (
          <p className="text-gray-500 italic">
            You haven't submitted any peer assignments yet.
          </p>
        ) : (
          <div className="space-y-6">
            {submissions.map((s) => (
              <SubmissionResultPanel key={s.id} submission={s} uid={currentUser.uid} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
