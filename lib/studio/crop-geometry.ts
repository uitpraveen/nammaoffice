export type CropRect={x:number;y:number;width:number;height:number};
export type CropCorner="nw"|"ne"|"sw"|"se";
const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));
export function moveCrop(crop:CropRect,dx:number,dy:number):CropRect {
  return {...crop,x:clamp(crop.x+dx,0,1-crop.width),y:clamp(crop.y+dy,0,1-crop.height)};
}
export function resizeCrop(crop:CropRect,corner:CropCorner,x:number,y:number,ratio?:number):CropRect {
  const west=corner.includes("w"),north=corner.includes("n");
  const anchorX=west?crop.x+crop.width:crop.x,anchorY=north?crop.y+crop.height:crop.y;
  const availableW=west?anchorX:1-anchorX,availableH=north?anchorY:1-anchorY;
  let width=clamp(west?anchorX-x:x-anchorX,.005,availableW);
  let height=clamp(north?anchorY-y:y-anchorY,.005,availableH);
  if(ratio&&Number.isFinite(ratio)&&ratio>0){
    // Follow the axis that moved furthest. Taking the larger dimension makes
    // inward movement on just one axis impossible (including arrow keys).
    if(Math.abs(width-crop.width)>=Math.abs(height-crop.height)*ratio)height=width/ratio;
    else width=height*ratio;
    const scale=Math.min(1,availableW/width,availableH/height);width*=scale;height*=scale;
  }
  return {x:west?anchorX-width:anchorX,y:north?anchorY-height:anchorY,width,height};
}
export function centeredCrop(imageAspect:number,targetAspect?:number):CropRect {
  if(!targetAspect)return{x:0,y:0,width:1,height:1};
  const ratio=targetAspect/imageAspect;const width=Math.min(1,ratio),height=Math.min(1,1/ratio);
  return{x:(1-width)/2,y:(1-height)/2,width,height};
}
