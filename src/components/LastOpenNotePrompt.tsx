import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLastOpenId, removeLastOpenId } from "../utils/helpers";

export function LastOpenNotePrompt() {
    const [id, setId] = useState<string | null>(getLastOpenId());
    const handleCancel = () => {
        removeLastOpenId();
        setId(null);
    };

    useEffect(() => {
        if (id) console.log("Last Note ID: " + id);
    }, [id]);

    if (!id) return null;

    return (
        <div className="fixed bottom-0 right-0 left-0 max-w-[50vw] w-auto my-0 mx-auto bg-yellow-200 rounded-tr rounded-tl px-2 py-1 text-slate-900 font-semibold font-nunito flex justify-center items-center">
            <div className="hidden sm:block">
                You have a last edited note, do you want to open it?
            </div>
            <div className="sm:hidden block">Open Last Note</div>

            <div className="flex items-center">
                <Link
                    className="cursor-pointer ml-2 text-blue-500"
                    to={`/n/${id}`}
                >
                    Open
                </Link>
                <div
                    className="cursor-pointer ml-2 text-red-500"
                    onClick={handleCancel}
                >
                    Cancel
                </div>
            </div>
        </div>
    );
}
