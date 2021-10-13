import React from "react";
import { useHistory } from "react-router-dom";
import EditNote from "../components/EditNote";
import Layout from "../components/Layout";
import useNote from "../hooks/useNote";
import { encryptData } from "../utils/encryptions";
import { debounce } from "../utils/functions";

export default function NewNote() {
	const { data, saveData, syncNote } = useNote();
	const history = useHistory();

	const onSave = () => {
		const noteId = syncNote();
		const url = new URL(`${window.location.origin}/n/${noteId}`);
		const returned = prompt("Here is your note link:\n", url.toString());
		if (returned) {
			const token = encryptData(noteId);
			history.push(`/n/${noteId}?token=${token}`);
		}
	};

	const inputChange = (event) => {
		const {
			target: { value },
		} = event;
		saveData(value);
	};
	const inputHandler = debounce(inputChange, 1000);

	return (
		<Layout onSave={onSave}>
			<div className="new-note">
				<EditNote defaultValue={data} onChange={inputHandler} />
			</div>
		</Layout>
	);
}
