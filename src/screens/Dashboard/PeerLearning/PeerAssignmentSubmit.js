import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../../components/Dashboard/Layout";
import RubricForm from "../../../components/PeerLearning/RubricForm";
import useUserData from "../../../hooks/useUserData";
import useGetPeerAssignment from "../../../hooks/useGetPeerAssignment";
import { useSubmitPeerWork } from "../../../hooks/peerMutations";

export default function PeerAssignmentSubmit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, loading } = useUserData();
  const { assignment, isLoading } = useGetPeerAssignment(id);
  const submit = useSubmitPeerWork();

  const [file, setFile] = useState(null);
  const [ratings, setRatings] = useState({});
  const [tags, setTags] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

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
        <div className="p-6">Please log in to submit.</div>
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
    if (!file) {
      setErrorMsg("Please attach a file first.");
      return;
    }
    const missing = assignment.rubric.find((r) => !ratings[r.criterionId]);
    if (missing) {
      setErrorMsg(`Please rate "${missing.label}" before submitting.`);
      return;
    }
    try {
      await submit.mutateAsync({
        assignment,
        authorId: currentUser.uid,
        authorName: currentUser.name || currentUser.username || "",
        file,
        selfRating: ratings,
        selfFeedbackTags: tags,
      });
      navigate("/dashboard/peer-learning");
    } catch (err) {
      setErrorMsg(err.message || "Could not submit.");
    }
  };

  return (
    <Layout>
      <div className="p-6 flex-1 overflow-auto max-w-3xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{assignment.title}</h1>
        {assignment.instructions && (
          <p className="text-gray-600 mb-6 whitespace-pre-line">{assignment.instructions}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-bold text-gray-800 mb-2">Your work</label>
            <input
              type="file"
              accept="image/*,application/pdf,audio/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#F38315] file:text-white hover:file:opacity-80"
            />
            {file && (
              <p className="text-xs text-gray-500 mt-1">Selected: {file.name}</p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <RubricForm
              rubric={assignment.rubric || []}
              ratings={ratings}
              onRatingsChange={setRatings}
              feedbackTagIds={tags}
              onFeedbackTagsChange={setTags}
              heading="Rate your own work (this stays private from your classmates)"
              feedbackHeading="What you think went well"
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
              {submit.isPending ? "Submitting…" : "Submit"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/peer-learning")}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
