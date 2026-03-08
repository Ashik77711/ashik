/* ═══════════════════════════════════════
   TuZhi Deco — gold-ring
   Golden sparkling royal ring
   ═══════════════════════════════════════ */
(function(){
  const cv = document.getElementById('decoCanvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  const W=160, H=160, CX=80, CY=80, R=56;

  const C1='#ffd700', C2='#ff8c00', SPARK='#fff3a0';

  /* sparkle stars */
  const stars = Array.from({length:12},(_,i)=>({
    angle: (i/12)*Math.PI*2,
    speed: 0.009 + Math.random()*0.007,
    size:  2 + Math.random()*3,
    alpha: 0.5 + Math.random()*0.5,
    orbit: R + (Math.random()-0.5)*12,
    phase: Math.random()*Math.PI*2,
    twinkle: Math.random()*Math.PI*2,
  }));

  /* extra sparkles that pop randomly */
  const pops = Array.from({length:8},()=>({
    angle:Math.random()*Math.PI*2, life:0, maxLife:30+Math.random()*40,
    orbit: R+(Math.random()-0.5)*14, size:1+Math.random()*3
  }));

  let t=0, raf;
  function draw(){
    ctx.clearRect(0,0,W,H);
    t++;

    /* outer dashed glow */
    ctx.save();
    ctx.setLineDash([6,5]);
    ctx.beginPath(); ctx.arc(CX,CY,R+5,0,Math.PI*2);
    ctx.strokeStyle=C1; ctx.lineWidth=1;
    ctx.shadowColor=C1; ctx.shadowBlur=10;
    ctx.globalAlpha=0.25; ctx.stroke(); ctx.restore();

    /* main arc */
    const a1=t*0.018, len1=Math.PI*1.3;
    ctx.save();
    ctx.beginPath(); ctx.arc(CX,CY,R,a1,a1+len1);
    ctx.strokeStyle=C1; ctx.lineWidth=5; ctx.lineCap='round';
    ctx.shadowColor=C1; ctx.shadowBlur=20;
    ctx.globalAlpha=0.95; ctx.stroke(); ctx.restore();

    /* counter arc orange */
    const a2=-t*0.014+0.5, len2=Math.PI*0.5;
    ctx.save();
    ctx.beginPath(); ctx.arc(CX,CY,R,a2,a2+len2);
    ctx.strokeStyle=C2; ctx.lineWidth=3; ctx.lineCap='round';
    ctx.shadowColor=C2; ctx.shadowBlur=14;
    ctx.globalAlpha=0.8; ctx.stroke(); ctx.restore();

    /* stars */
    stars.forEach(s=>{
      s.angle+=s.speed;
      s.twinkle+=0.09;
      const tw = 0.5+0.5*Math.sin(s.twinkle);
      const x=CX+Math.cos(s.angle)*s.orbit;
      const y=CY+Math.sin(s.angle)*s.orbit;
      /* 4-point star shape */
      ctx.save();
      ctx.translate(x,y);
      ctx.rotate(s.twinkle);
      ctx.fillStyle=SPARK; ctx.shadowColor=C1; ctx.shadowBlur=12;
      ctx.globalAlpha=s.alpha*tw;
      const r1=s.size, r2=s.size*0.4;
      ctx.beginPath();
      for(let i=0;i<8;i++){
        const a=i*Math.PI/4, r=i%2===0?r1:r2;
        i===0?ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r):ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
      }
      ctx.closePath(); ctx.fill(); ctx.restore();
    });

    /* pop sparkles */
    pops.forEach(p=>{
      p.life++;
      if(p.life>p.maxLife){ p.life=0; p.angle=Math.random()*Math.PI*2; p.orbit=R+(Math.random()-0.5)*14; }
      const prog=p.life/p.maxLife;
      const alpha=prog<0.3?prog/0.3:1-(prog-0.3)/0.7;
      const x=CX+Math.cos(p.angle)*p.orbit, y=CY+Math.sin(p.angle)*p.orbit;
      ctx.save();
      ctx.beginPath(); ctx.arc(x,y,p.size*(1-prog*0.5),0,Math.PI*2);
      ctx.fillStyle='#fff'; ctx.shadowColor=C1; ctx.shadowBlur=14;
      ctx.globalAlpha=alpha*0.9; ctx.fill(); ctx.restore();
    });

    /* head dot */
    const hx=CX+Math.cos(a1+len1)*R, hy=CY+Math.sin(a1+len1)*R;
    ctx.save();
    ctx.beginPath(); ctx.arc(hx,hy,6,0,Math.PI*2);
    ctx.fillStyle='#fff'; ctx.shadowColor=C1; ctx.shadowBlur=24;
    ctx.globalAlpha=1; ctx.fill(); ctx.restore();

    window._decoRaf = raf = requestAnimationFrame(draw);
  }
  if(window._decoRaf) cancelAnimationFrame(window._decoRaf);
  draw();
})();
