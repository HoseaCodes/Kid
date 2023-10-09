import React from "react";

export default function BiggerParagraph({ children, className, ...props }) {
	return (
		<p
			className={`
            text-[115%] md:text-[130%] lg:text-[150%] ${className}`}
			{...props}
		>
			{children}
		</p>
	);
}
