import React from "react";
import bg from "../assets/left-arrow.png";

export default function ArrowLeft({ className, ...props }) {
	return (
		<img
			src={bg}
			alt="left_arrow_img"
			className={`hover:opacity-80 cursor-pointer ${className}`}
			{...props}
		/>
	);
}
