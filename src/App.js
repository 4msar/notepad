import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import NewNote from "./pages/NewNote";
import Note from "./pages/Note";
import RedirectToNote from "./pages/RedirectToNote";

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
				<Route path="/redirect/:note" exact element={<RedirectToNote />} />
			</Routes>
		</Router>
	);
}

export default App;
