import React from "react";

export default function BigParagraph({ children, className, ...props }) {
	return (
		<p
			className={`
            text-[100%] md:text-[110%] lg:text-[130%] ${className}`}
			{...props}
		>
			{children}
		</p>
	);
}
