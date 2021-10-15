import { INITIAL_NOTE, LAST_NOTE_ID, LOCAL_NOTES } from "./constant";
import { generateNoteId, isEmpty, isJsonString } from "./functions";

export const getLastOpenId = () => {
	return localStorage.getItem(LAST_NOTE_ID) ?? "";
};

export const setLastOpenId = (id) => {
	return localStorage.setItem(LAST_NOTE_ID, id);
};

export const removeLastOpenId = () => {
	return localStorage.removeItem(LAST_NOTE_ID);
};

export const removeLocalNote = () => {
	return localStorage.removeItem(LOCAL_NOTES);
};

export const createLocalNoteId = (id) => {
	if (!id) {
		return LOCAL_NOTES;
	}
	const key = generateNoteId(id);
	return `${LOCAL_NOTES}${key}__`;
};

export const getLocalData = (id = "") => {
	const key = id.startsWith(LOCAL_NOTES) ? id : createLocalNoteId(id);
	const data = localStorage.getItem(key);
	if (!isEmpty(data) && isJsonString(data)) {
		return JSON.parse(data);
	}
	return INITIAL_NOTE;
};
