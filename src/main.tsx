import React from "react";
import ReactDOM from "react-dom/client";
import { SnackbarProvider } from "notistack";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
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
