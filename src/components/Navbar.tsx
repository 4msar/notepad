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
            <strong
                id={id}
                className={clsx(
                    "text-slate-900 dark:text-white cursor-pointer border rounded text-xs p-1 transition-all duration-200 flex items-center w-20 sm:w-auto justify-between",
                    className
                )}
                onClick={onClick}
            >
                {children}
            </strong>
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

    const handleOpen = () => {
        const id = prompt("Enter note key to open:", "note-") ?? "";
        toggleMenu(false);
        if (!isEmpty(id)) {
            const noteId = generateNoteId(id);
            navigate(`/n/${noteId}${generateNoteIdWithToken(id)}`, {
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
        navigator.clipboard.writeText(url);
        showSnackbar("Link copied to clipboard");
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
                {note && (
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
        <header
            ref={menuRef}
            className="text-slate-900 dark:text-white bg-slate-400 dark:bg-slate-900 w-full h-14 shadow-sm flex items-center border-none sm:border-x sm:border-t dark:border-slate-800 rounded-none sm:rounded-tr-md sm:rounded-tl-md"
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
    );
}
