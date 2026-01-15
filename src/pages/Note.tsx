import { EditorContent } from "@tiptap/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import NoteService from "../services/NoteService";
import {
    rootClassName,
    useHotKeys,
    useNote,
    useNoteEditor,
    useUnload,
} from "src/hooks";
import {
    decryptData,
    isEmpty,
    removeLastOpenId,
    setLastOpenId,
} from "src/utils";
import { Layout, UnSaveNotice } from "src/components";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "src/components/ui/alert-dialog";

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
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
        toast.success("Note sync successfully!");
    };

    const onDelete = () => {
        const decryptedToken = !isEmpty(encryptedToken)
            ? decryptData(encryptedToken ?? "")
            : "";
        if (decryptedToken !== noteId) {
            toast.warning("You can't delete without permission.");
            return null;
        }
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        NoteService.delete(noteId);
        saveNote({});
        removeLastOpenId();
        toast.warning("Note deleted successfully!");
        setShowDeleteDialog(false);
        navigate(`/new`);
    };

    useHotKeys(["ctrl", "cmd", "s"], () => {
        console.log("Saved by Keyboard Shortcut.");
        onSave();
    });

    useEffect(() => {
        setLastOpenId(noteId);
    }, [noteId]);

    return (
        <>
            <Layout onSave={onSave} onDelete={onDelete}>
                <EditorContent className={rootClassName} editor={editor} />
                {!isSaved && <UnSaveNotice onReset={resetWithOnline} />}
            </Layout>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            note from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
