import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { debounce, parseNote } from "../utils/functions";

function useNoteEditor({ text, isReadOnly, onChange }, deps = []) {
    const handleChange = ({ editor }) => {
        const editorContent = editor.getHTML();
        // send the content to an API here
        if (typeof onChange === "function") {
            onChange(editorContent);
        }
    };

    const editor = useEditor(
        {
            extensions: [StarterKit],
            content: parseNote(text),
            autofocus: true,
            editable: !isReadOnly,
            onUpdate: debounce(handleChange, 100),
            editorProps: {
                attributes: {
                    class: "prose editor",
                },
            },
        },
        [text, ...deps]
    );
    return editor;
}

export default useNoteEditor;
