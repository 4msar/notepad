import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { getLocalKey, stripTags } from "src/utils";
import { Note } from "src/utils/types";
import { useReadLocalStorage } from "usehooks-ts";

export type SaveStatus = { text: string; tone: "ok" | "warn" };

export const Footer = ({
    hideMeta = false,
    showLastUpdate = false,
    status,
    children,
}: {
    hideMeta?: boolean;
    showLastUpdate?: boolean;
    status?: SaveStatus;
    children?: React.ReactNode;
}) => {
    const { note: noteId = "" } = useParams();

    const note = useReadLocalStorage<Note>(getLocalKey(noteId));

    const metaData = useMemo(() => {
        if (!note) {
            return {
                wordCount: 0,
                charCount: 0,
                lastUpdate: "",
            };
        }

        const content = stripTags(note?.note).trim();

        return {
            wordCount: content ? content.split(/\s+/).length : 0,
            charCount: content.length,
            lastUpdate: new Date(note.editedAt).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            }),
        };
    }, [note]);

    return (
        <footer className="flex h-auto w-full flex-col items-center justify-between gap-1 border-x-0 border-b-0 bg-slate-50 px-4 py-2 text-center text-xs text-slate-500 sm:h-8 sm:flex-row sm:py-0 sm:border-x sm:border-b dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 rounded-none sm:rounded-b-xl">
            <div className="flex flex-wrap items-center gap-x-3">
                {!hideMeta && (
                    <span>
                        {metaData.wordCount} words · {metaData.charCount}{" "}
                        chars
                        {metaData.lastUpdate &&
                            ` · edited ${metaData.lastUpdate}`}
                    </span>
                )}
                {status && (
                    <span
                        className={
                            status.tone === "ok"
                                ? "font-medium text-emerald-600 dark:text-emerald-400"
                                : "font-medium text-amber-600 dark:text-amber-400"
                        }
                    >
                        ● {status.text}
                    </span>
                )}
                {showLastUpdate && (
                    <span className="italic">
                        last update: {metaData.lastUpdate}
                    </span>
                )}
            </div>
            <p>
                &copy; {new Date().getFullYear()} ·{" "}
                <Link className="hover:underline" to="/">
                    Noto
                </Link>{" "}
                ·{" "}
                <Link className="hover:underline" to="/i/about">
                    about
                </Link>
            </p>
            {children}
        </footer>
    );
};
