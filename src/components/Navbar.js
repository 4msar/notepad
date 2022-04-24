import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import useHotKeys from "../hooks/useHotKeys";
import { getTheme, setTheme } from "../utils";
import { decryptData } from "../utils/encryptions";
import {
	generateNoteId,
	generateNoteIdWithToken,
	isEmpty,
} from "../utils/functions";
import { Sun, Moon, Menu } from "./Icons";

export default function Navbar({ onSave, onDelete }) {
	const history = useHistory();
	const { note } = useParams();
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 425);
	const [menuOpen, toggleMenu] = useState(false);
	const [isDarkMood, toggleDarkMood] = useState(getTheme() === "dark");
	const menuRef = useRef();

	const handleOpen = () => {
		const id = prompt("Enter note key to open:", "note-");
		toggleMenu(false);
		if (!isEmpty(id)) {
			const noteId = generateNoteId(id);
			history.push(`/n/${noteId}${generateNoteIdWithToken(id)}`);
		}
	};

	useHotKeys(["ctrl", "n", "cmd", "n"], (event) => {
		console.log(event);
		history.push("/new");
	});
	useHotKeys(["ctrl", "o", "cmd", "o"], handleOpen);

	var urlParams = new URLSearchParams(window.location.search);
	const encryptedToken = urlParams.get("token");
	const isReadOnly = urlParams.has("readonly");
	const decryptedToken = !isEmpty(encryptedToken)
		? decryptData(encryptedToken ?? "")
		: null;

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 425);
		};
		const menuHandler = (event) => {
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
		const theme = isDarkMood === true ? "dark" : "light";
		document.documentElement.setAttribute("data-theme", theme);
	}, [isDarkMood]);

	const onNewClick = () => {
		history.push("/new");
	};

	const switchTheme = () => {
		toggleDarkMood((mood) => {
			const theme = !mood === true ? "dark" : "light";
			setTheme(theme);
			// document.documentElement.setAttribute("data-theme", theme);
			return !mood;
		});
	};

	const menuActions = () => {
		return (
			<>
				<strong
					className="action-btn"
					onClick={onNewClick}
					id="new"
					title="Create New"
				>
					New
				</strong>
				<strong
					className="action-btn"
					onClick={handleOpen}
					id="open"
					title="Open a note"
				>
					Open
				</strong>
				{!isReadOnly && (
					<strong
						className="action-btn"
						onClick={onSave}
						id="save"
						title="Save the Note"
					>
						Save
					</strong>
				)}
				{note && !isReadOnly && note === decryptedToken && (
					<strong
						className="action-btn"
						onClick={onDelete}
						id="delete"
						title="Delete the Note"
					>
						Delete
					</strong>
				)}
			</>
		);
	};

	return (
		<header ref={menuRef} className="navbar">
			<div className="wrapper base-wrapper">
				<h1 className="name">
					<Link title="Simple Note Taking Application..." to="/">
						Noto
					</Link>
					{isDarkMood ? (
						<Sun className="theme-switch" onClick={switchTheme} />
					) : (
						<Moon className="theme-switch" onClick={switchTheme} />
					)}
				</h1>
				<div className="actions">
					{isMobile && (
						<Menu
							onClick={() => toggleMenu(!menuOpen)}
							className="menu"
						/>
					)}
					{!isMobile && menuActions()}
				</div>
			</div>
			{isMobile && (
				<div className={`menu-box ${menuOpen ? "open" : ""}`}>
					{menuActions()}
				</div>
			)}
		</header>
	);
}
