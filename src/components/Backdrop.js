import React from "react";

export default function Backdrop({ className, ...props }) {
	return (
		<div
			style={{
				background: "rgba(0, 0, 0, 0.5)",
			}}
			className={`Menu fixed top-0 right-0 w-full h-screen z-30 backdrop-blur-md ${className}`}
			{...props}
		/>
	);
}
