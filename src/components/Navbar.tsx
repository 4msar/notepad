import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useHotKeys } from "../hooks";
import { getTheme, removeLocalNote, setTheme } from "../utils";
import { decryptData } from "../utils/encryptions";
import clsx from "clsx";
import {
    generateNoteId,
    generateNoteIdWithToken,
    isEmpty,
} from "../utils/functions";
import { Sun, Moon, Menu } from "./Icons";

export type NavbarProps = {
    onSave: (evt: React.MouseEvent) => void;
    onDelete: (evt: React.MouseEvent) => void;
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
        <strong
            id={id}
            className={clsx(
                "text-slate-900 dark:text-white cursor-pointer border rounded text-xs py-0.5 px-1.5 transition-all duration-200 mr-2.5",
                className
            )}
            onClick={onClick}
            title={title}
        >
            {children}
        </strong>
    );
};

export function Navbar({ onSave, onDelete }: NavbarProps) {
    const navigate = useNavigate();
    const { note } = useParams();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 425);
    const [menuOpen, toggleMenu] = useState(false);

    const [appTheme, setAppTheme] = useState(getTheme() ?? "light");
    const menuRef = useRef<HTMLElement>(null);

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

    useHotKeys(["ctrl", "n", "cmd", "n"], () => {
        navigate("/new");
    });
    useHotKeys(["ctrl", "o", "cmd", "o"], handleOpen);

    const urlParams = new URLSearchParams(window.location.search);
    const encryptedToken = urlParams.get("token");
    const isReadOnly = urlParams.has("readonly");
    const decryptedToken = !isEmpty(encryptedToken)
        ? decryptData(encryptedToken ?? "")
        : null;

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 425);
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const menuHandler = (event: any) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                toggleMenu(false);
            }
        };
        window.addEventListener("resize", handleResize);
        document.addEventListener("click", menuHandler);

        return () => {
            window.removeEventListener("resize", handleResize);
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
        return (
            <>
                <ActionButton
                    className="border-blue-400 bg-blue-100 dark:bg-transparent hover:text-blue-400"
                    onClick={onNewClick}
                    id="new"
                    title="Create New"
                >
                    New
                </ActionButton>
                <ActionButton
                    onClick={handleOpen}
                    id="open"
                    title="Open a note"
                    className="border-yellow-400 bg-yellow-100 dark:bg-transparent hover:text-yellow-400"
                >
                    Open
                </ActionButton>
                {!isReadOnly && (
                    <ActionButton
                        onClick={onSave}
                        id="save"
                        title="Save the Note"
                        className="border-green-400 bg-green-100 dark:bg-transparent hover:text-green-400"
                    >
                        Save
                    </ActionButton>
                )}
                {note && !isReadOnly && note === decryptedToken && (
                    <ActionButton
                        onClick={onDelete}
                        id="delete"
                        title="Delete the Note"
                        className="border-red-400 bg-red-100 dark:bg-transparent hover:text-red-400"
                    >
                        Delete
                    </ActionButton>
                )}
            </>
        );
    };

    const isDarkMood = appTheme === "dark";

    return (
        <header
            ref={menuRef}
            className="text-slate-900 dark:text-white bg-slate-400 dark:bg-slate-900 w-full h-14 fixed top-0 z-50 shadow-sm flex items-center"
        >
            <div className="flex justify-between items-center px-4 w-full max-w-full mx-auto">
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
                    {isMobile && (
                        <Menu
                            onClick={() => toggleMenu(!menuOpen)}
                            className="h-6 p-2.5"
                        />
                    )}
                    {!isMobile && menuActions()}
                </div>
            </div>
            {isMobile && (
                <div
                    className={`max-h-52 w-32 flex flex-col items-end absolute right-52 top-14 transition-all duration-200 ${
                        menuOpen ? "right-0" : ""
                    }`}
                >
                    {menuActions()}
                </div>
            )}
        </header>
    );
}
