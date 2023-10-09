import { useCallback, useEffect } from "react";

export const useHotKeys = (
    keys: string[],
    callback: (evt: KeyboardEvent) => void
) => {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const cmdKeys = ["ctrl", "cmd", "command", "control"];
            const inputKeys = [event.key, event.keyCode];

            const isCtrl =
                (event.metaKey || event.ctrlKey) &&
                cmdKeys
                    .map((item) => keys.includes(item))
                    .some((item) => item === true);

            // const isAlt = event.altKey && keys.includes("alt");

            const isKey = inputKeys
                .map((item) => keys.includes(`${item}`))
                .some((item) => item === true);

            if (isCtrl && isKey) {
                event.preventDefault();
                event.stopPropagation();
                if (typeof callback === "function") {
                    callback(event);
                }
            }
        },
        [callback, keys]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);
};
