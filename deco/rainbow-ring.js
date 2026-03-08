/* ═══════════════════════════════════════
   TuZhi Deco — rainbow-ring
   Slowly shifting rainbow ring
   ═══════════════════════════════════════ */
(function(){
  const cv = document.getElementById('decoCanvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  const W=160, H=160, CX=80, CY=80, R=56;

  const parts = Array.from({length:24},(_,i)=>({
    angle: (i/24)*Math.PI*2,
    speed: 0.01 + Math.random()*0.009,
    size:  1.5 + Math.random()*2.5,
    alpha: 0.4 + Math.random()*0.55,
    orbit: R + (Math.random()-0.5)*10,
    phase: Math.random()*Math.PI*2,
    hueOffset: Math.random()*360,
  }));

  let t=0, raf;
  const hsl=(h,s,l)=>`hsl(${h%360},${s}%,${l}%)`;

  function draw(){
    ctx.clearRect(0,0,W,H);
    t++;
    const baseHue = t*0.4;

    /* rainbow ring — drawn as segments */
    const SEG=60;
    for(let i=0;i<SEG;i++){
      const a  = (i/SEG)*Math.PI*2;
      const a2 = ((i+1)/SEG)*Math.PI*2;
      const h  = (baseHue + (i/SEG)*360)%360;
      ctx.save();
      ctx.beginPath(); ctx.arc(CX,CY,R,a,a2);
      ctx.strokeStyle = hsl(h,95,65);
      ctx.lineWidth   = 4.5; ctx.lineCap='butt';
      ctx.shadowColor = hsl(h,95,65); ctx.shadowBlur=16;
      ctx.globalAlpha = 0.88; ctx.stroke(); ctx.restore();
    }

    /* outer shimmer ring */
    ctx.save();
    ctx.beginPath(); ctx.arc(CX,CY,R+5,0,Math.PI*2);
    ctx.strokeStyle=hsl(baseHue,90,70); ctx.lineWidth=1;
    ctx.shadowColor=hsl(baseHue,90,70); ctx.shadowBlur=14;
    ctx.globalAlpha=0.2; ctx.stroke(); ctx.restore();

    /* rotating bright arc */
    const a1=t*0.02, len1=Math.PI*0.6;
    ctx.save();
    ctx.beginPath(); ctx.arc(CX,CY,R,a1,a1+len1);
    ctx.strokeStyle='#ffffff'; ctx.lineWidth=2; ctx.lineCap='round';
    ctx.shadowColor='#ffffff'; ctx.shadowBlur=18;
    ctx.globalAlpha=0.35; ctx.stroke(); ctx.restore();

    /* rainbow particles */
    parts.forEach(p=>{
      p.angle+=p.speed;
      const pw=0.65+0.35*Math.sin(t*0.07+p.phase);
      const h=(baseHue+p.hueOffset)%360;
      const x=CX+Math.cos(p.angle)*p.orbit;
      const y=CY+Math.sin(p.angle)*p.orbit;
      ctx.save();
      ctx.beginPath(); ctx.arc(x,y,p.size*pw,0,Math.PI*2);
      ctx.fillStyle=hsl(h,90,70); ctx.shadowColor=hsl(h,90,70); ctx.shadowBlur=10;
      ctx.globalAlpha=p.alpha*pw; ctx.fill(); ctx.restore();
    });

    /* bright head */
    const hx=CX+Math.cos(a1+len1)*R, hy=CY+Math.sin(a1+len1)*R;
    ctx.save();
    ctx.beginPath(); ctx.arc(hx,hy,5.5,0,Math.PI*2);
    ctx.fillStyle='#fff'; ctx.shadowColor=hsl(baseHue,100,70); ctx.shadowBlur=22;
    ctx.globalAlpha=0.95; ctx.fill(); ctx.restore();

    window._decoRaf = raf = requestAnimationFrame(draw);
  }
  if(window._decoRaf) cancelAnimationFrame(window._decoRaf);
  draw();
})();
