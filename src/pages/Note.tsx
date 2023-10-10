import { EditorContent } from "@tiptap/react";
import { useEffect } from "react";
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
import { Layout, UnSaveNotice } from "src/components";

export default function Note() {
    const { note: noteId = "" } = useParams();
    const {
        onlineNote: data,
        isSaved,
        saveNote,
        saveToOnline,
        resetWithOnline,
    } = useNote(noteId);
    const navigate = useNavigate();
    const showSnackbar = useSnackbar();

    const urlParams = new URLSearchParams(window.location.search);
    const encryptedToken = urlParams.get("token");
    const isReadOnly = urlParams.has("readonly");

    useUnload(!isSaved);

    const onSave = () => {
        saveToOnline(noteId);
        showSnackbar("Note sync successfully!", { variant: "success" });
    };

    const onDelete = () => {
        const decryptedToken = !isEmpty(encryptedToken)
            ? decryptData(encryptedToken ?? "")
            : "";
        if (decryptedToken !== noteId) {
            showSnackbar("You can't delete without permission.", {
                variant: "warning",
            });
            return null;
        }
        // eslint-disable-next-line no-restricted-globals
        const confirmed = confirm("Are you sure?");
        if (confirmed) {
            NoteService.delete(noteId);
            saveNote({});
            removeLastOpenId();
            showSnackbar("Note deleted successfully!", { variant: "warning" });
            navigate(`/new`);
        }
    };

    useHotKeys(["ctrl", "cmd", "s"], () => {
        console.log("Saved by Keyboard Shortcut.");
        onSave();
    });

    useEffect(() => {
        setLastOpenId(noteId);
    }, [noteId]);

    const editor = useNoteEditor(
        {
            text: data.note,
            isReadOnly,
            onChange: (value) => {
                saveNote({
                    editedAt: new Date().getTime(),
                    note: value,
                });
            },
        },
        [noteId] as never[]
    );

    return (
        <Layout onSave={onSave} onDelete={onDelete}>
            <EditorContent className={rootClassName} editor={editor} />
            {!isSaved && <UnSaveNotice onReset={resetWithOnline} />}
        </Layout>
    );
}
