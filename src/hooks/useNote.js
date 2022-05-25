import { useEffect, useState } from "react";
import NoteService from "../services/NoteService";
import { createLocalNoteId, getLocalData } from "../utils";
import { INITIAL_NOTE } from "../utils/constant";
import { generateNoteId, isEmpty } from "../utils/functions";
import useLocalStorage from "./useLocalStorage";

const useNote = (id) => {
	const tempKey = createLocalNoteId(id);
	const [data, saveData] = useLocalStorage(tempKey, INITIAL_NOTE);
	const [onlineNote, setOnlineNote] = useState(data);

	const [isSaved, setIsSaved] = useState(
		data?.editedAt <= onlineNote?.editedAt
	);

	const syncNote = (noteId = null) => {
		const key = generateNoteId(noteId ?? id);
		const savedData = { ...data, key, editedAt: new Date().getTime() + 10 };
		NoteService.updateOrCreate(key, savedData);
		return key;
	};

	const syncOnline = (noteId = id) => {
		NoteService.getItem(noteId ?? id, (note) => {
			if (isEmpty(note)) {
				return false;
			}

			saveData(note);
			setOnlineNote(note);
		});
	};

	useEffect(() => {
		if (!isEmpty(id)) {
			NoteService.getItem(id, (note) => {
				if (isEmpty(note)) {
					return false;
				}

				setOnlineNote(note);

				const localData = getLocalData(id);
				if (isEmpty(localData?.note)) {
					saveData(note);
					setIsSaved(true);
				}
				if (localData?.editedAt <= note?.editedAt) {
					saveData(note);
				}
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	return {
		data,
		isSaved,
		syncedData: onlineNote,
		setIsSaved,
		saveData,
		syncNote,
		syncOnline,
	};
};

export default useNote;
