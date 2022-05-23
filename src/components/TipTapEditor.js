import { forwardRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const TipTapEditor = forwardRef(({ defaultValue, onChange, ...props }, ref) => {
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

    return (
        <EditorContent className="paper tiptap" ref={ref} editor={editor} />
    );
});

export default TipTapEditor;
