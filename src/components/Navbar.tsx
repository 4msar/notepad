import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useHotKeys } from "../hooks";
import { getTheme, removeLocalNote, setTheme } from "../utils";
import { decryptData } from "../utils/encryptions";
import {
    generateNoteId,
    generateNoteIdWithToken,
    generateShareToken,
    isEmpty,
} from "../utils/functions";
import { Sun, Moon, Menu, Trash, AddNew, Open, Save, Share } from "./Icons";
import { Button } from "./ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";

export type NavbarProps = {
    onSave: (evt: React.MouseEvent) => void;
    onDelete: (evt: React.MouseEvent) => void;
    hideNavLinks?: boolean;
};

const ActionButton = ({
    onClick,
    title,
    children,
    className,
    id,
}: {
    id?: string;
    title: string;
    children: React.ReactNode;
    onClick: (evt: React.MouseEvent) => void;
    className?: string;
}) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    id={id}
                    variant="outline"
                    size="sm"
                    className={className}
                    onClick={onClick}
                >
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
                <p>{title}</p>
            </TooltipContent>
        </Tooltip>
    );
};

export function Navbar({
    onSave,
    onDelete,
    hideNavLinks = false,
}: NavbarProps) {
    const navigate = useNavigate();
    const { note = "" } = useParams();
    const [menuOpen, toggleMenu] = useState(false);
    const [openDialogOpen, setOpenDialogOpen] = useState(false);
    const [noteKey, setNoteKey] = useState("");

    const [appTheme, setAppTheme] = useState(getTheme() ?? "light");
    const menuRef = useRef<HTMLElement>(null);

    const urlParams = new URLSearchParams(window.location.search);
    const encryptedToken = urlParams.get("token");
    const isReadOnly = urlParams.has("readonly");
    const decryptedToken = useMemo(() => {
        return encryptedToken && !isEmpty(encryptedToken)
            ? decryptData(decodeURIComponent(encryptedToken) ?? "")
            : null;
    }, [encryptedToken]);

    const handleOpen = () => {
        toggleMenu(false);
        setNoteKey("note-");
        setOpenDialogOpen(true);
    };

    const handleOpenNote = () => {
        if (!isEmpty(noteKey)) {
            const noteId = generateNoteId(noteKey);
            setOpenDialogOpen(false);
            setNoteKey("");
            navigate(`/n/${noteId}${generateNoteIdWithToken(noteKey)}`, {
                state: {
                    noteId,
                },
                replace: false,
            });
        }
    };

    const onShareClick = () => {
        const shareToken = generateShareToken(note);
        toggleMenu(false);
        const noteId = generateNoteId(note ?? "");
        const url = `${
            window.location.origin
        }/s/${noteId}?token=${encodeURIComponent(shareToken)}`;
        navigator.clipboard.writeText(url)
            .then(() => {
                toast.success("Link copied to clipboard");
            })
            .catch(() => {
                toast.error("Failed to copy link");
            });
    };

    useHotKeys(["ctrl", "n", "cmd", "n"], () => {
        navigate("/new");
    });
    useHotKeys(["ctrl", "o", "cmd", "o"], handleOpen);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const menuHandler = (event: any) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                toggleMenu(false);
            }
        };
        document.addEventListener("click", menuHandler);

        return () => {
            document.removeEventListener("click", menuHandler);
        };
    }, []);

    useEffect(() => {
        document.documentElement.classList.remove("light", "dark");

        document.documentElement.classList.add(appTheme);
    }, [appTheme]);

    const onNewClick = () => {
        removeLocalNote();
        navigate("/new");
    };

    const switchTheme = (mode: string) => {
        setTheme(mode);
        setAppTheme(mode);
    };

    const menuActions = () => {
        if (note.length <= 0) {
            return null;
        }

        if (hideNavLinks) {
            return (
                <ActionButton
                    onClick={onShareClick}
                    id="share"
                    title="Copy Share Link"
                    className="dark:border-indigo-400 text-slate-800 hover:text-indigo-400"
                >
                    <Share />{" "}
                    <span className="pl-2 inline sm:hidden">Share</span>
                </ActionButton>
            );
        }
        return (
            <>
                <ActionButton
                    className="dark:border-blue-400 text-slate-800 hover:text-blue-400"
                    onClick={onNewClick}
                    id="new"
                    title="Create New"
                >
                    <AddNew />{" "}
                    <span className="pl-2 inline sm:hidden">New</span>
                </ActionButton>
                <ActionButton
                    onClick={handleOpen}
                    id="open"
                    title="Open a note"
                    className="dark:border-yellow-400 text-slate-800 hover:text-yellow-400"
                >
                    <Open /> <span className="pl-2 inline sm:hidden">Open</span>
                </ActionButton>
                {!isReadOnly && (
                    <ActionButton
                        onClick={onSave}
                        id="save"
                        title="Save the Note"
                        className="dark:border-green-400 text-slate-800 hover:text-green-400"
                    >
                        <Save />{" "}
                        <span className="pl-2 inline sm:hidden">Save</span>
                    </ActionButton>
                )}
                {note && !isReadOnly && note === decryptedToken && (
                    <ActionButton
                        onClick={onDelete}
                        id="delete"
                        title="Delete the Note"
                        className="dark:border-red-400 text-slate-800 hover:text-red-400"
                    >
                        <Trash />{" "}
                        <span className="pl-2 inline sm:hidden">Delete</span>
                    </ActionButton>
                )}
                {note.length > 0 && (
                    <ActionButton
                        onClick={onShareClick}
                        id="share"
                        title="Share the note"
                        className="dark:border-indigo-400 text-slate-800 hover:text-indigo-400"
                    >
                        <Share />{" "}
                        <span className="pl-2 inline sm:hidden">Share</span>
                    </ActionButton>
                )}
            </>
        );
    };

    const isDarkMood = appTheme === "dark";

    return (
        <TooltipProvider>
            <header
                ref={menuRef}
                className="text-slate-900 dark:text-white bg-slate-400 dark:bg-slate-900 sticky top-0 sm:relative z-40 w-full h-14 shadow-sm flex items-center border-t-0 border-x-0 sm:border-x sm:border-t dark:border-slate-800 rounded-none sm:rounded-tr-md sm:rounded-tl-md"
            >
                <div className="flex justify-between items-center px-4 w-full max-w-full mx-auto z-40">
                    <h1 className="text-4xl font-bold font-nunito m-0 flex items-center">
                        <Link title="Simple Note Taking Application..." to="/">
                            Noto
                        </Link>
                        {isDarkMood ? (
                            <Sun
                                className="ml-4 cursor-pointer"
                                onClick={() => switchTheme("light")}
                            />
                        ) : (
                            <Moon
                                className="ml-4 cursor-pointer"
                                onClick={() => switchTheme("dark")}
                            />
                        )}
                    </h1>
                    <div className="flex items-center">
                        <Menu
                            onClick={() => toggleMenu(!menuOpen)}
                            className="h-6 cursor-pointer flex sm:hidden"
                        />

                        <div className="hidden sm:flex sm:items-center sm:space-x-1">
                            {menuActions()}
                        </div>
                    </div>

                    <div
                        className={`max-h-52 w-24 right-1 rounded-b z-20 space-y-2 flex flex-col sm:hidden sm:items-end absolute p-2 m-0 bg-slate-200 dark:bg-slate-800 transition-all duration-400 justify-center items-center overflow-hidden ${
                            menuOpen
                                ? "top-14 visible opacity-100"
                                : "-top-52 opacity-0 invisible"
                        }`}
                    >
                        {menuActions()}
                    </div>
                </div>
            </header>

            <Dialog open={openDialogOpen} onOpenChange={setOpenDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Open Note</DialogTitle>
                        <DialogDescription>
                            Enter the note key to open an existing note.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="noteKey" className="text-right">
                                Note Key
                            </Label>
                            <Input
                                id="noteKey"
                                value={noteKey}
                                onChange={(e) => setNoteKey(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleOpenNote();
                                    }
                                }}
                                placeholder="note-"
                                className="col-span-3"
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpenDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleOpenNote}>
                            Open Note
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    );
}
