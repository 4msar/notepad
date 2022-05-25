import React from "react";
import { createRoot } from 'react-dom/client';
import { SnackbarProvider } from 'react-notistack';
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorkerRegistration";
import "./styles/index.css";
import "./styles/prose.css";

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
    <React.StrictMode>
        <SnackbarProvider
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            autoHideDuration={5000}
            preventDuplicate
            maxSnack={3}
        >
            <App />
        </SnackbarProvider>
    </React.StrictMode>
);

// To enable offline compatibility register the SW
serviceWorker.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
