import { APP_THEME, INITIAL_NOTE, LAST_NOTE_ID, LOCAL_NOTES } from "./constant";
import { generateNoteId, isEmpty, isJsonString } from "./functions";
import { Note } from "./types";

export const getLastOpenId = () => {
    return localStorage.getItem(LAST_NOTE_ID) ?? "";
};

export const setLastOpenId = (id: string) => {
    return localStorage.setItem(LAST_NOTE_ID, id);
};

export const getTheme = () => {
    return localStorage.getItem(APP_THEME) ?? "light";
};

export const setTheme = (name: string) => {
    return localStorage.setItem(APP_THEME, name);
};

export const removeLastOpenId = () => {
    return localStorage.removeItem(LAST_NOTE_ID);
};

export const removeLocalNote = () => {
    return localStorage.removeItem(LOCAL_NOTES);
};

export const createLocalNoteId = (id?: string) => {
    if (!id) {
        return LOCAL_NOTES;
    }
    const key = generateNoteId(id);
    return `${LOCAL_NOTES}${key}__`;
};

export const getLocalData = <T = Note>(id = "") => {
    const key = id.startsWith(LOCAL_NOTES) ? id : createLocalNoteId(id);
    const data = localStorage.getItem(key) ?? "";
    if (!isEmpty(data) && isJsonString(data)) {
        return JSON.parse(data) as T;
    }
    return INITIAL_NOTE as T;
};
