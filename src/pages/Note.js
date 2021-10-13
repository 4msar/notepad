import { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import EditNote from "../components/EditNote";
import Layout from "../components/Layout";
import useNote from "../hooks/useNote";
import useSnackbar from "../hooks/useSnackbar";
import NoteService from "../services/NoteService";
import { setLastOpenId } from "../utils";
import { debounce } from "../utils/functions";

export default function Note() {
	const { note: noteId } = useParams();
	const { data, saveData, syncNote } = useNote(noteId);
	const history = useHistory();
	const showSnackbar = useSnackbar();
	var urlParams = new URLSearchParams(window.location.search);
	const encryptedToken = urlParams.get('token');

	useEffect(() => {
		setLastOpenId(noteId);
	}, [noteId]);

	const onSave = () => {
		syncNote(noteId);
		showSnackbar("Note sync successfully!", { variant: "success" });
	};
	const onDelete = () => {
		const decryptedToken =  decryptData(encryptedToken);
		if( decryptedToken !== noteId ){
			showSnackbar("You can't delete without permission.", { variant: "warning" });
			return null;
		}
		// eslint-disable-next-line no-restricted-globals
		const confirmed = confirm("Are you sure?");
		if (confirmed) {
			NoteService.delete(noteId);
			saveData("");
			showSnackbar("Note deleted successfully!", { variant: "warning" });
			history.push(`/new`);
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
		<Layout onSave={onSave} onDelete={onDelete}>
			<EditNote defaultValue={data} onChange={inputHandler} />
		</Layout>
	);
}
