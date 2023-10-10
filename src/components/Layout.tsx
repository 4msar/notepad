import { Footer } from ".";
import { Navbar, NavbarProps } from "./Navbar";

export function Layout({
    children,
    ...props
}: {
    children: React.ReactNode;
} & Partial<NavbarProps>) {
    return (
        <div className="bg-white dark:bg-slate-700 font-nunito border rounded-md dark:border-slate-900 m-0 sm:m-20 sm:mx-auto w-full sm:w-[80vw] h-full">
            <Navbar {...(props as NavbarProps)} />
            <main className="relative mx-auto max-h-min">{children}</main>
            <Footer />
        </div>
    );
}
