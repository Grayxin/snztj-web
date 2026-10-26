const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const nodes=new Map(),drawn=[];
function node(){return {textContent:'',hidden:false,disabled:false,dataset:{},classList:{add(){},remove(){},toggle(){}},addEventListener(){},setAttribute(){},querySelector(){return node();},focus(){},getContext(){return new Proxy({},{get:(_,key)=>key==='drawImage'?(im)=>drawn.push(im):()=>{}})}};}
const document={querySelector(s){if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)},querySelectorAll(){return []},addEventListener(){}};
const box={console,document,Math,Set,Promise,Error,Number,String,localStorage:{getItem(){return null},setItem(){}},Image:class{set src(v){this.width=640;this.height=480;this.onload()}},requestAnimationFrame(){},addEventListener(){},MysticPhysics:require('./physics.js'),MysticEnemy:require('./enemy-ai.js'),MysticMage:require('./native-mage.js'),MysticCloud:require('./native-cloud.js'),MysticHazards:require('./native-hazards.js'),MysticAudio:class{unlock(){}play(){}stop(){}tick(){}tone(){}effect(){}},};box.window=box;box.globalThis=box;vm.createContext(box);
vm.runInContext(fs.readFileSync(__dirname+'/assets/data.js','utf8'),box);
for(const file of ['native-atlas.js','encounters.js'])vm.runInContext(fs.readFileSync(__dirname+'/assets/'+file,'utf8'),box);
let game=fs.readFileSync(__dirname+'/game.js','utf8');game=game.replace(/\}\)\(\);\s*$/,"window.TEST={images,draw,drawPlayer,drawEnemy,setupStage,start,update,pause,resume,attack,magic,get:()=>({player,enemies,projectiles,mode,stage,level,keys,pressed,score,transition}),setMode:v=>mode=v};})();");vm.runInContext(game,box);
const t=box.TEST;
for(const [name,size] of Object.entries(box.GAME_DATA.images))t.images[name]={width:size[0],height:size[1],name};
t.setMode('ready');t.start();let s=t.get();assert.equal(s.mode,'playing');assert.equal(s.stage,0);s.enemies.forEach(e=>e.x=10000);
for(let i=0;i<90;i++)t.update(1/120);s=t.get();assert(s.player.ground,'spawn settles onto original map');
const before=s.player.x;s.keys.add('ArrowRight');for(let i=0;i<90;i++)t.update(1/120);s.keys.clear();assert(t.get().player.x>before+100,'movement advances');
s=t.get();s.pressed.add('Space');t.update(1/120);assert(s.player.vy<0,'jump launches');s.pressed.add('Space');t.update(1/120);assert.equal(s.player.jumps,2,'double jump available');
const e=s.enemies[0];e.x=s.player.x+35;e.y=s.player.y;e.hp=2;s.player.face=1;t.attack();t.update(.01);assert.equal(e.hp,1,'attack damages nearby enemy once');t.update(.01);assert.equal(e.hp,1,'same swing cannot damage twice');
const mana=s.player.mana;t.magic();assert(e.dead,'magic defeats enemy');assert(s.player.mana<mana,'magic costs mana');
t.pause();const x=s.player.x;t.update(.2);assert.equal(t.get().player.x,x,'pause freezes physics');t.resume();assert.equal(t.get().mode,'playing');
for(let stage=0;stage<16;stage++){
 t.setupStage(stage);t.setMode('playing');s=t.get();assert.equal(s.level.tiles.length,s.level.width*30);assert.equal(s.level.attrs.length,s.level.width*30);
 s.enemies.forEach(e=>e.dead=true);s.player.x=s.level.width*16-50;t.update(.01);
 if([5,10,15].includes(stage)){
  assert.equal(t.get().mode,'clear','major stage shows settlement');
  if(stage<15){t.start();assert.equal(t.get().stage,stage+1);}
 }else{
  assert.equal(t.get().mode,'transition','small stages pan directly without modal');
  assert.equal(nodes.get('#overlay').hidden,true);
  t.draw();t.update(.52);t.draw(); // Both source and destination scenes render during the pan.
  const elapsed=t.get().transition.elapsed;t.pause();t.update(.4);assert.equal(t.get().transition.elapsed,elapsed,'pan pauses on focus loss');t.resume();
  for(let i=0;i<180;i++)t.update(1/120);
  assert.equal(t.get().stage,stage+1);assert.equal(t.get().mode,'playing');assert.equal(t.get().transition,null);
 }
}
t.setMode('ready');t.start();s=t.get();s.player.hp=1;s.player.invincible=0;s.player.y=600;t.update(.01);assert.equal(t.get().mode,'dead','fatal fall opens restart');
t.start();assert.equal(t.get().player.hp,8,'restart restores health');
// The a1 sheet faces left, a2 faces right; verify the actual rendered image.
t.images.thany_a1={name:'left'};t.images.thany_a2={name:'right'};
s=t.get();s.player.invincible=0;
for(const [key,face,name] of [['ArrowRight',1,'right'],['ArrowLeft',-1,'left']]){
 s.keys.add(key);t.update(.01);s.keys.clear();assert.equal(s.player.face,face);
 for(const state of ['idle','walk','jump','attack']){
  s.player.ground=state!=='jump';s.player.vx=state==='walk'?100:0;s.player.attack=state==='attack'?.2:0;
  t.drawPlayer();assert.equal(drawn.at(-1).name,name,`${key} ${state} must face ${name}`);
 }
}
console.log('facing: right/left inputs render matching idle, walk, jump and attack sprites');
console.log('game: spawn, movement, double jump, melee hit deduplication, magic, pause, all 16 clears, stage transitions, death/restart passed');
// Hold attack for 20 seconds on an original platform in every tileset.
for(const stage of [0,6,11]){
 t.setupStage(stage);t.setMode('playing');s=t.get();s.enemies.forEach(e=>e.dead=true);s.enemies[0].dead=false;s.enemies[0].x=10000;
 const l=s.level;const i=l.attrs.findIndex((a,i)=>i>l.width&&a===33&&l.attrs[i-1]===33&&l.attrs[i+1]===33&&l.attrs[i-l.width]===0);
 assert(i>=0);const expected=Math.floor(i/l.width)*16-l.surfaceOffset;
 Object.assign(s.player,{x:(i%l.width)*16+8,y:expected,vx:0,vy:0,ground:true,invincible:0});s.keys.add('KeyJ');
 for(let tick=0;tick<2400;tick++){t.update(1/120);assert.equal(s.player.y,expected,`stage ${stage} repeated attack must stay on platform`);}
 s.keys.clear();
}
console.log('continuous attack: 20 seconds on original platforms in all 3 stages without sinking');

// Original encounter identity and active enemy damage integration.
const counts=[4,5,5,6,6,1,5,5,6,6,4,6,3,5,1,1];
for(let stage=0;stage<16;stage++){t.setupStage(stage);s=t.get();assert.equal(s.enemies.length,counts[stage]);assert.equal(s.level.width,40);}
t.setupStage(5);assert.equal(t.get().enemies[0].type,'werewolf');
t.setupStage(10);assert.equal(t.get().enemies.filter(e=>e.boss).length,2);assert.equal(t.get().enemies.filter(e=>e.type==='cloud').length,2);
t.setupStage(14);assert.equal(t.get().enemies[0].variant,2);
t.setupStage(15);assert.equal(t.get().enemies[0].type,'mage');
t.setupStage(0);t.setMode('playing');s=t.get();s.enemies.slice(1).forEach(e=>e.dead=true);Object.assign(s.player,{x:200,y:448-s.level.surfaceOffset,vx:0,vy:0,invincible:0,attack:0});Object.assign(s.enemies[0],{x:245,y:s.player.y,vx:0,vy:0,face:-1});
let sawWindup=false,sawStrike=false;for(let i=0;i<240;i++){t.update(1/120);sawWindup ||= s.enemies[0].state==='windup';sawStrike ||= s.enemies[0].state==='strike';}
assert(sawWindup&&sawStrike);assert(s.player.hp<8,'stationary player is hit by approaching ordinary enemy');
t.pause();let timer=s.enemies[0].timer;t.update(.5);assert.equal(s.enemies[0].timer,timer,'pause freezes enemy attacks');
console.log('native encounters: 16 exact rosters, wolf/rematch, giant pair+specials, final mage; enemy damage and pause integration passed');

t.setupStage(15);t.setMode('playing');s=t.get();Object.assign(s.player,{x:200,y:445,vx:0,vy:0,invincible:0});Object.assign(s.enemies[0],{x:290,y:375,hoverY:375});
let sawProjectile=false;for(let i=0;i<600;i++){t.update(1/120);sawProjectile ||= t.get().projectiles.length>0;}
assert(sawProjectile,'final mage creates live projectile entities');assert(s.player.hp<8,'mage projectiles actually damage player');
for(const [name,size] of Object.entries(box.GAME_DATA.images))t.images[name]={width:size[0],height:size[1],name};
for(let stage=0;stage<16;stage++){t.setupStage(stage);s=t.get();for(const e of s.enemies)for(const state of ['patrol','windup','strike','recovery'])for(const face of [-1,1]){Object.assign(e,{state,face,phase:.1});t.drawEnemy(e);}}
console.log('projectile damage and every native encounter sprite in all attack states/directions passed');
t.setupStage(0);t.setMode('playing');s=t.get();s.enemies.forEach(e=>e.dead=true);s.enemies[0].dead=false;Object.assign(s.enemies[0],{x:200,y:600,vy:0});Object.assign(s.player,{hp:1,invincible:0,y:600});t.update(.01);assert.equal(t.get().mode,'dead','fatal fall must take precedence over last-enemy clear');
console.log('fatal damage precedence passed');
