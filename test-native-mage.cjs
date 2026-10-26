const assert=require('node:assert/strict');
const Mage=require('./native-mage.js');
function run(state,difficulty=64,ticks=125,hp=100){const events=[],e={x:320,y:144,hp,maxHp:100};Mage.create(e);Mage.forceState(e,state,{cooldown:10000,repeat:1});const w={difficulty,random:()=>.5,player:{x:200,y:400,nativeX:176,nativeY:336},emit:(_,v)=>events.push({...v,tick:i})};let i=0;for(;i<ticks;i++)Mage.step(e,w,1/60);return {e,events};}
for(const [d,n,speed] of [[64,3,5],[128,5,6],[192,7,8]]){const a=run(1,d,85);assert.equal(a.events.length,n);assert.ok(a.events.every(v=>v.kind==='aimedBurst'&&v.speed===speed));}
assert.deepEqual(run(2,64,121).events.map(v=>v.tick),[59,89,119]);
assert.equal(run(2,128,121).events.length,4);assert.equal(run(2,192,121).events.length,5);
assert.equal(run(3,64,89).events.filter(v=>v.kind==='homingBolt').length,5);
assert.equal(run(8,64,121).events.length,9);assert.equal(run(8,128,121).events.length,11);assert.equal(run(8,192,121).events.length,14);
for(const v of run(12,64,121).events){assert.equal(v.kind,'acceleratingBolt');assert.equal(v.homing,false);assert.equal(v.acceleration,.2);}
assert.equal(run(10,64,81).events.filter(v=>v.kind==='special4252c6').length,1);
const clone=run(5,64,400);assert.equal(clone.events.filter(v=>v.kind==='homingBolt').length,5);
const tele=run(13,64,114);assert.equal(tele.e.nativeMage.state,8);assert.ok(tele.e.x>=200&&tele.e.x<=210);
const chain=run(6,64,20);assert.equal(chain.e.orbits.length,3);assert.equal(chain.e.orbitLinks.length,24);assert.ok(chain.e.orbitLinks.every(v=>v.nativeFrame>=6&&v.nativeFrame<=9&&v.attack));assert.ok(chain.e.orbits.every(v=>!v.attack&&v.nativeFrame<=5));
const e1={x:320,y:144,hp:100,maxHp:100},e2={...e1};Mage.create(e1);Mage.create(e2);const w={difficulty:64,player:{x:200,y:400},random:()=>.5,emit:()=>{}};for(let i=0;i<30;i++)Mage.step(e1,w,1/30);for(let i=0;i<60;i++)Mage.step(e2,w,1/60);assert.deepEqual(e1.nativeMage,e2.nativeMage);
console.log('Native mage: shot counts, timing, clone volley, teleport, beam and fixed-tick determinism passed.');

