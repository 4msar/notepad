import clsx from "clsx";
import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Layout } from "src/components";
import { useNote } from "src/hooks";
import { checkShareTokenIsValid } from "src/utils";

function ShareNote() {
    const { note: noteId = "" } = useParams();
    const { onlineNote } = useNote(noteId);
    const [params] = useSearchParams();

    const isValidNoteForShare = useMemo(() => {
        if (noteId && onlineNote) {
            return checkShareTokenIsValid(params.get("token") ?? "");
        }

        return false;
    }, [noteId, onlineNote, params]);

    return (
        <Layout
            hideNavLinks
            footerProps={{
                hideMeta: true,
                showLastUpdate: true,
            }}
        >
            <div
                className={clsx(
                    "prose prose-sm dark:prose-invert editor-font font-normal text-xl p-4 relative h-[calc(100vh-100px)] sm:h-[calc(100vh-15rem)] w-full point-bg overflow-hidden overflow-y-auto max-w-full"
                )}
            >
                {isValidNoteForShare ? (
                    <article
                        dangerouslySetInnerHTML={{
                            __html: onlineNote?.note ?? "",
                        }}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <h1 className="text-2xl font-bold">Invalid Note</h1>
                        <p className="text-gray-500 text-center">
                            The note you are trying to access is either invalid,
                            or has expired.
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default ShareNote;
