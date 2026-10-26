const assert=require('node:assert/strict');
const Mobile=require('./mobile.js');
for(const [w,h,coarse] of [[393,740,true],[844,390,true],[667,320,true],[390,520,false]]){
 const l=Mobile.layout(w,h,coarse);
 assert(l.mobile);assert(l.width>=l.height);assert.equal(l.rotated,w<h);
 assert(l.canvasWidth+2*l.rail<=l.width+.01);assert(l.canvasHeight<=l.height+.01);
 assert(Math.abs(l.canvasWidth/l.canvasHeight-4/3)<1e-9);
}
assert.equal(Mobile.layout(1440,900,false).mobile,false);
assert.equal(Mobile.layout(900,600,false).mobile,false);
// All display layers must have definite sizes; do not rely on nested abspos stretching.
const safe=Mobile.layout(393,740,true,{left:47,right:34,top:0,bottom:0});
assert(safe.canvasLeft>=47+safe.rail);assert(safe.canvasTop>=0);
assert(safe.canvasLeft+safe.canvasWidth<=safe.width-34-safe.rail+.01);
assert(safe.canvasTop+safe.canvasHeight<=safe.height+.01);
assert(Number.isFinite(safe.canvasLeft)&&Number.isFinite(safe.canvasTop));
const mobileCSS=require('node:fs').readFileSync(__dirname+'/mobile.css','utf8');
assert.match(mobileCSS,/height:var\(--play-canvas-height/,'canvas container must have an explicit height');
// Fullscreen must target the root, never the rotated shell (UA resets its transform).
const listeners={},fakeNode=()=>({classList:{toggle(){},add(){},remove(){}},style:{setProperty(){}},addEventListener(k,fn){listeners[this.id+':'+k]=fn;}});
const root=fakeNode(),shell=fakeNode(),full=Object.assign(fakeNode(),{id:'full'}),start=Object.assign(fakeNode(),{id:'start'});
let rootRequests=0;root.requestFullscreen=async()=>{rootRequests++;};shell.requestFullscreen=()=>{throw Error('rotated shell must not enter fullscreen');};
Mobile.install({innerWidth:393,innerHeight:740,matchMedia:()=>({matches:true}),screen:{},addEventListener(){}},{documentElement:root,querySelector:s=>({'#play-shell':shell,'#fullscreen':full,'#start':start}[s]),addEventListener(){}});
listeners['start:click']();assert.equal(rootRequests,1);
(async()=>{
 let requested=0,locked=0;
 await Mobile.enter({requestFullscreen:async()=>{requested++;}},{orientation:{lock:async v=>{assert.equal(v,'landscape');locked++;}}});
 assert.equal(requested,1);assert.equal(locked,1);
 assert.equal(await Mobile.enter({requestFullscreen:async()=>{throw Error('not supported');}},{}),false,'CSS landscape remains usable without fullscreen');
 assert.equal(await Mobile.enter({requestFullscreen:async()=>{}},{orientation:{lock:async()=>{throw Error('denied');}}}),true,'orientation rejection must not undo fullscreen');
 console.log('mobile: portrait rotation, landscape sizing, 4:3 fit, desktop preservation and fullscreen fallbacks passed');
})().catch(e=>{console.error(e);process.exitCode=1;});
