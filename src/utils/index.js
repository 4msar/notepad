import { LAST_NOTE_ID, LOCAL_NOTES } from "./constant";
import { generateNoteId } from "./functions";

export const getLastOpenId = () => {
	return localStorage.getItem(LAST_NOTE_ID) ?? "";
};

export const setLastOpenId = (id) => {
	return localStorage.setItem(LAST_NOTE_ID, id);
};

export const createLocalNoteId = (id) => {
	if (!id) {
		return LOCAL_NOTES;
	}
	const key = generateNoteId(id);
	return `${LOCAL_NOTES}${key}__`;
};
