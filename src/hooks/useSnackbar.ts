import { useSnackbar as useOriginalSnackbar } from "notistack";

export const useSnackbar = (config = {}) => {
    const { enqueueSnackbar } = useOriginalSnackbar();

    const showSnackbar = (msg: string, options = {}) =>
        enqueueSnackbar(msg, {
            variant: "info",
            autoHideDuration: 3000,
            ...config,
            ...options,
        });

    return showSnackbar;
};
