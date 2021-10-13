import { useEffect, useState } from "react";
import NoteService from "../services/NoteService";
import { createLocalNoteId } from "../utils";
import { generateNoteId } from "../utils/functions";
import useLocalStorage from "./useLocalStorage";

const useNote = (id) => {
	const tempKey = createLocalNoteId(id);
	const { data, saveData } = useLocalStorage(tempKey);
	const [hasNote, setHasNote] = useState(false);

	const syncNote = (noteId) => {
		const key = generateNoteId(noteId ?? id);
		NoteService.updateOrCreate(key, data);
		return key;
	};

	useEffect(() => {
		const getItem = async () => {
			if (id) {
				const note = await NoteService.getItem(id);
				if (note) {
					saveData(note);
					setHasNote(true);
				} else {
					setHasNote(false);
				}
			}
		};
		getItem();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	return { data, hasData: hasNote, saveData, syncNote };
};

export default useNote;
