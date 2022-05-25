import React from "react";
import { useNavigate } from "react-router-dom";
import LastOpenNotePrompt from "../components/LastOpenNotePrompt";
import Layout from "../components/Layout";
import TipTapEditor from "../components/TipTapEditor";
import useHotKeys from "../hooks/useHotKeys";
import useNote from "../hooks/useNote";
import useUnload from "../hooks/useUnload";
import { encryptData } from "../utils/encryptions";
import { debounce, isEmpty } from "../utils/functions";

export default function NewNote() {
	const { data, saveData, syncNote } = useNote();
	const navigate = useNavigate();

	useUnload(!isEmpty(data?.note));

	const onSave = () => {
		const noteId = syncNote();
		const url = new URL(`${window.location.origin}/n/${noteId}`);
		prompt("Here is your note link:\n", url.toString());
		if (noteId) {
			const token = encryptData(noteId);
			navigate(`/n/${noteId}?token=${token}`, { replace: true });
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
			<TipTapEditor
				data={data}
				defaultValue={data?.note || ''}
				onChange={inputHandler}
				autofocus={true}
			/>

			<LastOpenNotePrompt />

		</Layout>
	);
}
