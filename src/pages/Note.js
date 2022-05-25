import { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
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


const parseNote = (note = '') => {
    if (note.startsWith('<')) {
        return note;
    }
    return `${note}`
              .split("\n\n")
              .map((item) => `<p>${item}</p>`)
              .join("");
}

export default function Note() {
    const { note: noteId } = useParams();
    const {
        data,
        syncedData,
        isSaved,
        setIsSaved,
        saveData,
        syncNote,
        syncOnline,
    } = useNote(noteId);
    const history = useHistory();
    const showSnackbar = useSnackbar();

    var urlParams = new URLSearchParams(window.location.search);
    const encryptedToken = urlParams.get("token");
    const isReadOnly = urlParams.has("readonly");

    useUnload(!isSaved);

    const onSave = () => {
        syncNote(noteId);
        showSnackbar("Note sync successfully!", { variant: "success" });
        setIsSaved(true);
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
            setIsSaved(true);
            removeLastOpenId();
            showSnackbar("Note deleted successfully!", { variant: "warning" });
            history.push(`/new`);
        }
    };

    const inputChange = (event) => {
        const {
            target: { value },
        } = event;
        saveData({ editedAt: new Date().getTime(), note: value });
        setIsSaved(false);
    };
    const inputHandler = debounce(inputChange, 1000);

    useHotKeys(["ctrl", "cmd", "s"], () => {
        console.log("Saved by Keyboard Shortcut.");
        onSave();
    });

    useEffect(() => {
        setLastOpenId(noteId);
    }, [noteId]);

    useEffect(() => {
        setIsSaved(data?.editedAt <= syncedData?.editedAt);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [syncedData]);

    return (
        <Layout onSave={onSave} onDelete={onDelete}>
            {/* <EditNote
				defaultValue={data?.note ?? ""}
				readOnly={isReadOnly}
				onChange={inputHandler}
			/> */}
            {data?.note && (
                <TipTapEditor
                    defaultValue={parseNote(data?.note || "")}
                    editable={!isReadOnly}
                    onChange={inputHandler}
                />
            )}
            {!isSaved && <UnSaveNotice onReset={handleSync} />}
        </Layout>
    );
}
