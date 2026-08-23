import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../../components/Dashboard/Layout";
import RubricForm from "../../../components/PeerLearning/RubricForm";
import useUserData from "../../../hooks/useUserData";
import useGetReview from "../../../hooks/useGetReview";
import useGetPeerAssignment from "../../../hooks/useGetPeerAssignment";
import { useSubmitReview } from "../../../hooks/peerMutations";

const FilePreview = ({ fileUrl, fileType }) => {
  if (!fileUrl) return <p className="text-gray-500 italic">No file attached</p>;
  if (fileType === "image") {
    return (
      <img
        src={fileUrl}
        alt="Classmate's submission"
        className="max-w-full max-h-[480px] rounded border border-gray-200"
      />
    );
  }
  if (fileType === "pdf") {
    return (
      <embed
        src={fileUrl}
        type="application/pdf"
        className="w-full h-[480px] border border-gray-200 rounded"
      />
    );
  }
  if (fileType === "audio") {
    return <audio controls src={fileUrl} className="w-full" />;
  }
  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noreferrer"
      className="text-[#F38315] underline"
    >
      Open the file
    </a>
  );
};

export default function PeerReviewTask() {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const { currentUser, loading } = useUserData();
  const { review, isLoading: reviewLoading } = useGetReview(reviewId);
  const { assignment, isLoading: assignmentLoading } = useGetPeerAssignment(
    review?.assignmentId
  );
  const submit = useSubmitReview();

  const [ratings, setRatings] = useState({});
  const [tags, setTags] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  if (loading || reviewLoading || (review && assignmentLoading)) {
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
  if (!review) {
    return (
      <Layout>
        <div className="p-6">Review task not found.</div>
      </Layout>
    );
  }
  if (review.reviewerId !== currentUser.uid) {
    return (
      <Layout>
        <div className="p-6">This review isn't assigned to you.</div>
      </Layout>
    );
  }
  if (review.status === "submitted") {
    return (
      <Layout>
        <div className="p-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Review submitted</h1>
          <p className="text-gray-600 mb-6">
            Thanks for the feedback! Your classmate will see your stars and tags.
          </p>
          <button
            onClick={() => navigate("/dashboard/peer-learning")}
            className="px-4 py-2 bg-[#F38315] text-white rounded-full font-bold hover:opacity-80"
          >
            Back to Peer Learning
          </button>
        </div>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const missing = (assignment.rubric || []).find((r) => !ratings[r.criterionId]);
    if (missing) {
      setErrorMsg(`Please rate "${missing.label}" before submitting.`);
      return;
    }
    try {
      await submit.mutateAsync({
        reviewId,
        reviewerId: currentUser.uid,
        assignmentId: review.assignmentId,
        rubric: assignment.rubric || [],
        ratings,
        feedbackTagIds: tags,
      });
      navigate("/dashboard/peer-learning");
    } catch (err) {
      setErrorMsg(err.message || "Could not submit review.");
    }
  };

  return (
    <Layout>
      <div className="p-6 flex-1 overflow-auto max-w-3xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Peer review: {assignment.title}
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Your classmate's name is hidden. Be kind - pick stars and friendly tags.
        </p>

        <div className="mb-6 p-4 bg-white rounded-md shadow-sm">
          <h2 className="font-bold text-gray-700 mb-3">Your classmate's work</h2>
          <FilePreview fileUrl={review.fileUrl} fileType={review.fileType} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <RubricForm
              rubric={assignment.rubric || []}
              ratings={ratings}
              onRatingsChange={setRatings}
              feedbackTagIds={tags}
              onFeedbackTagsChange={setTags}
              heading="Rate your classmate's work"
              feedbackHeading="Pick a few friendly tags"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submit.isPending}
              className="px-6 py-2 bg-[#F38315] text-white rounded-full font-bold hover:opacity-80 disabled:opacity-50"
            >
              {submit.isPending ? "Submitting…" : "Submit review"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/peer-learning")}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
