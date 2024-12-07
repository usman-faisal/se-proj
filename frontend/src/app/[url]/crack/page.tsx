import Crack from "./components/Crack";


export default async function CrackPage({ params }: { params: { url: string } }) {
    const { url } = await params;
    return (
        <Crack url={url}/>
    )
}