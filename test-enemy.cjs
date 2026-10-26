const assert=require('node:assert/strict');
const AI=require('./enemy-ai.js');
const player={x:200,y:400,w:23,h:48,hp:8};
function enemy(type='goblin',x=245){return AI.create(type,x,400,0);}
function world(){return {player,damage:0,shots:[],hurt(n){this.damage+=n;},shoot(e,pattern){this.shots.push(pattern);}};}
let e=enemy(),w=world();for(let i=0;i<240;i++){AI.step(e,w,1/120);e.x+=e.vx/120;AI.resolve(e,w);}assert(w.damage>0,'enemy must strike from 45px; no stopping dead zone');
e=enemy();w=world();AI.step(e,w,.01);assert.equal(e.state,'windup');AI.resolve(e,w);assert.equal(w.damage,0,'windup cannot hurt');
for(let i=0;i<70;i++){AI.step(e,w,1/120);AI.resolve(e,w);}assert.equal(w.damage,1,'one hit per strike');
e=enemy();w=world();AI.step(e,w,.01);player.x=80;for(let i=0;i<70;i++){AI.step(e,w,1/120);AI.resolve(e,w);}assert.equal(w.damage,0,'moving out of range evades attack');player.x=200;
e=enemy();w=world();e.hit=.5;for(let i=0;i<30;i++){AI.step(e,w,1/120);AI.resolve(e,w);}assert.equal(w.damage,0,'stunned enemies cannot attack');
e=enemy('mage',450);w=world();for(let i=0;i<140;i++)AI.step(e,w,1/120);assert(w.shots.length>0,'mage launches projectiles');
for(let stage=0;stage<3;stage++){e=AI.create('golem',250,400,stage,true,stage+1);w=world();for(let i=0;i<800;i++)AI.step(e,w,1/120);assert(e.boss);assert.equal(e.variant,stage+1);if(stage>0)assert(w.shots.some(p=>p==='orb'||p==='fan'),'later bosses use ranged patterns');}
e=enemy();e.dead=true;w=world();for(let i=0;i<180;i++){AI.step(e,w,1/120);AI.resolve(e,w);}assert.equal(w.damage,0);assert.equal(w.shots.length,0);
console.log('enemy AI: approach/strike, windup safety, single-hit, evasion, stun/death, mage projectiles and distinct bosses passed');


e=enemy();w=world();e.state='strike';e.timer=.2;e.face=1;AI.resolve(e,w);assert.equal(w.damage,0,'melee cannot hit behind');e.face=-1;player.y=250;AI.resolve(e,w);assert.equal(w.damage,0,'melee cannot hit another elevation');player.y=400;
console.log('enemy hitbox direction and elevation safety passed');
e=AI.create('werewolf',245,400,5,true);w=world();AI.step(e,w,.01);assert.equal(e.state,'windup');e.hit=.2;AI.step(e,w,.05);assert.equal(e.state,'windup','boss hit flash must not cancel every windup');
console.log('boss attacks resist permanent stagger from repeated light hits');
