import { PasswordReset } from "@/components/studio/Login";
export default async function Page({searchParams}:{searchParams:Promise<{token?:string}>}){return <PasswordReset token={(await searchParams).token}/>;}
