import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import Layout from "../components/Layout";
import { getLastOpenId } from "../utils";

export default function Home() {
	const lastId = getLastOpenId();
	const navigate = useNavigate();

	useEffect(() => {
		if (
			lastId &&
			// eslint-disable-next-line no-restricted-globals
			confirm("You have a last edited note,\nDo you want to open it?")
		) {
			navigate(`/n/${lastId}`);
		} else {
			navigate(`/new`);
		}
	}, [navigate, lastId]);

	console.log('Home', { lastId });

	return (
		<Layout>
			<div className="flex-center loading">Loading...</div>
		</Layout>
	);
}
