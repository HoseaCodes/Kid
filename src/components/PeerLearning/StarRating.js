import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

export default function StarRating({ value = 0, onChange, max = 5, disabled = false, size = 28 }) {
  const stars = [];
  for (let i = 1; i <= max; i++) {
    const filled = i <= value;
    const Icon = filled ? AiFillStar : AiOutlineStar;
    stars.push(
      <button
        key={i}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onChange && onChange(i)}
        aria-label={`${i} star${i === 1 ? "" : "s"}`}
        className={`p-0.5 ${disabled ? "cursor-default" : "cursor-pointer hover:opacity-80"}`}
      >
        <Icon size={size} color={filled ? "#F38315" : "#cbd5e1"} />
      </button>
    );
  }
  return <div className="flex items-center">{stars}</div>;
}
