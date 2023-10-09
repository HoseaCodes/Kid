import React from "react";

export default function Input({ className, ...props }) {
	return (
		<input
			type="text"
			className={`bg-transparent p-2 border-b-2 border-[#00000033] focus:outline-none  ${className}`}
			{...props}
		/>
	);
}
