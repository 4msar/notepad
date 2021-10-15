import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import EditNote from "../components/EditNote";
import UnSaveNotice from '../components/UnSaveNotice';
import Layout from "../components/Layout";
import useNote from "../hooks/useNote";
import useSnackbar from "../hooks/useSnackbar";
import NoteService from "../services/NoteService";
import { setLastOpenId } from "../utils";
import { decryptData } from "../utils/encryptions";
import { debounce, isEmpty } from "../utils/functions";

export default function Note() {
	const { note: noteId } = useParams();
	const { data, syncedData, saveData, syncNote } = useNote(noteId);
	const [isSaved, setIsSaved] = useState(data.editedAt <= syncedData.editedAt);

	const history = useHistory();
	const showSnackbar = useSnackbar();
	var urlParams = new URLSearchParams(window.location.search);
	const encryptedToken = urlParams.get('token');

	useEffect(() => {
		setLastOpenId(noteId);
	}, [noteId]);
	
	useEffect(() => {
		setIsSaved(data.editedAt <= syncedData.editedAt);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [syncedData]);

	const onSave = () => {
		syncNote(noteId);
		showSnackbar("Note sync successfully!", { variant: "success" });
		setIsSaved(true);
	};
	const onDelete = () => {
		const decryptedToken = !isEmpty(encryptedToken) ? decryptData(encryptedToken ?? '') : '';
		if( decryptedToken !== noteId ){
			showSnackbar("You can't delete without permission.", { variant: "warning" });
			return null;
		}
		// eslint-disable-next-line no-restricted-globals
		const confirmed = confirm("Are you sure?");
		if (confirmed) {
			NoteService.delete(noteId);
			saveData("");
			setIsSaved(true);
			showSnackbar("Note deleted successfully!", { variant: "warning" });
			history.push(`/new`);
		}
	};

	const inputChange = (event) => {
		const {
			target: { value },
		} = event;

		saveData({editedAt: new Date().getTime(), note: value});
		setIsSaved(false);
	};
	const inputHandler = debounce(inputChange, 1000);

	return (
		<Layout onSave={onSave} onDelete={onDelete}>
			<EditNote defaultValue={data.note} onChange={inputHandler} />
			{!isSaved && <UnSaveNotice />}
		</Layout>
	);
}
