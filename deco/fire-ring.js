/* ═══════════════════════════════════════
   TuZhi Deco — fire-ring
   Red-orange fire & ember ring
   ═══════════════════════════════════════ */
(function(){
  const cv = document.getElementById('decoCanvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  const W=160, H=160, CX=80, CY=80, R=56;

  /* embers */
  const embers = Array.from({length:22},(_,i)=>({
    angle: Math.random()*Math.PI*2,
    speed: 0.014 + Math.random()*0.012,
    size:  1.2 + Math.random()*2.8,
    alpha: 0.4 + Math.random()*0.55,
    orbit: R + (Math.random()-0.5)*13,
    phase: Math.random()*Math.PI*2,
    hue:   10 + Math.random()*30,     /* red → orange */
  }));

  /* flame tongues — fixed positions, wave up */
  const flames = Array.from({length:10},(_,i)=>({
    base: (i/10)*Math.PI*2,
    height: 5 + Math.random()*9,
    phase: Math.random()*Math.PI*2,
    speed: 0.06 + Math.random()*0.05,
  }));

  let t=0, raf;
  function draw(){
    ctx.clearRect(0,0,W,H);
    t++;

    /* base glow ring */
    ctx.save();
    ctx.beginPath(); ctx.arc(CX,CY,R,0,Math.PI*2);
    ctx.strokeStyle='#ff4400'; ctx.lineWidth=2;
    ctx.shadowColor='#ff4400'; ctx.shadowBlur=22;
    ctx.globalAlpha=0.3; ctx.stroke(); ctx.restore();

    /* main fire arc */
    const a1=t*0.03, len1=Math.PI*1.05;
    ctx.save();
    ctx.beginPath(); ctx.arc(CX,CY,R,a1,a1+len1);
    ctx.strokeStyle='#ff4400'; ctx.lineWidth=5; ctx.lineCap='round';
    ctx.shadowColor='#ff6600'; ctx.shadowBlur=26;
    ctx.globalAlpha=0.92; ctx.stroke(); ctx.restore();

    /* inner orange arc */
    const a3=a1+0.2, len3=Math.PI*0.8;
    ctx.save();
    ctx.beginPath(); ctx.arc(CX,CY,R-3,a3,a3+len3);
    ctx.strokeStyle='#ff9900'; ctx.lineWidth=2.5; ctx.lineCap='round';
    ctx.shadowColor='#ff9900'; ctx.shadowBlur=14;
    ctx.globalAlpha=0.7; ctx.stroke(); ctx.restore();

    /* counter arc */
    const a2=-t*0.02+Math.PI*1.3, len2=Math.PI*0.35;
    ctx.save();
    ctx.beginPath(); ctx.arc(CX,CY,R,a2,a2+len2);
    ctx.strokeStyle='#ffcc00'; ctx.lineWidth=3; ctx.lineCap='round';
    ctx.shadowColor='#ffcc00'; ctx.shadowBlur=16;
    ctx.globalAlpha=0.75; ctx.stroke(); ctx.restore();

    /* flame tongues */
    flames.forEach(fl=>{
      fl.phase+=fl.speed;
      const ang=fl.base+t*0.025;
      const flare=fl.height*(0.6+0.4*Math.sin(fl.phase));
      const bx=CX+Math.cos(ang)*R, by=CY+Math.sin(ang)*R;
      const ox=CX+Math.cos(ang)*(R+flare), oy=CY+Math.sin(ang)*(R+flare);
      ctx.save();
      const grd=ctx.createLinearGradient(bx,by,ox,oy);
      grd.addColorStop(0,'rgba(255,100,0,0.8)');
      grd.addColorStop(1,'rgba(255,220,0,0)');
      ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(ox,oy);
      ctx.strokeStyle=grd; ctx.lineWidth=2.5+Math.random();
      ctx.shadowColor='#ff6600'; ctx.shadowBlur=10;
      ctx.globalAlpha=0.55+0.2*Math.sin(fl.phase); ctx.stroke(); ctx.restore();
    });

    /* embers */
    embers.forEach(e=>{
      e.angle+=e.speed;
      const pw=0.65+0.35*Math.sin(t*0.08+e.phase);
      const x=CX+Math.cos(e.angle)*e.orbit;
      const y=CY+Math.sin(e.angle)*e.orbit;
      ctx.save();
      ctx.beginPath(); ctx.arc(x,y,e.size*pw,0,Math.PI*2);
      ctx.fillStyle=`hsl(${e.hue},100%,60%)`;
      ctx.shadowColor=`hsl(${e.hue},100%,55%)`; ctx.shadowBlur=10;
      ctx.globalAlpha=e.alpha*pw; ctx.fill(); ctx.restore();
    });

    /* bright head */
    const hx=CX+Math.cos(a1+len1)*R, hy=CY+Math.sin(a1+len1)*R;
    ctx.save();
    ctx.beginPath(); ctx.arc(hx,hy,6,0,Math.PI*2);
    ctx.fillStyle='#fff'; ctx.shadowColor='#ffaa00'; ctx.shadowBlur=24;
    ctx.globalAlpha=1; ctx.fill(); ctx.restore();

    window._decoRaf = raf = requestAnimationFrame(draw);
  }
  if(window._decoRaf) cancelAnimationFrame(window._decoRaf);
  draw();
})();
