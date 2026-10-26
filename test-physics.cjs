const assert=require('node:assert/strict');
const {surfaceAt,moveBody}=require('./physics.js');
const level={width:10,height:30,attrs:Array(300).fill(0)};
level.attrs[20*10+3]=1;level.attrs[15*10+5]=33;level.attrs[20*10+4]=2;level.attrs[20*10+6]=3;
assert.equal(surfaceAt(level,56,330),320);
assert.equal(surfaceAt(level,65,330),335);
assert.equal(surfaceAt(level,97,330),321);
let b={x:56,y:300,vx:0,vy:100,w:20,h:40,ground:false};
moveBody(b,level,.2);assert.equal(b.y,320);assert.equal(b.ground,true);
b={x:88,y:270,vx:0,vy:-200,w:20,h:40,ground:false};moveBody(b,level,.2);assert.equal(b.y,230); // pass up through one-way
b={x:88,y:230,vx:0,vy:100,w:20,h:40,ground:false};moveBody(b,level,.2);assert.equal(b.y,240);
console.log('physics: solid landing, both slopes, one-way rise and landing passed');
const raised={...level,surfaceOffset:7};
assert.equal(surfaceAt(raised,56,320),313,'collision top must align with grass pixels');
b={x:88,y:220,vx:0,vy:100,w:20,h:40,ground:false};moveBody(b,raised,.2);assert.equal(b.y,233,'one-way surface uses visual offset');
for(let i=0;i<2400;i++){b.vy+=1180/120;moveBody(b,raised,1/120);assert.equal(b.y,233,'standing must not sink across repeated updates');}
b={x:88,y:260,vx:0,vy:-200,w:20,h:40,ground:false};moveBody(b,raised,.2);assert.equal(b.y,220,'offset platform still permits jumping through');
console.log('terrain alignment: 7px inset and 20s stable platform support passed');
const {blocksProjectile}=require('./physics.js');
assert.equal(blocksProjectile(level,56,325),true);
assert.equal(blocksProjectile(level,65,321),false,'above ascending slope stays open');
assert.equal(blocksProjectile(level,65,335),true,'inside ascending slope blocks shots');
assert.equal(blocksProjectile(level,97,320),false,'above descending slope stays open');
assert.equal(blocksProjectile(level,97,330),true,'inside descending slope blocks shots');
assert.equal(blocksProjectile(level,88,245),false,'one-way platform does not block shots');
console.log('projectile solid/slope terrain collision passed');
