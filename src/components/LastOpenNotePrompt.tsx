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
        <div className="last-note">
            <div className="last-note-title">
                You have a last edited note, do you want to open it?
            </div>
            <div className="last-note-title mobile">Open Last Note</div>

            <div className="last-note-buttons">
                <Link className="last-note-button" to={`/n/${id}`}>
                    Open
                </Link>
                <div className="last-note-button" onClick={handleCancel}>
                    Cancel
                </div>
            </div>
        </div>
    );
}
