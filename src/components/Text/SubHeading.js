import React from "react";

export default function SubHeading({ children, className, ...props }) {
	return (
		<h1
			style={{
				lineHeight: 1,
			}}
			className={`
            text-[140%] md:text-[187%] xl:text-[250%] 
            font-bold font-[riffic]
            capitalize
            ${className}`}
			{...props}
		>
			{children}
		</h1>
	);
}
