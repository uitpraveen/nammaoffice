import { LogoManager } from "@/components/admin/LogoManager";
import { readClients, canWrite } from "@/lib/admin/store";

export const metadata = { title: "Client logos" };
/** Always reflect what is on disk right now, never a cached list. */
export const dynamic = "force-dynamic";

export default async function AdminLogosPage() {
  return <LogoManager initialClients={await readClients()} canWrite={canWrite} />;
}
