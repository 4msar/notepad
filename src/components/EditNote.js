import React from "react";

export default function EditNote({ ...props }) {
	return (
		<section className="paper">
			<textarea
				autoFocus
				type="text"
				placeholder="Type your note here"
				{...props}
			></textarea>
		</section>
	);
}
