import { Editor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { debounce, parseNote } from "../utils/functions";
import clsx from "clsx";

type UseNoteEditorProps = {
    text: string;
    isReadOnly?: boolean;
    onChange?: (text: string) => void;
};

export const rootClassName = clsx(
    "relative max-h-[80vh] h-[calc(100vh-100px)] sm:h-[calc(100vh-15rem)] w-full text-slate-900 dark:text-white px-2 py-4 point-bg"
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
            extensions: [StarterKit],
            content: parseNote(text),
            autofocus: true,
            editable: !isReadOnly,
            onUpdate: debounce(handleChange, 100),
            editorProps: {
                attributes: {
                    class: "prose prose-sm dark:prose-invert prose-pre:max-w-2xl pr-2 editor-font font-normal text-xl text-slate-900 dark:text-white resize-none block border-none outline-none bg-transparent max-w-full w-full h-full overflow-hidden overflow-y-auto",
                },
            },
        },
        [...deps]
    );
    return editor;
}
