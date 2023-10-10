/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

export const useUnload = (confirmBeforeUnload = true) => {
    useEffect(() => {
        const onUnload = (event: any) => {
            event.preventDefault();
            return "Are you sure?";
        };

        if (confirmBeforeUnload) {
            window.onbeforeunload = onUnload;
        } else {
            window.onbeforeunload = undefined;
        }

        return () => (window.onbeforeunload = undefined);
    }, [confirmBeforeUnload]);
};

declare global {
    interface Window {
        onbeforeunload: any;
    }
}
