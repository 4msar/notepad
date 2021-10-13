import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { decryptData } from "../utils/encryptions";
import { generateNoteId, isEmpty } from "../utils/functions";

export default function Navbar({ onSave, onDelete }) {
	const history = useHistory();
	const { note } = useParams();
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 425);
	const handleOpen = () => {
		const id = prompt("Enter note key to open:", "note-");
		if (!isEmpty(id)) {
			const noteId = generateNoteId(id);
			history.push(`/n/${noteId}`);
		}
	};

	var urlParams = new URLSearchParams(window.location.search);
	const encryptedToken = urlParams.get("token");
	const decryptedToken = encryptedToken ? decryptData(encryptedToken) : null;

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 425);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<header className="navbar">
			<div className="wrapper">
				<h1 className="name">
					<Link to="/">Note</Link>
				</h1>
				<div className="actions">
					<strong
						className="action-btn"
						onClick={() => history.push("/new")}
						id="new"
						title="Create New"
					>
						{isMobile ? "N" : "New"}
					</strong>
					<strong
						className="action-btn"
						onClick={handleOpen}
						id="open"
						title="Open a note"
					>
						{isMobile ? "O" : "Open"}
					</strong>
					<strong
						className="action-btn"
						onClick={onSave}
						id="save"
						title="Save the Note"
					>
						{isMobile ? "S" : "Save"}
					</strong>
					{note && note === decryptedToken && (
						<strong
							className="action-btn"
							onClick={onDelete}
							id="delete"
							title="Delete the Note"
						>
							{isMobile ? "D" : "Delete"}
						</strong>
					)}
				</div>
			</div>
		</header>
	);
}
