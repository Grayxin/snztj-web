/* Transcribed helper geometry/timing: 423a4a, 422d7d, 42447a, 425805, 425e8c.
 * See docs/reverse/mage-moves.md and cloud-golem-moves.md. Native units are ticks.
 */
(function(root){
 'use strict';
 function create(event,w){
  const base={...event,age:0,accumulator:0,dead:false,hit:false,damage:1};
  if(event.kind==='lightning')return [{...base,y:w.groundAt(event.x)-480,vx:event.vx??0,lifeTicks:8,frame:75,w:16,h:480}];
  if(event.kind==='special4252c6'){
   const beams=[];for(let side=0;side<2;side++)for(let row=0;row<3;row++)beams.push({...base,kind:'beam',x:event.x+(side?32:-448),y:event.y+[-8,8,24][row],w:448,h:16,lifeTicks:6,sequence:side?row:(row+1)%3,frame:117});
   return beams;
  }
  if(!['aimedBurst','homingBolt','acceleratingBolt'].includes(event.kind))throw new Error(`Unported native hazard: ${event.kind}`);
  return [{...base,angle:event.angle??0,speed:event.speed??0,acceleration:event.acceleration??.2,lifeTicks:event.lifeTicks??300,w:16,h:16,frame:52}];
 }
 function rectHit(a,p){return a.x<p.x+p.w/2&&a.x+a.w>p.x-p.w/2&&a.y<p.y&&a.y+a.h>p.y-p.h;}
 function frame(h){
  if(h.kind==='lightning')return [75,76,83,77][Math.min(3,Math.floor(h.age/2))];
  if(h.kind==='beam')return 117+(h.sequence+Math.floor(h.age/2))%3;
  return 52+Math.floor(h.age/2)%2;
 }
 function tick(h,w){
  if(h.dead)return;h.age++;if(h.age>=h.lifeTicks){h.dead=true;return;}
  h.frame=frame(h);let active=true,rect;
  if(h.kind==='lightning'){
   h.x+=h.vx;h.vx*=.95;active=Math.floor(h.age/2)===1;rect={x:h.x-4,y:h.y,w:16,h:480};
  }else if(h.kind==='beam')rect={x:h.x,y:h.y,w:448,h:16};
  else{
   if(h.kind==='homingBolt'){
    let delta=Math.atan2(w.player.y-24-(h.y+16),w.player.x-(h.x+16))-h.angle;
    delta=Math.atan2(Math.sin(delta),Math.cos(delta));
    const n=h.age<30?128:h.age<60?8:h.age<128?(Math.abs(delta)>=Math.PI/2?128:16):h.age<160?64:Infinity;
    h.angle+=delta/n;h.speed=Math.min(h.age,40)/5;
   }
   const dx=Math.cos(h.angle)*h.speed,dy=Math.sin(h.angle)*h.speed,steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/4));
   for(let i=0;i<steps&&!h.dead;i++){
    h.x+=dx/steps;h.y+=dy/steps;rect={x:h.x+8,y:h.y+8,w:16,h:16};
    if(!h.hit&&rectHit(rect,w.player)){h.hit=true;w.hurt(h.damage,h.x);h.dead=true;}
    else if(w.terrain?.(h.x+16,h.y+16))h.dead=true;
   }
   if(h.kind==='acceleratingBolt')h.speed+=h.acceleration;
   if(h.x<-128||h.x>768||h.y<-128||h.y>608)h.dead=true;
  }
  if(active&&!h.dead&&!h.hit&&rect&&rectHit(rect,w.player)){h.hit=true;w.hurt(h.damage,h.x);}
 }
 function step(list,w,dt){for(const h of list){h.accumulator+=dt*(w.nativeHz||60);while(h.accumulator>=1-1e-9&&!h.dead){h.accumulator=Math.max(0,h.accumulator-1);tick(h,w);}}}
 const api={create,step,frame};if(typeof module==='object'&&module.exports)module.exports=api;else root.MysticHazards=api;
})(typeof window==='object'?window:globalThis);
