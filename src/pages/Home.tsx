import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getLastOpenId } from "../utils/helpers";
import { Layout } from "src/components";

export default function Home() {
    const lastId = getLastOpenId();
    const navigate = useNavigate();

    useEffect(() => {
        if (
            lastId &&
            // eslint-disable-next-line no-restricted-globals
            confirm("You have a last edited note,\nDo you want to open it?")
        ) {
            navigate(`/n/${lastId}`);
        } else {
            navigate(`/new`);
        }
    }, [navigate, lastId]);

    return (
        <Layout>
            <div className="flex justify-center items-center py-24 px-12">
                Loading...
            </div>
        </Layout>
    );
}
