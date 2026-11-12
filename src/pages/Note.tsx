import { EditorContent } from "@tiptap/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import NoteService from "../services/NoteService";
import {
    rootClassName,
    useHotKeys,
    useNote,
    useNoteEditor,
    useSnackbar,
    useUnload,
} from "src/hooks";
import {
    decryptData,
    isEmpty,
    removeLastOpenId,
    setLastOpenId,
} from "src/utils";
import {
    EditorToolbar,
    Layout,
    Modal,
    UnSaveNotice,
    dangerButtonClass,
    secondaryButtonClass,
} from "src/components";

export default function NotePage() {
    const { note: noteId = "" } = useParams();
    const {
        onlineNote,
        note: data,
        isSaved,
        saveNote,
        saveToOnline,
        resetWithOnline,
    } = useNote(noteId);
    const navigate = useNavigate();
    const showSnackbar = useSnackbar();
    const [confirmDelete, setConfirmDelete] = useState(false);

    const urlParams = new URLSearchParams(window.location.search);
    const encryptedToken = urlParams.get("token");
    const isReadOnly = urlParams.has("readonly");

    useUnload(!isSaved);
    const editor = useNoteEditor(
        {
            text: data.note ?? "",
            isReadOnly,
            onChange: (value) => {
                const noteObj = {
                    editedAt: new Date().getTime(),
                    note: value,
                };
                saveNote(noteObj);
            },
        },
        [noteId] as never[]
    );

    useEffect(() => {
        // Online is updated
        const isOnlineNoteIsLatest = onlineNote?.editedAt >= data?.editedAt;
        if (editor && isOnlineNoteIsLatest) {
            editor.commands.setContent(onlineNote?.note ?? "");
        }
    }, [onlineNote, data, editor]);

    const onSave = () => {
        saveToOnline(noteId);
        showSnackbar("Note synced", { variant: "success" });
    };

    const onDelete = () => {
        const decryptedToken = !isEmpty(encryptedToken)
            ? decryptData(encryptedToken ?? "")
            : "";
        if (decryptedToken !== noteId) {
            showSnackbar("You can't delete without permission.", {
                variant: "warning",
            });
            return;
        }
        setConfirmDelete(true);
    };

    const performDelete = () => {
        setConfirmDelete(false);
        NoteService.delete(noteId);
        saveNote({});
        removeLastOpenId();
        showSnackbar("Note deleted", { variant: "warning" });
        navigate(`/new`);
    };

    useHotKeys(["ctrl", "cmd", "s"], () => {
        onSave();
    });

    useEffect(() => {
        setLastOpenId(noteId);
    }, [noteId]);

    return (
        <Layout
            onSave={onSave}
            onDelete={onDelete}
            footerProps={{
                status: isReadOnly
                    ? { text: "Read only", tone: "warn" }
                    : isSaved
                    ? { text: "All changes synced", tone: "ok" }
                    : { text: "Unsynced changes. Press Save.", tone: "warn" },
            }}
        >
            {!isReadOnly && <EditorToolbar editor={editor} />}
            <EditorContent className={rootClassName} editor={editor} />
            {!isSaved && <UnSaveNotice onReset={resetWithOnline} />}

            <Modal
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                title="Delete this note?"
                footer={
                    <>
                        <button
                            type="button"
                            className={secondaryButtonClass}
                            onClick={() => setConfirmDelete(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className={dangerButtonClass}
                            onClick={performDelete}
                        >
                            Delete
                        </button>
                    </>
                }
            >
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    The note will be removed for everyone who has the link. This
                    cannot be undone.
                </p>
            </Modal>
        </Layout>
    );
}
