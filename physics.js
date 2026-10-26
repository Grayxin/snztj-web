(function(root){
  function attr(level,tx,ty){return tx<0||tx>=level.width||ty<0||ty>=level.height?0:level.attrs[ty*level.width+tx];}
  function surfaceAt(level,x,y){
    const offset=level.surfaceOffset||0,tx=Math.floor(x/16),ty=Math.floor((y+offset)/16),a=attr(level,tx,ty),local=x-tx*16;
    return a===1||a===33?ty*16-offset:a===2?ty*16+16-local-offset:a===3?ty*16+local-offset:Infinity;
  }
  // Feet-based bodies; slopes and one-way platforms use swept downward crossings.
  function moveBody(b,level,dt){
    const offset=level.surfaceOffset||0,oldY=b.y; const nextX=Math.max(b.w/2,Math.min(level.width*16-b.w/2,b.x+b.vx*dt));
    if(b.vx){
      const edge=nextX+Math.sign(b.vx)*b.w/2,tx=Math.floor(edge/16);
      let wall=false;
      for(let y=b.y-b.h+4;y<b.y-10;y+=8) if(attr(level,tx,Math.floor((y+offset)/16))===1) wall=true;
      if(wall){b.x=b.vx>0?tx*16-b.w/2:(tx+1)*16+b.w/2;b.vx=0;}else b.x=nextX;
    }else b.x=nextX;
    let target=b.y+b.vy*dt;b.ground=false;
    if(b.vy>=0){
      let floor=Infinity;
      for(let y=Math.floor((oldY-9+offset)/16);y<=Math.floor((target+offset)/16);y++){
        for(const x of [b.x-b.w*.35,b.x,b.x+b.w*.35]){
          const s=surfaceAt(level,x,y*16-offset+1);
          if(s>=oldY-9&&s<=target&&s<floor)floor=s;
        }
      }
      if(floor!==Infinity){target=floor;b.vy=0;b.ground=true;}
    }else{
      const top=target-b.h;
      for(const x of [b.x-b.w*.4,b.x+b.w*.4]){
        const tx=Math.floor(x/16),ty=Math.floor((top+offset)/16);
        if(attr(level,tx,ty)===1){target=(ty+1)*16-offset+b.h;b.vy=0;break;}
      }
    }
    b.y=target;
  }
  function blocksProjectile(level,x,y){
    const a=attr(level,Math.floor(x/16),Math.floor((y+(level.surfaceOffset||0))/16));
    return a===1||((a===2||a===3)&&y>=surfaceAt(level,x,y));
  }
  const api={surfaceAt,moveBody,attr,blocksProjectile};if(typeof module!=='undefined')module.exports=api;else root.MysticPhysics=api;
})(globalThis);
