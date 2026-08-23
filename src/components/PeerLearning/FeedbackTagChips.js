import React from "react";
import {
  PEER_FEEDBACK_TAGS,
  MAX_FEEDBACK_TAGS_PER_REVIEW,
} from "../../constants/peerReviewFeedback";

export default function FeedbackTagChips({ value = [], onChange, disabled = false }) {
  const selected = new Set(value);
  const atMax = selected.size >= MAX_FEEDBACK_TAGS_PER_REVIEW;

  const toggle = (id) => {
    if (disabled) return;
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else if (!atMax) {
      next.add(id);
    } else {
      return;
    }
    onChange && onChange(Array.from(next));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {PEER_FEEDBACK_TAGS.map((tag) => {
          const isOn = selected.has(tag.id);
          const isDisabled = disabled || (!isOn && atMax);
          return (
            <button
              key={tag.id}
              type="button"
              disabled={isDisabled}
              onClick={() => toggle(tag.id)}
              className={`px-3 py-1 text-sm rounded-full border transition ${
                isOn
                  ? "bg-[#F38315] text-white border-[#F38315]"
                  : "bg-white text-gray-700 border-gray-300 hover:border-[#F38315]"
              } ${isDisabled && !isOn ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {tag.label}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Pick up to {MAX_FEEDBACK_TAGS_PER_REVIEW} ({selected.size} selected)
      </p>
    </div>
  );
}
