import { EditorContent } from "@tiptap/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import LastOpenNotePrompt from "../components/LastOpenNotePrompt";
import Layout from "../components/Layout";
import useHotKeys from "../hooks/useHotKeys";
import useNote from "../hooks/useNote";
import useNoteEditor from "../hooks/useNoteEditor";
import useUnload from "../hooks/useUnload";
import { encryptData } from "../utils/encryptions";
import { isEmpty } from "../utils/functions";

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
            <EditorContent className="paper tiptap" editor={editor} />
            <LastOpenNotePrompt />
        </Layout>
    );
}
