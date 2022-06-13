import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import NewNote from "./pages/NewNote";
import Note from "./pages/Note";

function App() {
	return (
		<Router>
			<Routes>
				<Route
					path="*"
					element={<Navigate to="/new" />}
				/>
				<Route path="/new" exact element={<NewNote />} />
				<Route path="/n/:note" exact element={<Note />} />
			</Routes>
		</Router>
	);
}

export default App;
