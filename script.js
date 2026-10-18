/* MODULE 1 — TWINKLING STAR FIELD */
(function StarField(){
  const canvas=document.getElementById('stars-canvas'),ctx=canvas.getContext('2d');
  let W,H;
  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight}
  window.addEventListener('resize',resize);resize();
  const PALETTES=['255,215,0','255,255,255','180,210,255','255,180,120','200,160,255'];
  const stars=Array.from({length:220},()=>({
    x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,
    r:0.4+Math.random()*1.8,col:PALETTES[Math.floor(Math.random()*PALETTES.length)],
    phase:Math.random()*Math.PI*2,speed:0.4+Math.random()*1.2
  }));
  function drawStars(){
    ctx.clearRect(0,0,W,H);const t=Date.now()/1000;
    stars.forEach(s=>{
      const alpha=0.3+0.7*(0.5+0.5*Math.sin(t*s.speed+s.phase));
      ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${s.col},${alpha.toFixed(3)})`;ctx.fill();
    });requestAnimationFrame(drawStars);
  }
  drawStars();
})();

/* MODULE 2 — FIREWORKS (4 burst types) */
(function Fireworks(){
  const canvas=document.getElementById('fireworks-canvas'),ctx=canvas.getContext('2d');
  let W,H;
  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight}
  window.addEventListener('resize',resize);resize();
  class Particle{
    constructor(x,y,hue,type){
      this.x=x;this.y=y;this.hue=hue;this.type=type||'normal';
      const angle=Math.random()*Math.PI*2;
      const spd=this.type==='ring'?(4+Math.random()*3):this.type==='star'?(3+Math.random()*5):(1.5+Math.random()*5.5);
      this.vx=Math.cos(angle)*spd;this.vy=Math.sin(angle)*spd;
      this.alpha=1;this.decay=0.010+Math.random()*0.014;
      this.radius=1.3+Math.random()*2.2;this.gravity=this.type==='ring'?0:0.055;this.trail=[];
    }
    update(){
      this.trail.push({x:this.x,y:this.y});if(this.trail.length>7)this.trail.shift();
      this.vx*=0.978;this.vy*=0.978;this.vy+=this.gravity;this.x+=this.vx;this.y+=this.vy;this.alpha-=this.decay;
    }
    draw(){
      for(let i=0;i<this.trail.length;i++){
        const a=(i/this.trail.length)*this.alpha*0.35;
        ctx.beginPath();ctx.arc(this.trail[i].x,this.trail[i].y,this.radius*0.45,0,Math.PI*2);
        ctx.fillStyle=`hsla(${this.hue},100%,65%,${a})`;ctx.fill();
      }
      const grd=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.radius*2);
      grd.addColorStop(0,`hsla(${this.hue},100%,90%,${this.alpha})`);
      grd.addColorStop(1,`hsla(${this.hue},100%,55%,0)`);
      ctx.beginPath();ctx.arc(this.x,this.y,this.radius*2,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();
      ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
      ctx.fillStyle=`hsla(${this.hue},100%,80%,${this.alpha})`;ctx.fill();
    }
  }
  class Shell{
    constructor(){
      this.x=W*0.08+Math.random()*W*0.84;this.y=H;
      this.targetY=H*0.08+Math.random()*H*0.48;
      this.vy=(this.targetY-this.y)/34;this.hue=Math.random()*360;
      this.exploded=false;this.particles=[];this.trail=[];
      this.burstType=['normal','star','ring','heart'][Math.floor(Math.random()*4)];
    }
    update(){
      if(!this.exploded){
        this.trail.push({x:this.x,y:this.y});if(this.trail.length>12)this.trail.shift();
        this.y+=this.vy;if(this.y<=this.targetY)this.explode();
      } else {this.particles=this.particles.filter(p=>p.alpha>0);this.particles.forEach(p=>p.update())}
    }
    explode(){
      this.exploded=true;const count=Math.floor((90+Math.random()*70)*(W<600?0.6:1));
      if(this.burstType==='normal'){
        for(let i=0;i<count;i++)this.particles.push(new Particle(this.x,this.y,this.hue+(Math.random()*50-25)));
      } else if(this.burstType==='star'){
        for(let i=0;i<count;i++)this.particles.push(new Particle(this.x,this.y,this.hue+(Math.random()*40-20)));
        for(let i=0;i<16;i++){const a=(i/16)*Math.PI*2;const p=new Particle(this.x,this.y,this.hue+180,'star');p.vx=Math.cos(a)*7;p.vy=Math.sin(a)*7;this.particles.push(p)}
      } else if(this.burstType==='ring'){
        for(let i=0;i<60;i++){const a=(i/60)*Math.PI*2;const p=new Particle(this.x,this.y,this.hue+(Math.random()*30-15),'ring');const spd=3.5+Math.random()*1.5;p.vx=Math.cos(a)*spd;p.vy=Math.sin(a)*spd;this.particles.push(p)}
      } else if(this.burstType==='heart'){
        for(let i=0;i<80;i++){const t=(i/80)*Math.PI*2;const hx=16*Math.pow(Math.sin(t),3);const hy=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));const p=new Particle(this.x,this.y,this.hue+(Math.random()*30-15));p.vx=hx*0.35;p.vy=hy*0.35;this.particles.push(p)}
      }
    }
    draw(){
      if(!this.exploded){
        for(let i=0;i<this.trail.length;i++){const a=(i/this.trail.length)*0.7;ctx.beginPath();ctx.arc(this.trail[i].x,this.trail[i].y,2.5,0,Math.PI*2);ctx.fillStyle=`hsla(${this.hue},100%,88%,${a})`;ctx.fill()}
      } else {this.particles.forEach(p=>p.draw())}
    }
    get done(){return this.exploded&&this.particles.length===0}
  }
  let shells=[],spawnTimer=0;
  window.launchFirework=(x,y)=>{if(shells.length>16)return;const s=new Shell();s.x=x;s.targetY=Math.min(y,H*0.6);s.vy=(s.targetY-s.y)/34;shells.push(s)};
  document.addEventListener('pointerdown',e=>{if(e.target.closest('a,button'))return;window.launchFirework(e.clientX,e.clientY)});
  function loop(){
    ctx.globalCompositeOperation='destination-out';ctx.fillStyle='rgba(0,0,0,0.18)';ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='lighter';
    spawnTimer++;if(spawnTimer>26){shells.push(new Shell());spawnTimer=0}
    if(Math.random()<0.045)shells.push(new Shell());
    shells=shells.filter(s=>!s.done);shells.forEach(s=>{s.update();s.draw()});
    requestAnimationFrame(loop);
  }
  loop();
})();

/* MODULE 3 — SCROLL HINT */
setTimeout(()=>{document.getElementById('scrollHint').classList.add('visible')},1500);

/* MODULE 4 — AGE COUNTER */
(function AgeCounter(){
  const el=document.getElementById('ageCounter'),target=25,duration=2000,startTime=performance.now();
  function tick(now){
    const p=Math.min((now-startTime)/duration,1),eased=1-Math.pow(1-p,3);
    el.textContent=Math.floor(eased*target);
    if(p<1)requestAnimationFrame(tick);else el.textContent=target;
  }
  requestAnimationFrame(tick);
})();

/* MODULE 5 — INTERSECTION OBSERVER */
(function Observers(){
  const tlObs=new IntersectionObserver((entries)=>{entries.forEach((e,i)=>{if(e.isIntersecting)setTimeout(()=>e.target.classList.add('visible'),i*80)})},{threshold:0.18});
  document.querySelectorAll('.tl-item').forEach(el=>tlObs.observe(el));
  let burst=false;const bObs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');if(e.target.id==='blessingText'&&!burst){burst=true;[0.2,0.8,0.5,0.1,0.9].forEach((p,i)=>setTimeout(()=>window.launchFirework(innerWidth*p,innerHeight*(0.25+0.15*(i%3))),i*450))}}})},{threshold:0.2});
  ['blessingText','blessingPhotos'].forEach(id=>{const el=document.getElementById(id);if(el)bObs.observe(el)});
})();

/* MODULE 6 — LIGHT-SPEED WARP LAYER */
(function Warp(){
  const cv=document.createElement('canvas'),ctx=cv.getContext('2d'),sec=document.getElementById('timeline-section');
  cv.style.cssText='position:fixed;inset:0;z-index:50;pointer-events:none;opacity:0';
  document.body.appendChild(cv);
  let W,H,lvl=0,tgt=0,axis='y',dir=1,on=false;
  const rs=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight};rs();addEventListener('resize',rs);
  const COL=['255,215,0','255,255,255','255,140,215','170,200,255'];
  const S=Array.from({length:90},()=>({u:Math.random(),v:Math.random(),f:.35+Math.random()*.65,c:COL[Math.random()*4|0]}));
  function frame(){
    lvl+=(tgt-lvl)*.3;ctx.clearRect(0,0,W,H);
    if(lvl<.01&&tgt===0){on=false;cv.style.opacity=0;sec.style.setProperty('--w',0);return}
    cv.style.opacity=1;
    S.forEach(s=>{
      s.u-=dir*(.012+lvl*.14)*s.f;if(s.u<-.4)s.u+=1.8;if(s.u>1.4)s.u-=1.8;
      const a=s.u,b=s.u+dir*lvl*.45*s.f;
      const [x1,y1,x2,y2]=axis==='y'?[s.v*W,a*H,s.v*W,b*H]:[a*W,s.v*H,b*W,s.v*H];
      const g=ctx.createLinearGradient(x1,y1,x2,y2);
      g.addColorStop(0,`rgba(${s.c},${Math.min(1,lvl*s.f*1.2)})`);g.addColorStop(1,`rgba(${s.c},0)`);
      ctx.strokeStyle=g;ctx.lineWidth=1+lvl*2*s.f;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
    });
    const v=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.25,W/2,H/2,Math.max(W,H)*.75);
    v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,`rgba(255,170,230,${lvl*.18})`);
    ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
    sec.style.setProperty('--w',lvl.toFixed(2));
    requestAnimationFrame(frame);
  }
  window.warp=(l,ax,d)=>{tgt=l;if(ax){axis=ax;dir=d}if(!on){on=true;requestAnimationFrame(frame)}};
})();

/* MODULE 6b — TIMELINE AUTO-TRAVEL (desktop: sideways, mobile: downwards) */
(function TimelineTravel(){
  const sec=document.getElementById('timeline-section'),box=document.getElementById('tlContainer'),items=[...box.querySelectorAll('.tl-item')];
  const mob=()=>innerWidth<769,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  let cur=0,anim=0,busy=false,pause=false,pauseT,timer=null,raf=0;
  const dots=document.createElement('div');dots.className='tl-dots';
  items.forEach((_,i)=>{const b=document.createElement('button');b.setAttribute('aria-label','Milestone '+(i+1));b.addEventListener('click',()=>{userAct();go(i)});dots.appendChild(b)});
  sec.appendChild(dots);
  const posOf=i=>{const el=items[i];if(mob()){const r=el.getBoundingClientRect();return scrollY+r.top-Math.max(70,(innerHeight-r.height)/2)}return el.offsetLeft+el.offsetWidth/2-box.clientWidth/2};
  const here=()=>mob()?scrollY:box.scrollLeft;
  const ease=p=>p<=0?0:p>=1?1:p<.5?Math.pow(2,20*p-10)/2:(2-Math.pow(2,10-20*p))/2;
  function finish(){busy=false;document.documentElement.style.scrollBehavior='';box.style.scrollSnapType='';window.warp(0)}
  function travel(to,ax){
    cancelAnimationFrame(anim);
    const from=ax==='y'?scrollY:box.scrollLeft,dist=Math.abs(to-from),d=to>from?1:-1;
    const set=v=>ax==='y'?scrollTo(0,v):(box.scrollLeft=v);
    if(reduce||dist<4){set(to);box.style.scrollSnapType='';return}
    const dur=Math.min(1700,900+dist*.35),t0=performance.now();
    busy=true;document.documentElement.style.scrollBehavior='auto';box.style.scrollSnapType='none';
    anim=requestAnimationFrame(function step(now){
      const p=Math.min((now-t0)/dur,1);set(from+(to-from)*ease(p));
      window.warp(Math.min(1,(ease(Math.min(p+.01,1))-ease(Math.max(p-.01,0)))/.02/6.93),ax,d);
      if(p<1)anim=requestAnimationFrame(step);else{set(to);finish()}
    });
  }
  const go=i=>{cur=i;travel(posOf(i),mob()?'y':'x')};
  function active(){
    const c=mob()?innerHeight/2:box.getBoundingClientRect().left+box.clientWidth/2;let best=0,bd=1e9;
    items.forEach((el,i)=>{const r=el.getBoundingClientRect(),d=Math.abs((mob()?r.top+r.height/2:r.left+r.width/2)-c);if(d<bd){bd=d;best=i}});
    cur=best;items.forEach((el,i)=>el.classList.toggle('active',i===best));[...dots.children].forEach((b,i)=>b.classList.toggle('on',i===best));
  }
  function tick(){
    if(pause||busy||document.hidden)return;
    active();
    if(Math.abs(posOf(cur)-here())>(mob()?innerHeight*.15:box.clientWidth*.08))return go(cur);
    if(cur<items.length-1)go(cur+1);
    else if(mob())travel(scrollY+document.getElementById('blessing').getBoundingClientRect().top,'y');
    else go(0);
  }
  const rest=()=>{clearTimeout(pauseT);pauseT=setTimeout(()=>{pause=false;active()},5000)};
  function userAct(){if(busy){cancelAnimationFrame(anim);finish()}pause=true;rest()}
  ['wheel','touchstart','pointerdown','keydown'].forEach(ev=>addEventListener(ev,userAct,{passive:true}));
  const onScroll=()=>{if(!busy&&pause)rest();if(!raf)raf=requestAnimationFrame(()=>{raf=0;active()})};
  addEventListener('scroll',onScroll,{passive:true});box.addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',active);
  let dn=0,sx=0,sl=0;
  box.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||mob())return;dn=1;sx=e.clientX;sl=box.scrollLeft;box.style.scrollSnapType='none';box.classList.add('drag')});
  addEventListener('pointermove',e=>{if(dn)box.scrollLeft=sl-(e.clientX-sx)});
  addEventListener('pointerup',()=>{if(!dn)return;dn=0;box.classList.remove('drag');active();go(cur)});
  box.addEventListener('dragstart',e=>e.preventDefault());
  new IntersectionObserver(([e])=>{if(e.isIntersecting&&!timer)timer=setInterval(tick,3500);if(!e.isIntersecting){clearInterval(timer);timer=null}},{threshold:.15}).observe(sec);
  active();
})();

/* MODULE 7 — SPARKLE TRAIL */
(function SparkleTrail(){
  const canvas=document.getElementById('sparkle-canvas'),ctx=canvas.getContext('2d');
  let W,H;
  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight}
  window.addEventListener('resize',resize);resize();
  const particles=[],COLORS=['255,215,0','255,110,199','255,180,80','200,160,255','255,255,255'];
  class Spark{
    constructor(x,y){
      this.x=x;this.y=y;const a=Math.random()*Math.PI*2,s=0.5+Math.random()*2.5;
      this.vx=Math.cos(a)*s;this.vy=Math.sin(a)*s-1.2;
      this.alpha=0.9+Math.random()*0.1;this.decay=0.025+Math.random()*0.03;
      this.r=1.5+Math.random()*3;this.col=COLORS[Math.floor(Math.random()*COLORS.length)];
    }
    update(){this.x+=this.vx;this.y+=this.vy;this.vy+=0.04;this.alpha-=this.decay}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fillStyle=`rgba(${this.col},${Math.max(this.alpha,0)})`;ctx.fill()}
  }
  function spawnSparks(x,y,count){for(let i=0;i<count;i++)particles.push(new Spark(x,y))}
  let lastMX=-1,lastMY=-1;
  document.addEventListener('mousemove',e=>{if(Math.abs(e.clientX-lastMX)+Math.abs(e.clientY-lastMY)>6){spawnSparks(e.clientX,e.clientY,4);lastMX=e.clientX;lastMY=e.clientY}});
  document.addEventListener('touchmove',e=>{Array.from(e.touches).forEach(t=>spawnSparks(t.clientX,t.clientY,5))},{passive:true});
  function loop(){
    ctx.clearRect(0,0,W,H);
    for(let i=particles.length-1;i>=0;i--){particles[i].update();particles[i].draw();if(particles[i].alpha<=0)particles.splice(i,1)}
    requestAnimationFrame(loop);
  }
  loop();
})();

/* MODULE 8 — POLISH: dim fireworks outside hero, hide broken images */
(function Polish(){
  const fc=document.getElementById('fireworks-canvas'),hero=document.getElementById('hero');
  fc.style.transition='opacity 1s';
  new IntersectionObserver(([e])=>{fc.style.opacity=e.isIntersecting?1:0.4},{threshold:0.2}).observe(hero);
  document.querySelectorAll('img').forEach(i=>{const f=()=>{i.style.opacity=0};if(i.complete&&!i.naturalWidth)f();i.addEventListener('error',f)});
})();
