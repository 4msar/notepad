import { onValue, ref, update } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import NoteService from "../services/NoteService";
import { createLocalNoteId, getLocalData } from "../utils";
import { INITIAL_NOTE } from "../utils/constant";
import { database as db } from "../utils/firebase";
import { generateNoteId, isEmpty } from "../utils/functions";
import useLocalStorage from "./useLocalStorage";

const getRef = (rest = "") => "public-notes/" + rest;

const useNote = (id) => {
    const tempKey = createLocalNoteId(id);
    const [note, saveNote] = useLocalStorage(tempKey, INITIAL_NOTE);
    const [onlineNote, setOnlineNote] = useState(note);
    const isSaved = useRef(true);

    const saveToOnline = (noteId = null) => {
        const key = generateNoteId(noteId ?? id);
        const savedData = {
            ...note,
            key,
            syncAt: new Date().getTime(),
            editedAt: new Date().getTime() + 10,
        };

        if (!key) return false;

        const updates = {};
        updates[getRef(key)] = savedData;
        update(ref(db), updates);
        isSaved.current = true;

        return key;
    };

    const resetWithOnline = (noteId = id) => {
        NoteService.getItem(noteId ?? id, (note) => {
            if (isEmpty(note)) {
                return false;
            }

            saveNote(note);
            setOnlineNote(note);
            isSaved.current = true;
        });
    };

    const saveLocalData = (param) => {
        saveNote(param);
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

export default useNote;
