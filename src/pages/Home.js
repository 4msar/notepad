import React, { useEffect } from "react";
import { useHistory } from "react-router";
import Layout from "../components/Layout";
import { getLastOpenId } from "../utils";

export default function Home() {
	const lastId = getLastOpenId();
	const history = useHistory();

	useEffect(() => {
		if (
			lastId &&
			// eslint-disable-next-line no-restricted-globals
			confirm("You have a last edited note,\nDo you want to open it?")
		) {
			history.push(`/n/${lastId}`);
		} else {
			history.push(`/new`);
		}
	}, [history, lastId]);

	return (
		<Layout>
			<div className="flex-center loading">Loading...</div>
		</Layout>
	);
}
