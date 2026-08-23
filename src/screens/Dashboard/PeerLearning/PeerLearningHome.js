import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Dashboard/Layout";
import useUserData from "../../../hooks/useUserData";
import useGetPeerAssignments from "../../../hooks/useGetPeerAssignments";
import useGetMyPeerSubmissions from "../../../hooks/useGetMyPeerSubmissions";
import useGetReviewsAssignedToMe from "../../../hooks/useGetReviewsAssignedToMe";

const StatusPill = ({ status }) => {
  const styles = {
    open: "bg-green-100 text-green-800",
    reviewing: "bg-blue-100 text-blue-800",
    closed: "bg-gray-200 text-gray-700",
    finalized: "bg-purple-100 text-purple-800",
    draft: "bg-yellow-100 text-yellow-800",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
};

export default function PeerLearningHome() {
  const { currentUser, loading } = useUserData();
  const navigate = useNavigate();
  const role = currentUser?.isAdmin
    ? "admin"
    : currentUser?.isTeacher
    ? "teacher"
    : "student";

  const { assignments, isLoading } = useGetPeerAssignments({
    role,
    uid: currentUser?.uid,
  });
  const { submissions } = useGetMyPeerSubmissions(currentUser?.uid);
  const submittedAssignmentIds = new Set(submissions.map((s) => s.assignmentId));
  const { reviews } = useGetReviewsAssignedToMe(currentUser?.uid);
  const pendingReviews = reviews.filter((r) => r.status === "pending");
  const submittedReviewCount = reviews.length - pendingReviews.length;

  if (loading) {
    return (
      <Layout>
        <div className="p-6">Loading…</div>
      </Layout>
    );
  }

  if (!currentUser) {
    return (
      <Layout>
        <div className="p-6">Please log in to see peer learning.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 flex-1 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Peer Learning</h1>
          {(role === "teacher" || role === "admin") && (
            <button
              onClick={() => navigate("/dashboard/peer-learning/teacher/assignments")}
              className="px-4 py-2 bg-[#F38315] text-white rounded-full font-bold hover:opacity-80"
            >
              Manage Assignments
            </button>
          )}
        </div>

        <p className="text-gray-600 mb-6">
          Look at your classmates' work and learn from each other. Pick stars and friendly tags - no
          mean words allowed.
        </p>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-700 mb-3">My Assignments</h2>
          {isLoading ? (
            <p className="text-gray-500">Loading…</p>
          ) : assignments.length === 0 ? (
            <p className="text-gray-500 italic">No peer assignments yet.</p>
          ) : (
            <div className="grid gap-3">
              {assignments.map((a) => {
                const alreadySubmitted = submittedAssignmentIds.has(a.id);
                return (
                  <div
                    key={a.id}
                    className="p-4 bg-white rounded-md shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-800">{a.title}</h3>
                        <StatusPill status={a.status} />
                      </div>
                      {a.instructions && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{a.instructions}</p>
                      )}
                    </div>
                    <div>
                      {role === "student" ? (
                        alreadySubmitted ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                            Submitted
                          </span>
                        ) : a.status === "open" ? (
                          <button
                            onClick={() =>
                              navigate(`/dashboard/peer-learning/assignments/${a.id}/submit`)
                            }
                            className="px-4 py-2 bg-[#F38315] text-white rounded-full text-sm font-bold hover:opacity-80"
                          >
                            Submit
                          </button>
                        ) : (
                          <span className="text-sm text-gray-500">Closed</span>
                        )
                      ) : (
                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/peer-learning/teacher/assignments/${a.id}/manage`
                            )
                          }
                          className="px-4 py-2 bg-[#F38315] text-white rounded-full text-sm font-bold hover:opacity-80"
                        >
                          Manage
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-700">Reviews To Do</h2>
            {reviews.length > 0 && (
              <span className="text-xs text-gray-500">
                {submittedReviewCount} of {reviews.length} done
              </span>
            )}
          </div>
          {pendingReviews.length === 0 ? (
            reviews.length === 0 ? (
              <p className="text-gray-500 italic">
                No peer reviews assigned yet. They'll show up here once your teacher closes the
                submission window.
              </p>
            ) : (
              <p className="text-green-700 font-semibold">
                All done - thanks for reviewing your classmates' work!
              </p>
            )
          ) : (
            <div className="grid gap-3">
              {pendingReviews.map((r) => (
                <div
                  key={r.id}
                  className="p-4 bg-white rounded-md shadow-sm flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {r.assignmentTitle || "Peer review"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Your classmate's name is hidden. Tap stars and pick friendly tags.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/dashboard/peer-learning/reviews/${r.id}`)
                    }
                    className="px-4 py-2 bg-[#F38315] text-white rounded-full text-sm font-bold hover:opacity-80"
                  >
                    Start review
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
