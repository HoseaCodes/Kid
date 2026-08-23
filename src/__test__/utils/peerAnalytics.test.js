import {
  averageByCriterion,
  tagFrequency,
  buildSelfVsPeerVsClass,
} from "../../utils/peerAnalytics";

const rubric = [
  { criterionId: "effort", label: "Effort", maxStars: 5 },
  { criterionId: "creativity", label: "Creativity", maxStars: 5 },
];

describe("averageByCriterion", () => {
  test("averages valid ratings only", () => {
    const reviews = [
      { ratings: { effort: 4, creativity: 5 } },
      { ratings: { effort: 2, creativity: 3 } },
      { ratings: { effort: 10, creativity: 0 } }, // out-of-range, ignored
    ];
    const out = averageByCriterion(reviews, rubric);
    expect(out.effort).toBe(3);
    expect(out.creativity).toBe(4);
  });

  test("returns 0 when no valid ratings exist", () => {
    expect(averageByCriterion([], rubric).effort).toBe(0);
  });

  test("handles missing ratings field gracefully", () => {
    const out = averageByCriterion([{}, { ratings: {} }], rubric);
    expect(out.effort).toBe(0);
  });
});

describe("tagFrequency", () => {
  test("counts tag occurrences across reviews", () => {
    const reviews = [
      { feedbackTagIds: ["color", "neat"] },
      { feedbackTagIds: ["color", "creative"] },
      { feedbackTagIds: [] },
    ];
    const out = tagFrequency(reviews);
    expect(out.color).toBe(2);
    expect(out.neat).toBe(1);
    expect(out.creative).toBe(1);
  });

  test("returns empty for no reviews", () => {
    expect(tagFrequency([])).toEqual({});
  });
});

describe("buildSelfVsPeerVsClass", () => {
  test("produces three datasets in the expected order", () => {
    const out = buildSelfVsPeerVsClass({
      rubric,
      selfRating: { effort: 5, creativity: 4 },
      myReceivedReviews: [{ ratings: { effort: 4, creativity: 5 } }],
      allAssignmentReviews: [
        { ratings: { effort: 4, creativity: 5 } },
        { ratings: { effort: 2, creativity: 3 } },
      ],
    });
    expect(out.labels).toEqual(["Effort", "Creativity"]);
    expect(out.datasets).toHaveLength(3);
    expect(out.datasets[0].label).toBe("My self-rating");
    expect(out.datasets[0].data).toEqual([5, 4]);
    expect(out.datasets[1].label).toBe("Avg peer rating");
    expect(out.datasets[1].data).toEqual([4, 5]);
    expect(out.datasets[2].label).toBe("Class average");
    expect(out.datasets[2].data).toEqual([3, 4]);
  });
});
