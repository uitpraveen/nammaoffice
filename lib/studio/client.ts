"use client";
import { createAuthClient } from "better-auth/react";
export const authClient=createAuthClient();
export async function request<T>(url:string,options:RequestInit={}):Promise<T>{
  const r=await fetch(url,{...options,headers:{...(options.body instanceof FormData?{}:{"Content-Type":"application/json"}),...options.headers},signal:options.signal??AbortSignal.timeout(30000)});
  const data=await r.json().catch(()=>({error:"The server could not complete this request."}));
  if(!r.ok){const error=new Error(data.error||"Request failed.") as Error&{status:number};error.status=r.status;throw error;}return data;
}
