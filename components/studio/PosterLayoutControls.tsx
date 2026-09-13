"use client";
import type {EntryData} from "@/lib/studio/validation";

export function PosterLayoutControls({data,onChange}:{data:EntryData;onChange:<K extends keyof EntryData>(key:K,value:EntryData[K])=>void}){
  const frame=data.posterFrame??"auto";
  function autoFit(){onChange("posterFrame","auto");onChange("posterFit","contain");onChange("posterPositionX",50);onChange("posterPositionY",50);}
  return <fieldset disabled={!data.coverMediaId} style={{border:"1px solid #dfe5dd",padding:18,borderRadius:10,marginBottom:22,minWidth:0}}>
    <legend style={{fontWeight:650,padding:"0 6px"}}>Poster fit & alignment</legend>
    <p className="studio-muted" style={{marginBottom:16}}>The normal banner uses 60% of the desktop layout; your poster fills the remaining 40%. On phones, the poster sits below the banner text.</p>
    <label className="studio-field">Poster frame<select value={frame} onChange={e=>onChange("posterFrame",e.target.value as EntryData["posterFrame"])}><option value="auto">Auto — original image proportions</option><option value="portrait">Portrait — 3:4</option><option value="square">Square — 1:1</option><option value="landscape">Landscape — 16:9</option></select><small>Auto fits and centres the original image without cutting off text or stretching it.</small></label>
    {frame!=="auto"&&<>
      <label className="studio-field">Image fit<select value={data.posterFit??"contain"} onChange={e=>onChange("posterFit",e.target.value as EntryData["posterFit"])}><option value="contain">Show the full image</option><option value="cover">Fill the frame — crop edges</option></select><small>{data.posterFit==="cover"?"Check the preview: filling the frame can hide text near the edges.":"Keeps all artwork visible. Space may remain around the image when its shape differs from the frame."}</small></label>
      <label className="studio-field">Horizontal alignment: {data.posterPositionX??50}%<input aria-label="Horizontal poster alignment" type="range" min={0} max={100} step={1} value={data.posterPositionX??50} onChange={e=>onChange("posterPositionX",Number(e.target.value))}/><small>Left → right</small></label>
      <label className="studio-field">Vertical alignment: {data.posterPositionY??50}%<input aria-label="Vertical poster alignment" type="range" min={0} max={100} step={1} value={data.posterPositionY??50} onChange={e=>onChange("posterPositionY",Number(e.target.value))}/><small>Top → bottom. Alignment has an effect where there is spare space or cropped artwork.</small></label>
    </>}
    <button type="button" className="studio-button small" onClick={autoFit}>Auto fit & centre</button>
    <p className="studio-muted" style={{fontSize:12,marginTop:12}}>Frame settings apply to desktop and mobile artwork. These adjustments do not replace or reprocess your original file. Publish changes when the preview looks right.</p>
  </fieldset>;
}
