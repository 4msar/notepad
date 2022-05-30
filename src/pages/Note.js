import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TipTapEditor from "../components/TipTapEditor";
// import EditNote from "../components/EditNote";
import Layout from "../components/Layout";
import UnSaveNotice from "../components/UnSaveNotice";
import useHotKeys from "../hooks/useHotKeys";
import useNote from "../hooks/useNote";
import useSnackbar from "../hooks/useSnackbar";
import useUnload from "../hooks/useUnload";
import NoteService from "../services/NoteService";
import { removeLastOpenId, setLastOpenId } from "../utils";
import { decryptData } from "../utils/encryptions";
import { debounce, isEmpty } from "../utils/functions";

export default function Note() {
    const { note: noteId } = useParams();
    const {
        data,
        isSaved,
        saveData,
        syncNote,
        syncOnline,
    } = useNote(noteId);
    const navigate = useNavigate();
    const showSnackbar = useSnackbar();

    var urlParams = new URLSearchParams(window.location.search);
    const encryptedToken = urlParams.get("token");
    const isReadOnly = urlParams.has("readonly");

    useUnload(!isSaved);

    const onSave = () => {
        syncNote(noteId);
        showSnackbar("Note sync successfully!", { variant: "success" });
    };
    const handleSync = () => {
        syncOnline();
    };
    const onDelete = () => {
        const decryptedToken = !isEmpty(encryptedToken)
            ? decryptData(encryptedToken ?? "")
            : "";
        if (decryptedToken !== noteId) {
            showSnackbar("You can't delete without permission.", {
                variant: "warning",
            });
            return null;
        }
        // eslint-disable-next-line no-restricted-globals
        const confirmed = confirm("Are you sure?");
        if (confirmed) {
            NoteService.delete(noteId);
            saveData("");
            removeLastOpenId();
            showSnackbar("Note deleted successfully!", { variant: "warning" });
            navigate(`/new`);
        }
    };

    const inputChange = (event) => {
        const {
            target: { value },
        } = event;
        saveData({ editedAt: new Date().getTime(), note: value });
    };
    const inputHandler = debounce(inputChange, 1000);

    useHotKeys(["ctrl", "cmd", "s"], () => {
        console.log("Saved by Keyboard Shortcut.");
        onSave();
    });

    useEffect(() => {
        setLastOpenId(noteId);
    }, [noteId]);

    return (
        <Layout onSave={onSave} onDelete={onDelete}>
            <TipTapEditor
                data={data}
                editable={!isReadOnly}
                onChange={inputHandler}
            />
            {!isSaved && <UnSaveNotice onReset={handleSync} />}
        </Layout>
    );
}
