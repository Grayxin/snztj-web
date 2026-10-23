const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const nodes=new Map(),drawn=[];
function node(){return {textContent:'',hidden:false,disabled:false,dataset:{},classList:{add(){},remove(){},toggle(){}},addEventListener(){},setAttribute(){},querySelector(){return node();},focus(){},getContext(){return new Proxy({},{get:(_,key)=>key==='drawImage'?(im)=>drawn.push(im):()=>{}})}};}
const document={querySelector(s){if(!nodes.has(s))nodes.set(s,node());return nodes.get(s)},querySelectorAll(){return []},addEventListener(){}};
const box={console,document,Math,Set,Promise,Error,Number,String,localStorage:{getItem(){return null},setItem(){}},Image:class{set src(v){this.width=640;this.height=480;this.onload()}},requestAnimationFrame(){},addEventListener(){},MysticPhysics:require('./physics.js'),MysticAudio:class{unlock(){}play(){}stop(){}tick(){}tone(){}effect(){}},};box.window=box;box.globalThis=box;vm.createContext(box);
vm.runInContext(fs.readFileSync(__dirname+'/assets/data.js','utf8'),box);
let game=fs.readFileSync(__dirname+'/game.js','utf8');game=game.replace(/\}\)\(\);\s*$/,"window.TEST={images,drawPlayer,setupStage,start,update,pause,resume,attack,magic,get:()=>({player,enemies,mode,stage,level,keys,pressed,score}),setMode:v=>mode=v};})();");vm.runInContext(game,box);
const t=box.TEST;
t.setMode('ready');t.start();let s=t.get();assert.equal(s.mode,'playing');assert.equal(s.stage,0);
for(let i=0;i<90;i++)t.update(1/120);s=t.get();assert(s.player.ground,'spawn settles onto original map');
const before=s.player.x;s.keys.add('ArrowRight');for(let i=0;i<90;i++)t.update(1/120);s.keys.clear();assert(t.get().player.x>before+100,'movement advances');
s=t.get();s.pressed.add('Space');t.update(1/120);assert(s.player.vy<0,'jump launches');s.pressed.add('Space');t.update(1/120);assert.equal(s.player.jumps,2,'double jump available');
const e=s.enemies[0];e.x=s.player.x+35;e.y=s.player.y;e.hp=2;s.player.face=1;t.attack();t.update(.01);assert.equal(e.hp,1,'attack damages nearby enemy once');t.update(.01);assert.equal(e.hp,1,'same swing cannot damage twice');
const mana=s.player.mana;t.magic();assert(e.dead,'magic defeats enemy');assert(s.player.mana<mana,'magic costs mana');
t.pause();const x=s.player.x;t.update(.2);assert.equal(t.get().player.x,x,'pause freezes physics');t.resume();assert.equal(t.get().mode,'playing');
for(let stage=0;stage<3;stage++){
 t.setupStage(stage);t.setMode('playing');s=t.get();assert.equal(s.level.tiles.length,s.level.width*30);assert.equal(s.level.attrs.length,s.level.width*30);
 s.enemies.find(e=>e.boss).dead=true;s.player.x=s.level.width*16-50;t.update(.01);assert.equal(t.get().mode,'clear','exit completes scene '+stage);
 if(stage<2){t.start();assert.equal(t.get().stage,stage+1,'next scene starts');}
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
console.log('game: spawn, movement, double jump, melee hit deduplication, magic, pause, all 3 exits, stage transitions, death/restart passed');
// Hold attack for 20 seconds on an original platform in every tileset.
for(let stage=0;stage<3;stage++){
 t.setupStage(stage);t.setMode('playing');s=t.get();s.enemies.forEach(e=>e.dead=true);
 const l=s.level;const i=l.attrs.findIndex((a,i)=>i>l.width&&a===33&&l.attrs[i-1]===33&&l.attrs[i+1]===33&&l.attrs[i-l.width]===0);
 assert(i>=0);const expected=Math.floor(i/l.width)*16-l.surfaceOffset;
 Object.assign(s.player,{x:(i%l.width)*16+8,y:expected,vx:0,vy:0,ground:true,invincible:0});s.keys.add('KeyJ');
 for(let tick=0;tick<2400;tick++){t.update(1/120);assert.equal(s.player.y,expected,`stage ${stage} repeated attack must stay on platform`);}
 s.keys.clear();
}
console.log('continuous attack: 20 seconds on original platforms in all 3 stages without sinking');
