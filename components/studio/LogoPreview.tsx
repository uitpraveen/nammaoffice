/* eslint-disable @next/next/no-img-element -- Local crop previews use object URLs before upload. */
import type { CropRect } from "@/lib/studio/crop-geometry";
export function LogoPreview({src,crop={x:0,y:0,width:1,height:1},width=1,height=1,padding=0}:{src:string;crop?:CropRect;width?:number;height?:number;padding?:number}){
  const w=width*crop.width,h=height*crop.height,pad=w*padding/100;
  const scale=Math.min(200/(w+pad*2),72/(h+pad*2));
  return <div style={{marginTop:20}}><p className="studio-muted" style={{fontSize:12,marginBottom:10}}>Logo slot preview · light and dark backgrounds</p><div className="studio-row" style={{justifyContent:"center",gap:10}}>{["#ffffff","#23313b"].map(background=><div key={background} style={{width:220,maxWidth:"100%",height:96,background,border:"1px solid #dce0da",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{position:"relative",overflow:"hidden",width:w*scale,height:h*scale}}><img src={src} alt={background==="#ffffff"?"Logo preview on light background":"Logo preview on dark background"} style={{position:"absolute",maxWidth:"none",width:`${100/crop.width}%`,height:`${100/crop.height}%`,left:`${-crop.x/crop.width*100}%`,top:`${-crop.y/crop.height*100}%`}}/></div></div>)}</div></div>;
}
