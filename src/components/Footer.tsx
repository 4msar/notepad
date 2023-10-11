import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { getLocalData, stripTags } from "src/utils";

export const Footer = ({ hideMeta = false }: { hideMeta?: boolean }) => {
    const { note: noteId = "" } = useParams();
    const metaData = useMemo(() => {
        const note = getLocalData(noteId);

        const content = stripTags(note?.note);

        return {
            wordCount: content?.split(" ").length ?? 0,
            charCount: content?.length ?? 0,
            lastUpdate: new Date(note.editedAt).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            }),
        };
    }, [noteId]);

    return (
        <footer className="w-full h-auto flex-col sm:flex-row sm:h-6 bg-gray-100 dark:bg-slate-800 flex justify-between px-4 py-2 sm:py-0.5 items-center text-center border-none sm:border-b sm:border-x dark:border-slate-800 rounded-none sm:rounded-br-md sm:rounded-bl-md">
            {!hideMeta && (
                <p className="text-gray-500 text-xs">
                    <span>Word: {metaData.wordCount}</span> |
                    <span> Chars: {metaData.charCount}</span> |
                    <span> Last Update: {metaData.lastUpdate}</span>
                </p>
            )}
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

            {hideMeta && (
                <p className="text-gray-500 text-xs italic">
                    last update: {metaData.lastUpdate}
                </p>
            )}
        </footer>
    );
};
