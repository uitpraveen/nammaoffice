"use client";
import {useState} from "react";
import type { EntryData } from "@/lib/studio/validation";
import { AdjustArtwork } from "./MediaLibrary";
import { PosterLayoutControls } from "./PosterLayoutControls";
import { PromotionPlacementPreview } from "./PromotionPlacementPreview";
import { HeroPoster } from "@/components/sections/HeroPoster";
function localDate(iso:string){if(!iso)return"";const date=new Date(iso);if(!Number.isFinite(date.getTime()))return"";return new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16);}
export function PromotionFields({data,onChange,onChoose}:{data:EntryData;onChange:<K extends keyof EntryData>(key:K,value:EntryData[K])=>void;onChoose:(slot:"cover"|"mobile")=>void}){
  const [mobilePreview,setMobilePreview]=useState(false);
  const [adjusting,setAdjusting]=useState<"coverMediaId"|"mobileMediaId"|null>(null);
  const [placement,setPlacement]=useState(false);
  const previewData={...data,coverMediaId:mobilePreview?(data.mobileMediaId||data.coverMediaId):data.coverMediaId,mobileMediaId:""};
  const dateChange=(key:"startsAt"|"endsAt",value:string)=>{if(!value){onChange(key,"");return;}const date=new Date(value);if(Number.isFinite(date.getTime()))onChange(key,date.toISOString());};
  return <>
    <p className="studio-note" style={{marginBottom:22}}>A published poster appears beside the homepage headline during its display dates. Auto fit preserves its full artwork. Higher priority wins when dates overlap; equal priorities use the most recently published poster.</p>
    <label className="studio-field">Event title<input value={data.title} maxLength={180} onChange={e=>onChange("title",e.target.value)}/></label>
    <label className="studio-row" style={{marginBottom:20}}><input type="checkbox" checked={Boolean(data.imageOnly)} onChange={e=>onChange("imageOnly",e.target.checked)}/>Image only — show the artwork without a text panel</label>
    <label className="studio-field">Short event description<textarea value={data.excerpt} maxLength={500} onChange={e=>onChange("excerpt",e.target.value)}/><small>Hidden in image-only mode. Use the poster description below to make image-only events accessible.</small></label>
    <div className="studio-row" style={{marginBottom:18}}><button className="studio-button" onClick={()=>onChoose("cover")}>{data.coverMediaId?"Replace poster":"Choose poster"}</button><button className="studio-button" onClick={()=>onChoose("mobile")}>{data.mobileMediaId?"Replace mobile poster":"Choose mobile poster"}</button>{data.mobileMediaId&&<button className="studio-button small" onClick={()=>onChange("mobileMediaId","")}>Remove mobile poster</button>}</div>
    <div className="studio-row" style={{marginBottom:18}}>{data.coverMediaId&&<button className="studio-button" onClick={()=>setAdjusting("coverMediaId")}>Edit poster image</button>}{data.mobileMediaId&&<button className="studio-button" onClick={()=>setAdjusting("mobileMediaId")}>Edit mobile image</button>}</div>
    <p className="studio-muted" style={{marginBottom:18}}>Use a clear, high-resolution poster. Portrait or landscape artwork is supported. A mobile version is optional; otherwise the same poster is used on every screen.</p>
    <PosterLayoutControls data={data} onChange={onChange}/>
    <label className="studio-field">Poster description<input value={data.coverAlt} maxLength={250} onChange={e=>onChange("coverAlt",e.target.value)}/><small>Required: describe the poster for screen-reader users. The mobile artwork should communicate the same event.</small></label>
    <div className="studio-two"><label className="studio-field">Display from<input type="datetime-local" value={localDate(data.startsAt)} onChange={e=>dateChange("startsAt",e.target.value)}/><small>Optional; blank means immediately after publishing.</small></label><label className="studio-field">Display until<input type="datetime-local" required value={localDate(data.endsAt)} onChange={e=>dateChange("endsAt",e.target.value)}/><small>Required. The poster disappears automatically at this time.</small></label></div>
    <p className="studio-muted" style={{marginBottom:18}}>Dates use your device’s timezone. Publishing approves the poster; these dates control when it is visible.</p>
    <div className="studio-two"><label className="studio-field">{data.imageOnly?"Link description (optional)":"Button label"}<input value={data.ctaLabel} maxLength={60} onChange={e=>onChange("ctaLabel",e.target.value)}/></label><label className="studio-field">{data.imageOnly?"Poster link (optional)":"Button URL"}<input type="url" value={data.ctaUrl} placeholder="https://…" onChange={e=>onChange("ctaUrl",e.target.value)}/><small>{data.imageOnly?"Make the artwork clickable, or leave blank for an image alone.":"Optional. Fill both button fields or leave both blank."}</small></label></div>
    <label className="studio-field">Priority<input type="number" min={0} max={1000} value={data.priority} onChange={e=>onChange("priority",Number(e.target.value))}/><small>Higher numbers appear first when published promotions overlap.</small></label>
    <button className="studio-button" onClick={()=>setPlacement(true)}>Preview homepage placement</button>
    <div className="studio-row" style={{justifyContent:"center",marginTop:22}}><button className="studio-button small" aria-pressed={!mobilePreview} onClick={()=>setMobilePreview(false)}>Desktop preview</button><button className="studio-button small" aria-pressed={mobilePreview} onClick={()=>setMobilePreview(true)}>Mobile preview</button></div><div style={{maxWidth:mobilePreview?350:540,margin:"15px auto 0"}}><HeroPoster data={previewData} preview/></div>
    {adjusting&&<AdjustArtwork id={data[adjusting]} onClose={()=>setAdjusting(null)} onReady={media=>{onChange(adjusting,media.id);setAdjusting(null);}}/>}
    {placement&&<PromotionPlacementPreview data={data} onClose={()=>setPlacement(false)}/>}
  </>;
}
