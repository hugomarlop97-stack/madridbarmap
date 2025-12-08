import { auth } from "@/lib/auth";
import { Header } from "@/components/UI";
import MapContainer from "@/components/MapContainer";
import SplitLayout from "@/components/Layout/SplitLayout";
import SidePanel from "@/components/Panel/SidePanel";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex flex-col h-screen">
      <Header session={session} />
      <SplitLayout>
        <MapContainer session={session} />
        <SidePanel />
      </SplitLayout>
    </main>
  );
}
