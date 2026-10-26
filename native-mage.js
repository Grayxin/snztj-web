/* Mystic.exe wizard attack transcription. Evidence: docs/reverse/mage-moves.md.
 * Event coordinates are world pixels; speeds are pixels/native tick, not px/s.
 * Native tick rate is supplied by the host (default 60; original rate unverified).
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MysticMage=api;})(typeof window==='object'?window:globalThis,function(){
  'use strict';
  const TAU=Math.PI*2, rad=n=>n*TAU/65536, clamp=(v,m)=>Math.max(-m,Math.min(m,v));
  const animations={0:[[0,8],[1,8],[2,8]],1:[[3,8],[4,8],[5,8]],3:[[21,8],[22,8],[23,8],[24,8],[25,8],[26,8],[27,8],[28,8],[29,8],[30,16]],4:[[31,8],[32,8],[33,8],[34,8],[35,8],[36,8],[34,8],[35,8],[36,8]],5:[[15,8],[16,8],[17,8],[18,8],[19,8],[17,8],[18,8],[19,8],[17,8],[18,8],[19,8]],6:[[17,8],[18,8],[19,8]]};
  function create(e){e.nativeMage={state:0,tick:0,timer:0,sequence:0,cooldown:0,phase:0,phaseAngle:0,orbitAngle:0,seed:21000,accumulator:0,vx:0,vy:0,repeat:0,clones:[],unsupported:['native damage-type responses and hurt interruptions','exact native tick rate and fixed-point integer rounding','global time idle-position bias']};e.orbits=[{x:320,y:496,seed:0,difficulty:16,phase:99},{x:0,y:-16,seed:21845,difficulty:16,phase:99},{x:640,y:-16,seed:43690,difficulty:24,phase:99}].map((o,index)=>({...o,index,wait:0,tick:0,linkCount:0}));e.orbitLinks=[];return e.nativeMage;}
  function enter(m,state){m.state=state;m.timer=0;m.tick=0;m.settle=0;}
  function emit(e,w,event){if(w.emit)w.emit(e,event);}
  function player(w){const p=w.player||{};return {x:p.centerX??p.x??320,y:p.y??400,nx:p.nativeX??((p.x??320)-24),ny:p.nativeY??((p.y??400)-64)};}
  function hp(e){return 100*(e.hp??100)/(e.maxHp??e.hpMax??100);}
  function random(w,n){return Math.floor((w.random||Math.random)()*n);}
  function aim(e,p){return Math.atan2(p.y-(e.y-2),p.x-e.x);}
  function bolt(e,w,angle,source=e){emit(e,w,{kind:'homingBolt',x:source.x-16,y:source.y-96+94/3-8,angle,nativeConstructor:'0x42447a',speedMax:8,lifeTicks:300,homing:true});}
  function lightning(e,w,x,vx,rain){emit(e,w,{kind:'lightning',x,y:-32,vx,lifeTicks:8,variant:rain?128:0,nativeConstructor:'0x423a4a'});}
  function select(e,w,m,d,pct){
    const seq=m.sequence, phase=pct<40?2:pct<70?1:0;
    m.phase=phase;
    let state;
    // Native selector uses folded deterministic seed, not a random rage choice.
    let folded=m.seed>32767?65535-m.seed:m.seed;
    if(d>=128&&(folded&255)<96&&(seq&1))state=11;
    else if(phase===0)state=[2,1,1,2,1,9][seq%6];
    else if(seq%7===5||(d>=128&&(folded&255)<96&&(seq&3)===0))state=5;
    else state=(phase===1?[2,1,1,2,9,5,2]:[2,1,13,2,9,5,2])[seq%7];
    m.sequence=(seq+1)%(phase?7:6);
    m.repeat=Math.trunc((d+1)/96)+1;
    m.cloneVariant=phase===2?1:0;
    m.cooldown=[2,5].includes(state)?Math.trunc((256-d)/8)+60:Math.trunc((256-d)/6)+90;
    enter(m,state);
  }
  function setAnimation(e,m){let key=m.state===1?3:m.state===2?4:[9,11,13].includes(m.state)?6:[3,6,7,8,10,12].includes(m.state)?5:Math.abs(m.vx)>=1?1:0;
    const frames=animations[key],duration=frames.reduce((n,a)=>n+a[1],0);let t=m.tick%duration;
    for(const a of frames){if(t<a[1]){e.nativeFrame=a[0];break;}t-=a[1];}
  }
  function stepOrbits(e,w,m){
    m.orbitAngle=(m.orbitAngle+Math.trunc(Math.cos(rad(m.seed))*512))&65535;
    const scatter=[6,7,8,9,10,11,13].includes(m.state),anim=[[0,12],[1,8],[2,6],[3,4],[4,2],[5,2],[4,2],[3,4],[2,6],[1,8]];
    for(const o of e.orbits){
      o.tick++;o.seed=(o.seed+100)&65535;const folded=o.seed>32767?65536-o.seed:o.seed;
      if(o.wait>0)o.wait--;
      const old=o.phase;
      if(scatter){
        if(old!==2&&old!==3){o.tx=folded%656-16;o.ty=folded%496-16;}
        if((o.difficulty<<7)<=folded*2){o.phase=3;if(old===2)o.linkCount=24;}else o.phase=2;
      }else{
        if((o.difficulty<<7)>folded){if(old===0){o.phase=1;o.linkCount=12;}}
        else o.phase=0;
      }
      if(old!==o.phase&&!((old===2&&o.phase===3)||(old===0&&o.phase===1)))o.linkCount=0;
      if(o.phase===0||o.phase===1){
        const a=rad(m.orbitAngle+Math.trunc(65536/3)*o.index);o.tx=e.x+Math.cos(a)*64;o.ty=e.y-50+Math.sin(a)*64;
        const dx=o.tx-o.x,dy=o.ty-o.y;
        o.x+=clamp(dx/8,Math.abs(dx)<16?2:Math.abs(dx)<44?3:5);
        o.y+=clamp(dy/8,Math.abs(dy)<16?2:Math.abs(dy)<44?3:5);
      }else if(o.phase===2||o.phase===3){
        if(o.wait===0){o.wait=8;if(Math.abs(o.tx-o.x)<4&&Math.abs(o.ty-o.y)<4){o.tx=folded%656-16;o.ty=folded%496-16;}}
        const dx=o.tx-o.x,dy=o.ty-o.y;
        o.x+=clamp(dx/6,Math.abs(dx)<20?4:Math.abs(dx)<64?6:8);
        o.y+=clamp(dy/7,Math.abs(dy)<20?3:Math.abs(dy)<64?5:7);
      }
      let t=o.tick%54;for(const [frame,duration]of anim){if(t<duration){o.nativeFrame=o.frame=frame;break;}t-=duration;}
    }
    e.orbitLinks=[];
    for(const o of e.orbits){const next=e.orbits[(o.index+1)%3],n=o.linkCount;
      if(!n||![1,3].includes(o.phase))continue;
      for(let i=0;i<n;i++){const u=i/(n+1)+1/n,jitter=rad(random(w,127)<<11);e.orbitLinks.push({x:o.x+(next.x-o.x)*u+Math.cos(jitter)*2,y:o.y+(next.y-o.y)*u+Math.sin(jitter)*2,frame:6+Math.floor(o.tick/2)%4,nativeFrame:6+Math.floor(o.tick/2)%4,attack:true});}
    }
  }
  function tick(e,w){
    const m=e.nativeMage||create(e),d=w.difficulty??64,p=player(w),pct=hp(e);
    m.tick++;m.seed=(m.seed+53)&65535;m.phaseAngle=(m.phaseAngle+150)&65535;
    if(m.cooldown>0)m.cooldown--;
    e.nativeVisible=true;e.renderScale={x:1,y:1};
    const state=m.state;
    if(state===0){
      // Native idle approach, 40ae04..40b0c6 (remaining global time bias omitted).
      let seed=m.seed>32767?65535-m.seed:m.seed;
      const sx=rad(m.phaseAngle),targetX=280+80*Math.cos(sx)+(p.x<192?64:p.x>448?-64:0);
      const targetY=96+4*Math.sin(rad((m.phaseAngle&16383)*4))+(seed/32768)*32-(p.x>=192&&p.x<=448?32:0);
      const dx=targetX-(e.x-40),dy=targetY-(e.y-96);
      m.vx=clamp(dx/9,Math.abs(dx)<20?2:Math.abs(dx)<44?3:5);
      m.vy=clamp(dy/10,Math.abs(dy)<20?2:Math.abs(dy)<44?3:4);
      if(m.cooldown===0)select(e,w,m,d,pct);
    }else if([1,2,3,6,8,10,12].includes(state)){
      if([1,2,3].includes(state)){m.vx*=.95;m.vy*=.95;}
      if(m.timer===0){m.timer=({1:84,2:120,3:88,6:88,8:120,10:80})[state]|| (pct<20?220:pct<50?180:pct<70?160:120);m.elapsed=0;}
      else{
        m.timer--;m.elapsed++;const t=m.timer;
        if(state===1){
          if(t===50)m.aim=aim(e,p);
          const times=d<=64?[49,35,22]:d<=128?[49,42,35,29,22]:[49,45,40,35,30,25,21];
          const i=times.indexOf(t),n=times.length,spread=d<=64?1280:d<=128?1536:1024;
          if(i>=0){const offsets=n===3?[[32,0],[0,24],[-24,8]]:n===5?[[32,0],[16,16],[0,24],[-16,16],[-24,8]]:[[32,0],[16,16],[16,16],[0,24],[-16,16],[-16,16],[-24,8]];
            emit(e,w,{kind:'aimedBurst',x:e.x+offsets[i][0],y:e.y-96+94/3+offsets[i][1],angle:m.aim+rad((i-(n-1)/2)*spread*(n===3?2:1)),speed:d<=64?5:d<=128?6:8,nativeConstructor:'0x422d7d'});
          }
        }else if(state===2){
          const capture=d<=64?[76,46,16]:d<=128?[91,66,41,16]:[96,76,56,36,16];
          const fire=d<=64?[61,31,1]:d<=128?[76,51,26,1]:[86,66,46,26,6];
          if(capture.includes(t))m.targetX=p.x;
          if(fire.includes(t))lightning(e,w,m.targetX,random(w,511)/128-2,false);
        }else if(state===3){const i=[49,42,35,29,22].indexOf(t);if(i>=0)bolt(e,w,rad([49152,40960,57344,36864,61440][i]));
        }else if(state===6){
          const sources=[e];
          if(t===16)for(const source of sources){if(d<=64)bolt(e,w,rad(49152),source);else{bolt(e,w,rad(57344),source);bolt(e,w,rad(40960),source);}}
          if(t===8&&d>128)for(const source of sources)bolt(e,w,0,source);
        }else if(state===8){const interval=d<=64?8:d<=128?6:5,max=d>128?85:80;
          if(t<=max&&t>=16&&t%interval===0)lightning(e,w,e.x+random(w,127)-64,random(w,511)/64-(d<=64?3:d<=128?4:6),true);
        }else if(state===10){if(t===64)m.beamDelay=18;
        }else if(state===12){
          const interval=d<=64?15:d<=128?10:8,threshold=d<=64?40:d<=128?35:25;
          if(m.elapsed>=threshold&&m.elapsed%interval===0){const n=pct<20?12:pct<50?8:pct<70?6:4;
            emit(e,w,{kind:'acceleratingBolt',x:e.x-20,y:e.y-49,angle:aim(e,p)+rad((random(w,4096)-2048)*n/4),speed:1.5,acceleration:.2,homing:false,lifeTicks:300,nativeConstructor:'0x425e8c'});}
        }
        if(t===0){if(state===10)enter(m,9);else enter(m,0);}
      }
    }else if(state===5){
      if(!m.timer){m.timer=9999;let folded=m.seed>32767?65535-m.seed:m.seed;const k=Math.trunc(folded/4)%3;
        const slots=[[128,80],[320,80],[512,80]];if(m.cloneVariant){slots[0][1]=344;slots[1][1]=192;slots[2][1]=344;}
        const order=k===0?[0,1,2]:k===1?[2,0,1]:[1,2,0];m.target={x:slots[order[0]][0],y:slots[order[0]][1]+96};
        m.clones=order.slice(1).map(i=>({x:e.x,y:e.y,state:5,settle:0,timer:0,tick:0,target:{x:slots[i][0],y:slots[i][1]+96}}));
      }
      const dx=m.target.x-e.x,dy=m.target.y-e.y;m.vx=dx/16;m.vy=dy/16;
      if(Math.abs(dx)<1&&Math.abs(dy)<1){if(!m.settle)m.settle=30;else if(--m.settle===1)enter(m,6);}
    }else if(state===7){
      m.vx=(320-e.x)/16;m.vy=(144-e.y)/16;
      if(Math.abs(320-e.x)<1&&Math.abs(144-e.y)<1){if(!m.settle)m.settle=15;else if(--m.settle===1)enter(m,8);}
    }else if([9,11,13].includes(state)){
      m.vx=0;m.vy=0;
      const total=state===9?128:112,hidden=state===9?103:87,restore=state===9?25:39;
      if(!m.timer){if(state===9&&m.repeat<=0){enter(m,0);}else{if(state===9)m.repeat--;m.timer=total;}}
      else{
        const t=--m.timer;
        if(t===hidden)e.nativeVisible=false;
        if(t<=hidden&&t>restore)e.nativeVisible=false;
        if(t>hidden){const q=total-24;e.renderScale={x:(t-q)/20,y:20/(t-hidden)};}
        if(t===restore){if(state===9){e.x=p.nx+(p.nx>=320?-160:160)+40;e.y=(p.ny>=288?344:192)+96;}else if(state===11){e.x=288+40;e.y=48+96;}else{e.x=p.nx-8+40;e.y=8+96;}}
        const r=state===9?t:t-16,denominator=state===9?26-t:40-t;
        if(r>=1&&r<=(state===9?25:23))e.renderScale={x:24/denominator,y:denominator/24};
        if(t===0){e.nativeVisible=true;e.renderScale={x:1,y:1};enter(m,state===9?10:state===11?12:8);}
      }
    }else{m.unsupportedState=state;}
    for(const c of m.clones){
      c.tick++;
      if(c.state===5){const dx=c.target.x-c.x,dy=c.target.y-c.y;c.x+=dx/16;c.y+=dy/16;
        if(Math.abs(dx)<1&&Math.abs(dy)<1){if(!c.settle)c.settle=30;else if(--c.settle===1){c.state=6;c.timer=88;c.tick=0;}}
      }else if(c.state===6){if(--c.timer===16){bolt(e,w,rad(57344),c);bolt(e,w,rad(40960),c);}if(c.timer===0)c.dead=true;}
      const a=c.state===6?animations[5]:animations[0];c.nativeFrame=a[Math.floor(c.tick/8)%a.length][0];
    }
    m.clones=m.clones.filter(c=>!c.dead);
    if(m.beamDelay>0&&--m.beamDelay===0)emit(e,w,{kind:'special4252c6',x:e.x-16,y:e.y-72,lifeTicks:6,beamRows:[-8,8,24],beamWidth:448,nativeConstructor:'0x4252c6'});
    e.x+=m.vx;e.y+=m.vy;setAnimation(e,m);stepOrbits(e,w,m);
  }
  function step(e,w,dt){const m=e.nativeMage||create(e);m.accumulator+=(dt??1/60)*(w.nativeHz||60);let n=Math.floor(m.accumulator+1e-9);m.accumulator-=n;while(n-->0)tick(e,w);return m;}
  function forceState(e,state,options){const m=e.nativeMage||create(e);enter(m,state);Object.assign(m,options||{});return m;}
  return {create,step,forceState,animations};
});
