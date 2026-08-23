import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Dashboard/Layout";
import useUserData from "../../../hooks/useUserData";
import useGetAllUsers from "../../../hooks/useGetAllUsers";
import useGetAllCourses from "../../../hooks/useGetAllCourses";
import { useCreatePeerAssignment } from "../../../hooks/peerMutations";
import { DEFAULT_RUBRIC } from "../../../constants/peerReviewFeedback";

const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40) || `c${Date.now()}`;

export default function CreatePeerAssignment() {
  const navigate = useNavigate();
  const { currentUser, loading } = useUserData();
  const { users } = useGetAllUsers();
  const { courses } = useGetAllCourses();
  const create = useCreatePeerAssignment();

  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [courseId, setCourseId] = useState("");
  const [rubric, setRubric] = useState(DEFAULT_RUBRIC);
  const [reviewersPerSubmission, setReviewers] = useState(2);
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [reviewDeadline, setReviewDeadline] = useState("");
  const [cohort, setCohort] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const students = (users || []).filter((u) => u.isStudent && !u.isTeacher && !u.isAdmin);

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

  const updateCriterion = (idx, label) => {
    const next = [...rubric];
    next[idx] = { ...next[idx], label, criterionId: next[idx].criterionId || slugify(label) };
    setRubric(next);
  };

  const addCriterion = () => {
    if (rubric.length >= 6) return;
    setRubric([
      ...rubric,
      { criterionId: slugify(`new-${rubric.length + 1}`), label: "", maxStars: 5 },
    ]);
  };

  const removeCriterion = (idx) => {
    if (rubric.length <= 1) return;
    setRubric(rubric.filter((_, i) => i !== idx));
  };

  const toggleStudent = (uid) => {
    setCohort((prev) =>
      prev.includes(uid) ? prev.filter((x) => x !== uid) : [...prev, uid]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!title.trim()) {
      setErrorMsg("Please give the assignment a title.");
      return;
    }
    const cleanRubric = rubric
      .filter((r) => r.label.trim())
      .map((r) => ({
        criterionId: r.criterionId || slugify(r.label),
        label: r.label.trim(),
        maxStars: 5,
      }));
    if (cleanRubric.length === 0) {
      setErrorMsg("Please add at least one rubric criterion with a label.");
      return;
    }
    if (cohort.length < 2) {
      setErrorMsg("Pick at least 2 students for the cohort (auto-assign needs more).");
      return;
    }
    try {
      const id = await create.mutateAsync({
        title: title.trim(),
        instructions,
        ownerId: currentUser.uid,
        ownerName: currentUser.name || currentUser.username || "",
        courseId: courseId || null,
        chapterId: null,
        rubric: cleanRubric,
        reviewersPerSubmission,
        submissionDeadline: submissionDeadline || null,
        reviewDeadline: reviewDeadline || null,
        cohortUserIds: cohort,
      });
      navigate(`/dashboard/peer-learning/teacher/assignments/${id}/manage`);
    } catch (err) {
      setErrorMsg(err.message || "Could not create assignment.");
    }
  };

  return (
    <Layout>
      <div className="p-6 flex-1 overflow-auto max-w-4xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">New Peer Assignment</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g. My favorite animal drawing"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Instructions <span className="text-xs text-gray-500 font-normal">(students see this)</span>
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows={3}
              placeholder="Tell students what to make and submit"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Linked course <span className="text-xs text-gray-500 font-normal">(optional)</span>
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">— none —</option>
              {(courses || []).map((c) => (
                <option key={c.courseId} value={c.courseId}>
                  {c.title || c.name || c.courseId}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">Rubric</label>
            <div className="space-y-2">
              {rubric.map((r, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={r.label}
                    onChange={(e) => updateCriterion(idx, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded"
                    placeholder="Criterion (e.g. Effort)"
                  />
                  <span className="text-xs text-gray-500">5 stars</span>
                  <button
                    type="button"
                    onClick={() => removeCriterion(idx)}
                    disabled={rubric.length <= 1}
                    className="px-2 py-1 text-sm text-red-600 disabled:opacity-30"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addCriterion}
                disabled={rubric.length >= 6}
                className="text-sm text-[#F38315] font-semibold disabled:opacity-40"
              >
                + Add criterion
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Reviewers per submission</label>
              <input
                type="number"
                min={1}
                max={4}
                value={reviewersPerSubmission}
                onChange={(e) => setReviewers(Number(e.target.value) || 2)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Submission deadline</label>
              <input
                type="date"
                value={submissionDeadline}
                onChange={(e) => setSubmissionDeadline(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Review deadline</label>
              <input
                type="date"
                value={reviewDeadline}
                onChange={(e) => setReviewDeadline(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Cohort <span className="text-xs text-gray-500 font-normal">({cohort.length} selected)</span>
            </label>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded p-3 bg-white">
              {students.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No students found.</p>
              ) : (
                students.map((s) => (
                  <label key={s.uid || s.userId} className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      checked={cohort.includes(s.uid)}
                      onChange={() => toggleStudent(s.uid)}
                    />
                    <span className="text-sm text-gray-700">
                      {s.name || s.username || s.email}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={create.isPending}
              className="px-6 py-2 bg-[#F38315] text-white rounded-full font-bold hover:opacity-80 disabled:opacity-50"
            >
              {create.isPending ? "Creating…" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/peer-learning/teacher/assignments")}
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
