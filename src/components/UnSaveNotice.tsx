import { Sync } from "./Icons";

export function UnSaveNotice({ onReset }: { onReset?: (id: string) => void }) {
    return (
        <div className="unsaved">
            <span>Not Saved</span>
            {onReset && (
                <Sync
                    className="action-btn flex-center"
                    onClick={onReset}
                    id="sync"
                    title="Reset Local changes & sync with online."
                />
            )}
        </div>
    );
}
