import path from "node:path";
export const dataDir = () => process.env.CMS_DATA_DIR || path.join(process.cwd(), ".local/cms");
export const baseURL = () => process.env.BETTER_AUTH_URL || "http://127.0.0.1:3001";

export function trustedOrigins(){const u=new URL(baseURL());const origins=[u.origin];if(["127.0.0.1","localhost"].includes(u.hostname)){u.hostname=u.hostname==="127.0.0.1"?"localhost":"127.0.0.1";origins.push(u.origin);}return origins;}
