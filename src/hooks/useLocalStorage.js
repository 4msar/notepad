import { useEffect, useState } from "react";
import { LOCAL_NOTES } from "../utils/constant";

const useLocalStorage = (key = LOCAL_NOTES) => {
	const [item, setItem] = useState("");
	const saveData = (data = "") => {
		setItem(data);
		localStorage.setItem(key, data);
	};

	const data = localStorage.getItem(key);
	useEffect(() => {
		setItem(data ?? "");
	}, [data]);

	return { data: item, saveData };
};

export default useLocalStorage;
