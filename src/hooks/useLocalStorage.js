import { useCallback, useEffect, useState } from "react";
import { getLocalData } from "../utils";
import { LOCAL_NOTES } from "../utils/constant";

const useLocalStorage = (key = LOCAL_NOTES, init = "") => {
	const [item, setItem] = useState(init);

	const saveData = useCallback(
		(data = "") => {
			let saveableData = data;
			if (typeof data !== "string") {
				saveableData = JSON.stringify(data);
			}

			setItem(data);
			localStorage.setItem(key, saveableData);
		},
		[key]
	);

	useEffect(() => {
		setItem(getLocalData(key));
	}, [key]);

	return { data: item, saveData };
};

export default useLocalStorage;
