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

/* MODULE 6 — TIMELINE AUTO-SCROLL */
(function TimelineAuto(){
  const items=Array.from(document.querySelectorAll('.tl-item'));
  const container=document.getElementById('tlContainer');
  let current=0,timer=null,holding=false,userScrolled=false;
  function isMobile(){return window.innerWidth<769}
  function scrollToItem(idx){
    if(idx<0||idx>=items.length)return;
    const el=items[idx];
    if(isMobile()){el.scrollIntoView({behavior:'smooth',block:'center'})}
    else{const target=el.offsetLeft-container.offsetWidth/2+el.offsetWidth/2;container.scrollTo({left:target,behavior:'smooth'})}
  }
  function startTimer(){if(timer)return;timer=setInterval(()=>{if(holding||userScrolled)return;if(isMobile()&&current>=items.length-1){stopTimer();return}current=(current+1)%items.length;scrollToItem(current)},4000)}
  function stopTimer(){if(timer){clearInterval(timer);timer=null}}
  let scrollEndT;
  const onScroll=()=>{userScrolled=true;clearTimeout(scrollEndT);scrollEndT=setTimeout(()=>{userScrolled=false;const c=items.map(i=>{const r=i.getBoundingClientRect();return isMobile()?Math.abs(r.top+r.height/2-innerHeight/2):Math.abs(r.left+r.width/2-innerWidth/2)});current=c.indexOf(Math.min(...c))},2800)};
  window.addEventListener('scroll',onScroll,{passive:true});
  container.addEventListener('scroll',onScroll,{passive:true});
  ['mousedown','touchstart'].forEach(ev=>container.addEventListener(ev,()=>{holding=true},{passive:true}));
  ['mouseup','touchend','touchcancel'].forEach(ev=>document.addEventListener(ev,()=>{holding=false},{passive:true}));
  const sObs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting)startTimer();else stopTimer()})},{threshold:0.1});
  sObs.observe(document.getElementById('timeline-section'));
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
