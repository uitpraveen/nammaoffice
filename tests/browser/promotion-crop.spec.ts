import {test,expect,type Page} from "@playwright/test";
import fs from "node:fs";
import {randomUUID} from "node:crypto";
import sharp from "sharp";
import {Pool} from "pg";
const config=JSON.parse(fs.readFileSync(".local/verification.json","utf8"));
test.beforeEach(async({page})=>{
 const url=new URL(config.databaseURL);if(url.hostname!=="127.0.0.1"||!url.pathname.startsWith("/nammaoffice_verify_"))throw new Error("Use an isolated local verification database.");
 const db=new Pool({connectionString:config.databaseURL});await db.query('DELETE FROM "rateLimit"');await db.end();
 await page.route(/googletagmanager|google-analytics|connect\.facebook/,route=>route.abort());
 const r=await page.request.post("/api/auth/sign-in/email",{headers:{origin:config.baseURL},data:config.users.editor});expect(r.status()).toBe(200);
});
async function publishedPromotion(page:Page,title:string,priority:number,endsAt:string){
 const media=await(await page.request.get("/api/studio/media")).json();const image=media.items.find((m:{status:string})=>m.status==="ready");expect(image).toBeTruthy();
 const r=await page.request.post("/api/studio/entries",{headers:{origin:config.baseURL},data:{id:randomUUID(),kind:"promotion",version:0,data:{title,coverMediaId:image.id,coverAlt:"Browser event poster",endsAt,priority}}});expect(r.status()).toBe(200);const entry=await r.json();const published=await page.request.patch(`/api/studio/entries/${entry.id}`,{headers:{origin:config.baseURL},data:{version:entry.version,action:"publish"}});expect(published.status()).toBe(200);return entry.id;
}
test("logo crop supports drag, keyboard and adjusting a preserved original",async({page})=>{
 await page.goto("/admin/logos?new=1");await page.getByLabel("Client name",{exact:true}).fill(`Crop demo ${Date.now()}`);await page.getByRole("button",{name:"Choose artwork"}).click();await page.getByRole("button",{name:"Upload image",exact:true}).click();
 const bytes=await sharp({create:{width:800,height:400,channels:3,background:"#6a8438"}}).png().toBuffer();await page.locator('input[type="file"]').setInputFiles({name:"drag-crop.png",mimeType:"image/png",buffer:bytes});await page.getByLabel("Crop the original").check();
 const selection=page.getByRole("group",{name:"Move crop selection"});const initial=(await selection.boundingBox())!;const handle=(await page.getByRole("button",{name:"Resize crop bottom right"}).boundingBox())!;
 await page.mouse.move(handle.x+handle.width/2,handle.y+handle.height/2);await page.mouse.down();await page.mouse.move(handle.x-65,handle.y-40,{steps:8});await page.mouse.up();expect((await selection.boundingBox())!.width).toBeLessThan(initial.width-30);
 const before=(await selection.boundingBox())!;await selection.focus();await page.keyboard.press("ArrowRight");expect((await selection.boundingBox())!.x).toBeGreaterThan(before.x);
 await page.getByRole("button",{name:"Prepare image",exact:true}).click();await expect(page.getByRole("img",{name:"Processed image preview"})).toBeVisible();await page.getByRole("button",{name:"Use this image"}).click();await page.getByRole("button",{name:"Publish now",exact:true}).click();await expect(page.getByRole("status")).toContainText("Published.");
 const id=new URL(page.url()).searchParams.get("edit");const old=(await(await page.request.get(`/api/studio/entries/${id}`)).json()).draft.mediaId;
 await page.getByRole("button",{name:"Adjust crop",exact:true}).click();await expect(page.getByRole("img",{name:"Original artwork",exact:true})).toBeVisible();await page.getByLabel("Crop shape").selectOption("1");await page.getByRole("button",{name:"Prepare image",exact:true}).click();await expect(page.getByRole("img",{name:"Processed image preview"})).toBeVisible();await page.getByRole("button",{name:"Use this image"}).click();await expect(page.getByRole("status")).toContainText("Draft saved automatically");
 const revised=(await(await page.request.get(`/api/studio/entries/${id}`)).json()).draft.mediaId;expect(revised).not.toBe(old);const publicHome=await(await page.request.get("/")).text();expect(publicHome).toContain(old);expect(publicHome).not.toContain(revised);
 await page.getByRole("button",{name:"Publish changes"}).click();await expect(page.getByRole("status")).toContainText("Published.");expect(await(await page.request.get("/")).text()).toContain(revised);
});
test("editor publishes a hero poster with an optional mobile version",async({page})=>{
 await page.goto("/admin/promotions?new=1");const title=`Browser community event ${Date.now()}`;await page.getByLabel("Event title",{exact:true}).fill(title);await page.getByLabel("Short event description").fill("A fictional event to review the homepage poster.");
 await page.getByRole("button",{name:"Choose poster",exact:true}).click();await page.getByRole("button",{name:"Choose",exact:true}).first().click();await page.getByRole("button",{name:"Choose mobile poster",exact:true}).click();await page.getByRole("button",{name:"Choose",exact:true}).nth(1).click();
 await page.getByLabel(/^Poster description/).fill("Fictional local community event poster");const date=new Date(Date.now()+86400000);const local=new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16);await page.getByLabel("Display until",{exact:false}).fill(local);await page.getByLabel("Priority",{exact:false}).fill("300");await page.getByLabel("Button label",{exact:true}).fill("Read event details");await page.getByLabel("Button URL",{exact:false}).fill(config.baseURL+"/news");
 await page.getByRole("button",{name:"Publish now",exact:true}).click();await expect(page.getByRole("status")).toContainText("Published.");const id=new URL(page.url()).searchParams.get("edit");const data=(await(await page.request.get(`/api/studio/entries/${id}`)).json()).draft;
 await page.getByRole("button",{name:"Mobile preview",exact:true}).click();await expect(page.getByRole("complementary",{name:"Featured event"}).locator("img")).toHaveAttribute("src",`/media/${data.mobileMediaId}/display`);
 await page.goto("/");const card=page.getByRole("complementary",{name:"Featured event"});await expect(card.getByRole("heading",{name:title})).toBeVisible();await expect(card.getByRole("link",{name:"Read event details"})).toHaveAttribute("href",config.baseURL+"/news");
 await page.setViewportSize({width:1440,height:1000});expect((await card.boundingBox())!.width).toBeGreaterThan(450);await expect.poll(()=>card.locator("img").evaluate((image:HTMLImageElement)=>image.currentSrc)).toContain(data.coverMediaId);await page.screenshot({path:".local/hero-poster-desktop.png",fullPage:false});
 await page.setViewportSize({width:390,height:844});await expect.poll(()=>card.locator("img").evaluate((image:HTMLImageElement)=>image.currentSrc)).toContain(data.mobileMediaId);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();await card.scrollIntoViewIfNeeded();await page.screenshot({path:".local/hero-poster-mobile.png",fullPage:false});
});
test("an already-open homepage removes an expired poster without reload",async({page})=>{
 const title=`Expiring event ${Date.now()}`;await publishedPromotion(page,title,1000,new Date(Date.now()+7000).toISOString());await page.goto("/");await expect(page.getByRole("heading",{name:title,exact:true})).toBeVisible();await expect(page.getByRole("heading",{name:title,exact:true})).toHaveCount(0,{timeout:12000});await expect(page.getByRole("heading",{level:1})).toBeVisible();
});

test("image-only artwork fills the right column beside the original hero and can be removed from the homepage",async({page})=>{
 const title=`Image-only event ${Date.now()}`;const id=await publishedPromotion(page,title,999,new Date(Date.now()+86400000).toISOString());
 await page.goto(`/admin/promotions?edit=${id}`);await page.getByLabel("Image only — show the artwork without a text panel").check();
 await page.getByLabel("Poster link (optional)",{exact:false}).fill(config.baseURL+"/news");await page.getByRole("button",{name:"Publish changes",exact:true}).click();await expect(page.getByRole("status")).toContainText("Published.");
 await page.goto("/");const card=page.getByRole("complementary",{name:"Featured event"});await expect(card.locator("img")).toBeVisible();await expect(page.locator("#hero h1")).toBeVisible();await expect(page.locator("#hero").getByRole("link",{name:"Book Now"})).toBeVisible();await expect(card.getByText("What’s happening",{exact:true})).toHaveCount(0);await expect(card.getByRole("link",{name:title})).toHaveAttribute("href",config.baseURL+"/news");await expect(card.getByRole("heading")).toHaveClass("sr-only");
 await page.setViewportSize({width:1440,height:1000});expect((await card.boundingBox())!.width).toBeGreaterThan(450);
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
 await page.goto(`/admin/promotions?edit=${id}`);await page.getByLabel("Poster link (optional)",{exact:false}).fill("");await page.getByRole("button",{name:"Publish changes",exact:true}).click();await expect(page.getByRole("status")).toContainText("Published.");await page.goto("/");await expect(card.getByRole("link")).toHaveCount(0);await expect(card.locator("img")).toBeVisible();
 await page.goto(`/admin/promotions?edit=${id}`);page.once("dialog",dialog=>dialog.accept());await page.getByRole("button",{name:"Remove from homepage",exact:true}).click();await expect(page.getByRole("status")).toContainText("Content updated.");await page.goto("/");await expect(page.getByRole("heading",{name:title,exact:true})).toHaveCount(0);
});

test("poster editing preserves the original and publishes alignment only when approved",async({page})=>{
 const title=`Editable poster ${Date.now()}`;const id=await publishedPromotion(page,title,998,new Date(Date.now()+86400000).toISOString());
 const read=async()=>await(await page.request.get(`/api/studio/entries/${id}`)).json();const original=(await read()).draft.coverMediaId;
 await page.goto(`/admin/promotions?edit=${id}`);await page.getByLabel("Poster frame",{exact:false}).selectOption("portrait");await page.getByLabel("Image fit",{exact:false}).selectOption("cover");
 await page.getByRole("slider",{name:"Horizontal poster alignment"}).fill("20");await page.getByRole("slider",{name:"Vertical poster alignment"}).fill("80");
 const preview=page.getByRole("complementary",{name:"Featured event"}).locator("img");await expect(preview).toHaveCSS("object-fit","cover");await expect(preview).toHaveCSS("object-position","20% 80%");await expect(page.getByRole("status")).toContainText("Draft saved automatically");
 expect((await read()).draft).toMatchObject({posterFrame:"portrait",posterFit:"cover",posterPositionX:20,posterPositionY:80});
 await page.goto("/");const poster=page.getByRole("complementary",{name:"Featured event"});await expect(poster.getByRole("heading",{name:title})).toBeVisible();await expect(poster.locator("img")).toHaveCSS("object-fit","contain");
 await page.goto(`/admin/promotions?edit=${id}`);await page.getByRole("button",{name:"Edit poster image",exact:true}).click();await expect(page.getByRole("img",{name:"Original artwork",exact:true})).toBeVisible();await page.getByLabel("Crop the original").check();await page.getByLabel("Crop shape").selectOption("1");await page.getByRole("button",{name:"Resize crop bottom right"}).focus();await page.keyboard.press("Shift+ArrowLeft");await page.getByRole("button",{name:"Prepare image",exact:true}).click();await expect(page.getByRole("img",{name:"Processed image preview"})).toBeVisible();await page.getByRole("button",{name:"Use this image"}).click();await expect(page.getByRole("status")).toContainText("Draft saved automatically");
 const cropped=(await read()).draft.coverMediaId;expect(cropped).not.toBe(original);expect((await page.request.get(`/media/${original}/original`)).status()).toBe(200);
 await page.getByRole("button",{name:"Preview homepage placement",exact:true}).click();const dialog=page.getByRole("dialog",{name:"Homepage placement preview"});await expect(dialog.getByText("Build Your Business From",{exact:false})).toBeVisible();await expect(dialog.locator("img")).toHaveCSS("object-position","20% 80%");await dialog.getByLabel("Preview phone layout").check();await expect(dialog.locator("img")).toBeVisible();await dialog.getByRole("button",{name:"Close dialog"}).click();
 await page.goto("/");await expect(poster.locator("img")).toHaveAttribute("src",`/media/${original}/display`);
 await page.goto(`/admin/promotions?edit=${id}`);await page.getByRole("button",{name:"Publish changes",exact:true}).click();await expect(page.getByRole("status")).toContainText("Published.");await page.goto("/");await expect(poster.locator("img")).toHaveAttribute("src",`/media/${cropped}/display`);await expect(poster.locator("img")).toHaveCSS("object-fit","cover");await expect(poster.locator("img")).toHaveCSS("object-position","20% 80%");
 const box=(await poster.locator("img").boundingBox())!;expect(box.width/box.height).toBeCloseTo(.75,1);
 await page.goto(`/admin/promotions?edit=${id}`);await page.getByRole("button",{name:"Auto fit & centre",exact:true}).click();await page.getByRole("button",{name:"Publish changes",exact:true}).click();await expect(page.getByRole("status")).toContainText("Published.");expect((await read()).draft).toMatchObject({coverMediaId:cropped,posterFrame:"auto",posterFit:"contain",posterPositionX:50,posterPositionY:50});
 await page.goto("/");await expect(poster.locator("img")).toHaveCSS("object-fit","contain");await expect(poster.locator("img")).toHaveCSS("object-position","50% 50%");
});
