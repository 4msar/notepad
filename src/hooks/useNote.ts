import { onValue, ref, update } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import NoteService from "../services/NoteService";
import { createLocalNoteId, getLocalData } from "../utils/helpers";
import { INITIAL_NOTE } from "../utils/constant";
import { database as db } from "../utils/firebase";
import { generateNoteId, isEmpty } from "../utils/functions";
import { useLocalStorage } from "usehooks-ts";
import { Note } from "src/utils/types";
import { decryptData, encryptData } from "src/utils";

const getRef = (rest = "") => "public-notes/" + rest;

export const useNote = (id?: string) => {
    const tempKey = createLocalNoteId(id);
    const [note, saveNote] = useLocalStorage<Note>(tempKey, INITIAL_NOTE);
    const [onlineNote, setOnlineNote] = useState<Note>(note);
    const isSaved = useRef(true);

    const saveToOnline = (noteId?: string) => {
        const key = generateNoteId(noteId ?? id);

        if (!key) return false;

        const savedData: Note = {
            ...note,
            key,
            note: encryptData(note.note),
            encrypted: true,
            syncAt: new Date().getTime(),
            editedAt: new Date().getTime() + 10,
        };

        const updates = {} as Record<string, Note>;
        updates[getRef(key)] = savedData;
        update(ref(db), updates);
        isSaved.current = true;

        return key;
    };

    const resetWithOnline = () => {
        NoteService.getItem(`${id}`, (note: Note) => {
            if (isEmpty(note)) {
                return false;
            }

            saveNote(note);
            setOnlineNote(note);
            isSaved.current = true;
        });
    };

    const saveLocalData = (param: Partial<Note>) => {
        saveNote({ ...note, ...param });
        isSaved.current = false;
    };

    useEffect(() => {
        if (!isEmpty(id)) {
            const dataRef = ref(db, getRef(id));
            onValue(
                dataRef,
                (snapshot) => {
                    const note = snapshot.val();

                    if (isEmpty(note)) {
                        return false;
                    }

                    // decrypt data here
                    if (note?.encrypted) {
                        note.note = decryptData(note.note);
                    }
                    setOnlineNote(note);

                    const localData = getLocalData(id);
                    if (isEmpty(localData?.note)) {
                        saveNote(note);
                        isSaved.current = true;
                    }

                    /**
                     * When online data is newer than local data
                     * then update local data
                     */
                    const isLocalNoteIsLatest =
                        onlineNote?.editedAt <= note?.editedAt;
                    if (isLocalNoteIsLatest) {
                        isSaved.current =
                            onlineNote?.editedAt === note?.editedAt;
                        saveNote(note);
                    }
                },
                (error) => {
                    console.log(error);
                }
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return {
        note,
        onlineNote,
        isSaved: isSaved.current,
        saveNote: saveLocalData,
        saveToOnline,
        resetWithOnline,
    };
};
