import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useHotKeys, useSnackbar } from "../hooks";
import { getTheme, removeLocalNote, setTheme } from "../utils";
import { decryptData } from "../utils/encryptions";
import clsx from "clsx";
import {
    generateNoteId,
    generateNoteIdWithToken,
    generateShareToken,
    isEmpty,
} from "../utils/functions";
import { Sun, Moon, Menu, Trash, AddNew, Open, Save, Share } from "./Icons";
import { Tooltip } from "./Tooltip";
import {
    Modal,
    primaryButtonClass,
    secondaryButtonClass,
} from "./Modal";

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
        <Tooltip message={title} position="bottom">
            <button
                id={id}
                type="button"
                onClick={onClick}
                className={clsx(
                    "flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700",
                    className
                )}
            >
                {children}
            </button>
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
    const [openDialog, setOpenDialog] = useState(false);
    const [openKey, setOpenKey] = useState("note-");
    const showSnackbar = useSnackbar();

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

    const openNote = (key: string) => {
        if (isEmpty(key)) return;
        const noteId = generateNoteId(key);
        navigate(`/n/${noteId}${generateNoteIdWithToken(key)}`, {
            state: { noteId },
            replace: false,
        });
    };

    const handleOpen = () => {
        toggleMenu(false);
        setOpenKey("note-");
        setOpenDialog(true);
    };

    const onShareClick = () => {
        const shareToken = generateShareToken(note);
        toggleMenu(false);
        const noteId = generateNoteId(note ?? "");
        const url = `${
            window.location.origin
        }/s/${noteId}?token=${encodeURIComponent(shareToken)}`;
        navigator.clipboard.writeText(url);
        showSnackbar("Share link copied to clipboard");
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
                    title="Copy share link"
                >
                    <Share />
                    <span className="inline sm:hidden">Share</span>
                </ActionButton>
            );
        }
        return (
            <>
                <ActionButton onClick={onNewClick} id="new" title="New note">
                    <AddNew />
                    <span className="inline sm:hidden">New</span>
                </ActionButton>
                <ActionButton onClick={handleOpen} id="open" title="Open a note">
                    <Open />
                    <span className="inline sm:hidden">Open</span>
                </ActionButton>
                {!isReadOnly && (
                    <ActionButton onClick={onSave} id="save" title="Save the note">
                        <Save />
                        <span className="inline sm:hidden">Save</span>
                    </ActionButton>
                )}
                {note && !isReadOnly && note === decryptedToken && (
                    <ActionButton
                        onClick={onDelete}
                        id="delete"
                        title="Delete the note"
                        className="hover:text-red-600 dark:hover:text-red-400"
                    >
                        <Trash />
                        <span className="inline sm:hidden">Delete</span>
                    </ActionButton>
                )}
                {note.length > 0 && (
                    <ActionButton onClick={onShareClick} id="share" title="Share the note">
                        <Share />
                        <span className="inline sm:hidden">Share</span>
                    </ActionButton>
                )}
            </>
        );
    };

    const isDarkMood = appTheme === "dark";

    return (
        <header
            ref={menuRef}
            className="sticky top-0 z-40 flex h-14 w-full items-center border-x-0 border-t-0 bg-slate-100 text-slate-900 sm:relative sm:border-x sm:border-t dark:border-slate-800 dark:bg-slate-900 dark:text-white rounded-none sm:rounded-t-xl"
        >
            <div className="z-40 mx-auto flex w-full max-w-full items-center justify-between px-4">
                <h1 className="m-0 flex items-center gap-3 text-2xl font-bold">
                    <Link title="Simple note taking application" to="/">
                        Noto
                    </Link>
                    <Tooltip
                        message={isDarkMood ? "Light mode" : "Dark mode"}
                        position="bottom"
                    >
                        <button
                            type="button"
                            aria-label="Toggle theme"
                            onClick={() => switchTheme(isDarkMood ? "light" : "dark")}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            {isDarkMood ? <Sun /> : <Moon />}
                        </button>
                    </Tooltip>
                </h1>
                <div className="flex items-center">
                    <button
                        type="button"
                        aria-label="Menu"
                        onClick={() => toggleMenu(!menuOpen)}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md sm:hidden"
                    >
                        <Menu className="h-5" />
                    </button>

                    <div className="hidden sm:flex sm:items-center sm:gap-1">
                        {menuActions()}
                    </div>
                </div>

                <div
                    className={`absolute right-2 top-14 z-20 flex w-40 flex-col gap-1 rounded-lg bg-white p-2 shadow-lg transition-all duration-300 dark:bg-slate-800 sm:hidden ${
                        menuOpen
                            ? "visible translate-y-0 opacity-100"
                            : "invisible -translate-y-2 opacity-0"
                    }`}
                >
                    {menuActions()}
                </div>
            </div>

            <Modal
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                title="Open a note"
                footer={
                    <>
                        <button
                            type="button"
                            className={secondaryButtonClass}
                            onClick={() => setOpenDialog(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className={primaryButtonClass}
                            onClick={() => {
                                setOpenDialog(false);
                                openNote(openKey);
                            }}
                        >
                            Open
                        </button>
                    </>
                }
            >
                <label className="block text-sm text-slate-600 dark:text-slate-300">
                    Note key
                    <input
                        autoFocus
                        value={openKey}
                        onChange={(e) => setOpenKey(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setOpenDialog(false);
                                openNote(openKey);
                            }
                        }}
                        className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                    />
                </label>
            </Modal>
        </header>
    );
}
