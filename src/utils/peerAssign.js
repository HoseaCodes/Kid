// Pure reviewer-assignment logic. No Firestore here so it stays unit-testable.
//
// Algorithm (ring-walk):
//   1. Filter submissions to one-per-author (defensive; should already be true).
//   2. Fisher-Yates shuffle.
//   3. For each submission at ring position i, assign reviewers from positions
//      (i+1), (i+2), ... (i+N) mod len. Since the ring has unique authors and
//      we start at offset 1, the reviewer is never the submission's own author,
//      and each author appears as a reviewer for exactly N submissions.

export const shuffle = (arr, rng = Math.random) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const dedupeByAuthor = (submissions) => {
  const seen = new Set();
  const out = [];
  for (const s of submissions) {
    if (!s || !s.id || !s.authorId) continue;
    if (seen.has(s.authorId)) continue;
    seen.add(s.authorId);
    out.push(s);
  }
  return out;
};

export const assignReviewers = (submissions, reviewersPerSubmission, rng = Math.random) => {
  const N = Number(reviewersPerSubmission);
  if (!Array.isArray(submissions)) {
    throw new Error("submissions must be an array");
  }
  if (!Number.isInteger(N) || N < 1) {
    throw new Error("reviewersPerSubmission must be a positive integer");
  }
  const unique = dedupeByAuthor(submissions);
  if (unique.length < N + 1) {
    throw new Error(
      `Need at least ${N + 1} submissions from different authors; got ${unique.length}`
    );
  }

  const ring = shuffle(unique, rng);
  const len = ring.length;
  const assignments = [];
  for (let i = 0; i < len; i++) {
    const sub = ring[i];
    for (let k = 1; k <= N; k++) {
      const reviewer = ring[(i + k) % len];
      assignments.push({
        submissionId: sub.id,
        authorId: sub.authorId,
        reviewerId: reviewer.authorId,
      });
    }
  }
  return assignments;
};
