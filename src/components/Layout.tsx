import { Footer } from ".";
import { Navbar, NavbarProps } from "./Navbar";

export function Layout({
    children,
    hideNavLinks = false,
    hideMeta = false,
    ...props
}: {
    hideMeta?: boolean;
    hideNavLinks?: boolean;
    children: React.ReactNode;
} & Partial<NavbarProps>) {
    return (
        <div className="bg-white dark:bg-slate-700 font-nunito rounded-none sm:rounded-md m-0 sm:m-20 sm:mx-auto w-full sm:w-[80vw] h-full">
            <Navbar hideNavLinks={hideNavLinks} {...(props as NavbarProps)} />
            <main className="relative mx-auto border-none sm:border-x dark:border-slate-800 max-h-min">
                {children}
            </main>
            <Footer hideMeta={hideMeta} />
        </div>
    );
}
