import React from "react";
import ReactDOM from "react-dom";
import { SnackbarProvider } from 'react-notistack';

import "./styles/index.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "./utils/firebase";

ReactDOM.render(
	<React.StrictMode>
		<SnackbarProvider
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			autoHideDuration={5000}
			preventDuplicate
			maxSnack={3}
		>
			<App />
		</SnackbarProvider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();