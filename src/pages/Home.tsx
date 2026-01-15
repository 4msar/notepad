import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getLastOpenId } from "../utils/helpers";
import { Layout } from "src/components";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "src/components/ui/alert-dialog";

export default function Home() {
    const lastId = getLastOpenId();
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        if (lastId) {
            setShowDialog(true);
        } else {
            navigate(`/new`);
        }
    }, [navigate, lastId]);

    const handleOpenLastNote = () => {
        setShowDialog(false);
        navigate(`/n/${lastId}`);
    };

    const handleCreateNew = () => {
        setShowDialog(false);
        navigate(`/new`);
    };

    return (
        <>
            <Layout>
                <div className="flex justify-center items-center py-24 px-12">
                    Loading...
                </div>
            </Layout>

            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Last Edited Note</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have a last edited note. Do you want to open it or create a new one?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCreateNew}>
                            Create New
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleOpenLastNote}>
                            Open Last Note
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
