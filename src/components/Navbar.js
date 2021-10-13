import React from "react";
import { Link, useParams, useHistory } from "react-router-dom";

export default function Navbar({ onSave, onDelete }) {
	const history = useHistory();
	const { note } = useParams();
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
					>
						New
					</strong>
					<strong className="action-btn" onClick={onSave} id="save">
						Save
					</strong>
					{note && (
						<strong
							className="action-btn"
							onClick={onDelete}
							id="delete"
						>
							Delete
						</strong>
					)}
				</div>
			</div>
		</header>
	);
}
