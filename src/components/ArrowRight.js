import React from "react";
import bg from "../assets/home-right.png";

export default function ArrowRight({ className, ...props }) {
	return (
		<img
			src={bg}
			alt="right_arrow_img"
			className={`hover:opacity-80 cursor-pointer ${className}`}
			{...props}
		/>
	);
}
