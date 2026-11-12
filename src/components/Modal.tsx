import { ReactNode, useEffect, useRef } from "react";

/**
 * Native <dialog>-based modal. Replaces window.prompt/confirm, which block
 * the page and can't be styled.
 */
export function Modal({
    open,
    onClose,
    title,
    children,
    footer,
}: {
    open: boolean;
    onClose: () => void;
    title: string;
    children?: ReactNode;
    footer?: ReactNode;
}) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog
            ref={ref}
            onClose={onClose}
            className="m-auto w-[min(92vw,28rem)] rounded-xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-900/40 dark:bg-slate-800 dark:text-white"
        >
            <div className="p-5">
                <h2 className="mb-3 text-lg font-bold">{title}</h2>
                {children}
            </div>
            {footer && (
                <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3 dark:border-slate-700">
                    {footer}
                </div>
            )}
        </dialog>
    );
}

export const buttonClass =
    "rounded-md px-3 py-1.5 text-sm font-semibold transition-colors cursor-pointer";
export const primaryButtonClass = `${buttonClass} bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white`;
export const secondaryButtonClass = `${buttonClass} text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700`;
export const dangerButtonClass = `${buttonClass} bg-red-600 text-white hover:bg-red-500`;
