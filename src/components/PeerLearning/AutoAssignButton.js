import React, { useState } from "react";

export default function AutoAssignButton({
  isLoading = false,
  onConfirm,
  submissionCount = 0,
  reviewersPerSubmission = 2,
}) {
  const [confirming, setConfirming] = useState(false);
  const plural = reviewersPerSubmission === 1 ? "" : "s";

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={isLoading}
        className="px-4 py-2 bg-[#F38315] text-white rounded-full font-bold hover:opacity-80 disabled:opacity-50"
      >
        {isLoading ? "Assigning…" : "Close submissions & assign reviewers"}
      </button>

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-2">Close submissions?</h3>
            <p className="text-gray-700 mb-4">
              This will randomly assign <strong>{reviewersPerSubmission}</strong> peer reviewer
              {plural} to each of the <strong>{submissionCount}</strong> submissions. Each
              student will get {reviewersPerSubmission} review task{plural} to complete. New
              submissions won't be accepted after this.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirming(false);
                  onConfirm && onConfirm();
                }}
                className="px-4 py-2 bg-[#F38315] text-white rounded-full font-bold hover:opacity-80"
              >
                Yes, assign reviewers
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
