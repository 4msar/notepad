import { forwardRef, useEffect, useState } from "react";

type EditNoteProps = {
    defaultValue: string;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    readOnly?: boolean;
};

export const EditNote = forwardRef<HTMLTextAreaElement, EditNoteProps>(
    ({ defaultValue = "", onChange, ...props }, ref) => {
        const [value, setValue] = useState<string>(defaultValue ?? "");

        useEffect(() => {
            setValue(defaultValue);
        }, [defaultValue]);

        const handleChange = (
            event: React.ChangeEvent<HTMLTextAreaElement>
        ) => {
            const {
                target: { value },
            } = event;
            setValue(value);
            if (typeof onChange === "function") {
                onChange(event);
            }
        };

        return (
            <section className="relative h-[calc(100vh-56px)] before:absolute w-0 top-0 left-10 b-0 border-l border-slate-400">
                <textarea
                    autoFocus
                    placeholder="Type your note here"
                    value={value}
                    onChange={handleChange}
                    {...props}
                    ref={ref}
                    className="editor-font font-normal text-sm text-slate-900 resize-none block border-none outline-none bg-transparent h-full w-full py-8 px-12 overflow-hidden overflow-y-scroll"
                ></textarea>
            </section>
        );
    }
);

/*
usage: 
<EditNote
	defaultValue={data?.note ?? ""}
	readOnly={isReadOnly}
	onChange={inputHandler}
/> 
*/
