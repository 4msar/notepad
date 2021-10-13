import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import NewNote from "./pages/NewNote";
import Note from "./pages/Note";
import * as serviceWorker from "./serviceWorkerRegistration";

function App() {
	useEffect(() => {
		serviceWorker.register();
	}, []);
	return (
		<Router>
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/new" exact component={NewNote} />
				<Route path="/n/:note" exact component={Note} />
				<Route component={Home} />
			</Switch>
		</Router>
	);
}

export default App;
