(function(root){
'use strict';
// Timings and hitboxes are reconstruction parameters, not recovered EXE constants.
const defs={
 goblin:{kind:0,w:26,h:44,hp:2,speed:50,reach:57,windup:.4,active:.17,recovery:.75},
 dog:{kind:1,w:32,h:32,hp:2,speed:92,reach:110,windup:.35,active:.32,recovery:.85},
 skeleton:{kind:2,w:28,h:54,hp:4,speed:42,reach:70,windup:.5,active:.2,recovery:.9},
 werewolf:{kind:3,w:42,h:68,hp:16,speed:95,reach:125,windup:.5,active:.32,recovery:.7},
 mage:{kind:4,w:35,h:74,hp:18,speed:40,reach:400,windup:.8,active:.18,recovery:1.15},
 cloud:{kind:5,w:30,h:30,hp:3,speed:54,reach:210,windup:.65,active:.2,recovery:1.1},
 golem:{kind:6,w:54,h:84,hp:12,speed:42,reach:115,windup:.7,active:.25,recovery:1.05}
};
function create(type,x,y,stage=0,boss=false,variant=1){const d={...defs[type]};
 if(type==='werewolf'&&variant===2){d.hp=24;d.speed=115;d.windup=.4;d.recovery=.55;}
 if(type==='golem'){d.hp=boss?16:6+variant*2;if(boss){d.speed=55;d.windup=.6;}}
 if(type==='goblin')d.hp=1+variant;
 if(type==='dog'&&variant===2){d.hp=3;d.speed=110;}
 if(type==='skeleton')d.hp=variant===1?4:variant===3?5:6;
 return {...d,type,x,y,vx:0,vy:0,ground:false,home:x,hoverY:y,face:-1,maxHp:d.hp,hp:d.hp,variant,boss,state:'patrol',timer:0,phase:0,cycle:0,hit:0,dead:false,didHit:false,attack:0};}
function begin(e,state,duration){e.state=state;e.timer=duration;e.phase=0;}
function step(e,w,dt){
 const p=w.player,d=e;e.vx=0;if(e.dead||e.type==='cloud'||e.type==='mage')return;e.hit=Math.max(0,e.hit-dt);e.phase+=dt;
 if(e.hit>0&&!e.boss){begin(e,'recovery',.35);return;}
 const dx=p.x-e.x,dy=Math.abs((p.y-p.h/2)-(e.y-e.h/2));e.rage=e.boss&&e.hp<=e.maxHp/2;const rate=e.rage?1.25:1;
 if(e.state==='windup'){
  e.timer-=dt*rate;
  if(e.timer<=0){begin(e,'strike',d.active);e.didHit=false;e.cycle++;

  }
 }else if(e.state==='strike'){
  if(e.type==='dog'||e.type==='werewolf')e.vx=e.face*(e.type==='dog'?280:340);
  e.timer-=dt;if(e.timer<=0)begin(e,'recovery',d.recovery);
 }else if(e.state==='recovery'){
  e.timer-=dt*rate;if(e.timer<=0)begin(e,'patrol',0);
 }else{
  const aware=Math.abs(dx)<(e.boss?600:420)&&dy<(e.type==='mage'||e.type==='cloud'?200:90);
  if(aware){e.face=dx>=0?1:-1;e.state='chase';
   if(Math.abs(dx)<=d.reach&&dy<(e.type==='mage'||e.type==='cloud'?180:65)){begin(e,'windup',d.windup);e.didHit=false;}
   else e.vx=e.face*d.speed;
  }else{e.state='patrol';if(Math.abs(e.x-e.home)>75)e.face=e.x>e.home?-1:1;e.vx=e.face*d.speed*.45;}
 }
 e.attack=e.state==='strike'?e.timer:0;
}
function resolve(e,w){
 if(e.dead||e.hit>0||e.state!=='strike'||e.didHit||e.type==='mage'||e.type==='cloud')return;
 const p=w.player,dx=(p.x-e.x)*e.face,dy=Math.abs((p.y-p.h/2)-(e.y-e.h/2));
 const reach=(e.type==='dog'||e.type==='werewolf')?65:defs[e.type].reach;
 if(dx>=-p.w/2&&dx<=reach&&dy<50){e.didHit=true;w.hurt(e.boss?2:1,e.x);}
}
const api={defs,create,step,resolve};if(typeof module!=='undefined')module.exports=api;else root.MysticEnemy=api;
})(globalThis);
