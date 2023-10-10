import { LastOpenNotePrompt, Layout } from "src/components";
import {
    rootClassName,
    useHotKeys,
    useNote,
    useNoteEditor,
    useUnload,
} from "src/hooks";
import { encryptData, isEmpty } from "src/utils";
import { EditorContent } from "@tiptap/react";
import { useNavigate } from "react-router-dom";

export default function NewNote() {
    const { onlineNote: data, saveNote, saveToOnline } = useNote();
    const navigate = useNavigate();

    useUnload(!isEmpty(data?.note));

    const onSave = () => {
        const noteId = saveToOnline();
        const url = new URL(`${window.location.origin}/n/${noteId}`);
        prompt("Here is your note link:\n", url.toString());
        if (noteId) {
            const token = encryptData(noteId);
            url.searchParams.set("token", token);
            navigate(`/n/${noteId}?token=${encodeURIComponent(token)}`, {
                replace: true,
            });
        }
    };

    useHotKeys(["ctrl", "cmd", "s"], () => {
        console.log("Saved by Keyboard Shortcut.");
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
        <Layout onSave={onSave}>
            <EditorContent className={rootClassName} editor={editor} />
            <LastOpenNotePrompt />
        </Layout>
    );
}
