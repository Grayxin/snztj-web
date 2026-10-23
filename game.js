(() => {
'use strict';
const $=s=>document.querySelector(s),canvas=$('#game'),ctx=canvas.getContext('2d'),data=window.GAME_DATA;
const {surfaceAt,moveBody,attr}=MysticPhysics,images={},audio=new MysticAudio(data.music);
const names=['翡翠森林','幽蓝遗迹','暮色古城'],keys=new Set(),pressed=new Set();
let mode='loading',stage=0,level,player,enemies=[],gems=[],particles=[],camera=0,time=0,score=0,best=0,checkpoint=0,shake=0,toastTime=0;
try{best=Number(localStorage.getItem('mystic-best')||0)||0;}catch{}
$('#best').textContent=String(best).padStart(6,'0');
function record(){if(score>best){best=score;try{localStorage.setItem('mystic-best',String(best));}catch{}}$('#score').textContent=String(score).padStart(6,'0');$('#best').textContent=String(best).padStart(6,'0');}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');toastTime=3;}
function overlay(title,copy,button,kicker='MYSTIC ARTS',logo=false){$('#overlay').hidden=false;$('#overlay-title').textContent=title;$('#overlay-copy').textContent=copy;$('#start').textContent=button;$('#start').disabled=false;$('#overlay-kicker').textContent=kicker;$('#title-logo').hidden=!logo;$('#start-hint').textContent=mode==='paused'?'按 P 或 Esc 也可继续':'方向键 / A D 移动 · 空格二段跳 · J 攻击 · K 魔法';}
function floorAt(x,min=100){for(let y=min;y<480;y++){const s=surfaceAt(level,x,y);if(s!==Infinity&&s>=min)return s;}return 448;}
function setupStage(index){
 stage=index;level=data.levels[stage];camera=0;checkpoint=0;enemies=[];gems=[];particles=[];
 player={x:70,y:100,vx:0,vy:0,w:23,h:48,ground:false,face:1,hp:8,maxHp:8,mana:100,jumps:0,attack:0,cooldown:0,invincible:1,magic:0};
 player.y=floorAt(player.x)-1;
 for(let x=410;x<level.width*16-240;x+=250){
   const kind=(enemies.length+stage)%3,ex=x+(enemies.length%2)*26;
   enemies.push({x:ex,y:floorAt(ex)-1,vx:0,vy:0,w:kind===2?35:26,h:kind===2?57:42,ground:false,home:ex,face:-1,hp:kind===2?4:2,maxHp:kind===2?4:2,kind,attack:0,hit:0,dead:false,boss:false});
 }
 const end=level.width*16-170;
 enemies.push({x:end,y:floorAt(end)-1,vx:0,vy:0,w:45,h:65,ground:false,home:end,face:-1,hp:12,maxHp:12,kind:2,attack:0,hit:0,dead:false,boss:true});
 for(let x=200;x<level.width*16-150;x+=160)gems.push({x,y:floorAt(x)-60,taken:false});
 $('#stage-label').textContent=`0${stage+1} / ${names[stage]}`;$('#status-label').textContent='抵达传送门';$('#pause').textContent='暂停 Ⅱ';
 document.querySelectorAll('.chapter').forEach((el,i)=>{el.classList.toggle('active',i===stage);el.classList.toggle('done',i<stage);el.querySelector('i').textContent=i<stage?'✓':i===stage?'✦':'◇';});
 audio.play(stage+1);record();
}
function start(){audio.unlock();if(mode==='paused'){resume();return;}if(mode==='clear'&&stage<2){setupStage(stage+1);}else{score=0;setupStage(0);}mode='playing';$('#overlay').hidden=true;canvas.focus();toast('冒险开始 · 空格可二段跳，J 连续攻击');}
function pause(){if(mode!=='playing')return;mode='paused';keys.clear();pressed.clear();audio.stop();overlay('稍作休息','森林会在这里等你。','继续冒险','TAKE A BREATH');$('#pause').textContent='继续 ▶';}
function resume(){if(mode!=='paused')return;mode='playing';$('#overlay').hidden=true;$('#pause').textContent='暂停 Ⅱ';audio.play(stage+1);canvas.focus();}
function togglePause(){if(mode==='playing')pause();else if(mode==='paused')resume();}
function burst(x,y,color,n=12){for(let i=0;i<n;i++)particles.push({x,y,vx:(Math.random()-.5)*220,vy:(Math.random()-.7)*200,t:.3+Math.random()*.35,max:.7,color,size:2+Math.random()*3});}
function hurt(amount,from){if(mode!=='playing'||player.invincible>0)return;player.hp-=amount;player.invincible=1.4;player.vx=(player.x<from?-1:1)*220;player.vy=-240;shake=9;audio.effect('hurt');burst(player.x,player.y-25,'#e3ad8c');if(player.hp<=0){player.hp=0;mode='dead';audio.stop();record();overlay('旅程尚未结束',`本次得分 ${score}。再试一次，你会走得更远。`,'重新出发','TRY AGAIN');}}
function hitEnemy(e,damage){if(e.dead)return;e.hp-=damage;e.hit=.2;e.x+=player.face*12;audio.effect('hit');burst(e.x,e.y-e.h*.55,'#e7dba8');score+=30;shake=4;if(e.hp<=0){e.dead=true;score+=e.boss?1200:150;burst(e.x,e.y-30,e.boss?'#c6acf4':'#b2d6a1',24);player.mana=Math.min(100,player.mana+12);if(e.boss)toast('守卫已击败 · 前往发光的传送门');}record();}
function attack(){if(player.cooldown>0)return;player.attack=.27;player.cooldown=.36;player.struck=new Set();audio.tone(240,.07,'triangle',.13);}
function magic(){if(player.magic>0||player.mana<35)return;player.mana-=35;player.magic=.65;shake=6;audio.effect('magic');for(const e of enemies)if(!e.dead&&Math.abs(e.x-player.x)<220&&Math.abs(e.y-player.y)<160)hitEnemy(e,3);}
function update(dt){
 time+=dt;audio.tick();if(toastTime>0){toastTime-=dt;if(toastTime<=0)$('#toast').classList.remove('show');}
 for(const p of particles){p.t-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=350*dt;}particles=particles.filter(p=>p.t>0);shake=Math.max(0,shake-35*dt);
 if(mode!=='playing'){pressed.clear();return;}
 const p=player;p.attack=Math.max(0,p.attack-dt);p.cooldown=Math.max(0,p.cooldown-dt);p.invincible=Math.max(0,p.invincible-dt);p.magic=Math.max(0,p.magic-dt);p.mana=Math.min(100,p.mana+5*dt);
 const move=(keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0);
 const target=move*(p.attack>0?100:205);if(p.invincible<1.1)p.vx+=(target-p.vx)*Math.min(1,dt*16);if(move)p.face=move;
 if((pressed.has('Space')||pressed.has('KeyW')||pressed.has('ArrowUp'))&&(p.ground||p.jumps<2)){p.vy=p.jumps===0?-490:-440;p.jumps++;p.ground=false;audio.effect('jump');burst(p.x,p.y,'#d7e8bc',6);}
 if(keys.has('KeyJ')||keys.has('KeyZ'))attack();if(pressed.has('KeyK')||pressed.has('KeyX'))magic();
 p.vy=Math.min(750,p.vy+1180*dt);moveBody(p,level,dt);if(p.ground)p.jumps=0;
 if(p.y>550){p.invincible=0;hurt(2,p.x+1);if(mode==='playing'){p.x=checkpoint*640+65;p.y=floorAt(p.x)-2;p.vx=0;p.vy=0;p.jumps=0;toast('回到本屏起点 · 生命 −2');}}
 const room=Math.floor(p.x/640);if(room>checkpoint){checkpoint=room;score+=100;record();toast(`已到达区域 ${room+1} · 检查点已记录`);}
 for(const e of enemies){
   if(e.dead||Math.abs(e.x-p.x)>820)continue;
   e.hit=Math.max(0,e.hit-dt);e.attack=Math.max(0,e.attack-dt);const dx=p.x-e.x,near=Math.abs(dx)<(e.boss?340:230)&&Math.abs(p.y-e.y)<100;
   if(near)e.face=dx>0?1:-1;
   else if(Math.abs(e.x-e.home)>90)e.face=e.x>e.home?-1:1;
   const speed=e.boss?70:e.kind===1?90:45;e.vx=(near&&Math.abs(dx)<35?0:e.face*speed)*(e.hit>0?0:1);
   const ahead=e.x+e.face*(e.w/2+15);const groundAhead=surfaceAt(level,ahead,e.y+20);
   if(e.ground&&groundAhead===Infinity){e.vx=0;if(!near)e.face*=-1;}
   e.vy=Math.min(650,e.vy+1180*dt);moveBody(e,level,dt);
   if(e.y>550){e.dead=true;score+=150;record();continue;}
   if(p.attack>0&&!p.struck?.has(e)&&((e.x-p.x)*p.face>-16)&&((e.x-p.x)*p.face<(e.boss?100:82))&&Math.abs((p.y-25)-(e.y-e.h/2))<55){p.struck.add(e);hitEnemy(e,1);}
   if(!e.dead&&Math.abs(dx)<(p.w+e.w)/2+6&&Math.abs(p.y-e.y)<45&&e.attack<=0){hurt(e.boss?2:1,e.x);e.attack=1;}
 }
 for(const g of gems)if(!g.taken&&Math.hypot(p.x-g.x,p.y-25-g.y)<38){g.taken=true;score+=80;p.mana=Math.min(100,p.mana+6);audio.effect('coin');burst(g.x,g.y,'#e6ce82',8);record();}
 const boss=enemies.find(e=>e.boss);if(p.x>level.width*16-75&&boss.dead){mode='clear';score+=1000;record();audio.stop();overlay(stage===2?'回忆，再次闪耀':'前方，还有新的风景',stage===2?`三组场景已完成，最终得分 ${score}。感谢你重新踏上这段旅程。`:`${names[stage]}已通过，准备进入${names[stage+1]}。`,stage===2?'再玩一次':'进入下一场景',stage===2?'JOURNEY COMPLETE':'STAGE CLEAR');}
 camera+=(Math.max(0,Math.min(level.width*16-640,p.x-245))-camera)*Math.min(1,dt*7);
 pressed.clear();
}
function sprite(name,sx,sy,sw,sh,x,y,w,h,flip=false){const im=images[name];if(!im)return;ctx.save();ctx.translate(Math.round(x),Math.round(y));if(flip){ctx.translate(w,0);ctx.scale(-1,1);}ctx.drawImage(im,sx,sy,sw,sh,0,0,w,h);ctx.restore();}
function text(s,x,y,size=12,color='#e8e6c3',align='left'){ctx.font=`${size}px "Segoe UI","Microsoft YaHei",sans-serif`;ctx.textAlign=align;ctx.fillStyle='#071213';ctx.fillText(s,x+1,y+2);ctx.fillStyle=color;ctx.fillText(s,x,y);}
function drawPlayer(){const p=player;if(p.invincible>0&&Math.floor(time*15)%2===0)return;
 let frame;if(p.attack>0)frame=16+Math.floor((.27-p.attack)/.27*5);else if(!p.ground)frame=p.vy<0?33:36;else if(Math.abs(p.vx)>25)frame=6+Math.floor(time*11)%10;else frame=Math.floor(time*5)%6;
 // Original sheets: a1 faces left; a2 faces right.
 sprite(p.face>0?'thany_a2':'thany_a1',(frame%10)*64,Math.floor(frame/10)*64,64,64,p.x-32,p.y-64,64,64);
 if(p.attack>0){ctx.save();ctx.strokeStyle='#f2e9bd';ctx.lineWidth=3;ctx.shadowColor='#eedca1';ctx.shadowBlur=12;ctx.beginPath();const x=p.x+p.face*24,y=p.y-33;ctx.ellipse(x,y,43,31,p.face>0?-.2:.2,p.face>0?-1.1:2,p.face>0?1.1:4.2);ctx.stroke();ctx.restore();}
 if(p.magic>0){ctx.save();ctx.globalAlpha=p.magic/.65;ctx.strokeStyle='#b0c4ff';ctx.lineWidth=3;ctx.shadowColor='#8a99ff';ctx.shadowBlur=20;ctx.beginPath();ctx.arc(p.x,p.y-30,(1-p.magic/.65)*220,0,Math.PI*2);ctx.stroke();ctx.restore();}
}
function drawEnemy(e){if(e.dead)return;const walking=Math.abs(e.vx)>5;let name,sw,sh,frame,scale=e.boss?1.5:1;
 if(e.kind===0){name='gob1';sw=48;sh=64;frame=walking?Math.floor(time*9)%8:8;}
 else if(e.kind===1){name='dog1';sw=80;sh=48;frame=Math.floor(time*10)%6;}
 else {name='bone1';sw=64;sh=64;frame=Math.floor(time*7)%6;}
 ctx.save();if(e.hit>0)ctx.globalAlpha=.55;const columns=Math.floor(images[name].width/sw);sprite(name,(frame%columns)*sw,Math.floor(frame/columns)*sh,sw,sh,e.x-sw*scale/2,e.y-sh*scale,sw*scale,sh*scale,e.face>0);ctx.restore();
 if(e.hp<e.maxHp||e.boss){const w=e.boss?68:32;ctx.fillStyle='#091114';ctx.fillRect(e.x-w/2,e.y-sh*scale-10,w,4);ctx.fillStyle=e.boss?'#c59cda':'#d6ca94';ctx.fillRect(e.x-w/2,e.y-sh*scale-10,w*e.hp/e.maxHp,3);}
}
function draw(){
 ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,640,480);const bg=images[`stgb0${stage+1}`]||images.stgb01;
 if(bg){const scroll=(camera*.18)%640;ctx.drawImage(bg,-scroll,0,640,480);ctx.drawImage(bg,640-scroll,0,640,480);}else{ctx.fillStyle='#132a2b';ctx.fillRect(0,0,640,480);}
 if(!level){ctx.fillStyle='#071b1640';ctx.fillRect(0,0,640,480);return;}
 ctx.save();ctx.translate(-Math.round(camera)+(Math.random()-.5)*shake,(Math.random()-.5)*shake);
 const tiles=images[`stgp0${stage+1}`];const first=Math.max(0,Math.floor(camera/16)),last=Math.min(level.width,first+42);
 for(let y=0;y<30;y++)for(let x=first;x<last;x++){const v=level.tiles[y*level.width+x];if(v)ctx.drawImage(tiles,v%40*16,Math.floor(v/40)*16,16,16,x*16,y*16,16,16);}
 for(const g of gems)if(!g.taken&&g.x>camera-20&&g.x<camera+660){const y=g.y+Math.sin(time*3+g.x)*4;ctx.save();ctx.translate(g.x,y);ctx.rotate(Math.PI/4);ctx.shadowColor='#e1d495';ctx.shadowBlur=12;ctx.fillStyle='#efdc8b';ctx.fillRect(-5,-5,10,10);ctx.fillStyle='#fff3c6';ctx.fillRect(-3,-3,3,3);ctx.restore();}
 const boss=enemies.find(e=>e.boss);const portalX=level.width*16-50,py=floorAt(portalX)-38;
 ctx.save();ctx.strokeStyle=boss.dead?'#d9eaaa':'#a0a4ad';ctx.shadowBlur=18;ctx.shadowColor=boss.dead?'#c8e597':'#73718d';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(portalX,py,20+Math.sin(time*3)*2,35,0,0,Math.PI*2);ctx.stroke();ctx.restore();
 if(portalX-camera<650)text(boss.dead?'传送门':'击败守卫',portalX,py-46,10,'#d9dfb5','center');
 for(const e of enemies)if(e.x>camera-90&&e.x<camera+740)drawEnemy(e);drawPlayer();
 for(const p of particles){ctx.globalAlpha=Math.max(0,p.t/p.max);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,p.size,p.size);}ctx.globalAlpha=1;ctx.restore();
 hud();
}
function hud(){
 const p=player;ctx.fillStyle='#071619d9';ctx.fillRect(0,0,640,51);ctx.fillStyle='#9aaf7b66';ctx.fillRect(0,50,640,1);
 text('THANY',18,18,9,'#becaa7');for(let i=0;i<8;i++){ctx.fillStyle=i<p.hp?'#d4ae88':'#344440';ctx.fillRect(18+i*14,25,10,10);ctx.fillStyle=i<p.hp?'#efd6a9':'#45534a';ctx.fillRect(18+i*14,25,10,3);}
 text('MAGIC',150,18,9,'#b0b9dd');ctx.fillStyle='#304040';ctx.fillRect(150,26,94,6);ctx.fillStyle='#a2b7de';ctx.fillRect(150,26,94*p.mana/100,6);
 text(String(score).padStart(6,'0'),350,29,19,'#eee1af','center');text(`AREA ${Math.min(Math.floor(p.x/640)+1,level.width/40)} / ${level.width/40}`,620,20,11,'#c8d4b9','right');
 ctx.fillStyle='#3a5041';ctx.fillRect(496,31,124,3);ctx.fillStyle='#c6d49a';ctx.fillRect(496,31,124*p.x/(level.width*16),3);
}
function keydown(e){if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space','KeyJ','KeyK','KeyZ','KeyX','KeyW','KeyA','KeyD','KeyP','Escape','KeyR','Enter'].includes(e.code))e.preventDefault();if(e.repeat)return;
 if(e.code==='KeyP'||e.code==='Escape'){togglePause();return;}
 if(e.code==='KeyR'&&['playing','paused','dead','clear'].includes(mode)){mode='ready';start();return;}
 if(e.code==='Enter'&&mode!=='playing'&&mode!=='loading'){start();return;}
 if(!keys.has(e.code))pressed.add(e.code);keys.add(e.code);
}
window.addEventListener('keydown',keydown);window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
document.querySelectorAll('[data-key]').forEach(button=>{
 button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);const key=button.dataset.key;if(!keys.has(key))pressed.add(key);keys.add(key);});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(name,()=>keys.delete(button.dataset.key));
});
$('#start').addEventListener('click',start);$('#pause').addEventListener('click',togglePause);
$('#sound').addEventListener('click',()=>{audio.unlock();audio.setEnabled(!audio.enabled);$('#sound').textContent=`声音 ${audio.enabled?'开':'关'}`;$('#sound').setAttribute('aria-pressed',String(audio.enabled));});
$('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('#screen').requestFullscreen();}catch{toast('当前浏览器不支持全屏，可使用浏览器全屏模式');}});
let last=0,accumulator=0;function frame(ms){const dt=Math.min(.06,(ms-last)/1000||0);last=ms;accumulator+=dt;while(accumulator>=1/120){update(1/120);accumulator-=1/120;}draw();requestAnimationFrame(frame);}
async function loadImages(){
 const names=Object.keys(data.images);
 for(let i=0;i<names.length;i+=5)await Promise.all(names.slice(i,i+5).map(name=>new Promise((resolve,reject)=>{
   const im=new Image();let retry=0;im.onload=()=>{images[name]=im;resolve();};
   im.onerror=()=>{if(retry++<2){im.src=`assets/${name}.png?retry=${retry}`;}else reject(new Error(`图片加载失败：${name}`));};im.src=`assets/${name}.png`;
 })));
}
loadImages().then(()=>{mode='ready';$('#start').disabled=false;$('#start').textContent='开始冒险 →';requestAnimationFrame(frame);}).catch(error=>{mode='error';$('#overlay-title').textContent='资源加载失败';$('#overlay-copy').textContent=error.message+'。请重新运行资源提取脚本。';$('#start').textContent='请刷新页面重试';});
// Read-only diagnostics for reproducible smoke checks; no gameplay mutations.
window.mysticState=()=>({mode,stage,score,best,player:player?{x:player.x,y:player.y,hp:player.hp,mana:player.mana,ground:player.ground}:null,enemies:enemies.filter(e=>!e.dead).length,loadedImages:Object.keys(images).length});
})();
