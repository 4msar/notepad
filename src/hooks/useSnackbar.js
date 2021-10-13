import { useSnackbar as useOriginalSnackbar } from "react-notistack";

const useSnackbar = (config = {}) => {
	const { enqueueSnackbar } = useOriginalSnackbar();
	const showSnackbar = (msg, options = {}) =>
		enqueueSnackbar(msg, {
			variant: "info",
			hide: 5000,
			...config,
			...options,
		});

	return showSnackbar;
};

export default useSnackbar;
