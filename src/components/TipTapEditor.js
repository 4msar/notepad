import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { forwardRef, useEffect } from "react";
import { useParams } from "react-router-dom";

const TipTapEditor = forwardRef(({ newNote = false, defaultValue, onChange, ...props }, ref) => {
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
    });

    const setEditorContent = (content) => {
        if (editor?.commandManager?.editor?.commands && content) {
            editor.commandManager.editor.commands.setContent(content);
        }
    }

    useEffect(() => {
        setEditorContent(defaultValue)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [note]);

    return (
        <EditorContent
            ref={ref}
            className="paper tiptap"
            editor={editor}
        />
    );
});

export default TipTapEditor;
