import { useParams } from "react-router-dom";
import { useNote } from "src/hooks";

export const Footer = () => {
    const { note: noteId = "" } = useParams();
    const { onlineNote } = useNote(noteId);
    return (
        <footer className="w-full h-6 bg-gray-100 dark:bg-slate-800 flex justify-between px-4 items-center text-center">
            <p className="text-gray-500 text-xs">
                <span>Word: {onlineNote.note.split(" ").length}</span> |
                <span> Chars: {onlineNote.note.length}</span>
            </p>
            <p className="text-gray-500 text-xs">
                &copy; {new Date().getFullYear()}
                {" - "}
                <a href="//msar.me" target="_blank">
                    msar.me
                </a>
                {" | "}
                <a href="//msar.me/about" target="_blank">
                    about
                </a>
            </p>
        </footer>
    );
};
