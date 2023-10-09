export const INITIAL_NOTE = {
    note: "",
    key: "",
    editedAt: new Date().getTime(),
};

export const LAST_NOTE_ID = "__note_app__last__open__note__id__";
export const APP_THEME = "__note_app__theme__";
export const LOCAL_NOTES = "__note_app__local_note__";

export const ENCRYPTION_KEY = process.env.APP_ENCRYPTION_KEY;
