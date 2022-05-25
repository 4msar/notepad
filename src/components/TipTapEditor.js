import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { forwardRef } from "react";
import { useParams } from "react-router-dom";

const TipTapEditor = forwardRef(({ defaultValue, onChange, noteId, data, ...props }, ref) => {
    const { note } = useParams();
    const editor = useEditor({
        extensions: [StarterKit],
        content: defaultValue,
        autofocus: true,
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
    }, [note]);

    // console.log({ note, defaultValue, noteId, data });

    return (
        <EditorContent
            ref={ref}
            className="paper tiptap"
            editor={editor}
        />
    );
});

export default TipTapEditor;
