import { useEffect, useState } from "react";
import NoteService from "../services/NoteService";
import { createLocalNoteId } from "../utils";
import { generateNoteId, isEmpty } from "../utils/functions";
import useLocalStorage from "./useLocalStorage";

const useNote = (id) => {
	const tempKey = createLocalNoteId(id);
	const { data, saveData } = useLocalStorage(tempKey);
	const [hasNote, setHasNote] = useState(false);
	const [onlineNote, setOnlineNote] = useState(data);

	const [isSaved, setIsSaved] = useState(data.editedAt <= onlineNote.editedAt);

	const syncNote = (noteId = null) => {
		const key = generateNoteId(noteId ?? id);
		const savedData = {...data, editedAt: (new Date().getTime() + 10) };
		NoteService.updateOrCreate(key, savedData);
		setOnlineNote(savedData);
		setIsSaved(true);
		return key;
	};

	useEffect(() => {
		const getItem =() => {
			if (!isEmpty(id)) {
				NoteService.getItem(id, (note)=>{
					if( data?.editedAt >= note?.editedAt ){
						saveData(data);
						// syncNote();
						setOnlineNote(note);
					}else{
						if (note) {
							saveData(note);
							setOnlineNote(note);
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

	return { 
		data, 
		isSaved,
		syncedData: onlineNote, 
		hasData: hasNote, 
		setIsSaved,
		saveData, 
		syncNote
	};
};

export default useNote;
