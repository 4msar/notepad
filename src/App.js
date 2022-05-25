import React from "react";
import Note from "./pages/Note";
import NewNote from "./pages/NewNote";
import RedirectToNote from "./pages/RedirectToNote";
import { BrowserRouter as Router, Navigate, Route, Routes, useParams } from "react-router-dom";

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
