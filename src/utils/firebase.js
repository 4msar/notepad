// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDUNHG4vHuIzIt9ve3GaPAsAOC0dYeP6jQ",
	authDomain: "msar-note.firebaseapp.com",
	databaseURL: "https://msar-note.firebaseio.com",
	projectId: "msar-note",
	storageBucket: "msar-note.appspot.com",
	messagingSenderId: "677133912279",
	appId: "1:677133912279:web:41aeee6b8dc158e7fb0892",
	measurementId: "G-D3S6MWZPNY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export const database = getDatabase(app);

export default app;
