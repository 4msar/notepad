import { onValue, ref, remove, update } from "firebase/database";
import { decryptData, encryptData } from "../utils/encryptions";
import { database as db } from "../utils/firebase";
import { Note } from "src/utils/types";
import { ENCRYPTION_KEY, isEmpty } from "src/utils";

const getRef = (rest = "") => "public-notes/" + rest;

class NoteService {
    encryption() {
        return {
            encrypt: encryptData,
            decrypt: decryptData,
            KEY: ENCRYPTION_KEY,
        };
    }

    getAll() {
        return new Promise((resolve, reject) => {
            const dataRef = ref(db, getRef());
            onValue(
                dataRef,
                (snapshot) => {
                    const data = snapshot.val();

                    // decrypt data here
                    Object.keys(data).forEach((key) => {
                        const item = data[key] as Note;
                        if (item?.encrypted) {
                            item.note = decryptData(item.note);
                        }
                        data[key] = item;
                    });

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
                    const data = snapshot.val() as Note;

                    // decrypt data here
                    if (data?.encrypted) {
                        data.note = decryptData(data.note);
                    }

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

        // encrypt data here
        if (value?.encrypted && value?.note && !isEmpty(value?.note)) {
            value.note = encryptData(value.note);
        }

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

if (import.meta.env.NODE_ENV !== "production") {
    window.NoteService = new NoteService();
}
