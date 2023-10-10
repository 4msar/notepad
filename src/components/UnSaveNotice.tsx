import { Sync } from "./Icons";
import { Tooltip } from "./Tooltip";

export function UnSaveNotice({ onReset }: { onReset?: () => void }) {
    if (!onReset) return null;

    return (
        <div className="fixed bottom-0 right-0 bg-red-500 rounded-tl px-2 py-1 text-white font-bold flex justify-center items-center">
            <Tooltip message="Reset Changes" position="left">
                {onReset && (
                    <Sync
                        className="border-blue-400 cursor-pointer flex justify-center items-center w-8 h-8"
                        onClick={onReset}
                        id="sync"
                        title="Reset Local changes & sync with online."
                    />
                )}
            </Tooltip>
        </div>
    );
}
