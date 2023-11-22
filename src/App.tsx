import {
    BrowserRouter as Router,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";
import NewNote from "./pages/NewNote";
import Note from "./pages/Note";
import ShareNote from "./pages/Share";
import About from "./pages/About";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/new" element={<NewNote />} />
                <Route path="/i/about" element={<About />} />
                <Route path="/n/:note" element={<Note />} />
                <Route path="/s/:note" element={<ShareNote />} />
                <Route path="*" element={<Navigate to="/new" />} />
            </Routes>
        </Router>
    );
}

export default App;
