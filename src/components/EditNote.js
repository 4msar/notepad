import React, { forwardRef } from "react";

const EditNote = forwardRef((props, ref)=>{
	return (
		<section className="paper">
			<textarea
				autoFocus
				type="text"
				placeholder="Type your note here"
				{...props}
				ref={ref}
			></textarea>
		</section>
	)
})

export default EditNote;
