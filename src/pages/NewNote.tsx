import { LastOpenNotePrompt, Layout } from "src/components";
import { useHotKeys, useNote, useNoteEditor, useUnload } from "src/hooks";
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
            navigate(`/n/${noteId}?token=${token}`, { replace: true });
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
            <EditorContent
                className="relative h-[calc(100vh-56px)] text-slate-900 dark:text-white px-12 pt-4 before:absolute before:w-full before:h-full before:top-0 before:left-10 before:b-0 before:border-l before:border-slate-400"
                editor={editor}
            />
            <LastOpenNotePrompt />
        </Layout>
    );
}
