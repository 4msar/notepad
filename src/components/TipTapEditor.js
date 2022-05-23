import { forwardRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useParams } from "react-router-dom";

const TipTapEditor = forwardRef(({ defaultValue, onChange, ...props }, ref) => {
    const { note } = useParams();
    const editor = useEditor({
        extensions: [StarterKit],
        content: defaultValue ?? "",
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

    // useEffect(() => {
    //     if (editor?.commandManager?.editor?.commands) {
    //         editor.commandManager.editor.commands.setContent(defaultValue);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [defaultValue]);

    useEffect(() => {
        if (editor?.commandManager?.editor?.commands) {
            editor.commandManager.editor.commands.setContent(defaultValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [note])

    return (
        <EditorContent
            ref={ref}
            className="paper tiptap"
            value={defaultValue}
            editor={editor}
        />
    );
});

export default TipTapEditor;
