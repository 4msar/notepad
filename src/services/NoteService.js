import { onValue, ref, remove, update } from "firebase/database";
import { database as db } from "../utils/firebase";

const getRef = (rest = "") => "public-notes/" + rest;

class NoteService {
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
		// Write the new post's data simultaneously in the posts list and the user's post list.
		const updates = {};
		updates[getRef(key)] = value;

		const all = await update(ref(db), updates);
		if (getData) return all;
		return key;
	}

	async delete(key, getData = false) {
		const all = await remove(ref(db, getRef(key)));
		if (getData) return all;
		return true;
	}
}

export default new NoteService();

window.NoteService = new NoteService();
