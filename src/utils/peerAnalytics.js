// Pure analytics helpers for peer review data. Used by MyPeerResults and
// PeerAssignmentAnalytics screens. No Firestore here so they stay unit-testable.

export const averageByCriterion = (reviews, rubric) => {
  const result = {};
  for (const c of rubric || []) {
    let sum = 0;
    let n = 0;
    for (const r of reviews || []) {
      const v = r?.ratings?.[c.criterionId];
      if (typeof v === "number" && v >= 1 && v <= 5) {
        sum += v;
        n += 1;
      }
    }
    result[c.criterionId] = n === 0 ? 0 : Number((sum / n).toFixed(2));
  }
  return result;
};

export const tagFrequency = (reviews) => {
  const out = {};
  for (const r of reviews || []) {
    for (const t of r?.feedbackTagIds || []) {
      out[t] = (out[t] || 0) + 1;
    }
  }
  return out;
};

export const buildSelfVsPeerVsClass = ({ rubric, selfRating, myReceivedReviews, allAssignmentReviews }) => {
  // Returns the dataset shape Chart.js Bar expects.
  const peerAvg = averageByCriterion(myReceivedReviews, rubric);
  const classAvg = averageByCriterion(allAssignmentReviews, rubric);
  const labels = (rubric || []).map((c) => c.label);
  return {
    labels,
    datasets: [
      {
        label: "My self-rating",
        data: (rubric || []).map((c) => Number(selfRating?.[c.criterionId] || 0)),
        backgroundColor: "#F38315",
      },
      {
        label: "Avg peer rating",
        data: (rubric || []).map((c) => peerAvg[c.criterionId] || 0),
        backgroundColor: "#3b82f6",
      },
      {
        label: "Class average",
        data: (rubric || []).map((c) => classAvg[c.criterionId] || 0),
        backgroundColor: "#10b981",
      },
    ],
  };
};

export const buildClassAvgChart = ({ rubric, allAssignmentReviews }) => {
  const avg = averageByCriterion(allAssignmentReviews, rubric);
  return {
    labels: (rubric || []).map((c) => c.label),
    datasets: [
      {
        label: "Class average",
        data: (rubric || []).map((c) => avg[c.criterionId] || 0),
        backgroundColor: "#10b981",
      },
    ],
  };
};
