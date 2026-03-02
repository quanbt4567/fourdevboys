// ═══════════════════════════════════════════
//  LOADING SCREEN
// ═══════════════════════════════════════════
const loaderBar = document.getElementById('loaderBar');
const loaderText = document.getElementById('loaderText');
const msgs = ['Khởi động hệ thống...','Tải hiệu ứng...','Chuẩn bị nội dung...','Hoàn tất!'];
let prog = 0;
const loaderInterval = setInterval(() => {
  prog += Math.random() * 25 + 10;
  if (prog >= 100) { prog = 100; clearInterval(loaderInterval); }
  loaderBar.style.width = prog + '%';
  loaderText.textContent = msgs[Math.min(Math.floor(prog / 26), 3)];
  if (prog === 100) {
    setTimeout(() => {
      document.getElementById('loading-screen').classList.add('hidden');
      AOS.init({ duration:800, once:true, offset:80 });
      initParticles();
      initCursor();
      initCarousel();
      initCounters();
      initThreeJS();
      initMusicPlayer();
      initTyping();
      showNotif('success','Chào mừng! 👋','Website đã tải xong. Khám phá ngay!');
    }, 400);
  }
}, 120);

// ═══════════════════════════════════════════
//  CURSOR
// ═══════════════════════════════════════════
function initCursor() {
  const c = document.getElementById('cursor');
  const f = document.getElementById('cursor-follower');
  let mx=0,my=0,fx=0,fy=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; c.style.left=mx+'px'; c.style.top=my+'px'; });
  (function animF(){
    fx += (mx-fx)*0.12; fy += (my-fy)*0.12;
    f.style.left=fx+'px'; f.style.top=fy+'px';
    requestAnimationFrame(animF);
  })();
  document.querySelectorAll('a,button,.tool-card,.glass-card,.blog-card,.faq-q,.team-card,.gallery-item').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ c.style.width='24px'; c.style.height='24px'; f.style.width='60px'; f.style.height='60px'; f.style.borderColor='rgba(108,99,255,0.8)'; });
    el.addEventListener('mouseleave',()=>{ c.style.width='12px'; c.style.height='12px'; f.style.width='40px'; f.style.height='40px'; f.style.borderColor='rgba(108,99,255,0.5)'; });
  });
}

// ═══════════════════════════════════════════
//  PARTICLES
// ═══════════════════════════════════════════
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => { canvas.width=window.innerWidth; canvas.height=window.innerHeight; });
  const particles = Array.from({length:80},()=>({
    x: Math.random()*canvas.width, y: Math.random()*canvas.height,
    vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5,
    r: Math.random()*2+0.5,
    alpha: Math.random()*0.5+0.1,
    color: ['#6c63ff','#f64f59','#43e97b','#4facfe'][Math.floor(Math.random()*4)]
  }));
  let mouseX=0,mouseY=0;
  document.addEventListener('mousemove',e=>{mouseX=e.clientX;mouseY=e.clientY;});
  (function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach((p,i)=>{
      const dx=mouseX-p.x, dy=mouseY-p.y, dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<120){ p.vx+=dx*0.00005; p.vy+=dy*0.00005; }
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>canvas.width) p.vx*=-1;
      if(p.y<0||p.y>canvas.height) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.color; ctx.globalAlpha=p.alpha; ctx.fill();
      particles.slice(i+1).forEach(p2=>{
        const d=Math.sqrt((p.x-p2.x)**2+(p.y-p2.y)**2);
        if(d<100){ ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p2.x,p2.y); ctx.strokeStyle=p.color; ctx.globalAlpha=0.03*(1-d/100); ctx.lineWidth=0.5; ctx.stroke(); }
      });
    });
    ctx.globalAlpha=1;
    requestAnimationFrame(draw);
  })();
}

// ═══════════════════════════════════════════
//  THREE.JS HERO BG
// ═══════════════════════════════════════════
function initThreeJS() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;
  const W = canvas.offsetWidth, H = canvas.offsetHeight;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const dots = Array.from({length:30},()=>({
    x:Math.random()*W, y:Math.random()*H,
    vx:(Math.random()-0.5)*0.8, vy:(Math.random()-0.5)*0.8,
    size:Math.random()*4+2,
    hue:Math.floor(Math.random()*60)+240
  }));
  (function anim(){
    if(!document.getElementById('page-home').classList.contains('active')){ requestAnimationFrame(anim); return; }
    ctx.clearRect(0,0,W,H);
    dots.forEach(d=>{
      d.x+=d.vx; d.y+=d.vy;
      if(d.x<0||d.x>W) d.vx*=-1;
      if(d.y<0||d.y>H) d.vy*=-1;
      const grad=ctx.createRadialGradient(d.x,d.y,0,d.x,d.y,d.size*3);
      grad.addColorStop(0,`hsla(${d.hue},100%,70%,0.8)`);
      grad.addColorStop(1,`hsla(${d.hue},100%,70%,0)`);
      ctx.beginPath(); ctx.arc(d.x,d.y,d.size,0,Math.PI*2);
      ctx.fillStyle=grad; ctx.fill();
    });
    requestAnimationFrame(anim);
  })();
}

// ═══════════════════════════════════════════
//  TYPING EFFECT
// ═══════════════════════════════════════════
function initTyping() {
  const el = document.getElementById('heroTitle');
  if(!el) return;
  const words = ['Độ Mixi','Tộc Trưởng','Refund Gaming','MixiGaming','Streamer #1 VN'];
  let wi=0, ci=0, deleting=false;
  el.innerHTML = '';
  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  cursor.style.height='1.1em';
  el.parentElement.appendChild(cursor);
  function type(){
    const w=words[wi];
    if(deleting){ el.textContent=w.slice(0,--ci); if(ci===0){deleting=false;wi=(wi+1)%words.length;setTimeout(type,400);return;} }
    else{ el.textContent=w.slice(0,++ci); if(ci===w.length){setTimeout(()=>{deleting=true;type();},2000);return;} }
    setTimeout(type,deleting?50:100);
  }
  setTimeout(type,1500);
}

// ═══════════════════════════════════════════
//  COUNTERS
// ═══════════════════════════════════════════
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el=e.target, target=+el.dataset.count;
      let cur=0;
      const step=target/60;
      const t=setInterval(()=>{
        cur=Math.min(cur+step,target);
        el.textContent=Math.floor(cur)+(target===100?'%':target>=1000?'+':'');
        if(cur>=target) clearInterval(t);
      },25);
      obs.unobserve(el);
    });
  },{threshold:0.5});
  counters.forEach(c=>obs.observe(c));
}

// ═══════════════════════════════════════════
//  SKILL BARS
// ═══════════════════════════════════════════
const skillObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    e.target.querySelectorAll('.skill-fill').forEach(bar=>{
      setTimeout(()=>{ bar.style.width=bar.dataset.width+'%'; },200);
    });
    skillObs.unobserve(e.target);
  });
},{threshold:0.3});
const skillSec = document.getElementById('skillsSection');
if(skillSec) skillObs.observe(skillSec);

// ═══════════════════════════════════════════
//  PAGE NAVIGATION
// ═══════════════════════════════════════════
function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a=>a.classList.remove('active'));
  const page = document.getElementById('page-'+id);
  if(page){ page.classList.remove('active'); void page.offsetWidth; page.classList.add('active'); }
  if(el) el.classList.add('active');
  else {
    document.querySelectorAll('nav a').forEach(a=>{
      if(a.getAttribute('onclick')&&a.getAttribute('onclick').includes("'"+id+"'")) a.classList.add('active');
    });
  }
  window.scrollTo({top:0,behavior:'smooth'});
  closeNav();
  // Re-trigger AOS
  setTimeout(()=>AOS.refresh(),100);
  // Trigger skill bars if about page
  if(id==='about'&&skillSec){ skillSec.querySelectorAll('.skill-fill').forEach(b=>{ b.style.width='0'; setTimeout(()=>b.style.width=b.dataset.width+'%',300); }); }
  // Start game if games page
  if(id==='games'&&document.getElementById('gameContent').innerHTML==='') switchGame('quiz');
  // Start tools if tools page
  if(id==='tools'&&document.getElementById('toolContent').innerHTML==='') switchTool('clock');
}

// ═══════════════════════════════════════════
//  MOBILE NAV
// ═══════════════════════════════════════════
function toggleNav(){
  const nav=document.getElementById('mainNav');
  const icon=document.getElementById('navIcon');
  nav.classList.toggle('open');
  icon.className = nav.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
}
function closeNav(){
  document.getElementById('mainNav').classList.remove('open');
  document.getElementById('navIcon').className='fas fa-bars';
}

// ═══════════════════════════════════════════
//  SCROLL EFFECTS
// ═══════════════════════════════════════════
window.addEventListener('scroll',()=>{
  const hdr=document.getElementById('mainHeader');
  const btn=document.getElementById('back-top');
  if(window.scrollY>50){ hdr.style.boxShadow='0 4px 30px rgba(108,99,255,0.15)'; }
  else { hdr.style.boxShadow='none'; }
  if(window.scrollY>400){ btn.classList.add('show'); }
  else { btn.classList.remove('show'); }
});
document.getElementById('back-top').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

// ═══════════════════════════════════════════
//  CAROUSEL 3D
// ═══════════════════════════════════════════
let cSlide=0, cTotal=7, cAutoTimer;
function initCarousel(){
  const dotsEl=document.getElementById('cDots');
  if(!dotsEl) return;
  dotsEl.innerHTML='';
  for(let i=0;i<cTotal;i++){
    const d=document.createElement('div');
    d.className='c-dot'+(i===0?' active':'');
    d.onclick=()=>goCarousel(i);
    dotsEl.appendChild(d);
  }
  updateCarousel();
  cAutoTimer=setInterval(()=>nextSlide(),4000);
}
function updateCarousel(){
  for(let i=0;i<cTotal;i++){
    const s=document.getElementById('slide-'+i);
    if(!s) continue;
    const diff=(i-cSlide+cTotal)%cTotal;
    const angle=diff<=cTotal/2?diff:diff-cTotal;
    if(diff===0){ s.style.cssText='transform:translate(-50%,-50%) scale(1) translateZ(0);opacity:1;z-index:10;'; }
    else if(Math.abs(angle)===1){ const dir=angle>0?1:-1; s.style.cssText=`transform:translate(calc(-50% + ${dir*320}px),-50%) scale(0.75) translateZ(-100px);opacity:0.5;z-index:5;`; }
    else { s.style.cssText='transform:translate(-50%,-50%) scale(0.5) translateZ(-300px);opacity:0;z-index:1;'; }
  }
  document.querySelectorAll('.c-dot').forEach((d,i)=>d.classList.toggle('active',i===cSlide));
}
function nextSlide(){ cSlide=(cSlide+1)%cTotal; updateCarousel(); resetCarouselTimer(); }
function prevSlide(){ cSlide=(cSlide-1+cTotal)%cTotal; updateCarousel(); resetCarouselTimer(); }
function goCarousel(i){ cSlide=i; updateCarousel(); resetCarouselTimer(); }
function resetCarouselTimer(){ clearInterval(cAutoTimer); cAutoTimer=setInterval(()=>nextSlide(),4000); }

// ═══════════════════════════════════════════
//  LIGHTBOX
// ═══════════════════════════════════════════
const emojis=['🎮','🏆','🎵','⚽','🎖️','❤️','👨‍👩‍👦','🐕','🎤'];
const grads=['linear-gradient(135deg,#667eea,#764ba2)','linear-gradient(135deg,#f093fb,#f5576c)','linear-gradient(135deg,#4facfe,#00f2fe)','linear-gradient(135deg,#43e97b,#38f9d7)','linear-gradient(135deg,#fa709a,#fee140)','linear-gradient(135deg,#a18cd1,#fbc2eb)','linear-gradient(135deg,#ffecd2,#fcb69f)','linear-gradient(135deg,#84fab0,#8fd3f4)','linear-gradient(135deg,#30cfd0,#330867)'];
function openLightbox(idx,title,desc){
  document.getElementById('lightboxImg').style.background=grads[idx%grads.length];
  document.getElementById('lightboxImg').innerHTML=`<span style="font-size:5em">${emojis[idx%emojis.length]}</span>`;
  document.getElementById('lightboxTitle').textContent=title;
  document.getElementById('lightboxDesc').textContent=desc;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow='';
}
document.getElementById('lightbox').addEventListener('click',function(e){ if(e.target===this) closeLightbox(); });

// ═══════════════════════════════════════════
//  FAQ
// ═══════════════════════════════════════════
function toggleFAQ(btn){
  const item=btn.parentElement;
  const isOpen=item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open'));
  if(!isOpen) item.classList.add('open');
}
function filterFAQ(cat,btn){
  document.querySelectorAll('#faqList .faq-item').forEach(item=>{
    item.style.display=(cat==='all'||item.dataset.cat===cat)?'block':'none';
  });
  document.querySelectorAll('.page-content .btn-primary,.page-content .btn-outline').forEach(b=>{
    b.className=b===btn?'btn-primary':'btn-outline';
    b.style.cssText=b===btn?'padding:10px 22px;font-size:0.85em;':'padding:10px 22px;font-size:0.85em;';
  });
}

// ═══════════════════════════════════════════
//  BLOG POST MODAL
// ═══════════════════════════════════════════
const blogPosts=[
  {title:'Hành trình từ nhân viên văn phòng đến Streamer #1 VN',emoji:'🎮',cat:'Sự Nghiệp',grad:'linear-gradient(135deg,#667eea,#764ba2)',content:`<h1 style="font-size:1.8em;font-weight:800;margin-bottom:15px;background:linear-gradient(135deg,#667eea,#764ba2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Hành trình Độ Mixi</h1><div style="color:var(--text2);font-size:0.85em;margin-bottom:25px;"><span>📅 01/03/2026</span> | <span>✍️ Fan Page</span></div><p style="line-height:1.9;margin-bottom:20px;">Phùng Thanh Độ (sinh 12/09/1989 tại Cao Bằng) từng là nhân viên văn phòng trước khi trở thành streamer. Năm 2016, anh bắt đầu stream CS:GO với niềm đam mê game.</p><h2 style="font-size:1.3em;font-weight:700;color:var(--primary);margin:25px 0 12px;">Bước ngoặt sự nghiệp</h2><p style="line-height:1.9;color:var(--text2);margin-bottom:15px;">Được PewPew mời bình luận giải đấu, Độ Mixi nhanh chóng thu hút lượng fan lớn. Anh sáng lập Refund Gaming và tham dự PGI 2018 tại Berlin.</p><h2 style="font-size:1.3em;font-weight:700;color:var(--primary);margin:25px 0 12px;">Kỷ lục 242K viewers</h2><p style="line-height:1.9;color:var(--text2);">Năm 2020, anh lập kỷ lục 242,000 người xem đồng thời — gấp 6 lần sức chứa sân Mỹ Đình. MV "Stream đến bao giờ" đạt Top 1 Trending YouTube VN.</p>`},
  {title:'Refund Gaming — Chiến tích PGI 2018 Berlin',emoji:'🏆',cat:'eSports',grad:'linear-gradient(135deg,#f093fb,#f5576c)',content:`<h1 style="font-size:1.8em;font-weight:800;margin-bottom:15px;background:linear-gradient(135deg,#f093fb,#f5576c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Refund Gaming tại PGI 2018</h1><div style="color:var(--text2);font-size:0.85em;margin-bottom:25px;">📅 25/02/2026 | ✍️ Fan Page</div><p style="line-height:1.9;margin-bottom:20px;">Refund Gaming là đội PUBG do Độ Mixi sáng lập. Năm 2018, đội giành vé tham dự PUBG Global Invitational tại Berlin — giải PUBG lớn nhất thế giới.</p><h2 style="font-size:1.3em;font-weight:700;color:var(--primary);margin:25px 0 12px;">Top 1 FPP</h2><p style="line-height:1.9;color:var(--text2);">Refund Gaming đạt Top 1 ở chế độ Góc nhìn thứ nhất (FPP), tạo nên chiến tích lịch sử cho eSports Việt Nam.</p>`},
  {title:'Discography: Từ Độ Tộc 1 đến Nóng! Hông Làm Quá',emoji:'🎵',cat:'Âm Nhạc',grad:'linear-gradient(135deg,#4facfe,#00f2fe)',content:`<h1 style="font-size:1.8em;font-weight:800;margin-bottom:15px;background:linear-gradient(135deg,#4facfe,#00f2fe);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Âm nhạc Độ Mixi</h1><div style="color:var(--text2);font-size:0.85em;margin-bottom:25px;">📅 20/02/2026 | ✍️ Fan Page</div><p style="line-height:1.9;">Các sản phẩm: "Độ Tộc 1" (2019), "Stream đến bao giờ" (2020 - Top 1 Trending), "Cô đơn không muốn về nhà" (2020), "Độ Tộc 2" (2021), "Nóng! Hông làm quá" (2023), "Noel Không Cô Đơn" (2023).</p>`},
  {title:'Hoạt động từ thiện: Xây cầu, xây trường vùng cao',emoji:'❤️',cat:'Từ Thiện',grad:'linear-gradient(135deg,#43e97b,#38f9d7)',content:`<h1 style="font-size:1.8em;font-weight:800;margin-bottom:15px;background:linear-gradient(135deg,#43e97b,#38f9d7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Từ thiện MixiGaming</h1><div style="color:var(--text2);font-size:0.85em;margin-bottom:25px;">📅 15/02/2026 | ✍️ Fan Page</div><p style="line-height:1.9;margin-bottom:20px;">Lũ lụt miền Trung 2020: quyên góp 1.2 tỷ đồng (gia đình đóng 460 triệu).</p><p style="line-height:1.9;color:var(--text2);margin-bottom:15px;">Tháng 1/2021: Xây cầu từ thiện ở quê Cao Bằng.</p><p style="line-height:1.9;color:var(--text2);">Cuối 2021: Gây quỹ 1.3 tỷ xây trường tại Nghệ An và khánh thành điểm trường tại Sơn La.</p>`},
  {title:'Mixi Cup 2024: Giải bóng đá viral nhất VN',emoji:'⚽',cat:'Events',grad:'linear-gradient(135deg,#fa709a,#fee140)',content:`<h1 style="font-size:1.8em;font-weight:800;margin-bottom:15px;background:linear-gradient(135deg,#fa709a,#fee140);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Mixi Cup 2024</h1><div style="color:var(--text2);font-size:0.85em;margin-bottom:25px;">📅 10/02/2026 | ✍️ Fan Page</div><p style="line-height:1.9;">Giải quy tụ 4 đội: Refund Gaming, SBTC, 500BROS và AllStar F.C. tại sân Bà Rịa ngày 23-24/11/2024. Lượt xem trực tiếp gấp 8 lần sức chứa sân Mỹ Đình. Mixi ghi bàn đẹp trong trận mở màn.</p>`},
  {title:'Sao Nhập Ngũ: Hành trình quân ngũ của Tộc trưởng',emoji:'🎖️',cat:'TV Show',grad:'linear-gradient(135deg,#a18cd1,#fbc2eb)',content:`<h1 style="font-size:1.8em;font-weight:800;margin-bottom:15px;background:linear-gradient(135deg,#a18cd1,#fbc2eb);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Sao Nhập Ngũ 2022</h1><div style="color:var(--text2);font-size:0.85em;margin-bottom:25px;">📅 05/02/2026 | ✍️ Fan Page</div><p style="line-height:1.9;">Năm 2022, Độ Mixi tham gia chương trình truyền hình "Sao nhập ngũ" cùng Hòa Minzy, Minh Tú, Anh Tú, Cara Phương, S.T Sơn Thạch. Chương trình mang đến nhiều khoảnh khắc hài hước và cảm động.</p>`}
];
function openBlogPost(i){
  const p=blogPosts[i];
  document.getElementById('blogPostContent').innerHTML=`<div style="height:200px;display:flex;align-items:center;justify-content:center;font-size:5em;background:${p.grad};">${p.emoji}</div><div style="padding:40px;">${p.content}</div>`;
  document.getElementById('blogPostModal').style.display='block';
  window.scrollTo({top:0});
}

// ═══════════════════════════════════════════
//  TOOLS
// ═══════════════════════════════════════════
let clockInterval;
function switchTool(tool){
  clearInterval(clockInterval);
  const tc=document.getElementById('toolContent');
  tc.style.opacity='0';
  setTimeout(()=>{
    if(tool==='clock') renderClock(tc);
    else if(tool==='calculator') renderCalc(tc);
    else if(tool==='weather') renderWeather(tc);
    else if(tool==='draw') renderDraw(tc);
    else if(tool==='qr') renderQR(tc);
    else if(tool==='colorpicker') renderColorPicker(tc);
    tc.style.transition='opacity 0.4s';
    tc.style.opacity='1';
  },200);
}

function renderClock(tc){
  tc.innerHTML=`<div style="max-width:500px;margin:0 auto;text-align:center;background:rgba(22,22,58,0.7);border:1px solid rgba(108,99,255,0.2);border-radius:24px;padding:50px;box-shadow:0 20px 60px rgba(108,99,255,0.2);">
    <div id="clockFace" style="font-family:'Orbitron',monospace;font-size:clamp(2em,8vw,4em);font-weight:900;background:linear-gradient(135deg,var(--primary),var(--secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-shadow:none;margin-bottom:10px;">00:00:00</div>
    <div id="clockDate" style="color:var(--text2);font-size:1em;margin-bottom:30px;"></div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:15px;">
      <div style="background:rgba(108,99,255,0.1);border-radius:12px;padding:15px;"><div style="font-family:'Orbitron',monospace;font-size:1.5em;font-weight:700;color:var(--primary);" id="clockH">00</div><div style="color:var(--text2);font-size:0.8em;margin-top:5px;">GIỜ</div></div>
      <div style="background:rgba(246,79,89,0.1);border-radius:12px;padding:15px;"><div style="font-family:'Orbitron',monospace;font-size:1.5em;font-weight:700;color:var(--secondary);" id="clockM">00</div><div style="color:var(--text2);font-size:0.8em;margin-top:5px;">PHÚT</div></div>
      <div style="background:rgba(67,233,123,0.1);border-radius:12px;padding:15px;"><div style="font-family:'Orbitron',monospace;font-size:1.5em;font-weight:700;color:var(--accent);" id="clockS">00</div><div style="color:var(--text2);font-size:0.8em;margin-top:5px;">GIÂY</div></div>
    </div>
  </div>`;
  const days=['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
  function updateClock(){
    const n=new Date();
    const h=String(n.getHours()).padStart(2,'0'), m=String(n.getMinutes()).padStart(2,'0'), s=String(n.getSeconds()).padStart(2,'0');
    document.getElementById('clockFace').textContent=`${h}:${m}:${s}`;
    document.getElementById('clockH').textContent=h;
    document.getElementById('clockM').textContent=m;
    document.getElementById('clockS').textContent=s;
    document.getElementById('clockDate').textContent=`${days[n.getDay()]}, ${n.toLocaleDateString('vi-VN',{year:'numeric',month:'long',day:'numeric'})}`;
  }
  updateClock();
  clockInterval=setInterval(updateClock,1000);
}

function renderCalc(tc){
  tc.innerHTML=`<div class="calc-wrap">
    <div class="calc-display"><div class="calc-expr" id="calcExpr"></div><div class="calc-val" id="calcVal">0</div></div>
    <div class="calc-grid">
      <button class="calc-btn calc-clear" onclick="cBtn('C')" style="grid-column:span 2">C</button>
      <button class="calc-btn calc-op" onclick="cBtn('%')">%</button>
      <button class="calc-btn calc-op" onclick="cBtn('/')">÷</button>
      <button class="calc-btn calc-num" onclick="cBtn('7')">7</button>
      <button class="calc-btn calc-num" onclick="cBtn('8')">8</button>
      <button class="calc-btn calc-num" onclick="cBtn('9')">9</button>
      <button class="calc-btn calc-op" onclick="cBtn('*')">×</button>
      <button class="calc-btn calc-num" onclick="cBtn('4')">4</button>
      <button class="calc-btn calc-num" onclick="cBtn('5')">5</button>
      <button class="calc-btn calc-num" onclick="cBtn('6')">6</button>
      <button class="calc-btn calc-op" onclick="cBtn('-')">−</button>
      <button class="calc-btn calc-num" onclick="cBtn('1')">1</button>
      <button class="calc-btn calc-num" onclick="cBtn('2')">2</button>
      <button class="calc-btn calc-num" onclick="cBtn('3')">3</button>
      <button class="calc-btn calc-op" onclick="cBtn('+')">+</button>
      <button class="calc-btn calc-num" onclick="cBtn('0')" style="grid-column:span 2">0</button>
      <button class="calc-btn calc-num" onclick="cBtn('.')">.</button>
      <button class="calc-btn calc-eq" onclick="cBtn('=')">=</button>
    </div>
  </div>`;
}
let calcCur='',calcExpr='';
function cBtn(v){
  const disp=document.getElementById('calcVal'), expr=document.getElementById('calcExpr');
  if(!disp) return;
  if(v==='C'){calcCur='';calcExpr='';disp.textContent='0';expr.textContent='';return;}
  if(v==='='){
    try{
      const r=Function('"use strict";return ('+calcExpr+calcCur+')')();
      expr.textContent=calcExpr+calcCur+'=';
      calcCur=String(parseFloat(r.toFixed(10)));
      calcExpr='';
      disp.textContent=calcCur;
    }catch{disp.textContent='Lỗi';calcCur='';calcExpr='';}
    return;
  }
  if(['+','-','*','/','^','%'].includes(v)){
    calcExpr+=calcCur+v; calcCur='';
    expr.textContent=calcExpr; disp.textContent='0';
  } else {
    if(v==='.'&&calcCur.includes('.')) return;
    calcCur+=v;
    disp.textContent=calcCur;
  }
}

function renderWeather(tc){
  tc.innerHTML=`<div style="display:flex;justify-content:center;"><div class="weather-card">
    <div class="weather-main"><div class="weather-icon">☀️</div><div><div class="weather-temp">32°C</div><div class="weather-desc">Trời nắng đẹp</div></div></div>
    <div style="margin-bottom:20px;color:var(--text2);display:flex;align-items:center;gap:8px;"><i class="fas fa-map-marker-alt" style="color:var(--primary);"></i> TP. Hồ Chí Minh, Việt Nam</div>
    <div class="weather-details">
      <div class="weather-detail"><div class="weather-detail-label">💧 Độ ẩm</div><div class="weather-detail-value">75%</div></div>
      <div class="weather-detail"><div class="weather-detail-label">🌬️ Gió</div><div class="weather-detail-value">15 km/h</div></div>
      <div class="weather-detail"><div class="weather-detail-label">🌡️ Cảm giác</div><div class="weather-detail-value">35°C</div></div>
      <div class="weather-detail"><div class="weather-detail-label">☁️ Mây</div><div class="weather-detail-value">10%</div></div>
    </div>
    <div style="margin-top:20px;padding-top:20px;border-top:1px solid rgba(108,99,255,0.1);">
      <div style="color:var(--text2);font-size:0.85em;margin-bottom:12px;">Dự báo 5 ngày tới:</div>
      <div style="display:flex;gap:10px;justify-content:space-between;">
        ${['T2','T3','T4','T5','T6'].map((d,i)=>`<div style="text-align:center;background:rgba(79,172,254,0.08);border-radius:10px;padding:10px 8px;flex:1"><div style="font-size:0.8em;color:var(--text2);margin-bottom:5px;">${d}</div><div style="font-size:1.2em;">${['☀️','⛅','🌧️','☀️','⛅'][i]}</div><div style="font-size:0.85em;font-weight:700;color:var(--accent);margin-top:5px;">${[32,30,27,33,31][i]}°</div></div>`).join('')}
      </div>
    </div>
    <div style="margin-top:15px;color:var(--text2);font-size:0.75em;text-align:center;">⚠️ Dữ liệu mẫu — kết nối OpenWeatherMap API để xem thực tế</div>
  </div></div>`;
}

function renderDraw(tc){
  tc.innerHTML=`<div style="background:rgba(22,22,58,0.7);border:1px solid rgba(108,99,255,0.2);border-radius:20px;padding:25px;">
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-bottom:15px;">
      <input type="color" id="brushColor" value="#6c63ff" style="width:44px;height:44px;border:none;cursor:pointer;border-radius:10px;background:none;">
      <div style="display:flex;align-items:center;gap:8px;"><label style="color:var(--text2);font-size:0.85em;">Size:</label><input type="range" id="brushSize" min="2" max="40" value="6" style="width:100px;accent-color:var(--primary);"></div>
      <button onclick="clearDrawCanvas()" style="padding:10px 18px;background:rgba(246,79,89,0.2);border:1px solid rgba(246,79,89,0.3);color:var(--secondary);border-radius:10px;cursor:pointer;font-size:0.85em;">🗑️ Xóa</button>
      <button onclick="downloadCanvas()" style="padding:10px 18px;background:rgba(108,99,255,0.2);border:1px solid rgba(108,99,255,0.3);color:var(--primary);border-radius:10px;cursor:pointer;font-size:0.85em;">💾 Lưu</button>
      <div style="display:flex;gap:6px;">${['🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪'].map((e,i)=>{const cols=['#ff4444','#ff8c00','#ffd700','#44ff44','#4444ff','#9944ff','#111111','#ffffff'];return `<div onclick="document.getElementById('brushColor').value='${cols[i]}'" style="width:28px;height:28px;background:${cols[i]};border-radius:50%;cursor:pointer;border:2px solid rgba(255,255,255,0.2);" title="${e}"></div>`}).join('')}</div>
    </div>
    <canvas id="drawCanvas" width="800" height="400" style="border:2px dashed rgba(108,99,255,0.3);border-radius:12px;cursor:crosshair;max-width:100%;background:#0a0a1a;display:block;"></canvas>
  </div>`;
  const canvas=document.getElementById('drawCanvas'), ctx=canvas.getContext('2d');
  let drawing=false, lx=0,ly=0;
  canvas.addEventListener('mousedown',e=>{drawing=true;[lx,ly]=[e.offsetX,e.offsetY];});
  canvas.addEventListener('mousemove',e=>{
    if(!drawing) return;
    ctx.beginPath(); ctx.moveTo(lx,ly); ctx.lineTo(e.offsetX,e.offsetY);
    ctx.strokeStyle=document.getElementById('brushColor').value;
    ctx.lineWidth=document.getElementById('brushSize').value;
    ctx.lineCap='round'; ctx.lineJoin='round'; ctx.stroke();
    [lx,ly]=[e.offsetX,e.offsetY];
  });
  ['mouseup','mouseleave'].forEach(ev=>canvas.addEventListener(ev,()=>drawing=false));
  // Touch support
  canvas.addEventListener('touchstart',e=>{e.preventDefault();const t=e.touches[0],r=canvas.getBoundingClientRect();drawing=true;lx=t.clientX-r.left;ly=t.clientY-r.top;});
  canvas.addEventListener('touchmove',e=>{e.preventDefault();const t=e.touches[0],r=canvas.getBoundingClientRect(),ox=t.clientX-r.left,oy=t.clientY-r.top;if(!drawing)return;ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(ox,oy);ctx.strokeStyle=document.getElementById('brushColor').value;ctx.lineWidth=document.getElementById('brushSize').value;ctx.lineCap='round';ctx.stroke();lx=ox;ly=oy;});
}
function clearDrawCanvas(){ const c=document.getElementById('drawCanvas'); if(c) c.getContext('2d').clearRect(0,0,c.width,c.height); }
function downloadCanvas(){
  const c=document.getElementById('drawCanvas'); if(!c) return;
  const a=document.createElement('a'); a.href=c.toDataURL(); a.download='nexus-drawing.png'; a.click();
  showNotif('success','Đã lưu!','Ảnh đã được tải xuống');
}

function renderQR(tc){
  tc.innerHTML=`<div style="max-width:500px;margin:0 auto;background:rgba(22,22,58,0.7);border:1px solid rgba(108,99,255,0.2);border-radius:20px;padding:35px;text-align:center;">
    <h3 style="margin-bottom:20px;color:var(--primary);">📱 QR Code Generator</h3>
    <input id="qrInput" type="text" class="form-control" placeholder="Nhập URL hoặc văn bản..." value="https://nexus.edu.vn" style="margin-bottom:15px;text-align:center;">
    <button onclick="genQR()" class="btn-primary" style="margin-bottom:25px;"><span>⚡ Tạo QR Code</span></button>
    <div id="qrOutput" style="display:flex;justify-content:center;min-height:200px;align-items:center;"></div>
    <div style="color:var(--text2);font-size:0.8em;margin-top:15px;">QR code được tạo bằng QR Server API</div>
  </div>`;
  genQR();
}
function genQR(){
  const v=encodeURIComponent(document.getElementById('qrInput').value||'https://nexus.edu.vn');
  const out=document.getElementById('qrOutput');
  out.innerHTML=`<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${v}&bgcolor=0a0a1a&color=6c63ff" style="border-radius:12px;border:2px solid rgba(108,99,255,0.3);" alt="QR Code">`;
}

function renderColorPicker(tc){
  tc.innerHTML=`<div style="max-width:500px;margin:0 auto;background:rgba(22,22,58,0.7);border:1px solid rgba(108,99,255,0.2);border-radius:20px;padding:35px;">
    <h3 style="margin-bottom:20px;color:var(--primary);text-align:center;">🎨 Color Picker</h3>
    <div style="text-align:center;margin-bottom:25px;">
      <input type="color" id="colorPick" value="#6c63ff" oninput="updateColor()" style="width:120px;height:120px;border:none;cursor:pointer;border-radius:50%;background:none;">
    </div>
    <div id="colorPreview" style="height:80px;border-radius:16px;background:#6c63ff;margin-bottom:20px;box-shadow:0 10px 30px rgba(108,99,255,0.4);transition:all 0.3s;"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;">
      <div style="background:rgba(108,99,255,0.1);border-radius:10px;padding:15px;text-align:center;"><div style="color:var(--text2);font-size:0.8em;margin-bottom:5px;">HEX</div><div id="hexVal" style="font-family:'Orbitron',monospace;font-weight:700;font-size:0.9em;">#6c63ff</div></div>
      <div style="background:rgba(108,99,255,0.1);border-radius:10px;padding:15px;text-align:center;"><div style="color:var(--text2);font-size:0.8em;margin-bottom:5px;">RGB</div><div id="rgbVal" style="font-family:'Orbitron',monospace;font-weight:700;font-size:0.75em;">108,99,255</div></div>
      <div style="background:rgba(108,99,255,0.1);border-radius:10px;padding:15px;text-align:center;"><div style="color:var(--text2);font-size:0.8em;margin-bottom:5px;">HSL</div><div id="hslVal" style="font-family:'Orbitron',monospace;font-weight:700;font-size:0.75em;">243,100%,70%</div></div>
    </div>
    <button onclick="copyColor()" class="btn-primary" style="width:100%;margin-top:20px;"><span>📋 Sao chép HEX</span></button>
  </div>`;
}
function updateColor(){
  const h=document.getElementById('colorPick').value;
  document.getElementById('colorPreview').style.background=h;
  document.getElementById('colorPreview').style.boxShadow=`0 10px 30px ${h}66`;
  document.getElementById('hexVal').textContent=h.toUpperCase();
  const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);
  document.getElementById('rgbVal').textContent=`${r},${g},${b}`;
  const rf=r/255,gf=g/255,bf=b/255,max=Math.max(rf,gf,bf),min=Math.min(rf,gf,bf);
  let hue=0,sat=0,light=(max+min)/2;
  if(max!==min){const d=max-min;sat=light>0.5?d/(2-max-min):d/(max+min);switch(max){case rf:hue=((gf-bf)/d+(gf<bf?6:0))/6;break;case gf:hue=((bf-rf)/d+2)/6;break;case bf:hue=((rf-gf)/d+4)/6;break;}}
  document.getElementById('hslVal').textContent=`${Math.round(hue*360)},${Math.round(sat*100)}%,${Math.round(light*100)}%`;
}
function copyColor(){
  navigator.clipboard.writeText(document.getElementById('hexVal').textContent);
  showNotif('success','Đã sao chép!',document.getElementById('hexVal').textContent);
}

// ═══════════════════════════════════════════
//  MUSIC PLAYER
// ═══════════════════════════════════════════
const tracks=[
  {name:'Stream đến bao giờ',artist:'Độ Mixi ft. HuyR',emoji:'🎤',dur:248},
  {name:'Độ Tộc 2',artist:'Masew, Phúc Du, Pháo, Độ Mixi',emoji:'🔥',dur:215},
  {name:'Cô đơn không muốn về nhà',artist:'Mr. Siro ft. Refund Band',emoji:'🎵',dur:285},
  {name:'Nóng! Hông làm quá',artist:'Phúc Du, Gill, Pháo, Độ Mixi',emoji:'🎶',dur:230},
];
let curTrack=0, playing=false, progTimer, elapsed=0;
function initMusicPlayer(){
  const tl=document.getElementById('trackList');
  if(!tl) return;
  tl.innerHTML=tracks.map((t,i)=>`<div onclick="playTrack(${i})" style="display:flex;align-items:center;gap:12px;padding:10px 15px;border-radius:10px;cursor:pointer;transition:all 0.2s;background:rgba(108,99,255,0.05);border:1px solid rgba(108,99,255,0.1);" class="tl-item-${i}" onmouseover="this.style.background='rgba(108,99,255,0.15)'" onmouseout="this.style.background='rgba(108,99,255,0.05)'"><span style="font-size:1.5em;">${t.emoji}</span><div style="flex:1"><div style="font-weight:600;font-size:0.9em;">${t.name}</div><div style="color:var(--text2);font-size:0.78em;">${t.artist}</div></div><span style="color:var(--text2);font-size:0.78em;">${Math.floor(t.dur/60)}:${String(t.dur%60).padStart(2,'0')}</span></div>`).join('');
  playTrack(0);
}
function playTrack(i){
  curTrack=i; elapsed=0; const t=tracks[i];
  document.getElementById('playerTitle').textContent=t.name;
  document.getElementById('playerArtist').textContent=t.artist;
  document.getElementById('playerCover').textContent=t.emoji;
  document.getElementById('totalTime').textContent=`${Math.floor(t.dur/60)}:${String(t.dur%60).padStart(2,'0')}`;
  document.querySelectorAll('[class^="tl-item-"]').forEach((el,j)=>{ el.style.borderColor=j===i?'rgba(108,99,255,0.5)':'rgba(108,99,255,0.1)'; el.style.background=j===i?'rgba(108,99,255,0.2)':'rgba(108,99,255,0.05)'; });
  if(playing) startProgress();
}
function togglePlay(){
  playing=!playing;
  document.getElementById('playBtn').innerHTML=playing?'<i class="fas fa-pause"></i>':'<i class="fas fa-play"></i>';
  document.getElementById('playerCover').classList.toggle('spinning',playing);
  if(playing) startProgress(); else clearInterval(progTimer);
}
function startProgress(){
  clearInterval(progTimer);
  progTimer=setInterval(()=>{
    elapsed++;
    const dur=tracks[curTrack].dur;
    const pct=Math.min((elapsed/dur)*100,100);
    document.getElementById('playerBar').style.width=pct+'%';
    document.getElementById('currentTime').textContent=`${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')}`;
    if(elapsed>=dur) nextTrack();
  },1000);
}
function nextTrack(){ playTrack((curTrack+1)%tracks.length); }
function prevTrack(){ playTrack((curTrack-1+tracks.length)%tracks.length); }
function shuffleTrack(){ playTrack(Math.floor(Math.random()*tracks.length)); showNotif('success','🔀 Ngẫu nhiên','Đã chuyển bài ngẫu nhiên'); }
function seekMusic(e){
  const rect=document.getElementById('playerProgress').getBoundingClientRect();
  const pct=(e.clientX-rect.left)/rect.width;
  elapsed=Math.floor(pct*tracks[curTrack].dur);
}

// ═══════════════════════════════════════════
//  GAMES
// ═══════════════════════════════════════════
function switchGame(game){
  const gc=document.getElementById('gameContent');
  gc.style.opacity='0';
  setTimeout(()=>{
    if(game==='snake') renderSnake(gc);
    else if(game==='quiz') renderQuiz(gc);
    else if(game==='memory') renderMemory(gc);
    gc.style.transition='opacity 0.4s';
    gc.style.opacity='1';
  },200);
}

// SNAKE GAME
let snakeGame={running:false,loop:null};
function renderSnake(gc){
  gc.innerHTML=`<div style="text-align:center;">
    <div style="margin-bottom:15px;display:flex;justify-content:center;align-items:center;gap:20px;">
      <div style="background:rgba(108,99,255,0.15);border:1px solid rgba(108,99,255,0.3);border-radius:10px;padding:10px 20px;font-family:'Orbitron',monospace;font-size:1.2em;font-weight:700;color:var(--primary);">Điểm: <span id="snakeScore">0</span></div>
      <button onclick="startSnake()" class="btn-primary" style="padding:10px 22px;"><span>▶️ Bắt đầu</span></button>
      <div style="color:var(--text2);font-size:0.85em;">Dùng phím ← → ↑ ↓ để điều khiển</div>
    </div>
    <canvas id="snakeCanvas" width="400" height="400" style="max-width:100%;"></canvas>
    <div style="margin-top:15px;display:grid;grid-template-columns:repeat(3,60px);gap:5px;justify-content:center;">
      <div></div><button onclick="snakeDir('up')" style="padding:12px;background:rgba(108,99,255,0.2);border:1px solid rgba(108,99,255,0.3);color:var(--primary);border-radius:8px;cursor:pointer;font-size:1.1em;">↑</button><div></div>
      <button onclick="snakeDir('left')" style="padding:12px;background:rgba(108,99,255,0.2);border:1px solid rgba(108,99,255,0.3);color:var(--primary);border-radius:8px;cursor:pointer;font-size:1.1em;">←</button>
      <button onclick="snakeDir('down')" style="padding:12px;background:rgba(108,99,255,0.2);border:1px solid rgba(108,99,255,0.3);color:var(--primary);border-radius:8px;cursor:pointer;font-size:1.1em;">↓</button>
      <button onclick="snakeDir('right')" style="padding:12px;background:rgba(108,99,255,0.2);border:1px solid rgba(108,99,255,0.3);color:var(--primary);border-radius:8px;cursor:pointer;font-size:1.1em;">→</button>
    </div>
  </div>`;
  drawSnakeIdle();
}
let snake={body:[{x:10,y:10}],dir:'right',food:{x:15,y:15},score:0,growing:false};
function drawSnakeIdle(){
  const c=document.getElementById('snakeCanvas'); if(!c) return;
  const ctx=c.getContext('2d'),sz=20,cols=20,rows=20;
  ctx.fillStyle='#0a0a1a'; ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle='rgba(108,99,255,0.1)';
  for(let i=0;i<cols;i++) for(let j=0;j<rows;j++) if((i+j)%2===0) ctx.fillRect(i*sz,j*sz,sz,sz);
  ctx.fillStyle='rgba(108,99,255,0.5)'; ctx.font='bold 16px Orbitron'; ctx.textAlign='center'; ctx.fillText('Nhấn Bắt Đầu',200,200);
}
function startSnake(){
  clearInterval(snakeGame.loop);
  snake={body:[{x:10,y:10},{x:9,y:10},{x:8,y:10}],dir:'right',food:randFood(),score:0,growing:false};
  document.getElementById('snakeScore').textContent='0';
  snakeGame.running=true;
  snakeGame.loop=setInterval(tickSnake,120);
  document.addEventListener('keydown',snakeKey);
}
function randFood(){ return {x:Math.floor(Math.random()*20),y:Math.floor(Math.random()*20)}; }
function snakeDir(d){const opp={up:'down',down:'up',left:'right',right:'left'};if(d!==opp[snake.dir])snake.dir=d;}
function snakeKey(e){ const m={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'}; if(m[e.key]){e.preventDefault();snakeDir(m[e.key]);} }
function tickSnake(){
  if(!document.getElementById('snakeCanvas')||!snakeGame.running){clearInterval(snakeGame.loop);return;}
  const h={...snake.body[0]};
  if(snake.dir==='right') h.x++; else if(snake.dir==='left') h.x--; else if(snake.dir==='up') h.y--; else h.y++;
  if(h.x<0||h.x>=20||h.y<0||h.y>=20||snake.body.some(s=>s.x===h.x&&s.y===h.y)){
    clearInterval(snakeGame.loop); snakeGame.running=false;
    showNotif('warning','Game Over 🐍',`Điểm của bạn: ${snake.score}`);
    return;
  }
  snake.body.unshift(h);
  if(h.x===snake.food.x&&h.y===snake.food.y){ snake.score+=10; snake.food=randFood(); document.getElementById('snakeScore').textContent=snake.score; }
  else snake.body.pop();
  const c=document.getElementById('snakeCanvas'),ctx=c.getContext('2d'),sz=20;
  ctx.fillStyle='#0a0a1a'; ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle='rgba(108,99,255,0.05)'; for(let i=0;i<20;i++) for(let j=0;j<20;j++) if((i+j)%2===0) ctx.fillRect(i*sz,j*sz,sz,sz);
  snake.body.forEach((s,i)=>{ const g=ctx.createRadialGradient(s.x*sz+sz/2,s.y*sz+sz/2,0,s.x*sz+sz/2,s.y*sz+sz/2,sz/2); g.addColorStop(0,i===0?'#ff6b6b':'#6c63ff'); g.addColorStop(1,i===0?'#f64f59':'#4a42e0'); ctx.fillStyle=g; ctx.beginPath(); ctx.roundRect(s.x*sz+1,s.y*sz+1,sz-2,sz-2,4); ctx.fill(); });
  ctx.fillStyle='#43e97b'; ctx.beginPath(); ctx.arc(snake.food.x*sz+sz/2,snake.food.y*sz+sz/2,sz/2-2,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(67,233,123,0.3)'; ctx.beginPath(); ctx.arc(snake.food.x*sz+sz/2,snake.food.y*sz+sz/2,sz/2+3,0,Math.PI*2); ctx.fill();
}

// QUIZ
const quizQ=[
  {q:'Tên thật của Độ Mixi là gì?',opts:['Phùng Thanh Độ','Nguyễn Văn Độ','Trần Thanh Độ','Phùng Minh Độ'],ans:0},
  {q:'Độ Mixi sinh năm nào?',opts:['1991','1989','1990','1992'],ans:1},
  {q:'Đội tuyển eSports do Mixi sáng lập tên gì?',opts:['Team Flash','Refund Gaming','GAM eSports','SBTC'],ans:1},
  {q:'MV nào của Mixi đạt Top 1 Trending YouTube?',opts:['Độ Tộc 1','Độ Tộc 2','Stream đến bao giờ','Cô đơn không muốn về nhà'],ans:2},
  {q:'Mixi lập kỷ lục bao nhiêu viewers đồng thời?',opts:['100,000','150,000','242,000','300,000'],ans:2},
  {q:'Độ Mixi quê ở đâu?',opts:['Hà Nội','Cao Bằng','TP.HCM','Đà Nẵng'],ans:1},
  {q:'Giải bóng đá Mixi Cup tổ chức năm nào?',opts:['2022','2023','2024','2025'],ans:2},
  {q:'Dân tộc của Độ Mixi là gì?',opts:['Kinh','Tày','Mường','Thái'],ans:1},
  {q:'Website chính thức của MixiGaming là?',opts:['mixi.vn','mixigaming.com','domixi.com','refundgaming.vn'],ans:1},
  {q:'Chương trình truyền hình Mixi tham gia năm 2022?',opts:['Running Man','Sao nhập ngũ','The Voice','Rap Việt'],ans:1},
];
let qIdx=0,qScore=0,qAnswered=false;
function renderQuiz(gc){
  qIdx=0; qScore=0;
  gc.innerHTML=`<div class="quiz-card">
    <div class="quiz-progress"><div class="quiz-prog-bar" id="quizBar" style="width:${(1/quizQ.length)*100}%"></div></div>
    <div style="color:var(--text2);font-size:0.85em;margin-bottom:15px;display:flex;justify-content:space-between;"><span>Câu <span id="qNum">1</span>/${quizQ.length}</span><span>🏆 Điểm: <span id="qScoreDisplay">0</span></span></div>
    <div class="quiz-question" id="quizQ"></div>
    <div class="quiz-options" id="quizOpts"></div>
    <div id="quizResult" style="display:none;text-align:center;padding:30px;"></div>
  </div>`;
  renderQuestion();
}
function renderQuestion(){
  qAnswered=false;
  const q=quizQ[qIdx];
  document.getElementById('quizQ').textContent=q.q;
  document.getElementById('qNum').textContent=qIdx+1;
  document.getElementById('quizBar').style.width=`${((qIdx+1)/quizQ.length)*100}%`;
  document.getElementById('quizOpts').innerHTML=q.opts.map((o,i)=>`<button class="quiz-option" onclick="answerQ(${i})">${o}</button>`).join('');
  document.getElementById('quizResult').style.display='none';
}
function answerQ(i){
  if(qAnswered) return; qAnswered=true;
  const q=quizQ[qIdx]; const opts=document.querySelectorAll('.quiz-option');
  opts.forEach((o,j)=>{ if(j===q.ans) o.classList.add('correct'); else if(j===i&&i!==q.ans) o.classList.add('wrong'); });
  if(i===q.ans){ qScore++; document.getElementById('qScoreDisplay').textContent=qScore; showNotif('success','Đúng rồi! ✅','Câu trả lời chính xác!'); }
  else showNotif('error','Sai rồi! ❌',`Đáp án đúng: ${q.opts[q.ans]}`);
  setTimeout(()=>{
    qIdx++;
    if(qIdx<quizQ.length) renderQuestion();
    else {
      const res=document.getElementById('quizResult'),stars=qScore>=6?'⭐⭐⭐':qScore>=4?'⭐⭐':'⭐';
      document.getElementById('quizOpts').innerHTML='';
      document.getElementById('quizQ').textContent='';
      res.style.display='block';
      res.innerHTML=`<div style="font-size:3em;margin-bottom:15px;">${qScore===quizQ.length?'🏆':qScore>=5?'🎉':'📚'}</div><div style="font-size:1.5em;font-weight:800;margin-bottom:10px;">${stars}</div><div style="font-size:1.1em;color:var(--text2);margin-bottom:20px;">Bạn đạt <strong style="color:var(--primary)">${qScore}/${quizQ.length}</strong> câu đúng</div><button onclick="renderQuiz(document.getElementById('gameContent'))" class="btn-primary"><span>🔄 Chơi lại</span></button>`;
    }
  },1500);
}

// MEMORY GAME
const mEmojis=['🌸','🏙️','🌊','🏔️','🌅','🎆','🌻','🦋'];
let mCards=[...mEmojis,...mEmojis].sort(()=>Math.random()-0.5).map((e,i)=>({id:i,emoji:e,flipped:false,matched:false}));
let mFlipped=[],mMoves=0,mCanFlip=true;
function renderMemory(gc){
  mCards=[...mEmojis,...mEmojis].sort(()=>Math.random()-0.5).map((e,i)=>({id:i,emoji:e,flipped:false,matched:false}));
  mFlipped=[]; mMoves=0; mCanFlip=true;
  gc.innerHTML=`<div style="text-align:center;">
    <div style="margin-bottom:20px;display:flex;justify-content:center;gap:20px;align-items:center;">
      <div style="background:rgba(108,99,255,0.15);border:1px solid rgba(108,99,255,0.3);border-radius:10px;padding:10px 20px;font-family:'Orbitron',monospace;font-weight:700;color:var(--primary);">Lượt: <span id="memMoves">0</span></div>
      <button onclick="renderMemory(document.getElementById('gameContent'))" class="btn-outline" style="padding:10px 20px;font-size:0.85em;">🔄 Bắt đầu lại</button>
    </div>
    <div id="memGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;max-width:380px;margin:0 auto;"></div>
  </div>`;
  renderMemGrid();
}
function renderMemGrid(){
  const g=document.getElementById('memGrid'); if(!g) return;
  g.innerHTML=mCards.map(c=>`<div onclick="flipCard(${c.id})" style="aspect-ratio:1;border-radius:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.8em;transition:all 0.4s;background:${c.flipped||c.matched?'rgba(108,99,255,0.2)':'rgba(22,22,58,0.8)'};border:2px solid ${c.matched?'rgba(67,233,123,0.5)':c.flipped?'rgba(108,99,255,0.5)':'rgba(108,99,255,0.2)'};transform:${c.flipped||c.matched?'rotateY(0)':'rotateY(180deg)'};box-shadow:${c.matched?'0 0 15px rgba(67,233,123,0.3)':'none'};">${c.flipped||c.matched?c.emoji:'🔲'}</div>`).join('');
}
function flipCard(id){
  if(!mCanFlip) return; const c=mCards.find(x=>x.id===id); if(!c||c.flipped||c.matched) return;
  c.flipped=true; mFlipped.push(c); renderMemGrid();
  if(mFlipped.length===2){
    mMoves++; document.getElementById('memMoves').textContent=mMoves; mCanFlip=false;
    if(mFlipped[0].emoji===mFlipped[1].emoji){ mFlipped.forEach(x=>x.matched=true); mFlipped=[]; mCanFlip=true; renderMemGrid(); if(mCards.every(x=>x.matched)){setTimeout(()=>showNotif('success','🎉 Thắng!',`Hoàn thành trong ${mMoves} lượt!`),300);} }
    else { setTimeout(()=>{ mFlipped.forEach(x=>x.flipped=false); mFlipped=[]; mCanFlip=true; renderMemGrid(); },1000); }
  }
}

// ═══════════════════════════════════════════
//  STAR RATING
// ═══════════════════════════════════════════
let currentRating=0;
function setRating(v){ currentRating=v; updateStars(v,true); }
function hoverRating(v){ updateStars(v,false); }
function resetRating(){ updateStars(currentRating,true); }
function updateStars(v,save){
  document.querySelectorAll('.star').forEach(s=>{ s.textContent=+s.dataset.v<=v?'⭐':'☆'; });
}

// ═══════════════════════════════════════════
//  FORM SUBMIT
// ═══════════════════════════════════════════
function handleFormSubmit(e){
  e.preventDefault();
  const btn=e.target.querySelector('[type=submit]');
  btn.innerHTML='<span><i class="fas fa-spinner fa-spin"></i> Đang gửi...</span>';
  btn.disabled=true;
  setTimeout(()=>{
    btn.innerHTML='<span><i class="fas fa-check"></i> Đã gửi!</span>';
    btn.style.background='linear-gradient(135deg,#43e97b,#38f9d7)';
    showNotif('success','Gửi thành công! 🎉','Chúng tôi sẽ phản hồi trong 24 giờ');
    setTimeout(()=>{ e.target.reset(); btn.innerHTML='<span><i class="fas fa-paper-plane"></i> Gửi Tin Nhắn</span>'; btn.style.background=''; btn.disabled=false; setRating(0); },3000);
  },2000);
}

// ═══════════════════════════════════════════
//  NOTIFICATIONS
// ═══════════════════════════════════════════
function showNotif(type,title,msg){
  const stack=document.getElementById('notifStack');
  const icons={success:'✅',error:'❌',warning:'⚠️',info:'ℹ️'};
  const notif=document.createElement('div');
  notif.className=`notif ${type}`;
  notif.innerHTML=`<div class="notif-icon">${icons[type]||'ℹ️'}</div><div class="notif-text"><div class="notif-title">${title}</div><div class="notif-msg">${msg}</div></div>`;
  notif.onclick=()=>notif.remove();
  stack.appendChild(notif);
  setTimeout(()=>{ notif.style.transition='all 0.4s'; notif.style.opacity='0'; notif.style.transform='translateX(100px)'; setTimeout(()=>notif.remove(),400); },4000);
}

// ═══════════════════════════════════════════
//  KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){ closeLightbox(); document.getElementById('blogPostModal').style.display='none'; closeNav(); }
});

// ═══════════════════════════════════════════
//  HEADER SCROLL GLOW
// ═══════════════════════════════════════════
window.addEventListener('scroll',()=>{
  const pct=Math.min(window.scrollY/300,1);
  document.getElementById('mainHeader').style.background=`rgba(10,10,26,${0.85+pct*0.14})`;
});