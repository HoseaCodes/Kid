import React, { useState } from "react";
import { FLAG_REASONS } from "../../constants/peerReviewFeedback";

export default function FlagReviewModal({ open, onClose, onConfirm, isLoading = false }) {
  const [reasonCode, setReasonCode] = useState(FLAG_REASONS[0].code);

  if (!open) return null;

  const handleConfirm = () => {
    onConfirm && onConfirm(reasonCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full mx-4">
        <h3 className="text-lg font-bold mb-2">Tell your teacher about this review</h3>
        <p className="text-gray-600 text-sm mb-4">
          Your teacher will see your name and look at the review. Pick the closest reason -
          you don't need to write anything.
        </p>
        <div className="space-y-2 mb-4">
          {FLAG_REASONS.map((r) => (
            <label
              key={r.code}
              className={`flex items-start gap-2 p-2 rounded border cursor-pointer ${
                reasonCode === r.code
                  ? "border-[#F38315] bg-orange-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="flag-reason"
                value={r.code}
                checked={reasonCode === r.code}
                onChange={() => setReasonCode(r.code)}
                className="mt-0.5"
              />
              <span className="text-sm text-gray-700">{r.label}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-[#F38315] text-white rounded-full font-bold hover:opacity-80 disabled:opacity-50"
          >
            {isLoading ? "Sending…" : "Send to teacher"}
          </button>
        </div>
      </div>
    </div>
  );
}
