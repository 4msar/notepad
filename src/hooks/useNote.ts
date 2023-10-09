import { onValue, ref, update } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import NoteService from "../services/NoteService";
import { createLocalNoteId, getLocalData } from "../utils/helpers";
import { INITIAL_NOTE } from "../utils/constant";
import { database as db } from "../utils/firebase";
import { generateNoteId, isEmpty } from "../utils/functions";
import { useLocalStorage } from "./useLocalStorage";
import { Note } from "src/utils/types";

const getRef = (rest = "") => "public-notes/" + rest;

export const useNote = (id?: string) => {
    const tempKey = createLocalNoteId(id);
    const [note, saveNote] = useLocalStorage<Note>(tempKey, INITIAL_NOTE);
    const [onlineNote, setOnlineNote] = useState<Note>(note as Note);
    const isSaved = useRef(true);

    const saveToOnline = (noteId?: string) => {
        const key = generateNoteId(noteId ?? id);
        const savedData = {
            ...note,
            key,
            note: note.note,
            syncAt: new Date().getTime(),
            editedAt: new Date().getTime() + 10,
        };

        if (!key) return false;

        const updates = {} as Record<string, Note>;
        updates[getRef(key)] = savedData;
        update(ref(db), updates);
        isSaved.current = true;

        return key;
    };

    const resetWithOnline = (noteId = id) => {
        NoteService.getItem(`${noteId}`, (note: Note) => {
            if (isEmpty(note)) {
                return false;
            }

            saveNote(note);
            setOnlineNote(note);
            isSaved.current = true;
        });
    };

    const saveLocalData = (param: Partial<Note>) => {
        saveNote(param as Note);
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
                    setOnlineNote(note);

                    const localData = getLocalData(id);
                    if (isEmpty(localData?.note)) {
                        saveNote(note);
                        isSaved.current = true;
                    }
                    if (localData?.editedAt <= note?.editedAt) {
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
