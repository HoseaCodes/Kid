import React from "react";
import StarRating from "./StarRating";
import FeedbackTagChips from "./FeedbackTagChips";

export default function RubricForm({
  rubric = [],
  ratings = {},
  onRatingsChange,
  feedbackTagIds = [],
  onFeedbackTagsChange,
  disabled = false,
  heading = "Rate each part",
  feedbackHeading = "Add some encouragement",
}) {
  const setRating = (criterionId, stars) => {
    if (!onRatingsChange) return;
    onRatingsChange({ ...ratings, [criterionId]: stars });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-gray-800 mb-3">{heading}</h3>
        <div className="space-y-3">
          {rubric.map((criterion) => (
            <div
              key={criterion.criterionId}
              className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200"
            >
              <span className="font-medium text-gray-700">{criterion.label}</span>
              <StarRating
                value={Number(ratings[criterion.criterionId] || 0)}
                onChange={(n) => setRating(criterion.criterionId, n)}
                disabled={disabled}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-gray-800 mb-3">{feedbackHeading}</h3>
        <FeedbackTagChips
          value={feedbackTagIds}
          onChange={onFeedbackTagsChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
