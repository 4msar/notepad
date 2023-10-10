import {
    BrowserRouter as Router,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";
import NewNote from "./pages/NewNote";
import Note from "./pages/Note";
import ShareNote from "./pages/Share";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="*" element={<Navigate to="/new" />} />
                <Route path="/new" element={<NewNote />} />
                <Route path="/n/:note" element={<Note />} />
                <Route path="/s/:note" element={<ShareNote />} />
            </Routes>
        </Router>
    );
}

export default App;
