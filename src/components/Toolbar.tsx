import { Editor, useEditorState } from "@tiptap/react";
import clsx from "clsx";

type Item = {
    key: string;
    label: string;
    content: React.ReactNode;
    run: (editor: Editor) => void;
    isActive: (editor: Editor) => boolean;
    isDisabled?: (editor: Editor) => boolean;
};

const items: Item[] = [
    {
        key: "bold",
        label: "Bold",
        content: <strong>B</strong>,
        run: (e) => e.chain().focus().toggleBold().run(),
        isActive: (e) => e.isActive("bold"),
    },
    {
        key: "italic",
        label: "Italic",
        content: <em>I</em>,
        run: (e) => e.chain().focus().toggleItalic().run(),
        isActive: (e) => e.isActive("italic"),
    },
    {
        key: "strike",
        label: "Strikethrough",
        content: <s>S</s>,
        run: (e) => e.chain().focus().toggleStrike().run(),
        isActive: (e) => e.isActive("strike"),
    },
    {
        key: "h1",
        label: "Heading 1",
        content: "H1",
        run: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: (e) => e.isActive("heading", { level: 1 }),
    },
    {
        key: "h2",
        label: "Heading 2",
        content: "H2",
        run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: (e) => e.isActive("heading", { level: 2 }),
    },
    {
        key: "bullet",
        label: "Bulleted list",
        content: "• List",
        run: (e) => e.chain().focus().toggleBulletList().run(),
        isActive: (e) => e.isActive("bulletList"),
    },
    {
        key: "ordered",
        label: "Numbered list",
        content: "1. List",
        run: (e) => e.chain().focus().toggleOrderedList().run(),
        isActive: (e) => e.isActive("orderedList"),
    },
    {
        key: "quote",
        label: "Quote",
        content: "“ ”",
        run: (e) => e.chain().focus().toggleBlockquote().run(),
        isActive: (e) => e.isActive("blockquote"),
    },
    {
        key: "code",
        label: "Code block",
        content: "</>",
        run: (e) => e.chain().focus().toggleCodeBlock().run(),
        isActive: (e) => e.isActive("codeBlock"),
    },
    {
        key: "undo",
        label: "Undo",
        content: "↶",
        run: (e) => e.chain().focus().undo().run(),
        isActive: () => false,
        isDisabled: (e) => !e.can().undo(),
    },
    {
        key: "redo",
        label: "Redo",
        content: "↷",
        run: (e) => e.chain().focus().redo().run(),
        isActive: () => false,
        isDisabled: (e) => !e.can().redo(),
    },
];

/**
 * Formatting toolbar. Uses useEditorState so active/disabled states update on
 * every selection change without re-rendering the whole page.
 */
export function EditorToolbar({ editor }: { editor: Editor | null }) {
    const state = useEditorState({
        editor,
        selector: ({ editor: e }) =>
            e
                ? Object.fromEntries(
                      items.map((item) => [
                          item.key,
                          {
                              active: item.isActive(e),
                              disabled: item.isDisabled?.(e) ?? false,
                          },
                      ])
                  )
                : null,
    });

    if (!editor || !state) return null;

    return (
        <div
            role="toolbar"
            aria-label="Formatting"
            className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-slate-200 bg-white/90 px-3 py-2 backdrop-blur dark:border-slate-700 dark:bg-slate-800/90"
        >
            {items.map((item) => {
                const s = state[item.key];
                return (
                    <button
                        key={item.key}
                        type="button"
                        title={item.label}
                        aria-label={item.label}
                        aria-pressed={s.active}
                        disabled={s.disabled}
                        onMouseDown={(evt) => evt.preventDefault()}
                        onClick={() => item.run(editor)}
                        className={clsx(
                            "min-w-8 rounded-md px-2 py-1 text-sm text-slate-700 transition-colors dark:text-slate-200",
                            "hover:bg-slate-100 dark:hover:bg-slate-700",
                            "disabled:cursor-not-allowed disabled:opacity-40",
                            s.active &&
                                "bg-slate-200 font-semibold dark:bg-slate-600"
                        )}
                    >
                        {item.content}
                    </button>
                );
            })}
        </div>
    );
}
