import { useCallback, useEffect } from "react";

const useHotKeys = (keys=[], callback)=>{

    const handleKeyDown = useCallback((event)=>{
        const cmdKeys = ['ctrl', 'cmd', 'command', 'control'];
        const inputKeys = [event.key, event.keyCode];
        
        const isCtrl = (event.metaKey || event.ctrlKey) && cmdKeys.map(item => keys.includes(item)).some(item => item === true);

        // eslint-disable-next-line no-unused-vars
        const isAlt = event.altKey && keys.includes('alt');
        
        const isKey = inputKeys.map(item => keys.includes(item)).some(item => item === true);

        if ( isCtrl && isKey ) {
            event.preventDefault();
            event.stopPropagation();
            if( typeof callback === 'function' ){
                callback(event);
            }
        }
    }, [callback, keys]);

    useEffect(()=>{
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown)
    },[handleKeyDown]);
}

export default useHotKeys;