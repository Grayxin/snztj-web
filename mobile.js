/* Mobile presentation only; the 640x480 world and input coordinates stay intact. */
(function(root){
 'use strict';
 function layout(w,h,coarse,insets={}){
  const mobile=(coarse&&Math.min(w,h)<=820)||w<=600,rotated=mobile&&h>w;
  const width=rotated?h:w,height=rotated?w:h,rail=Math.max(60,Math.min(100,width*.115));
  const safe={};for(const side of ['left','right','top','bottom'])safe[side]=Math.max(0,Number(insets[side])||0);
  const availableWidth=Math.max(1,width-safe.left-safe.right-2*rail),availableHeight=Math.max(1,height-safe.top-safe.bottom);
  const canvasWidth=Math.min(availableWidth,availableHeight*4/3),canvasHeight=canvasWidth*3/4;
  const canvasLeft=safe.left+(width-safe.left-safe.right-canvasWidth)/2,canvasTop=safe.top+(availableHeight-canvasHeight)/2;
  return {mobile,rotated,width,height,rail,canvasWidth,canvasHeight,canvasLeft,canvasTop};
 }
 async function enter(target,screen){
  try{if(!target.requestFullscreen)return false;await target.requestFullscreen();}
  catch{return false;}
  try{await screen.orientation?.lock?.('landscape');}catch{/* CSS rotation is the fallback. */}
  return true;
 }
 function install(win,doc){
  const shell=doc.querySelector('#play-shell'),full=doc.querySelector('#fullscreen'),start=doc.querySelector('#start'),arcade=doc.querySelector('.arcade');
  let current;
  const sync=()=>{
   const v=win.visualViewport,currentWidth=v?.width||win.innerWidth,currentHeight=v?.height||win.innerHeight;
   current=layout(currentWidth,currentHeight,win.matchMedia('(pointer: coarse)').matches);
   doc.documentElement.classList.toggle('mobile-game',current.mobile);
   shell.classList.toggle('rotated',current.rotated);
   // Read safe areas after selecting portrait/landscape CSS, then set definite pixel
   // sizes. This avoids WebKit's nested auto-height/percentage sizing path entirely.
   const padding=arcade&&win.getComputedStyle?win.getComputedStyle(arcade):{};
   current=layout(currentWidth,currentHeight,win.matchMedia('(pointer: coarse)').matches,{
    left:parseFloat(padding.paddingLeft),right:parseFloat(padding.paddingRight),top:parseFloat(padding.paddingTop),bottom:parseFloat(padding.paddingBottom)
   });
   for(const [key,value]of Object.entries({width:current.width,height:current.height,rail:current.rail,'canvas-width':current.canvasWidth,'canvas-height':current.canvasHeight,'canvas-left':current.canvasLeft,'canvas-top':current.canvasTop}))shell.style.setProperty(`--play-${key}`,`${value}px`);
   // Center inside the visual viewport, including browser toolbar changes.
   shell.style.setProperty('--view-x',`${(v?.offsetLeft||0)+currentWidth/2}px`);
   shell.style.setProperty('--view-y',`${(v?.offsetTop||0)+currentHeight/2}px`);
   full.textContent=doc.fullscreenElement?'退出全屏':'全屏 ↗';
  };
  // Fullscreen the root: browsers reset transforms on the fullscreen element itself.
  // Keeping the rotated shell below it preserves the iOS/unsupported-lock fallback.
  start.addEventListener('click',()=>{if(current.mobile&&!doc.fullscreenElement)void enter(doc.documentElement,win.screen);});
  full.addEventListener('click',async()=>{
   if(doc.fullscreenElement){try{await doc.exitFullscreen();}catch{}return;}
   const ok=await enter(current.mobile?doc.documentElement:doc.querySelector('#screen'),win.screen);
   if(!ok){const hint=doc.querySelector('#toast');hint.textContent=current.mobile?'已使用横屏布局 · 横握手机即可游玩':'当前浏览器不支持全屏';hint.classList.add('show');win.setTimeout(()=>hint.classList.remove('show'),3000);}
  });
  win.addEventListener('resize',sync);win.visualViewport?.addEventListener('resize',sync);
  win.visualViewport?.addEventListener('scroll',sync);doc.addEventListener('fullscreenchange',sync);
  win.addEventListener('pageshow',sync);
  sync();
 }
 const api={layout,enter,install};
 if(typeof module==='object'&&module.exports)module.exports=api;
 else{root.MysticMobile=api;install(root,root.document);}
})(typeof window==='object'?window:globalThis);
