import { Editor, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { debounce, parseNote } from "../utils/functions";
import clsx from "clsx";

type UseNoteEditorProps = {
    text: string;
    isReadOnly?: boolean;
    onChange?: (text: string) => void;
};

export const rootClassName = clsx(
    "relative max-h-full h-full min-h-[60vh] sm:max-h-[80vh] sm:h-[calc(100vh-15rem)] w-full text-slate-900 dark:text-white px-2 point-bg"
);

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
            extensions: [
                StarterKit,
                Placeholder.configure({
                    // Use a placeholder:
                    placeholder: "Write something…",
                    emptyNodeClass: "is-empty is-editor-empty not-prose",
                }),
            ],
            content: parseNote(text),
            autofocus: true,
            editable: !isReadOnly,
            onUpdate: debounce(handleChange, 100),
            editorProps: {
                attributes: {
                    class: "prose prose-sm dark:prose-invert prose-pre:max-w-2xl pr-2 py-4 editor-font font-normal text-xl text-slate-900 dark:text-white resize-none block border-none outline-none bg-transparent max-w-full w-full h-full overflow-hidden overflow-y-auto",
                },
            },
        },
        [...deps]
    );
    return editor;
}
