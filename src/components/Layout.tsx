import { Navbar, NavbarProps } from "./Navbar";

export function Layout({
    children,
    ...props
}: {
    children: React.ReactNode;
} & Partial<NavbarProps>) {
    return (
        <div className="App">
            <Navbar {...(props as NavbarProps)} />
            <main className="max-w-full relative mt-14 mx-auto">
                {children}
            </main>
        </div>
    );
}
