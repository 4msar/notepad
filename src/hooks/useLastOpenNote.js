import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLastOpenId } from "../utils";

export const useLastOpenNote = () => {
    const navigate = useNavigate();
    const lastId = getLastOpenId();

    useEffect(() => {
        console.log("LastOpenNote");
        // eslint-disable-next-line no-restricted-globals
        const confirmed = confirm("You have a last edited note,\nDo you want to open it?");
        if (lastId && confirmed) {
            navigate(`/n/${lastId}`);
        }
    }, [lastId, navigate]);
}