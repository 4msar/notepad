import React from "react";

export default function EditNote({ ...props }) {
	return (
		<section className="paper">
			<textarea
				type="text"
				placeholder="Type your note here"
				{...props}
			></textarea>
		</section>
	);
}
