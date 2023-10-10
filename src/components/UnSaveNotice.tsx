import { Sync } from "./Icons";

export function UnSaveNotice({ onReset }: { onReset?: () => void }) {
    return (
        <div className="fixed bottom-0 right-0 bg-red-500 rounded-tl px-2 py-1 text-white font-bold flex justify-center items-center">
            <span>Not Saved</span>
            {onReset && (
                <Sync
                    className="border-blue-400 cursor-pointer pl-2 flex justify-center items-center"
                    onClick={onReset}
                    id="sync"
                    title="Reset Local changes & sync with online."
                />
            )}
        </div>
    );
}
