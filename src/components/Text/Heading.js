import React from "react";

export default function Heading({ children, className, ...props }) {
	return (
		<h1
			style={{
				lineHeight: 1,
			}}
			className={`
            text-[200%] md:text-[300%] lg:text-[400%]  
            font-bold font-[riffic] 
            capitalize
            ${className}`}
			{...props}
		>
			{children}
		</h1>
	);
}
