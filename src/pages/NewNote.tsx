import { useState } from "react";
import {
    EditorToolbar,
    LastOpenNotePrompt,
    Layout,
    Modal,
    primaryButtonClass,
    secondaryButtonClass,
} from "src/components";
import {
    rootClassName,
    useHotKeys,
    useNote,
    useNoteEditor,
    useSnackbar,
    useUnload,
} from "src/hooks";
import { encryptData, isEmpty } from "src/utils";
import { EditorContent } from "@tiptap/react";
import { useNavigate } from "react-router-dom";

export default function NewNote() {
    const { onlineNote: data, saveNote, saveToOnline } = useNote();
    const navigate = useNavigate();
    const showSnackbar = useSnackbar();
    const [share, setShare] = useState<{ url: string; next: string } | null>(
        null
    );

    useUnload(!isEmpty(data?.note));

    const onSave = () => {
        const noteId = saveToOnline();
        if (!noteId) return;

        const url = new URL(`${window.location.origin}/n/${noteId}`);
        const token = encryptData(noteId);
        url.searchParams.set("token", token);
        // Navigate only after the dialog is dismissed; navigating now would unmount it.
        setShare({
            url: url.toString(),
            next: `/n/${noteId}?token=${encodeURIComponent(token)}`,
        });
    };

    const closeShare = () => {
        if (share) navigate(share.next, { replace: true });
        setShare(null);
    };

    const copyLink = async () => {
        if (!share) return;
        try {
            await navigator.clipboard.writeText(share.url);
            showSnackbar("Link copied to clipboard", { variant: "success" });
        } catch {
            showSnackbar("Could not copy. Select the link and copy it manually.", {
                variant: "warning",
            });
        }
    };

    useHotKeys(["ctrl", "cmd", "s"], () => {
        onSave();
    });

    const editor = useNoteEditor(
        {
            text: data.note,
            onChange: (value) => {
                saveNote({
                    editedAt: new Date().getTime(),
                    note: value,
                });
            },
        },
        []
    );

    return (
        <Layout
            onSave={onSave}
            footerProps={{
                status: { text: "Saved in this browser", tone: "ok" },
            }}
        >
            <EditorToolbar editor={editor} />
            <EditorContent className={rootClassName} editor={editor} />
            <LastOpenNotePrompt />

            <Modal
                open={!!share}
                onClose={closeShare}
                title="Your note is saved"
                footer={
                    <>
                        <button
                            type="button"
                            className={secondaryButtonClass}
                            onClick={copyLink}
                        >
                            Copy link
                        </button>
                        <button
                            type="button"
                            className={primaryButtonClass}
                            onClick={closeShare}
                        >
                            Done
                        </button>
                    </>
                }
            >
                <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
                    Anyone with this link can open the note. Keep it somewhere
                    safe.
                </p>
                <input
                    readOnly
                    value={share?.url ?? ""}
                    onFocus={(e) => e.target.select()}
                    className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-xs dark:border-slate-600 dark:bg-slate-900"
                />
            </Modal>
        </Layout>
    );
}
