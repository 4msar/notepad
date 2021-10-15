import { useEffect, useState } from "react";
import { LOCAL_NOTES } from "../utils/constant";
import { isJsonString } from "../utils/functions";

const useLocalStorage = (key = LOCAL_NOTES) => {
	const data = localStorage.getItem(key);
	const initValue = isJsonString(data) ? (JSON.parse(data) ?? {}) : (data || "");
	const [item, setItem] = useState(initValue);
	const saveData = (data = "") => {
		let saveableData = data;
		if( typeof data !== 'string' ){
			saveableData = JSON.stringify(data);
		}

		setItem(data);
		localStorage.setItem(key, saveableData);
	};

	useEffect(() => {
		if( isJsonString(data) ){
			setItem(JSON.parse(data) ?? {});
		}else{
			setItem(data ?? "");
		}
	}, [data]);

	return { data: item, saveData };
};

export default useLocalStorage;
