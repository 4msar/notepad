import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NewNote from "./pages/NewNote";
import Note from "./pages/Note";

function App() {
	
	return (
		<Router>
			<Routes>
				<Route path="/" exact element={<Home/>} />
				<Route path="/new" exact element={<NewNote/>} />
				<Route path="/n/:note" exact element={<Note/>} />
				<Route element={<Home/>} />
			</Routes>
		</Router>
	);
}

export default App;
