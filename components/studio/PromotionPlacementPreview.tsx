"use client";
import {useState} from "react";
import type {EntryData} from "@/lib/studio/validation";
import {HeroPoster} from "@/components/sections/HeroPoster";
import {Modal} from "./MediaLibrary";

export function PromotionPlacementPreview({data,onClose}:{data:EntryData;onClose:()=>void}){
  const [mobile,setMobile]=useState(false);
  const previewData={...data,coverMediaId:mobile?(data.mobileMediaId||data.coverMediaId):data.coverMediaId,mobileMediaId:""};
  return <Modal title="Homepage placement preview" onClose={onClose}>
    <p className="studio-muted" style={{marginBottom:16}}>A scaled preview of the first banner slide and your draft poster. The public website keeps showing the published version until you publish changes.</p>
    <label className="studio-row" style={{marginBottom:18}}><input type="checkbox" checked={mobile} onChange={e=>setMobile(e.target.checked)}/>Preview phone layout</label>
    <div style={{maxWidth:mobile?350:undefined,margin:"auto",borderRadius:14,padding:mobile?18:24,background:"linear-gradient(#0d1627c9,#0d1627de), url('/images/elevate/hero-slide-1.jpg') center / cover",display:"grid",gridTemplateColumns:mobile?"minmax(0,1fr)":"minmax(0,3fr) minmax(0,2fr)",gap:24,alignItems:"center"}}>
      <div style={{color:"white",minWidth:0}}><p style={{fontSize:11,letterSpacing:1,marginBottom:14}}>COWORKING · SALEM</p><p style={{fontSize:mobile?30:"clamp(20px, 3vw, 40px)",fontWeight:650,lineHeight:1.15}}>Build Your Business From <span style={{color:"#e1b06c"}}>Your City</span></p><p style={{fontSize:12,lineHeight:1.7,marginTop:18}}>Premium workspaces for startups, freelancers, and growing teams in Tier-2 & Tier-3 cities.</p><div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:22,fontSize:11}}><span style={{padding:"9px 14px",background:"#a44832",borderRadius:24}}>Book Now ↗</span><span style={{padding:"9px 14px",border:"1px solid #ffffff60",borderRadius:24}}>Explore centres</span></div></div>
      <div style={{minWidth:0}}><HeroPoster data={previewData} preview/></div>
    </div>
  </Modal>;
}
