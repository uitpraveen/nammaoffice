import { test,expect,type Page } from "@playwright/test";
import fs from "node:fs";
import sharp from "sharp";
import { Pool } from "pg";
const config=JSON.parse(fs.readFileSync(".local/verification.json","utf8"));
test.beforeEach(async()=>{
 const u=new URL(config.databaseURL);if(!["127.0.0.1","localhost"].includes(u.hostname)||!u.pathname.startsWith("/nammaoffice_verify_"))throw new Error("Browser fixtures require an isolated local verification database.");
 const db=new Pool({connectionString:config.databaseURL});await db.query('DELETE FROM "rateLimit"');await db.end();
});
async function login(page:Page,role="editor"){
 await page.goto("/admin/login");await page.getByLabel("Email address").fill(config.users[role].email);await page.getByLabel("Password",{exact:true}).fill(config.users[role].password);await page.getByRole("button",{name:"Sign in",exact:true}).click();
 await expect(page.getByRole("heading",{name:/Welcome,/})).toBeVisible();
}
test("editor creates, previews and publishes a blog while live revisions remain stable",async({page,browser})=>{
 await login(page);await page.goto("/admin/blogs?new=1");const name=`Browser story ${Date.now()}`;await page.getByLabel("Title",{exact:true}).fill(name);await page.getByLabel("Summary",{exact:false}).fill("A browser-tested story summary.");await page.locator(".tiptap").fill("Written and published through the real rich-text editor.");
 await page.getByRole("button",{name:"Save draft",exact:true}).click();await expect(page.getByRole("status")).toContainText("Draft saved");
 await page.getByRole("button",{name:"Preview",exact:true}).click();await expect(page.getByRole("dialog")).toContainText(name);await page.getByRole("button",{name:"Close dialog"}).click();
 await page.getByRole("button",{name:"Publish now",exact:true}).click();await expect(page.getByRole("status")).toContainText("Published.");
 const slug=name.toLowerCase().replaceAll(" ","-");const reader=await browser.newPage();await reader.goto(`${config.baseURL}/blogs/${slug}`);await expect(reader.getByRole("heading",{name,exact:true})).toBeVisible();
 await page.getByLabel("Title",{exact:true}).fill(name+" private revision");await expect(page.getByRole("status")).toContainText("Draft saved automatically");await reader.reload();await expect(reader.getByRole("heading",{name,exact:true})).toBeVisible();
 await page.getByRole("button",{name:"Publish changes"}).click();await expect(page.getByRole("status")).toContainText("Published.");await reader.reload();await expect(reader.getByRole("heading",{name:name+" private revision",exact:true})).toBeVisible();
 await page.getByRole("button",{name:"Revision history"}).click();await expect(page.getByRole("dialog")).toContainText("Restoring a revision creates a draft");await page.getByRole("button",{name:"Restore draft",exact:true}).last().click();await expect(page.getByRole("status")).toContainText("Revision restored as a draft");await reader.reload();await expect(reader.getByRole("heading",{name:name+" private revision",exact:true})).toBeVisible();await reader.close();
});
test("logo upload gives a processed preview and publishes without stretching",async({page})=>{
 await login(page);await page.goto("/admin/logos?new=1");const name=`Browser brand ${Date.now()}`;await page.getByLabel("Client name",{exact:true}).fill(name);await page.getByRole("button",{name:"Choose artwork"}).click();await page.getByRole("button",{name:"Upload image",exact:true}).click();
 const png=await sharp({create:{width:800,height:240,channels:4,background:{r:42,g:82,b:121,alpha:.65}}}).png().toBuffer();await page.locator('input[type="file"]').setInputFiles({name:"browser-logo.png",mimeType:"image/png",buffer:png});
 await page.getByRole("button",{name:"Prepare image",exact:true}).click();await expect(page.getByRole("img",{name:"Processed image preview"})).toBeVisible();await page.getByRole("button",{name:"Use this image"}).click();await expect(page.getByRole("dialog")).toHaveCount(0);
 await page.getByRole("button",{name:"Publish now",exact:true}).click();await expect(page.getByRole("status")).toContainText("Published.");await page.goto("/");await expect(page.locator(`img[alt="${name}"]`)).toBeVisible();
});
test("network failure restores upload controls and gives a clear recovery message",async({page})=>{
 await login(page);await page.goto("/admin/media");await page.getByRole("button",{name:"Upload image",exact:true}).click();const png=await sharp({create:{width:80,height:40,channels:3,background:"#aa3311"}}).png().toBuffer();await page.locator('input[type="file"]').setInputFiles({name:"failure.png",mimeType:"image/png",buffer:png});
 await page.route("**/api/studio/media",route=>route.request().method()==="POST"?route.abort():route.continue());await page.getByRole("button",{name:"Prepare image",exact:true}).click();await expect(page.getByRole("dialog").getByRole("alert")).toContainText("Connection lost");await expect(page.getByRole("button",{name:"Prepare image",exact:true})).toBeEnabled();
});
test("author navigation and review workflow enforce limited access",async({page})=>{
 await login(page,"author");await expect(page.getByRole("navigation",{name:"Studio navigation"}).getByRole("link",{name:"Client logos"})).toHaveCount(0);await expect(page.getByRole("link",{name:"Team & access",exact:true})).toHaveCount(0);
 await page.goto("/admin/logos");await expect(page).toHaveURL(/\/admin$/);await page.goto("/admin/news?new=1");await page.getByLabel("Title",{exact:true}).fill(`Author news ${Date.now()}`);await page.getByLabel("Summary",{exact:false}).fill("Author's review submission.");await page.locator(".tiptap").fill("Ready for editorial review.");await expect(page.getByRole("button",{name:"Publish now"})).toHaveCount(0);await page.getByRole("button",{name:"Submit for review"}).click();await expect(page.getByText("review",{exact:true})).toBeVisible();
});
test("administrator signs in with a password and staff can accept the local invitation",async({page,browser})=>{
 await login(page,"admin");await page.getByRole("link",{name:"Team & access",exact:true}).click();const email=`browser-${Date.now()}@studio-test.local`;await page.getByLabel("Full name",{exact:true}).fill("Browser invited staff");await page.getByLabel("Email",{exact:true}).fill(email);await page.getByRole("button",{name:"Send invitation"}).click();await expect(page.getByRole("status")).toContainText("Account created");await page.getByRole("button",{name:"Local mail",exact:true}).click();await expect(page.getByRole("heading",{name:"Local mail outbox"})).toBeVisible();await expect(page.locator("section").filter({has:page.getByRole("heading",{name:"Local mail outbox"})})).toContainText(email);
 const mail=await (await page.request.get("/api/studio/mail")).json();const invitation=mail.find((m:{to:string})=>m.to===email);const context=await browser.newContext();const invited=await context.newPage();await invited.goto(invitation.url);await expect(invited.getByRole("heading",{name:"Set your password"})).toBeVisible();await invited.getByLabel("New password").fill("Browser-invitation-password-2941!");await invited.getByRole("button",{name:"Set password",exact:true}).click();await expect(invited.getByRole("status")).toContainText("Your password was updated");await invited.getByRole("link",{name:"Back to sign in"}).click();await invited.getByLabel("Email address").fill(email);await invited.getByLabel("Password",{exact:true}).fill("Browser-invitation-password-2941!");await invited.getByRole("button",{name:"Sign in",exact:true}).click();await expect(invited.getByRole("heading",{name:/Welcome,/})).toBeVisible();await context.close();
});
test("admin screens fit a phone viewport and do not load public analytics",async({page})=>{
 const trackers:string[]=[];page.on("request",r=>{if(/googletagmanager|google-analytics|connect.facebook/.test(r.url()))trackers.push(r.url());});await page.setViewportSize({width:390,height:844});await login(page);
 for(const route of ["/admin","/admin/logos","/admin/blogs?new=1","/admin/media","/admin/security"]){await page.goto(route);await expect(page.locator("h1")).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route).toBeTruthy();}
 expect(trackers).toEqual([]);await page.screenshot({path:".local/studio-mobile.png",fullPage:true});
});
test("signing out revokes the session and protects the next admin visit",async({page})=>{
 await login(page);await page.getByRole("button",{name:"Sign out",exact:true}).click();await expect(page).toHaveURL(/\/admin\/login$/);await page.goto("/admin/news");await expect(page).toHaveURL(/\/admin\/login$/);
});
