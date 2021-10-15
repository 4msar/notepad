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
		const getItem =() => {
			if (id) {
				NoteService.getItem(id, (note)=>{
					if (note) {
						saveData(note);
						setHasNote(true);
					} else {
						setHasNote(false);
					}
				});
				
			}
		};
		getItem();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	console.log('return',{data});

	return { data, hasData: hasNote, saveData, syncNote };
};

export default useNote;
