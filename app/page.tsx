import Image from "next/image";
import { RefineSimulator } from "./components/Refinesimulator";

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <RefineSimulator />
    </div>
  );
}
