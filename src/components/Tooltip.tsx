import React from "react";

export const Tooltip = ({
    message,
    children,
    position = "bottom",
}: {
    message: string;
    children: React.ReactNode;
    position?: "top" | "left" | "right" | "bottom";
}) => {
    const tipRef = React.useRef<HTMLDivElement>(null);
    const orientations = {
        right: "right",
        top: "top",
        left: "left",
        bottom: "bottom",
    };

    function handleMouseEnter() {
        if (tipRef.current) {
            tipRef.current.style.opacity = "1";
        }
    }

    function handleMouseLeave() {
        if (tipRef.current) {
            tipRef.current.style.opacity = "0";
        }
    }

    const setContainerPosition = (orientation: string) => {
        let classnames;

        switch (orientation) {
            case orientations.right:
                classnames = "top-0 left-full ml-4";
                break;
            case orientations.left:
                classnames = "top-0 right-full mr-4";
                break;
            case orientations.top:
                classnames =
                    "bottom-full left-[50%] translate-x-[-50%] -translate-y-2";
                break;
            case orientations.bottom:
                classnames =
                    "top-full left-[50%] translate-x-[-50%] translate-y-2";
                break;

            default:
                break;
        }

        return classnames;
    };

    const setPointerPosition = (orientation: string) => {
        let classnames;

        switch (orientation) {
            case orientations.right:
                classnames = "left-[-6px]";
                break;
            case orientations.left:
                classnames = "right-[-6px]";
                break;
            case orientations.top:
                classnames =
                    "top-full left-[50%] translate-x-[-50%] -translate-y-2";
                break;
            case orientations.bottom:
                classnames =
                    "bottom-full left-[50%] translate-x-[-50%] translate-y-2";
                break;

            default:
                break;
        }

        return classnames;
    };

    const classContainer = `w-max absolute z-10 ${setContainerPosition(
        position
    )} bg-gray-600 text-white text-sm px-2 py-1 rounded hidden items-center transition-all duration-150 pointer-events-none sm:flex`;

    const pointerClasses = `bg-gray-600 h-3 w-3 absolute z-10 ${setPointerPosition(
        position
    )} rotate-45 pointer-events-none`;

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={classContainer} style={{ opacity: 0 }} ref={tipRef}>
                <div className={pointerClasses} />
                {message}
            </div>
            {children}
        </div>
    );
};
