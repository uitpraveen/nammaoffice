import { googleSignInEnabled } from "@/lib/studio/identity";
import { auth } from "@/lib/studio/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { boundedBytes, response } from "@/lib/studio/access";
const handlers=toNextJsHandler(auth);
const allowed=new Set(["sign-in/email","sign-out","get-session","request-password-reset","reset-password","change-password","list-sessions","revoke-session","revoke-other-sessions"]);
async function handle(request:Request){
  const route=new URL(request.url).pathname.replace(/^\/api\/auth\//,"");
  const resetCallback=request.method==="GET" && /^reset-password\/[A-Za-z0-9_-]{16,256}$/.test(route);
  const googleRoute=googleSignInEnabled() && (route==="sign-in/social" && request.method==="POST" || route==="callback/google" && request.method==="GET");
  if(!allowed.has(route) && !resetCallback && !googleRoute)return response({error:"This authentication endpoint is not available."},404);
  if(request.method==="POST"){
    try{const bytes=await boundedBytes(request,32*1024);if(route==="sign-in/social"){const input=JSON.parse(bytes.toString());if(input.provider!=="google" || input.idToken || input.additionalParams)return response({error:"Use the Google sign-in button."},400);}
      return handlers.POST(new Request(request.url,{method:"POST",headers:request.headers,body:bytes}));}
    catch{return response({error:"Invalid authentication request."},400);}
  }
  return handlers.GET(request);
}
export const GET=handle;
export const POST=handle;
