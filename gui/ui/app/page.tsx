import Image from "next/image";
import Session from "@/components/Session.tsx";
import Root from "@/components/Root.tsx";
import SessionContainer from "@/components/SessionContainer.tsx";
import Navigation from "@/components/Navigation.tsx";

export default function Home() {
  return (<Root/>)
  return (
  <div>
    <Navigation></Navigation>
    <SessionContainer></SessionContainer>
  </div>
  );
}
