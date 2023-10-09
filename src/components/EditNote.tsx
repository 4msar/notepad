import React, { forwardRef, useEffect, useState } from "react";

const EditNote = forwardRef(({ defaultValue, onChange, ...props }, ref) => {
	const [value, setValue] = useState(defaultValue ?? "");

	useEffect(() => {
		setValue(defaultValue);
	}, [defaultValue]);

	const handleChange = (event) => {
		const {
			target: { value },
		} = event;
		setValue(value);
		if (typeof onChange === "function") {
			onChange(event);
		}
	};

	return (
		<section className="paper">
			<textarea
				autoFocus
				type="text"
				placeholder="Type your note here"
				value={value}
				onChange={handleChange}
				{...props}
				ref={ref}
			></textarea>
		</section>
	);
});

export default EditNote;

/*
usage: 
<EditNote
	defaultValue={data?.note ?? ""}
	readOnly={isReadOnly}
	onChange={inputHandler}
/> 
*/
