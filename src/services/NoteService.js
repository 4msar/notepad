import { onValue, ref, remove, update } from "firebase/database";
import { database as db } from "../utils/firebase";

const getRef = (rest = "") => "public-notes/" + rest;

class NoteService {
	getAllNotes() {
		return "https://msar-note.firebaseio.com/public-notes.json";
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

	getItem(id) {
		return new Promise((resolve, reject) => {
			const dataRef = ref(db, getRef(id));
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

	async updateOrCreate(key, value, getData = false) {
		if (!key) return false;

		const updates = {};
		updates[getRef(key)] = value;

		const all = await update(ref(db), updates);
		if (getData) return all;
		return key;
	}

	async delete(key, getData = false) {
		if (!key) return false;
		const all = await remove(ref(db, getRef(key)));
		if (getData) return all;
		return true;
	}
}

export default new NoteService();

window.NoteService = new NoteService();
