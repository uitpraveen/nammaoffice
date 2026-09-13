import "server-only";
import { getPublicContent } from "@/lib/cms/public";
export const getClients = async () => (await getPublicContent()).clients;
