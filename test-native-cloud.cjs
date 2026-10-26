'use strict';
const assert=require('node:assert/strict');
const Cloud=require('./native-cloud.js');
function fixture(profile=64) {
  const e={x:320,y:160,nativeProfile:profile};Cloud.create(e);
  const events=[];const w={player:{x:320,y:400,nativeX:296,nativeY:336},playerRect:{x:308,y:352,w:24,h:48},random:()=>.5,nativeHz:60,difficulty:64,emit:(_,event)=>events.push(event)};
  return {e,w,events};
}
function run(f,n){for(let i=0;i<n;i++)Cloud.step(f.e,f.w,1/60);}
// Recovered quadrant mapping is toward the target, not away from it.
assert.equal(Cloud.heading(65536,0),32768);assert.equal(Cloud.heading(-65536,0),0);
assert.equal(Cloud.heading(0,65536),49152);assert.equal(Cloud.heading(0,-65536),16384);
const f=fixture();Object.assign(f.e.nativeCloud,{state:1,timer:54});run(f,48);
assert.equal(f.events.length,1);assert.equal(f.events[0].kind,'lightning');
assert.equal(f.events[0].x,320);assert.deepEqual(f.events[0].attackRect,{x:-4,y:0,w:16,h:480});
assert.deepEqual(f.events[0].frames,[75,76,83,77]);assert.deepEqual(f.events[0].damageFrames,[1]);
const two=fixture(96);Object.assign(two.e.nativeCloud,{state:2,timer:54});run(two,48);
assert.deepEqual(two.events.map(e=>e.x),[332,308]);
const three=fixture(160);Object.assign(three.e.nativeCloud,{state:2,timer:54});run(three,48);
assert.deepEqual(three.events.map(e=>e.x),[308,332,320]);
const hit=fixture(160);assert.equal(Cloud.onHit(hit.e,{nativeAttackType:2}),true);
assert.equal(hit.e.nativeCloud.pressure,240);assert.equal(Cloud.onHit(hit.e,{nativeAttackType:3}),true);
assert.equal(hit.e.nativeCloud.pressure,420);assert.equal(Cloud.onHit(hit.e,{nativeAttackType:999}),false);
assert.equal(hit.e.nativeCloud.pressure,420);
Cloud.onHit(hit.e,{nativeAttackType:6});
for(let i=0;i<30&&hit.e.nativeCloud.state===0;i++) {
  hit.w.playerRect.x=hit.e.x-12;run(hit,1);
}
assert.equal(hit.e.nativeCloud.state,2);
const no=fixture();no.w.playerRect.x=0;run(no,10);assert.equal(no.e.nativeCloud.state,0);assert.equal(no.events.length,0);
// When aligned, the source decrements alignment twice per idle tick (including the common timer).
const aligned=fixture();aligned.e.nativeCloud.targetTicks=120;
aligned.e.nativeCloud.tx=320*65536;aligned.e.nativeCloud.ty=136*65536;
for(let i=0;i<30&&aligned.e.nativeCloud.state===0;i++) {
  aligned.w.playerRect.x=aligned.e.x-12;run(aligned,1);
}
assert.equal(aligned.e.nativeCloud.state,1);assert.equal(aligned.events.length,0);
const a=fixture(),b=fixture();run(a,60);for(let i=0;i<120;i++)Cloud.step(b.e,b.w,1/120);
assert.equal(a.e.x,b.e.x);assert.equal(a.e.y,b.e.y);assert.deepEqual(a.events,b.events);
const contact=fixture();contact.e.nativeCloud.state=1;contact.e.nativeCloud.timer=54;
let active=[];for(let i=0;i<54;i++){run(contact,1);if(contact.e.nativeContact)active.push(contact.e.nativeFrame);}
assert(active.length>0);assert(active.every(n=>[3,4,5].includes(n)));
console.log('Native cloud: flight quadrants, fixed ticks, alignment trigger, 1/2/3 lightning patterns, original frames/contact passed.');
