/* ═══════════════════════════════════════════════
   TuZhi Deco — spooky-ring  v3
   Evil red-dark creature ring
   • Eyes BLINK independently per creature
   • Glow CONSTANT — never fades out
   • Extra effects: blood drip animation, eyelid blink, ember particles
   ═══════════════════════════════════════════════ */
(function(){
  const cv = document.getElementById('decoCanvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  const W=160, H=160, CX=80, CY=80;

  const BLK  = '#0a0005';
  const DARK = '#180008';
  const D2   = '#200010';
  const RED  = '#cc0000';
  const RED2 = '#ff2200';
  const BLD  = '#8b0000';
  const WH   = '#ffffff';

  const INNER = 56;

  let t = 0, raf;

  /* ════════════════════════════════════════
     BLINK SYSTEM
     Each eye group has independent blink timer.
     blink() returns eyelid close ratio 0..1
     (0=open, 1=fully closed)
  ════════════════════════════════════════ */
  function makeBlinker(interval, dur){
    /* interval = frames between blinks, dur = blink duration frames */
    return { phase:Math.floor(Math.random()*interval), interval, dur };
  }
  function blinkVal(b){
    const f = (t + b.phase) % b.interval;
    if(f > b.dur) return 0;          /* open */
    const h = b.dur * 0.5;
    return f < h ? f/h : (b.dur-f)/h; /* 0→1→0 triangle */
  }

  /* Individual blinkers per creature */
  const BLINK = {
    skull : makeBlinker(140, 7),
    ghost : makeBlinker(190, 8),
    demon : makeBlinker(160, 6),
    wing  : makeBlinker(220, 9),
    eye   : makeBlinker(110, 5),   /* floating eyeball */
    cat   : makeBlinker(170, 8),
  };

  /* ════════════════════════════════════════
     CONSTANT GLOW — min 0.82, pulse above
  ════════════════════════════════════════ */
  /* gGlow never goes below 0.82 */
  let gGlow = 0.9;

  const sv = ctx.save.bind(ctx);
  const rs = ctx.restore.bind(ctx);

  function fill(color, blur, alpha){
    ctx.fillStyle   = color;
    ctx.shadowColor = color;
    ctx.shadowBlur  = Math.max(blur||0, 0);
    ctx.globalAlpha = Math.min(Math.max(alpha||1, 0), 1);
  }
  function stk(color, lw, blur, alpha){
    ctx.strokeStyle = color;
    ctx.lineWidth   = lw   || 1;
    ctx.shadowColor = color;
    ctx.shadowBlur  = blur || 0;
    ctx.globalAlpha = Math.min(Math.max(alpha||1, 0), 1);
  }
  function p2c(a,r){ return [CX+Math.cos(a)*r, CY+Math.sin(a)*r]; }

  /* ── EYELID BLINK helper ──
     Draws a filled eyelid arc over the eye.
     bv = blink value 0(open)..1(closed)             */
  function drawEyelid(x,y,r,bv,colorBody){
    if(bv < 0.02) return;
    sv();
    /* eyelid closes downward — clip to upper semicircle */
    ctx.beginPath();
    ctx.arc(x, y, r+0.5, Math.PI, 0);              /* top arc */
    ctx.lineTo(x+r+0.5, y + (r+0.5)*2*bv - (r+0.5));
    ctx.arc(x, y + (r+0.5)*2*bv - (r+0.5),
            r+0.5, 0, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle   = colorBody || DARK;
    ctx.shadowBlur  = 0;
    ctx.globalAlpha = 1;
    ctx.fill();
    /* thin red eyelid line */
    ctx.beginPath();
    ctx.arc(x, y + (r+0.5)*2*bv - (r+0.5), r+0.5, Math.PI*1.05, Math.PI*1.95);
    ctx.strokeStyle = RED2;
    ctx.lineWidth   = 0.8;
    ctx.shadowColor = RED2;
    ctx.shadowBlur  = 6;
    ctx.globalAlpha = 0.85;
    ctx.stroke();
    rs();
  }

  /* ── X-EYE with blink ── */
  function xEye(x,y,r,blinker,bodyColor){
    const bv = blinkVal(blinker);
    sv();
    /* outer glow — CONSTANT */
    fill(RED2, 16, 0.55);
    ctx.beginPath(); ctx.arc(x,y,r+2,0,Math.PI*2); ctx.fill();
    /* white */
    fill(WH, 0, 1);
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    /* red iris */
    fill(RED2, 8, 0.95);
    ctx.beginPath(); ctx.arc(x,y,r*0.62,0,Math.PI*2); ctx.fill();
    /* black pupil */
    fill(BLK, 0, 1);
    ctx.beginPath(); ctx.arc(x,y,r*0.28,0,Math.PI*2); ctx.fill();
    /* X slash */
    ctx.strokeStyle=BLD; ctx.lineWidth=r*0.5; ctx.lineCap='round';
    ctx.shadowColor=RED2; ctx.shadowBlur=6; ctx.globalAlpha=0.9;
    const o=r*0.52;
    ctx.beginPath(); ctx.moveTo(x-o,y-o); ctx.lineTo(x+o,y+o); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+o,y-o); ctx.lineTo(x-o,y+o); ctx.stroke();
    /* highlight */
    fill(WH,0,0.85);
    ctx.beginPath(); ctx.arc(x-r*0.28,y-r*0.3,r*0.18,0,Math.PI*2); ctx.fill();
    rs();
    /* eyelid on top */
    drawEyelid(x,y,r,bv,bodyColor||DARK);
  }

  /* ── HOLLOW DOT-EYE with blink ── */
  function hollowEye(x,y,r,blinker,bodyColor){
    const bv = blinkVal(blinker);
    sv();
    fill(RED2,14,0.5);
    ctx.beginPath(); ctx.arc(x,y,r+1.5,0,Math.PI*2); ctx.fill();
    fill(WH,0,0.92);
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    fill(RED2,7,0.9);
    ctx.beginPath(); ctx.arc(x,y,r*0.6,0,Math.PI*2); ctx.fill();
    fill(BLK,0,1);
    ctx.beginPath(); ctx.arc(x,y,r*0.3,0,Math.PI*2); ctx.fill();
    rs();
    drawEyelid(x,y,r,bv,bodyColor||DARK);
  }

  /* blood drip static */
  function drip(x,y,len,w){
    sv();
    fill(BLD, 4, 0.9);
    ctx.beginPath();
    ctx.moveTo(x-w,y);
    ctx.quadraticCurveTo(x-w*1.8,y+len*0.6,x,y+len);
    ctx.quadraticCurveTo(x+w*1.8,y+len*0.6,x+w,y);
    ctx.closePath(); ctx.fill();
    /* drip glow tip */
    fill(RED2, 7, 0.75);
    ctx.beginPath(); ctx.arc(x,y+len,w*1.1,0,Math.PI*2); ctx.fill();
    rs();
  }

  /* animated blood drip — elongates over time */
  const DRIPS = [
    { x:80,  base:21, len:0, maxLen:9,  speed:0.06, w:1.8, wait:80  },
    { x:72,  base:22, len:0, maxLen:7,  speed:0.05, w:1.5, wait:160 },
    { x:88,  base:21, len:0, maxLen:8,  speed:0.055,w:1.6, wait:220 },
    { x:CX,  base:CY+INNER, len:0, maxLen:11, speed:0.07, w:2, wait:100 },
  ];
  function updateDrips(){
    DRIPS.forEach(d=>{
      if(t < d.wait){ d.len=0; return; }
      d.len = Math.min(d.len + d.speed, d.maxLen);
      if(d.len >= d.maxLen){ d.len=0; d.wait=t+80+Math.random()*120; }
    });
  }
  function drawDrips(){
    DRIPS.forEach(d=>{
      if(d.len < 0.5) return;
      drip(d.x, d.base, d.len, d.w);
    });
  }

  /* ═══ CREATURES ═══ */

  function drawSkull(g){
    sv();
    const sx=80, sy=10;
    fill(DARK,8,1);
    ctx.beginPath(); ctx.arc(sx,sy,11,0,Math.PI*2); ctx.fill();
    /* jaw */
    fill(DARK,5,1);
    ctx.beginPath();
    ctx.moveTo(sx-8,sy+6);
    ctx.bezierCurveTo(sx-9,sy+14,sx-5,sy+18,sx,sy+18);
    ctx.bezierCurveTo(sx+5,sy+18,sx+9,sy+14,sx+8,sy+6);
    ctx.fill();
    /* teeth */
    fill(WH,4,0.9);
    [-5,-1.5,2,5.5].forEach(ox=>{
      ctx.beginPath();
      ctx.moveTo(sx+ox,sy+11); ctx.lineTo(sx+ox+1.5,sy+16); ctx.lineTo(sx+ox+3,sy+11);
      ctx.fill();
    });
    fill(RED2,3,0.6);
    ctx.beginPath(); ctx.arc(sx-3,sy+15,1.5,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(sx+4,sy+15,1.5,0,Math.PI*2); ctx.fill();
    /* eyes */
    xEye(sx-5,sy-1,3.5,BLINK.skull,DARK);
    xEye(sx+5,sy-1,3.5,BLINK.skull,DARK);
    /* cracks */
    sv(); stk(RED2,0.7,6,0.6);
    ctx.beginPath(); ctx.moveTo(sx,sy-9); ctx.lineTo(sx-2,sy-4); ctx.lineTo(sx+1,sy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx+6,sy-7); ctx.lineTo(sx+4,sy-3); ctx.stroke();
    rs();
    /* connect left */
    fill(DARK,5,1);
    ctx.beginPath();
    ctx.moveTo(sx-10,sy+2);
    ctx.bezierCurveTo(sx-22,sy,sx-30,sy+8,sx-28,sy+18);
    ctx.bezierCurveTo(sx-24,sy+14,sx-18,sy+10,sx-10,sy+10);
    ctx.fill();
    /* connect right */
    fill(DARK,5,1);
    ctx.beginPath();
    ctx.moveTo(sx+10,sy+2);
    ctx.bezierCurveTo(sx+22,sy,sx+30,sy+8,sx+28,sy+18);
    ctx.bezierCurveTo(sx+24,sy+14,sx+18,sy+10,sx+10,sy+10);
    ctx.fill();
    rs();
  }

  function drawGhost(g){
    sv();
    const gx=136,gy=76;
    fill(D2,8,1);
    ctx.beginPath();
    ctx.moveTo(gx-8,gy-18);
    ctx.bezierCurveTo(gx+6,gy-22,gx+16,gy-12,gx+14,gy+2);
    ctx.bezierCurveTo(gx+14,gy+14,gx+8,gy+22,gx,gy+20);
    ctx.bezierCurveTo(gx-10,gy+20,gx-16,gy+12,gx-14,gy);
    ctx.bezierCurveTo(gx-14,gy-10,gx-8,gy-18,gx-8,gy-18);
    ctx.fill();
    fill(D2,4,1);
    ctx.beginPath();
    ctx.moveTo(gx-14,gy+12);
    ctx.bezierCurveTo(gx-14,gy+22,gx-8,gy+26,gx-4,gy+22);
    ctx.bezierCurveTo(gx-2,gy+26,gx+4,gy+28,gx+8,gy+24);
    ctx.bezierCurveTo(gx+10,gy+28,gx+14,gy+26,gx+14,gy+20);
    ctx.fill();
    /* horns */
    fill(BLD,4,1);
    ctx.beginPath(); ctx.moveTo(gx-8,gy-18); ctx.lineTo(gx-12,gy-28); ctx.lineTo(gx-4,gy-20); ctx.fill();
    ctx.beginPath(); ctx.moveTo(gx+2,gy-20); ctx.lineTo(gx+8,gy-30); ctx.lineTo(gx+10,gy-20); ctx.fill();
    /* eyes */
    xEye(gx-5,gy-2,4,BLINK.ghost,D2);
    xEye(gx+5,gy-4,4,BLINK.ghost,D2);
    /* blood tears */
    sv(); stk(RED2,1,5,0.7);
    ctx.beginPath(); ctx.moveTo(gx-5,gy+2); ctx.lineTo(gx-6,gy+10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(gx+5,gy); ctx.lineTo(gx+6,gy+8); ctx.stroke();
    rs();
    rs();
  }

  function drawDemon(g){
    sv();
    const dx=118,dy=118;
    fill(DARK,7,1);
    ctx.beginPath();
    ctx.moveTo(dx,dy-12);
    ctx.bezierCurveTo(dx+12,dy-14,dx+18,dy-4,dx+16,dy+8);
    ctx.bezierCurveTo(dx+14,dy+16,dx+6,dy+18,dx,dy+16);
    ctx.bezierCurveTo(dx-8,dy+16,dx-14,dy+8,dx-12,dy);
    ctx.bezierCurveTo(dx-10,dy-8,dx-4,dy-12,dx,dy-12);
    ctx.fill();
    fill(BLD,4,1);
    ctx.beginPath(); ctx.moveTo(dx-6,dy-12); ctx.lineTo(dx-9,dy-20); ctx.lineTo(dx-2,dy-13); ctx.fill();
    ctx.beginPath(); ctx.moveTo(dx+4,dy-12); ctx.lineTo(dx+8,dy-20); ctx.lineTo(dx+10,dy-12); ctx.fill();
    hollowEye(dx-4,dy,3.5,BLINK.demon,DARK);
    hollowEye(dx+4,dy-2,3.5,BLINK.demon,DARK);
    sv(); stk(RED,1.5,5,0.85);
    ctx.beginPath();
    ctx.moveTo(dx-4,dy+8);
    ctx.bezierCurveTo(dx-2,dy+12,dx+2,dy+12,dx+4,dy+8);
    ctx.stroke();
    rs();
    rs();
  }

  function drawBottomMass(g){
    sv();
    fill(DARK,8,1);
    ctx.beginPath();
    ctx.moveTo(60,140);
    ctx.bezierCurveTo(50,148,40,146,38,136);
    ctx.bezierCurveTo(36,126,46,120,56,124);
    ctx.bezierCurveTo(60,116,70,114,76,118);
    ctx.bezierCurveTo(84,114,92,116,94,124);
    ctx.bezierCurveTo(102,120,112,126,110,136);
    ctx.bezierCurveTo(108,146,98,148,90,140);
    ctx.bezierCurveTo(82,148,72,150,66,144);
    ctx.bezierCurveTo(64,148,60,148,60,140);
    ctx.fill();
    /* ears */
    fill(DARK,4,1);
    ctx.beginPath(); ctx.moveTo(56,124); ctx.lineTo(50,112); ctx.lineTo(60,118); ctx.fill();
    fill(BLD,3,0.7);
    ctx.beginPath(); ctx.moveTo(56,122); ctx.lineTo(52,114); ctx.lineTo(59,119); ctx.fill();
    fill(DARK,4,1);
    ctx.beginPath(); ctx.moveTo(94,124); ctx.lineTo(100,112); ctx.lineTo(90,118); ctx.fill();
    fill(BLD,3,0.7);
    ctx.beginPath(); ctx.moveTo(94,122); ctx.lineTo(98,114); ctx.lineTo(91,119); ctx.fill();
    /* eyes — each eye blinks independently with offset */
    const bl2 = { ...BLINK.cat, phase: BLINK.cat.phase + 30 };
    hollowEye(67,128,5,BLINK.cat,DARK);
    hollowEye(83,128,5,bl2,DARK);
    /* teeth */
    fill(WH,4,0.88);
    [-8,-4,0,4,8].forEach(ox=>{
      ctx.beginPath();
      ctx.moveTo(75+ox,134); ctx.lineTo(74+ox,140); ctx.lineTo(77+ox,134);
      ctx.fill();
    });
    fill(RED2,3,0.6);
    ctx.beginPath(); ctx.arc(75,140,2,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(83,140,2,0,Math.PI*2); ctx.fill();
    rs();
  }

  function drawWing(g){
    sv();
    fill(D2,6,1);
    ctx.beginPath();
    ctx.moveTo(24,80);
    ctx.bezierCurveTo(8,70,4,54,12,42);
    ctx.bezierCurveTo(18,32,28,30,34,38);
    ctx.bezierCurveTo(28,46,24,60,28,72);
    ctx.fill();
    sv(); stk(BLD,1,4,0.55);
    ctx.beginPath(); ctx.moveTo(12,42); ctx.lineTo(28,60); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(16,36); ctx.lineTo(30,54); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(20,32); ctx.lineTo(32,50); ctx.stroke();
    rs();
    fill(DARK,4,1);
    [[6,48],[4,60],[6,72]].forEach(([x,y])=>{
      ctx.beginPath();
      ctx.moveTo(x,y); ctx.lineTo(x-4,y-6); ctx.lineTo(x-4,y+6); ctx.closePath(); ctx.fill();
    });
    fill(DARK,8,1);
    ctx.beginPath();
    ctx.moveTo(26,70);
    ctx.bezierCurveTo(20,60,22,46,30,42);
    ctx.bezierCurveTo(38,38,46,44,46,54);
    ctx.bezierCurveTo(46,64,40,72,32,74);
    ctx.bezierCurveTo(28,74,26,72,26,70);
    ctx.fill();
    xEye(36,56,5.5,BLINK.wing,DARK);
    hollowEye(26,64,3,BLINK.wing,DARK);
    fill(DARK,5,1);
    ctx.beginPath();
    ctx.moveTo(34,38);
    ctx.bezierCurveTo(36,26,48,18,58,20);
    ctx.bezierCurveTo(52,24,44,30,40,38);
    ctx.fill();
    rs();
  }

  function drawFloatingEye(g){
    sv();
    const bv  = blinkVal(BLINK.eye);
    const px  = 0.88 + 0.12*Math.sin(t*0.045);   /* gentle pulse */
    const ex=120, ey=28;

    /* glow ring — constant minimum */
    fill(RED2, 18, 0.45);
    ctx.beginPath(); ctx.arc(ex,ey,13*px,0,Math.PI*2); ctx.fill();

    fill(WH, 0, 0.92);
    ctx.beginPath(); ctx.arc(ex,ey,10*px,0,Math.PI*2); ctx.fill();

    fill(RED2, 9, 0.9);
    ctx.beginPath(); ctx.arc(ex,ey,6.5*px,0,Math.PI*2); ctx.fill();

    /* slit pupil — stretches vertically on blink */
    fill(BLK,0,1);
    const slitH = bv > 0.05 ? 5*px*(1-bv*0.8) : 5*px;
    ctx.beginPath();
    ctx.ellipse(ex,ey,1.8,slitH,0,0,Math.PI*2); ctx.fill();

    /* veins */
    sv(); stk(RED2,0.8,5,0.5);
    ctx.beginPath(); ctx.moveTo(ex-9,ey-2); ctx.lineTo(ex-5,ey+2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ex+6,ey-6); ctx.lineTo(ex+9,ey); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ex,ey-9); ctx.lineTo(ex+2,ey-5); ctx.stroke();
    rs();

    /* highlight */
    fill(WH,0,0.88);
    ctx.beginPath(); ctx.arc(ex-3,ey-3,2.5,0,Math.PI*2); ctx.fill();

    /* eyelid blink over eyeball */
    if(bv > 0.02){
      sv();
      ctx.beginPath(); ctx.arc(ex,ey,10.5*px,0,Math.PI*2);
      ctx.clip();
      /* top eyelid comes down */
      const lidY = ey - 10*px + 20*px*bv;
      ctx.beginPath();
      ctx.rect(ex-12,ey-12,24,lidY-(ey-12)+1);
      ctx.fillStyle=DARK; ctx.shadowBlur=0; ctx.globalAlpha=1; ctx.fill();
      /* bottom eyelid comes up */
      const botY = ey + 10*px - 20*px*bv;
      ctx.beginPath();
      ctx.rect(ex-12,botY,24,12);
      ctx.fill();
      /* red eyelid edge */
      ctx.strokeStyle=RED2; ctx.lineWidth=1; ctx.shadowColor=RED2;
      ctx.shadowBlur=5; ctx.globalAlpha=0.8;
      ctx.beginPath(); ctx.moveTo(ex-10,lidY); ctx.lineTo(ex+10,lidY); ctx.stroke();
      rs();
    }

    /* dangling stem + animated blood drop */
    sv(); stk(BLD,1.2,3,0.75);
    ctx.beginPath(); ctx.moveTo(ex,ey+10*px); ctx.lineTo(ex+1,ey+18); ctx.stroke();
    rs();
    const dropPulse = 0.85 + 0.15*Math.sin(t*0.06);
    fill(RED2, 8, 0.85);
    ctx.beginPath(); ctx.arc(ex+1,ey+20,2.5*dropPulse,0,Math.PI*2); ctx.fill();

    rs();
  }

  /* ── EMBERS — constant ambient particles ── */
  const EMBERS = Array.from({length:18},(_,i)=>({
    a : (i/18)*Math.PI*2 + Math.random()*0.5,
    r : INNER + 2 + Math.random()*18,
    phase : Math.random()*Math.PI*2,
    speed : 0.006 + Math.random()*0.006,
    sz  : 0.8 + Math.random()*1.4,
  }));

  function drawEmbers(){
    EMBERS.forEach(m=>{
      m.a += m.speed;
      /* pulse between 0.45 and 1 — never fully off */
      const pulse = 0.45 + 0.55*Math.abs(Math.sin(t*0.05 + m.phase));
      const [x,y] = p2c(m.a, m.r);
      sv();
      fill(RED2, 9, 0.5*pulse);
      ctx.beginPath(); ctx.arc(x,y,m.sz,0,Math.PI*2); ctx.fill();
      rs();
    });
  }

  /* ── CONSTANT RING GLOW ── */
  function drawRingGlow(){
    sv();
    const atm = ctx.createRadialGradient(CX,CY,INNER-6,CX,CY,82);
    atm.addColorStop(0,   'rgba(140,0,0,0.12)');
    atm.addColorStop(0.55,'rgba(80,0,0,0.20)');
    atm.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.arc(CX,CY,82,0,Math.PI*2);
    ctx.fillStyle=atm; ctx.globalAlpha=1; ctx.fill();
    rs();
  }

  /* ══ MAIN LOOP ══ */
  function draw(){
    ctx.clearRect(0,0,W,H);
    t++;

    /* gGlow: soft slow breathe, minimum 0.82 — never low */
    gGlow = 0.82 + 0.18*Math.sin(t*0.025);

    updateDrips();

    drawRingGlow();
    drawWing(gGlow);
    drawSkull(gGlow);
    drawFloatingEye(gGlow);
    drawGhost(gGlow);
    drawDemon(gGlow);
    drawBottomMass(gGlow);
    drawDrips();
    drawEmbers();

    window._decoRaf = raf = requestAnimationFrame(draw);
  }

  if(window._decoRaf) cancelAnimationFrame(window._decoRaf);
  draw();
})();
              
