import { onValue, ref, remove, update } from "firebase/database";
import { decryptData, encryptData } from "../utils/encryptions";
import { database as db } from "../utils/firebase";
import { Note } from "src/utils/types";

const getRef = (rest = "") => "public-notes/" + rest;

/**
 * Data Model
 *
 * editedAt: 1675078396832
 * key: "note-temp"
 * note: "html content"
 * syncAt: 1675078396822
 * encrypted: true
 */

class NoteService {
    encryption() {
        return {
            encrypt: encryptData,
            decrypt: decryptData,
        };
    }
    getAllNotes() {
        return (
            import.meta.env.VITE_APP_FIREBASE_DATABASE_URL +
            "/public-notes.json"
        );
    }
    getAll() {
        return new Promise((resolve, reject) => {
            const dataRef = ref(db, getRef());
            onValue(
                dataRef,
                (snapshot) => {
                    const data = snapshot.val();
                    resolve(data);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    getItem(id: string, callback: (data: Note) => void) {
        return new Promise((resolve, reject) => {
            if (!id) {
                return reject(new Error("Invalid ID"));
            }
            const dataRef = ref(db, getRef(id));
            onValue(
                dataRef,
                (snapshot) => {
                    const data = snapshot.val();
                    resolve(data);
                    if (typeof callback === "function") {
                        callback(data);
                    }
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    async updateOrCreate(key: string, value: Partial<Note>, getData = false) {
        if (!key) return false;

        const updates = {} as Record<string, Partial<Note>>;
        updates[getRef(key)] = value;

        const all = await update(ref(db), updates);
        if (getData) return all;
        return key;
    }

    async delete(key: string, getData = false) {
        if (!key) return false;
        const all = await remove(ref(db, getRef(key)));
        if (getData) return all;
        return true;
    }
}

export default new NoteService();

declare global {
    interface Window {
        NoteService?: NoteService;
    }
}

if (import.meta.env.NODE_ENV === "development") {
    window.NoteService = new NoteService();
}
