import React from "react";

export default function Paragraph({ children, className, ...props }) {
	return (
		<p
			className={`text-[80%] md:text-[90%] lg:text-[100%] ${className}`}
			{...props}
		>
			{children}
		</p>
	);
}
