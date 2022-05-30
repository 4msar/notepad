import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { forwardRef } from "react";

const parseNote = (note = "") => {
    if (note.startsWith("<")) {
        return note;
    }
    return `${note}`
        .split("\n\n")
        .map((item) => `<p>${item}</p>`)
        .join("");
};

const TipTapEditor = forwardRef(({ data: {note: defaultValue='', syncAt}, onChange, noteId, ...props }, ref) => {
    const editor = useEditor(
        {
            extensions: [StarterKit],
            content: parseNote(defaultValue),
            autofocus: false,
            onUpdate: ({ editor }) => {
                const editorContent = editor.getHTML();
                // send the content to an API here
                if (typeof onChange === "function") {
                    onChange({ target: { value: editorContent } });
                }
            },
            editorProps: {
                attributes: {
                    class: "prose editor",
                },
            },
            ...props,
        },
        [noteId, syncAt]
    );

    return (
        <EditorContent
            ref={ref}
            className="paper tiptap"
            editor={editor}
        />
    );
});

export default TipTapEditor;
