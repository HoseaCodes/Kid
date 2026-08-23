import React from "react";
import StarRating from "./StarRating";
import { PEER_FEEDBACK_TAGS } from "../../constants/peerReviewFeedback";

const TAG_LABELS = Object.fromEntries(PEER_FEEDBACK_TAGS.map((t) => [t.id, t.label]));

export default function ReviewCard({
  review,
  rubric = [],
  viewer = "author", // "author" | "teacher"
  rightAction = null,
}) {
  if (!review) return null;
  const isTeacher = viewer === "teacher";
  const reviewerLabel = isTeacher ? review.reviewerName || review.reviewerId || "Reviewer" : "Anonymous";

  return (
    <div className="p-4 bg-white rounded-md shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">From</p>
          <p className="font-bold text-gray-800">{reviewerLabel}</p>
        </div>
        {rightAction}
      </div>

      <div className="space-y-2 mb-3">
        {rubric.map((c) => (
          <div key={c.criterionId} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{c.label}</span>
            <StarRating
              value={Number(review.ratings?.[c.criterionId] || 0)}
              disabled
              size={20}
            />
          </div>
        ))}
      </div>

      {Array.isArray(review.feedbackTagIds) && review.feedbackTagIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {review.feedbackTagIds.map((id) => (
            <span
              key={id}
              className="px-2 py-0.5 bg-orange-50 text-[#F38315] text-xs rounded-full border border-orange-200"
            >
              {TAG_LABELS[id] || id}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
