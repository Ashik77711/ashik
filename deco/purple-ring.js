/* ═══════════════════════════════════════
   TuZhi Deco — purple-ring
   Animated purple & pink glowing ring
   ═══════════════════════════════════════ */
(function(){
  const cv = document.getElementById('decoCanvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  const W=160, H=160, CX=80, CY=80, R=56;

  const C1='#cc44ff', C2='#ff44aa', SPARK='#f0aaff';

  const parts = Array.from({length:18},(_,i)=>({
    angle: (i/18)*Math.PI*2,
    speed: 0.011 + Math.random()*0.01,
    size:  1.5 + Math.random()*2.8,
    alpha: 0.35 + Math.random()*0.6,
    orbit: R + (Math.random()-0.5)*10,
    phase: Math.random()*Math.PI*2,
  }));

  let t=0, raf;
  function draw(){
    ctx.clearRect(0,0,W,H);
    t++;

    /* base glow */
    ctx.save();
    ctx.beginPath(); ctx.arc(CX,CY,R,0,Math.PI*2);
    ctx.strokeStyle=C1; ctx.lineWidth=2;
    ctx.shadowColor=C1; ctx.shadowBlur=20;
    ctx.globalAlpha=0.25; ctx.stroke(); ctx.restore();

    /* main arc */
    const a1=t*0.022, len1=Math.PI*1.2;
    ctx.save();
    ctx.beginPath(); ctx.arc(CX,CY,R,a1,a1+len1);
    ctx.strokeStyle=C1; ctx.lineWidth=5; ctx.lineCap='round';
    ctx.shadowColor=C1; ctx.shadowBlur=24;
    ctx.globalAlpha=0.9; ctx.stroke(); ctx.restore();

    /* pink trailing arc */
    const a2=-t*0.015+Math.PI, len2=Math.PI*0.55;
    ctx.save();
    ctx.beginPath(); ctx.arc(CX,CY,R,a2,a2+len2);
    ctx.strokeStyle=C2; ctx.lineWidth=3; ctx.lineCap='round';
    ctx.shadowColor=C2; ctx.shadowBlur=18;
    ctx.globalAlpha=0.8; ctx.stroke(); ctx.restore();

    /* pulsing dots around ring */
    for(let i=0;i<6;i++){
      const ang = a1 + (i/6)*Math.PI*2 + t*0.01;
      const px  = CX+Math.cos(ang)*R, py=CY+Math.sin(ang)*R;
      const alf = 0.3+0.3*Math.sin(t*0.07+i);
      ctx.save();
      ctx.beginPath(); ctx.arc(px,py,3,0,Math.PI*2);
      ctx.fillStyle=C2; ctx.shadowColor=C2; ctx.shadowBlur=12;
      ctx.globalAlpha=alf; ctx.fill(); ctx.restore();
    }

    /* particles */
    parts.forEach(p=>{
      p.angle+=p.speed;
      const px=0.7+0.3*Math.sin(t*0.06+p.phase);
      const x=CX+Math.cos(p.angle)*p.orbit;
      const y=CY+Math.sin(p.angle)*p.orbit;
      ctx.save();
      ctx.beginPath(); ctx.arc(x,y,p.size*px,0,Math.PI*2);
      ctx.fillStyle=SPARK; ctx.shadowColor=SPARK; ctx.shadowBlur=10;
      ctx.globalAlpha=p.alpha*px; ctx.fill(); ctx.restore();
    });

    /* head dot */
    const hx=CX+Math.cos(a1+len1)*R, hy=CY+Math.sin(a1+len1)*R;
    ctx.save();
    ctx.beginPath(); ctx.arc(hx,hy,6,0,Math.PI*2);
    ctx.fillStyle='#fff'; ctx.shadowColor=C1; ctx.shadowBlur=22;
    ctx.globalAlpha=1; ctx.fill(); ctx.restore();

    window._decoRaf = raf = requestAnimationFrame(draw);
  }
  if(window._decoRaf) cancelAnimationFrame(window._decoRaf);
  draw();
})();
