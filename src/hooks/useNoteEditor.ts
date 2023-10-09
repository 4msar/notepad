import { Editor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { debounce, parseNote } from "../utils/functions";

type UseNoteEditorProps = {
    text: string;
    isReadOnly?: boolean;
    onChange?: (text: string) => void;
};

export function useNoteEditor(
    { text, isReadOnly, onChange }: UseNoteEditorProps,
    deps = []
) {
    const handleChange = ({ editor }: { editor: Editor }) => {
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
                    class: "prose dark:prose-invert editor-font font-normal text-xl text-slate-900 dark:text-white resize-none block border-none outline-none bg-transparent max-w-full w-full h-full overflow-hidden overflow-y-scroll",
                },
            },
        },
        [text, ...deps]
    );
    return editor;
}
