import React from "react";
import { useHistory } from "react-router-dom";
import EditNote from "../components/EditNote";
import Layout from "../components/Layout";
import useHotKeys from "../hooks/useHotKeys";
import useNote from "../hooks/useNote";
import useUnload from "../hooks/useUnload";
import { encryptData } from "../utils/encryptions";
import { debounce, isEmpty } from "../utils/functions";

export default function NewNote() {
	const { data, saveData, syncNote } = useNote();
	const history = useHistory();

	useUnload(!isEmpty(data?.note));

	const onSave = () => {
		const noteId = syncNote();
		const url = new URL(`${window.location.origin}/n/${noteId}`);
		prompt("Here is your note link:\n", url.toString());
		if (noteId) {
			const token = encryptData(noteId);
			history.push(`/n/${noteId}?token=${token}`);
		}
	};

	const inputChange = (event) => {
		const {
			target: { value },
		} = event;
		saveData({ editedAt: new Date().getTime(), note: value });
	};
	const inputHandler = debounce(inputChange, 1000);

	useHotKeys(["ctrl", "cmd", "s"], () => {
		console.log("Saved by Keyboard Shortcut.");
		onSave();
	});

	return (
		<Layout onSave={onSave}>
			<EditNote defaultValue={data.note} onChange={inputHandler} />
		</Layout>
	);
}
