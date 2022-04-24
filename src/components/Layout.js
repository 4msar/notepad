import React from "react";
import Navbar from "./Navbar";

export default function Layout({ children, ...props }) {
	return (
		<div className="App">
			<Navbar {...props} />
			<main className="base-wrapper">{children}</main>
		</div>
	);
}
