import { Url } from "@/lib/types";
import ImageDecryptor from "./components/image-decryptor";


async function getUrlData(url: string): Promise<Url> {
    const res = await fetch(`http://localhost:3001/url/${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return await res.json();
}

export default async function UrlPage({ params }: { params: { url: string } }) {
    const { url } = params;
    const data = await getUrlData(url);
    return(
        <ImageDecryptor url={data.url} image={data.image} />
    )
}