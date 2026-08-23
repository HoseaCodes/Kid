import { assignReviewers } from "../../utils/peerAssign";

const fixedRng = () => 0.5; // deterministic for tests

describe("assignReviewers", () => {
  const make = (n) =>
    Array.from({ length: n }, (_, i) => ({ id: `s${i}`, authorId: `u${i}` }));

  test("throws when not enough submissions for the requested N", () => {
    expect(() => assignReviewers(make(2), 2, fixedRng)).toThrow(/at least 3/);
  });

  test("throws when reviewersPerSubmission is invalid", () => {
    expect(() => assignReviewers(make(5), 0, fixedRng)).toThrow();
    expect(() => assignReviewers(make(5), -1, fixedRng)).toThrow();
    expect(() => assignReviewers(make(5), 1.5, fixedRng)).toThrow();
  });

  test("produces exactly submissions * N assignments", () => {
    const out = assignReviewers(make(3), 2, fixedRng);
    expect(out).toHaveLength(6);
  });

  test("never assigns a reviewer to their own submission", () => {
    const out = assignReviewers(make(5), 2, fixedRng);
    out.forEach((a) => expect(a.reviewerId).not.toBe(a.authorId));
  });

  test("each author appears as reviewer exactly N times (load-balanced)", () => {
    const submissions = make(5);
    const out = assignReviewers(submissions, 2, fixedRng);
    const counts = {};
    out.forEach((a) => {
      counts[a.reviewerId] = (counts[a.reviewerId] || 0) + 1;
    });
    submissions.forEach((s) => expect(counts[s.authorId]).toBe(2));
  });

  test("each submission gets exactly N distinct reviewers", () => {
    const out = assignReviewers(make(6), 3, fixedRng);
    const bySubmission = {};
    out.forEach((a) => {
      bySubmission[a.submissionId] = bySubmission[a.submissionId] || new Set();
      bySubmission[a.submissionId].add(a.reviewerId);
    });
    Object.values(bySubmission).forEach((set) => expect(set.size).toBe(3));
  });

  test("dedupes submissions sharing an authorId", () => {
    const subs = [
      { id: "s0", authorId: "u0" },
      { id: "s0dup", authorId: "u0" },
      { id: "s1", authorId: "u1" },
      { id: "s2", authorId: "u2" },
    ];
    const out = assignReviewers(subs, 2, fixedRng);
    expect(out).toHaveLength(6); // 3 unique authors * 2
  });
});
