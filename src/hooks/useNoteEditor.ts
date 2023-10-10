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
    "relative h-[calc(100vh-56px)] text-slate-900 dark:text-white pl-6 sm:pl-12 pt-4 before:absolute before:w-full before:h-full before:top-0 before:left-4 before:sm:left-10 before:b-0 before:border-l before:border-slate-400"
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
                    class: "prose dark:prose-invert editor-font font-normal text-xl text-slate-900 dark:text-white resize-none block border-none outline-none bg-transparent max-w-full w-full h-full overflow-hidden overflow-y-auto pr-6 sm:pr-12",
                },
            },
        },
        [text, ...deps]
    );
    return editor;
}
