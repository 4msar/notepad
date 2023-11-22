import clsx from "clsx";
import { Layout } from "src/components";

function About() {
    return (
        <Layout
            hideNavLinks
            footerProps={{
                hideMeta: true,
                children: (
                    <p className="text-gray-500 text-xs">
                        <a href="//msar.me/contact" target="_blank">
                            Contact
                        </a>
                    </p>
                ),
            }}
        >
            <div
                className={clsx(
                    "prose prose-sm dark:prose-invert editor-font font-normal text-xl p-4 relative h-[calc(100vh-100px)] sm:h-[calc(100vh-15rem)] w-full bg-white dark:bg-slate-800 overflow-hidden overflow-y-auto max-w-full"
                )}
            >
                <h1>About</h1>
                <p>
                    <strong>
                        Noto <i>(note.msar.me)</i>
                    </strong>{" "}
                    is a simple note taking app that saves your notes in the
                    cloud and syncs them across devices on realtime. The notes
                    are stored in the cloud using AES-256 encryption and can
                    only be decrypted by the app.
                    <br />
                    You can also share your notes with others by clicking on the
                    share button. The note will be shared with a unique token
                    that can be used to access the note.
                    <br />
                    User can also encrypt the note with a password. The note
                    will be encrypted with AES-256 encryption and can only be
                    decrypted by the password.
                </p>
                <p>
                    <strong>Noto</strong> is open source and can be found on{" "}
                    <a href="//github.com/4msar/notepad" target="_blank">
                        GitHub
                    </a>
                    . You can also report bugs or request features on{" "}
                    <a href="//github.com/4msar/notepad/issues" target="_blank">
                        GitHub Issues
                    </a>
                    .
                </p>
                <p>
                    <strong>Noto</strong> is a free service and will always be
                    free. If you like the app, you can support the developer by
                    buying him a coffee.
                    <a
                        href="//www.buymeacoffee.com/msar"
                        target="_blank"
                        className="block mt-4"
                    >
                        <img
                            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                            alt="Buy Me A Coffee"
                            className="w-40"
                        />
                    </a>
                </p>
            </div>
        </Layout>
    );
}

export default About;
