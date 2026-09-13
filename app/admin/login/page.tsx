import { Login } from "@/components/studio/Login";
import { googleSignInEnabled } from "@/lib/studio/identity";
export const dynamic="force-dynamic";
export default async function Page({searchParams}:{searchParams:Promise<{error?:string}>}){const {error}=await searchParams;return <Login googleEnabled={googleSignInEnabled()} oauthError={Boolean(error)}/>;}
