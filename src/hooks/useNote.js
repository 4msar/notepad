import { useEffect, useState } from "react";
import NoteService from "../services/NoteService";
import { createLocalNoteId } from "../utils";
import { generateNoteId } from "../utils/functions";
import useLocalStorage from "./useLocalStorage";

const useNote = (id) => {
	const tempKey = createLocalNoteId(id);
	const { data, saveData } = useLocalStorage(tempKey);
	const [hasNote, setHasNote] = useState(false);
	const [onlineNote, setOnlineNote] = useState(data);

	const syncNote = (noteId = null) => {
		const key = generateNoteId(noteId ?? id);
		NoteService.updateOrCreate(key, {...data, editedAt: new Date().getTime()});
		return key;
	};

	useEffect(() => {
		const getItem =() => {
			if (id) {
				NoteService.getItem(id, (note)=>{
					if( data.editedAt >= note.editedAt ){
						saveData(data);
						// syncNote();
						setOnlineNote(note);
					}else{
						if (note) {
							saveData(note);
							setHasNote(true);
						} else {
							setHasNote(false);
						}
					}
				});
				
			}
		};
		getItem();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	return { data, syncedData: onlineNote, hasData: hasNote, saveData, syncNote };
};

export default useNote;
