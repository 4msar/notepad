import { useEffect } from "react";

const useUnload = (confirmBeforeUnload = true) => {

    useEffect(() => {
        const onUnload = (event) => {
            event.preventDefault();
            return 'Are you sure?'
        };

        if( confirmBeforeUnload ){
            window.onbeforeunload = onUnload;
        }else{
            window.onbeforeunload = undefined
        }

        return () => window.onbeforeunload = undefined;
    }, [confirmBeforeUnload]);
    
};

export default useUnload;