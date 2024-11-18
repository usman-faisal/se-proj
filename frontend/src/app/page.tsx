import Image from "next/image";
import IndexPage from "./components/index-page";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <><IndexPage />
      <Toaster />
      </>
      
  );
}
