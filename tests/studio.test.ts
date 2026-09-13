import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { entryDataSchema,validatePublication,validateRichText,mediaIds } from "../lib/studio/validation";
import { canEdit,editorOnly,type Actor } from "../lib/studio/access";
import { decodedImage,uploadOptions } from "../lib/studio/media";
const actor=(role:Actor["role"],id="staff-a"):Actor=>({id,name:"Staff",email:"staff@example.test",role});
const complete=()=>entryDataSchema.parse({title:"A real article",slug:"real-article",excerpt:"Summary",body:{type:"doc",content:[{type:"paragraph",content:[{type:"text",text:"Article text"}]}]},date:"2026-09-12"});
test("authors can edit only their own editorial content",()=>{assert(canEdit(actor("author"),{kind:"blog",owner_id:"staff-a"}));assert(!canEdit(actor("author"),{kind:"blog",owner_id:"staff-b"}));assert(!canEdit(actor("author"),{kind:"logo",owner_id:"staff-a"}));assert(canEdit(actor("editor"),{kind:"logo",owner_id:null}));assert.throws(()=>editorOnly(actor("author")));});
test("rich text rejects executable nodes, unsafe links and excessive nesting",()=>{assert.throws(()=>validateRichText({type:"doc",content:[{type:"iframe"}]}));assert.throws(()=>validateRichText({type:"doc",content:[{type:"text",text:"click",marks:[{type:"link",attrs:{href:"javascript:alert(1)"}}]}]}));let value:unknown={type:"paragraph"};for(let i=0;i<20;i++)value={type:"doc",content:[value]};assert.throws(()=>validateRichText(value));});
test("rich text retains supported formatting and removes unapproved attributes",()=>{const safe=validateRichText({type:"doc",content:[{type:"heading",attrs:{level:2,onclick:"alert(1)"},content:[{type:"text",text:"Hello",marks:[{type:"bold"}]}]}]});assert.deepEqual(safe.content?.[0].attrs,{level:2});assert.equal(safe.content?.[0].content?.[0].marks?.[0].type,"bold");});
test("entry schema rejects privilege fields and malformed slugs",()=>{assert.throws(()=>entryDataSchema.parse({owner_id:"admin"}));assert.throws(()=>entryDataSchema.parse({slug:"../admin"}));assert.throws(()=>entryDataSchema.parse({website:"javascript:alert(1)"}));assert.throws(()=>entryDataSchema.parse({order:-1}));});
test("publication validates calendar dates, embeds and accessibility",()=>{validatePublication("blog",complete());assert.throws(()=>validatePublication("blog",{...complete(),date:"2026-02-31"}));assert.throws(()=>validatePublication("blog",{...complete(),videoUrl:"https://example.test/video"}));assert.throws(()=>validatePublication("blog",{...complete(),coverMediaId:"80b3993a-3a4f-49b2-9aa1-3a8e6fe94db3",coverAlt:""}));});
test("each content type has publication requirements",()=>{assert.throws(()=>validatePublication("logo",entryDataSchema.parse({name:"Client"})));assert.throws(()=>validatePublication("testimonial",entryDataSchema.parse({name:"Person"})));assert.throws(()=>validatePublication("case-study",complete()));validatePublication("testimonial",entryDataSchema.parse({name:"Person",quote:"Real quote"}));});
test("media references are unique across covers, logos and galleries",()=>{const id="80b3993a-3a4f-49b2-9aa1-3a8e6fe94db3";assert.deepEqual(mediaIds(entryDataSchema.parse({mediaId:id,coverMediaId:id,gallery:[id]})),[id]);});
test("crop coordinates cannot extend outside the artwork",()=>{assert.throws(()=>uploadOptions.parse({crop:{x:.9,y:0,width:.4,height:1}}));assert.throws(()=>uploadOptions.parse({crop:{x:0,y:0,width:0,height:1}}));assert.equal(uploadOptions.parse({}).trim,false);});
test("image validation identifies actual bytes rather than trusting the filename",async()=>{const png=await sharp({create:{width:30,height:20,channels:4,background:"transparent"}}).png().toBuffer();assert.equal((await decodedImage(png)).mime,"image/png");await assert.rejects(decodedImage(Buffer.from("<html>not artwork</html>")));});
test("SVG processing rejects scripts, external resources and entities",async()=>{for(const inner of ['<script>alert(1)</script>','<image href="https://example.test/private"/>','<use href="file:///etc/passwd"/>','<rect width="40" height="20" fill="url(https://example.test/image)"/>'])await assert.rejects(decodedImage(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20">${inner}</svg>`)));await assert.rejects(decodedImage(Buffer.from('<!DOCTYPE svg [<!ENTITY x SYSTEM "file:///etc/passwd">]><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><text>&x;</text></svg>')));});

test("hero promotions require poster, expiry and complete optional CTA",()=>{
 const promotion=entryDataSchema.parse({title:"Workshop",coverMediaId:"80b3993a-3a4f-49b2-9aa1-3a8e6fe94db3",coverAlt:"Workshop poster",startsAt:"2026-10-01T09:00:00Z",endsAt:"2026-10-02T09:00:00Z"});
 validatePublication("promotion",promotion);
 assert.throws(()=>validatePublication("promotion",{...promotion,endsAt:""}));
 assert.throws(()=>validatePublication("promotion",{...promotion,startsAt:promotion.endsAt}));
 assert.throws(()=>validatePublication("promotion",{...promotion,ctaLabel:"Register"}));
 assert.throws(()=>validatePublication("promotion",{...promotion,coverMediaId:""}));
 assert(!canEdit(actor("author"),{kind:"promotion",owner_id:"staff-a"}));
});
