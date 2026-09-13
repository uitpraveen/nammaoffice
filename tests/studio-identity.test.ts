import {test} from "node:test";
import assert from "node:assert/strict";
import {allowedStaffEmail} from "../lib/studio/identity";
import {entryDataSchema,validatePublication} from "../lib/studio/validation";
test("staff policy matches exact addresses or exact Workspace domain",()=>{
 const env={CMS_ALLOWED_EMAILS:"owner@gmail.com, colleague@gmail.com",CMS_GOOGLE_WORKSPACE_DOMAIN:"staff.example"};
 assert.equal(allowedStaffEmail("OWNER@gmail.com",env),true);
 assert.equal(allowedStaffEmail("person@staff.example",env),true);
 for(const email of ["other@gmail.com","owner+alias@gmail.com","person@staff.example.attacker.test","person@other.staff.example","nammaoffice-anyone@gmail.com"])assert.equal(allowedStaffEmail(email,env),false,email);
 assert.equal(allowedStaffEmail("invited@local.test",{}),true);
});
test("image-only publication allows no text panel and an optional image link",()=>{
 const data=entryDataSchema.parse({title:"Internal event title",imageOnly:true,coverMediaId:"00000000-0000-4000-8000-000000000001",coverAlt:"Event details",endsAt:new Date(Date.now()+86400000).toISOString()});
 assert.doesNotThrow(()=>validatePublication("promotion",data));
 assert.doesNotThrow(()=>validatePublication("promotion",{...data,ctaUrl:"https://example.test/event"}));
 assert.throws(()=>validatePublication("promotion",{...data,coverAlt:""}));
 assert.throws(()=>validatePublication("promotion",{...data,endsAt:""}));
 assert.throws(()=>entryDataSchema.parse({...data,ctaUrl:"javascript:alert(1)"}));
 assert.equal(entryDataSchema.parse({}).imageOnly,false);
});

test("poster layout accepts bounded placement and defaults old revisions to automatic fit",()=>{
 const old=entryDataSchema.parse({title:"Older poster"});
 assert.equal(old.posterFrame,"auto");assert.equal(old.posterFit,"contain");assert.equal(old.posterPositionX,50);assert.equal(old.posterPositionY,50);
 for(const data of [{posterFrame:"arbitrary"},{posterFit:"stretch"},{posterPositionX:-1},{posterPositionY:101},{posterPositionX:25.5}])assert.equal(entryDataSchema.safeParse(data).success,false);
 assert.equal(entryDataSchema.safeParse({posterFrame:"portrait",posterFit:"cover",posterPositionX:0,posterPositionY:100}).success,true);
});
