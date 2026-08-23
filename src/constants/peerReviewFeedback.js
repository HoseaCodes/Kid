export const PEER_FEEDBACK_TAGS = [
  { id: "color", label: "Great use of color" },
  { id: "clarity", label: "Clear explanation" },
  { id: "creative", label: "Creative idea" },
  { id: "effort", label: "Lots of effort" },
  { id: "neat", label: "Neat and organized" },
  { id: "details", label: "Loved the details" },
  { id: "story", label: "Great storytelling" },
  { id: "improve", label: "Almost there - keep going!" },
  { id: "questions", label: "Made me think" },
  { id: "teamwork", label: "Nice teamwork" },
];

export const PEER_FEEDBACK_TAG_IDS = PEER_FEEDBACK_TAGS.map((t) => t.id);

export const MAX_FEEDBACK_TAGS_PER_REVIEW = 6;

export const FLAG_REASONS = [
  { code: "unfair_rating", label: "I don't think this rating is fair" },
  { code: "off_topic", label: "The review wasn't about my work" },
  { code: "incomplete_review", label: "The review feels incomplete" },
  { code: "bullying_or_mean", label: "The review felt mean" },
  { code: "other", label: "Something else - please review" },
];

export const FLAG_REASON_CODES = FLAG_REASONS.map((r) => r.code);

export const DEFAULT_RUBRIC = [
  { criterionId: "effort", label: "Effort", maxStars: 5 },
  { criterionId: "creativity", label: "Creativity", maxStars: 5 },
  { criterionId: "clarity", label: "Clarity", maxStars: 5 },
];

export const PEER_ASSIGNMENT_STATUSES = [
  "draft",
  "open",
  "reviewing",
  "closed",
  "finalized",
];

export const PEER_SUBMISSION_STATUSES = ["submitted", "reviewed", "graded"];

export const PEER_REVIEW_STATUSES = ["pending", "submitted"];
