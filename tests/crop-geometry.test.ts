import test from "node:test";
import assert from "node:assert/strict";
import {centeredCrop,moveCrop,resizeCrop} from "../lib/studio/crop-geometry";
test("moving a crop keeps it inside the original image",()=>{const crop={x:.2,y:.2,width:.4,height:.3};assert.deepEqual(moveCrop(crop,3,-2),{x:.6,y:0,width:.4,height:.3});});
test("square and landscape presets account for original image dimensions",()=>{const square=centeredCrop(2,1);assert.equal(square.width,.5);assert.equal(square.height,1);assert.equal(square.x,.25);const portrait=centeredCrop(2,4/5);assert.equal(portrait.width,.4);assert.equal(portrait.height,1);});
test("corner resize cannot flip, exceed image edges or break a locked aspect",()=>{const crop={x:.2,y:.2,width:.5,height:.5};for(const corner of ["nw","ne","sw","se"] as const){const result=resizeCrop(crop,corner,3,-2,1.5);assert(result.x>=0&&result.y>=0);assert(result.x+result.width<=1.000001&&result.y+result.height<=1.000001);assert(result.width>0&&result.height>0);assert(Math.abs(result.width/result.height-1.5)<.000001);}});

test("locked crop can shrink on either axis and keeps the opposite corner anchored",()=>{
 const crop={x:.25,y:0,width:.5,height:1};
 const horizontal=resizeCrop(crop,"se",.725,1,.5);
 assert(horizontal.width<crop.width);assert(horizontal.height<crop.height);
 assert.equal(horizontal.x,crop.x);assert.equal(horizontal.y,crop.y);
 assert(Math.abs(horizontal.width/horizontal.height-.5)<.000001);
 const vertical=resizeCrop(crop,"se",.75,.95,.5);
 assert(vertical.width<crop.width);assert(vertical.height<crop.height);
 assert.equal(vertical.x,crop.x);assert.equal(vertical.y,crop.y);
 const opposite=resizeCrop({x:.2,y:.2,width:.4,height:.4},"nw",.25,.2,1);
 assert(opposite.width<.4);assert(Math.abs(opposite.x+opposite.width-.6)<.000001);
 assert(Math.abs(opposite.y+opposite.height-.6)<.000001);
});
