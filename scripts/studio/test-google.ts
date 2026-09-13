import "./env";
import {promises as fs} from "node:fs";
import assert from "node:assert/strict";
import {generateKeyPair,SignJWT} from "jose";
const config=JSON.parse(await fs.readFile(".local/verification.json","utf8"));
const url=new URL(config.databaseURL);if(url.hostname!=="127.0.0.1"||!url.pathname.startsWith("/nammaoffice_verify_"))throw new Error("Google policy tests require an isolated local database.");
process.env.DATABASE_URL=config.databaseURL;process.env.BETTER_AUTH_URL=config.baseURL;process.env.CMS_DATA_DIR=config.dataDir;process.env.CMS_MAIL_MODE="local";
process.env.GOOGLE_CLIENT_ID="local-verification.apps.googleusercontent.com";process.env.GOOGLE_CLIENT_SECRET="local-verification-only";
delete process.env.CMS_GOOGLE_WORKSPACE_DOMAIN;delete process.env.CMS_ALLOWED_EMAILS;
const {auth}=await import("../../lib/studio/auth");const {pool}=await import("../../lib/studio/db");
const context=await auth.$context;const google=context.socialProviders.find(p=>p.id==="google")!;
// The sole test substitution is Google's signing-key lookup. The library still
// verifies signature, issuer, audience and expiry before our staff checks.
// This runs only in this separate process, never in the application server.
const {privateKey,publicKey}=await generateKeyPair("RS256");if(!google.idToken||!("jwks" in google.idToken))throw new Error("Expected Google JWKS verification.");google.idToken.jwks=async()=>publicKey;
let checks=0;const check=(value:unknown,message:string)=>{assert.ok(value,message);checks++;};
async function signIn(email:string,verified=true,audience=process.env.GOOGLE_CLIENT_ID!){
 const token=await new SignJWT({email,email_verified:verified,name:"Local Google fixture"}).setProtectedHeader({alg:"RS256",kid:"local-fixture"}).setSubject(email).setIssuer("https://accounts.google.com").setAudience(audience).setIssuedAt().setExpirationTime("5m").sign(privateKey);
 return auth.api.signInSocial({body:{provider:"google",idToken:{token},callbackURL:"/admin"}});
}
async function rejected(action:()=>Promise<unknown>,message:string){await assert.rejects(action,message);checks++;}
try{
 const email="google-invited@studio-test.local";const created=await auth.api.signUpEmail({body:{email,name:"Google invited author",password:"Local-fixture-password-462093!"}});
 const login=await signIn(email);check("user" in login&&login.user?.id===created.user.id,"Verified Google email claims the existing invitation");
 const {rows:[user]}=await pool.query('SELECT role FROM "user" WHERE id=$1',[created.user.id]);check(user.role==="author","Google sign-in retains assigned author role");
 await rejected(()=>signIn("not-invited@studio-test.local"),"Uninvited Google account rejected");
 await rejected(()=>signIn(email,false),"Unverified Google email rejected");
 await rejected(()=>signIn(email,true,"another-client"),"Wrong Google audience rejected");
 process.env.CMS_ALLOWED_EMAILS="another-invited@studio-test.local";
 await rejected(()=>signIn(email),"Email policy applies to an already-linked Google account");
 await rejected(()=>auth.api.signInEmail({body:{email,password:"Local-fixture-password-462093!"}}),"Email policy also applies to password login");
 delete process.env.CMS_ALLOWED_EMAILS;
 await pool.query('UPDATE "user" SET disabled=true WHERE id=$1',[created.user.id]);await rejected(()=>signIn(email),"Disabled Google account rejected");
 const callback=await auth.handler(new Request(config.baseURL+"/api/auth/callback/google?code=untrusted"));check(callback.status===302&&Boolean(callback.headers.get("location")?.includes("error=")),"OAuth callback without state rejected");
 const external=await auth.handler(new Request(config.baseURL+"/api/auth/sign-in/social",{method:"POST",headers:{origin:config.baseURL,"content-type":"application/json"},body:JSON.stringify({provider:"google",callbackURL:"https://attacker.invalid/steal"})}));check(external.status===403,"External callback redirect rejected over HTTP");
 const {rows:[count]}=await pool.query('SELECT count(*) FROM "user" WHERE email=$1',["not-invited@studio-test.local"]);check(count.count==="0","Google cannot create uninvited users");
 await fs.writeFile(".local/google-policy-verification.json",JSON.stringify({passed:true,checks,at:new Date().toISOString(),scope:"Local signed-token fixtures; real Google OAuth requires credentials."},null,2),{mode:0o600});console.log(`Google access policy verification passed: ${checks} checks (local signing key; no Google requests).`);
}finally{await pool.end();}
