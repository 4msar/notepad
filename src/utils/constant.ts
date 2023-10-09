import { Note } from "./types";

/**
 * Data Model
 *
 * editedAt: 1675078396832
 * key: "note-temp"
 * note: "html content"
 * syncAt: 1675078396822
 * encrypted: true
 */
export const INITIAL_NOTE: Note = {
    note: "",
    key: "",
    encrypted: false,
    editedAt: new Date().getTime(),
    syncAt: undefined,
};

export const LAST_NOTE_ID = "__note_app__last__open__note__id__";
export const APP_THEME = "__note_app__theme__";
export const LOCAL_NOTES = "__note_app__local_note__";

export const ENCRYPTION_KEY =
    import.meta.env.VITE_APP_ENCRYPTION_KEY ?? "EeWqEDchLc7CX8j45dQQ";
