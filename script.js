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
const galleryImages=[
  'https://img.youtube.com/vi/jk7LbXUpmz0/maxresdefault.jpg',
  'https://img.youtube.com/vi/nR_IHR6oF8w/maxresdefault.jpg',
  'https://img.youtube.com/vi/Jk38OqdAQxc/maxresdefault.jpg',
  'https://img.youtube.com/vi/VWm_cV1Aoz4/maxresdefault.jpg',
  'https://img.youtube.com/vi/rBDinocbnbc/maxresdefault.jpg',
  'https://img.youtube.com/vi/2aGByfV0k6Y/maxresdefault.jpg',
  'https://img.youtube.com/vi/7hd7W6KF4so/maxresdefault.jpg',
  'https://img.youtube.com/vi/XQ9QzfUeW6A/maxresdefault.jpg',
  'https://img.youtube.com/vi/SPDE0ntfGSM/maxresdefault.jpg'
];
function openLightbox(idx,title,desc){
  const imgUrl = galleryImages[idx % galleryImages.length];
  const emoji = emojis[idx % emojis.length];
  const grad = grads[idx % grads.length];
  const lbImg = document.getElementById('lightboxImg');
  lbImg.style.background = `url('${imgUrl}') center/cover no-repeat, ${grad}`;
  const img = document.createElement('img');
  img.src = imgUrl;
  img.alt = title;
  img.style.cssText = 'max-width:100%;max-height:100%;object-fit:contain;border-radius:8px;box-shadow:0 10px 40px rgba(0,0,0,0.5);';
  img.onerror = function(){ this.style.display='none'; lbImg.innerHTML='<span style="font-size:5em">'+emoji+'</span>'; };
  lbImg.innerHTML = '';
  lbImg.appendChild(img);
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
  {title:'Hành trình từ nhân viên văn phòng đến Streamer #1 VN',emoji:'🎮',cat:'Sự Nghiệp',grad:'linear-gradient(135deg,#667eea,#764ba2)',content:`<h1 style="font-size:1.8em;font-weight:800;margin-bottom:15px;background:linear-gradient(135deg,#667eea,#764ba2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Hành trình Độ Mixi</h1><div style="color:var(--text2);font-size:0.85em;margin-bottom:25px;"><span>📅 01/03/2026</span> | <span>✍️ Fan Page</span></div><p style="line-height:1.9;margin-bottom:20px;">Phùng Thanh Độ (sinh 12/09/1989 tại Cao Bằng) từng là nhân viên văn phòng trước khi trở thành streamer. Năm 2016, anh bắt đầu stream CS:GO với niềm đam mê game.</p><img src="https://img.youtube.com/vi/jk7LbXUpmz0/hqdefault.jpg" alt="Stream Đến Bao Giờ" style="width:100%;border-radius:12px;margin:15px 0;"><h2 style="font-size:1.3em;font-weight:700;color:var(--primary);margin:25px 0 12px;">Bước ngoặt sự nghiệp</h2><p style="line-height:1.9;color:var(--text2);margin-bottom:15px;">Được PewPew mời bình luận giải đấu, Độ Mixi nhanh chóng thu hút lượng fan lớn. Anh sáng lập Refund Gaming và tham dự PGI 2018 tại Berlin.</p><img src="https://img.youtube.com/vi/nR_IHR6oF8w/hqdefault.jpg" alt="PGI 2018" style="width:100%;border-radius:12px;margin:15px 0;"><h2 style="font-size:1.3em;font-weight:700;color:var(--primary);margin:25px 0 12px;">Kỷ lục 242K viewers</h2><p style="line-height:1.9;color:var(--text2);">Năm 2020, anh lập kỷ lục 242,000 người xem đồng thời — gấp 6 lần sức chứa sân Mỹ Đình. MV "Stream đến bao giờ" đạt Top 1 Trending YouTube VN.</p>`},
  {title:'Refund Gaming — Chiến tích PGI 2018 Berlin',emoji:'🏆',cat:'eSports',grad:'linear-gradient(135deg,#f093fb,#f5576c)',content:`<h1 style="font-size:1.8em;font-weight:800;margin-bottom:15px;background:linear-gradient(135deg,#f093fb,#f5576c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Refund Gaming tại PGI 2018</h1><div style="color:var(--text2);font-size:0.85em;margin-bottom:25px;">📅 25/02/2026 | ✍️ Fan Page</div><p style="line-height:1.9;margin-bottom:20px;">Refund Gaming là đội PUBG do Độ Mixi sáng lập. Năm 2018, đội giành vé tham dự PUBG Global Invitational tại Berlin — giải PUBG lớn nhất thế giới.</p><img src="https://img.youtube.com/vi/nR_IHR6oF8w/hqdefault.jpg" alt="Refund Gaming PGI" style="width:100%;border-radius:12px;margin:15px 0;"><h2 style="font-size:1.3em;font-weight:700;color:var(--primary);margin:25px 0 12px;">Top 1 FPP</h2><p style="line-height:1.9;color:var(--text2);margin-bottom:15px;">Refund Gaming đạt Top 1 ở chế độ Góc nhìn thứ nhất (FPP), tạo nên chiến tích lịch sử cho eSports Việt Nam.</p><img src="https://img.youtube.com/vi/SPDE0ntfGSM/hqdefault.jpg" alt="PUBG Highlight" style="width:100%;border-radius:12px;margin:15px 0;"><h2 style="font-size:1.3em;font-weight:700;color:var(--primary);margin:25px 0 12px;">Di sản Refund Gaming</h2><p style="line-height:1.9;color:var(--text2);">Sau PGI, Refund Gaming trở thành biểu tượng của PUBG Việt Nam và là nền tảng cho sự phát triển của eSports nước nhà.</p>`},
  {title:'Discography: Từ Độ Tộc 1 đến Nóng! Hông Làm Quá',emoji:'🎵',cat:'Âm Nhạc',grad:'linear-gradient(135deg,#4facfe,#00f2fe)',content:`<h1 style="font-size:1.8em;font-weight:800;margin-bottom:15px;background:linear-gradient(135deg,#4facfe,#00f2fe);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Âm nhạc Độ Mixi</h1><div style="color:var(--text2);font-size:0.85em;margin-bottom:25px;">📅 20/02/2026 | ✍️ Fan Page</div><p style="line-height:1.9;margin-bottom:15px;">Độ Mixi không chỉ là streamer mà còn là ca sĩ với nhiều MV triệu views.</p><img src="https://img.youtube.com/vi/Jk38OqdAQxc/hqdefault.jpg" alt="Độ Tộc 2 MV" style="width:100%;border-radius:12px;margin:15px 0;"><h2 style="font-size:1.3em;font-weight:700;color:var(--primary);margin:25px 0 12px;">Các MV nổi bật</h2><p style="line-height:1.9;color:var(--text2);margin-bottom:15px;">"Độ Tộc 1" (2019), "Stream đến bao giờ" (2020 - Top 1 Trending), "Cô đơn không muốn về nhà" (2020), "Độ Tộc 2" (2021 - 100M+ views), "Nóng! Hông làm quá" (2023), "Noel Không Cô Đơn" (2023).</p><img src="https://img.youtube.com/vi/7hd7W6KF4so/hqdefault.jpg" alt="MixiMusic" style="width:100%;border-radius:12px;margin:15px 0;"><h2 style="font-size:1.3em;font-weight:700;color:var(--primary);margin:25px 0 12px;">MixiMusic</h2><p style="line-height:1.9;color:var(--text2);">Ngoài MV chính thức, Độ Mixi còn có series MixiMusic tổng hợp nhạc tự sáng tác cùng anh em Bộ Tộc.</p>`},
  {title:'Hoạt động từ thiện: Xây cầu, xây trường vùng cao',emoji:'❤️',cat:'Từ Thiện',grad:'linear-gradient(135deg,#43e97b,#38f9d7)',content:`<h1 style="font-size:1.8em;font-weight:800;margin-bottom:15px;background:linear-gradient(135deg,#43e97b,#38f9d7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Từ thiện MixiGaming</h1><div style="color:var(--text2);font-size:0.85em;margin-bottom:25px;">📅 15/02/2026 | ✍️ Fan Page</div><p style="line-height:1.9;margin-bottom:20px;">Lũ lụt miền Trung 2020: quyên góp 1.2 tỷ đồng (gia đình đóng 460 triệu).</p><img src="https://img.youtube.com/vi/2aGByfV0k6Y/hqdefault.jpg" alt="MixiCharity" style="width:100%;border-radius:12px;margin:15px 0;"><h2 style="font-size:1.3em;font-weight:700;color:var(--primary);margin:25px 0 12px;">Xây cầu & xây trường</h2><p style="line-height:1.9;color:var(--text2);margin-bottom:15px;">Tháng 1/2021: Xây cầu từ thiện ở quê Cao Bằng. Cuối 2021: Gây quỹ 1.3 tỷ xây trường tại Nghệ An và khánh thành điểm trường tại Sơn La.</p><img src="https://img.youtube.com/vi/rBDinocbnbc/hqdefault.jpg" alt="Sao Nhập Ngũ" style="width:100%;border-radius:12px;margin:15px 0;"><h2 style="font-size:1.3em;font-weight:700;color:var(--primary);margin:25px 0 12px;">Ảnh hưởng cộng đồng</h2><p style="line-height:1.9;color:var(--text2);">Các hoạt động từ thiện của Độ Mixi truyền cảm hứng cho hàng triệu fan và khẳng định vai trò của streamer trong xã hội.</p>`},
  {title:'Mixi Cup 2024: Giải bóng đá viral nhất VN',emoji:'⚽',cat:'Events',grad:'linear-gradient(135deg,#fa709a,#fee140)',content:`<h1 style="font-size:1.8em;font-weight:800;margin-bottom:15px;background:linear-gradient(135deg,#fa709a,#fee140);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Mixi Cup 2024</h1><div style="color:var(--text2);font-size:0.85em;margin-bottom:25px;">📅 10/02/2026 | ✍️ Fan Page</div><p style="line-height:1.9;margin-bottom:15px;">Giải quy tụ 4 đội: Refund Gaming, SBTC, 500BROS và AllStar F.C. tại sân Bà Rịa ngày 23-24/11/2024.</p><img src="https://img.youtube.com/vi/VWm_cV1Aoz4/hqdefault.jpg" alt="Mixi Cup 2024" style="width:100%;border-radius:12px;margin:15px 0;"><h2 style="font-size:1.3em;font-weight:700;color:var(--primary);margin:25px 0 12px;">Kỷ lục lượt xem</h2><p style="line-height:1.9;color:var(--text2);margin-bottom:15px;">Lượt xem trực tiếp gấp 8 lần sức chứa sân Mỹ Đình. Mixi ghi bàn đẹp trong trận mở màn.</p><img src="https://img.youtube.com/vi/jk7LbXUpmz0/hqdefault.jpg" alt="Mixi" style="width:100%;border-radius:12px;margin:15px 0;"><h2 style="font-size:1.3em;font-weight:700;color:var(--primary);margin:25px 0 12px;">Tầm ảnh hưởng</h2><p style="line-height:1.9;color:var(--text2);">Mixi Cup chứng minh sức mạnh cộng đồng MixiGaming và tạo tiền đề cho các giải đấu tiếp theo.</p>`},
  {title:'Sao Nhập Ngũ: Hành trình quân ngũ của Tộc trưởng',emoji:'🎖️',cat:'TV Show',grad:'linear-gradient(135deg,#a18cd1,#fbc2eb)',content:`<h1 style="font-size:1.8em;font-weight:800;margin-bottom:15px;background:linear-gradient(135deg,#a18cd1,#fbc2eb);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Sao Nhập Ngũ 2022</h1><div style="color:var(--text2);font-size:0.85em;margin-bottom:25px;">📅 05/02/2026 | ✍️ Fan Page</div><p style="line-height:1.9;margin-bottom:15px;">Năm 2022, Độ Mixi tham gia chương trình truyền hình "Sao nhập ngũ" cùng Hòa Minzy, Minh Tú, Anh Tú, Cara Phương, S.T Sơn Thạch.</p><img src="https://img.youtube.com/vi/rBDinocbnbc/hqdefault.jpg" alt="Sao Nhập Ngũ" style="width:100%;border-radius:12px;margin:15px 0;"><h2 style="font-size:1.3em;font-weight:700;color:var(--primary);margin:25px 0 12px;">Khoảnh khắc đáng nhớ</h2><p style="line-height:1.9;color:var(--text2);margin-bottom:15px;">Chương trình mang đến nhiều khoảnh khắc hài hước và cảm động, giúp khán giả hiểu thêm về con người Phùng Thanh Độ ngoài đời thực.</p><img src="https://img.youtube.com/vi/XQ9QzfUeW6A/hqdefault.jpg" alt="Ma Sói Độ Mixi" style="width:100%;border-radius:12px;margin:15px 0;"><h2 style="font-size:1.3em;font-weight:700;color:var(--primary);margin:25px 0 12px;">Sau Sao Nhập Ngũ</h2><p style="line-height:1.9;color:var(--text2);">Sau chương trình, Độ Mixi tiếp tục được nhiều nhãn hàng và chương trình truyền hình mời hợp tác.</p>`}
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
//  MUSIC PLAYER (Local Audio from musics/)
// ═══════════════════════════════════════════
const tracks=[
  {name:'Bến Yên Lãng',artist:'Sena và các đại thi hào',emoji:'🏞️',file:'musics/Bến Yên Lãng  Yen Lang Bund ( Bến Thượng Hải Parody ) - Sena và các đại thi hào - Sena và các đại thi hào.mp3'},
  {name:'Giao Hưởng Thank Độ',artist:'KillnTea',emoji:'🎻',file:'musics/GIAO HƯỞNG THANK ĐỘ - WOLFGANG KILLNTEA  NHẠC CỔ ĐIỂN HAY NHẤT MÀ BẠN NÊN NGHE MỘT LẦN TRONG ĐỜI - KillnTea.mp3'},
  {name:'Thank Độ (Cover)',artist:'KillnTea',emoji:'🎸',file:'musics/THANK DO (Cảm ơn anh Độ Mixi Cover) - Frank Killntea  NHẠC CHẾ ĐỘ CŨ THU THANH TRƯỚC 1975 - KillnTea.mp3'},
  {name:'Vua Yên Lãng',artist:'Hàng Mặc Thử',emoji:'👑',file:'musics/Vua Yên Lãng  - Cùng Vua Nhà Lý Và Quan Nịnh Thần Bật Nhạc Dọn Nhà Đón Tết 2026   Hàng Mặc Thử.mp3'},
  {name:'Ấn Độ Mixi (Nà Ná Na Na)',artist:'Vũ Văn Hiếu',emoji:'🎶',file:'musics/Ấn Độ Mixi (Nà Ná Na Na Anh Độ Mixi) - Vũ Văn Hiếu.mp3'},
];
let curTrack=0;
let bgAudio=null;
let isPlaying=false;
let hasUserInteracted=false;

function initMusicPlayer(){
  bgAudio=document.getElementById('bgAudio');
  if(!bgAudio) return;
  bgAudio.volume=0.5;

  // Auto-play random track on first user interaction
  const startOnInteraction=()=>{
    if(!hasUserInteracted){
      hasUserInteracted=true;
      shuffleTrack(true); // silent=true, no notification
      document.removeEventListener('click',startOnInteraction);
      document.removeEventListener('keydown',startOnInteraction);
      document.removeEventListener('touchstart',startOnInteraction);
      document.removeEventListener('scroll',startOnInteraction);
    }
  };
  document.addEventListener('click',startOnInteraction);
  document.addEventListener('keydown',startOnInteraction);
  document.addEventListener('touchstart',startOnInteraction);
  document.addEventListener('scroll',startOnInteraction);

  // Audio events
  bgAudio.addEventListener('timeupdate',updateProgress);
  bgAudio.addEventListener('ended',()=>nextTrack());
  bgAudio.addEventListener('play',()=>{
    isPlaying=true;
    updatePlayButtons();
  });
  bgAudio.addEventListener('pause',()=>{
    isPlaying=false;
    updatePlayButtons();
  });

  renderTrackList();
}

function renderTrackList(){
  const tl=document.getElementById('trackList');
  if(!tl) return;
  tl.innerHTML=tracks.map((t,i)=>{
    const isActive=i===curTrack;
    return `<div onclick="playTrack(${i})" style="display:flex;align-items:center;gap:12px;padding:10px 15px;border-radius:10px;cursor:pointer;transition:all 0.2s;background:${isActive?'rgba(108,99,255,0.2)':'rgba(108,99,255,0.05)'};border:1px solid ${isActive?'rgba(108,99,255,0.5)':'rgba(108,99,255,0.1)'};" onmouseover="this.style.background='rgba(108,99,255,0.15)'" onmouseout="this.style.background='${isActive?'rgba(108,99,255,0.2)':'rgba(108,99,255,0.05)'}'"><span style="font-size:1.5em;">${t.emoji}</span><div style="flex:1;min-width:0;"><div style="font-weight:600;font-size:0.9em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${t.name}</div><div style="color:var(--text2);font-size:0.78em;">${t.artist}</div></div>${isActive&&isPlaying?'<span style="color:var(--primary);font-size:0.85em;"><i class="fas fa-volume-up"></i></span>':'<span style="color:var(--text2);font-size:0.78em;"><i class="fas fa-music"></i></span>'}</div>`;
  }).join('');
}

function playTrack(i){
  curTrack=i;
  const t=tracks[i];
  if(!bgAudio) return;
  bgAudio.src=t.file;
  bgAudio.play().catch(()=>{});
  // Update main player UI
  const titleEl=document.getElementById('playerTitle');
  const artistEl=document.getElementById('playerArtist');
  if(titleEl) titleEl.textContent=t.name;
  if(artistEl) artistEl.textContent=t.artist;
  // Update floating bar
  const fmbTitle=document.getElementById('fmbTitle');
  const fmbArtist=document.getElementById('fmbArtist');
  if(fmbTitle) fmbTitle.textContent=t.name;
  if(fmbArtist) fmbArtist.textContent=t.artist;
  renderTrackList();
}

function togglePlay(){
  if(!bgAudio) return;
  if(bgAudio.paused){
    if(!bgAudio.src || bgAudio.src===''){
      shuffleTrack(true);
    } else {
      bgAudio.play().catch(()=>{});
    }
  } else {
    bgAudio.pause();
  }
}

function updatePlayButtons(){
  const icon=isPlaying?'fa-pause':'fa-play';
  // Main player button
  const mainBtn=document.getElementById('playPauseBtn');
  if(mainBtn) mainBtn.innerHTML=`<i class="fas ${icon}"></i>`;
  // Floating bar button
  const fmbBtn=document.getElementById('fmbPlayBtn');
  if(fmbBtn) fmbBtn.innerHTML=`<i class="fas ${icon}"></i>`;
  // Album spin
  const albumSpin=document.getElementById('albumSpin');
  if(albumSpin){
    if(isPlaying) albumSpin.classList.add('spinning');
    else albumSpin.classList.remove('spinning');
  }
  // Floating bar album
  const fmbAlbum=document.getElementById('fmbAlbum');
  if(fmbAlbum){
    if(isPlaying) fmbAlbum.classList.add('spinning');
    else fmbAlbum.classList.remove('spinning');
  }
  renderTrackList();
}

function updateProgress(){
  if(!bgAudio||!bgAudio.duration) return;
  const pct=(bgAudio.currentTime/bgAudio.duration)*100;
  // Main player progress
  const bar=document.getElementById('playerProgressBar');
  if(bar) bar.style.width=pct+'%';
  // Time display
  const curEl=document.getElementById('playerCurrentTime');
  const durEl=document.getElementById('playerDuration');
  if(curEl) curEl.textContent=formatTime(bgAudio.currentTime);
  if(durEl) durEl.textContent=formatTime(bgAudio.duration);
  // Floating bar progress
  const fmbProgress=document.getElementById('fmbProgress');
  if(fmbProgress) fmbProgress.style.setProperty('--progress',pct+'%');
}

function formatTime(s){
  if(isNaN(s)) return '0:00';
  const m=Math.floor(s/60);
  const sec=Math.floor(s%60);
  return m+':'+(sec<10?'0':'')+sec;
}

function seekMusic(e){
  if(!bgAudio||!bgAudio.duration) return;
  const rect=e.currentTarget.getBoundingClientRect();
  const pct=(e.clientX-rect.left)/rect.width;
  bgAudio.currentTime=pct*bgAudio.duration;
}

function setVolume(val){
  if(bgAudio) bgAudio.volume=val/100;
}

function nextTrack(){ playTrack((curTrack+1)%tracks.length); }
function prevTrack(){ playTrack((curTrack-1+tracks.length)%tracks.length); }
function shuffleTrack(silent){
  let r; do{ r=Math.floor(Math.random()*tracks.length); }while(r===curTrack && tracks.length>1);
  playTrack(r);
  if(!silent) showNotif('success','🔀 Ngẫu nhiên','Đã chuyển bài ngẫu nhiên');
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
//  HEADER SCROLL GLOW + SCROLL PROGRESS
// ═══════════════════════════════════════════
window.addEventListener('scroll',()=>{
  const pct=Math.min(window.scrollY/300,1);
  document.getElementById('mainHeader').style.background=`rgba(10,10,26,${0.85+pct*0.14})`;
  // Scroll progress bar
  const scrollTop=window.scrollY;
  const docHeight=document.documentElement.scrollHeight-window.innerHeight;
  const scrollPct=docHeight>0?(scrollTop/docHeight)*100:0;
  const sp=document.getElementById('scroll-progress');
  if(sp) sp.style.width=scrollPct+'%';
});

// ═══════════════════════════════════════════
//  RIPPLE EFFECT ON BUTTONS
// ═══════════════════════════════════════════
document.addEventListener('click',function(e){
  const btn=e.target.closest('.btn-ripple,.btn-primary,.btn-outline');
  if(!btn) return;
  const rect=btn.getBoundingClientRect();
  const ripple=document.createElement('span');
  ripple.className='ripple-effect';
  const size=Math.max(rect.width,rect.height);
  ripple.style.width=ripple.style.height=size+'px';
  ripple.style.left=(e.clientX-rect.left-size/2)+'px';
  ripple.style.top=(e.clientY-rect.top-size/2)+'px';
  btn.style.position='relative';
  btn.style.overflow='hidden';
  btn.appendChild(ripple);
  setTimeout(()=>ripple.remove(),600);
});

// ═══════════════════════════════════════════
//  SPARKLE MOUSE TRAIL
// ═══════════════════════════════════════════
(function initSparkle(){
  const canvas=document.getElementById('sparkle-canvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  window.addEventListener('resize',()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;});
  const sparkles=[];
  let lastX=0,lastY=0,frame=0;
  document.addEventListener('mousemove',e=>{lastX=e.clientX;lastY=e.clientY;});
  function addSparkle(){
    if(frame%3===0){
      sparkles.push({
        x:lastX+(Math.random()-0.5)*20,
        y:lastY+(Math.random()-0.5)*20,
        size:Math.random()*3+1,
        life:1,
        vx:(Math.random()-0.5)*1,
        vy:(Math.random()-0.5)*1-0.5,
        color:['#6c63ff','#f64f59','#43e97b','#4facfe','#fff'][Math.floor(Math.random()*5)]
      });
    }
    if(sparkles.length>60) sparkles.splice(0,sparkles.length-60);
  }
  function drawSparkles(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    frame++;
    addSparkle();
    for(let i=sparkles.length-1;i>=0;i--){
      const s=sparkles[i];
      s.x+=s.vx;
      s.y+=s.vy;
      s.life-=0.02;
      s.size*=0.98;
      if(s.life<=0){sparkles.splice(i,1);continue;}
      ctx.save();
      ctx.globalAlpha=s.life*0.6;
      ctx.fillStyle=s.color;
      // Draw star shape
      ctx.beginPath();
      for(let j=0;j<5;j++){
        const angle=(j*Math.PI*2/5)-Math.PI/2;
        const x=s.x+Math.cos(angle)*s.size;
        const y=s.y+Math.sin(angle)*s.size;
        j===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        const innerAngle=angle+Math.PI/5;
        ctx.lineTo(s.x+Math.cos(innerAngle)*s.size*0.4,s.y+Math.sin(innerAngle)*s.size*0.4);
      }
      ctx.closePath();
      ctx.fill();
      // Add glow
      ctx.shadowBlur=10;
      ctx.shadowColor=s.color;
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(drawSparkles);
  }
  drawSparkles();
})();

// ═══════════════════════════════════════════
//  3D TILT ON CARDS
// ═══════════════════════════════════════════
document.querySelectorAll('.glass-card,.team-card,.video-card,.blog-card').forEach(card=>{
  card.addEventListener('mousemove',function(e){
    const rect=this.getBoundingClientRect();
    const x=e.clientX-rect.left;
    const y=e.clientY-rect.top;
    const centerX=rect.width/2;
    const centerY=rect.height/2;
    const rotateX=(y-centerY)/centerY*-5;
    const rotateY=(x-centerX)/centerX*5;
    this.style.transform=`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    // Move glow
    let glow=this.querySelector('.card-glow');
    if(!glow){glow=document.createElement('div');glow.className='card-glow';this.appendChild(glow);}
    glow.style.left=x+'px';
    glow.style.top=y+'px';
    glow.style.opacity='1';
  });
  card.addEventListener('mouseleave',function(){
    this.style.transform='';
    const glow=this.querySelector('.card-glow');
    if(glow) glow.style.opacity='0';
  });
});

// ═══════════════════════════════════════════
//  PARALLAX ON SCROLL
// ═══════════════════════════════════════════
window.addEventListener('scroll',function(){
  const shapes=document.querySelectorAll('.floating-shape');
  const scrollY=window.scrollY;
  shapes.forEach((s,i)=>{
    const speed=(i+1)*0.03;
    s.style.transform=`translateY(${scrollY*speed}px)`;
  });
});

// ═══════════════════════════════════════════
//  CONFETTI ON PAGE LOAD
// ═══════════════════════════════════════════
function launchConfetti(){
  const colors=['#6c63ff','#f64f59','#43e97b','#4facfe','#fee140','#fbc2eb','#fff'];
  for(let i=0;i<50;i++){
    const conf=document.createElement('div');
    conf.style.cssText=`
      position:fixed;z-index:99999;pointer-events:none;
      width:${Math.random()*8+4}px;height:${Math.random()*8+4}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      border-radius:${Math.random()>0.5?'50%':'2px'};
      left:${Math.random()*100}vw;top:-10px;
      opacity:1;
    `;
    document.body.appendChild(conf);
    const duration=Math.random()*2000+1500;
    const drift=(Math.random()-0.5)*200;
    conf.animate([
      {transform:'translateY(0) rotate(0deg)',opacity:1},
      {transform:`translateY(100vh) translateX(${drift}px) rotate(${Math.random()*720}deg)`,opacity:0}
    ],{duration,easing:'cubic-bezier(0.25,0.46,0.45,0.94)'});
    setTimeout(()=>conf.remove(),duration);
  }
}
// Launch confetti after loading screen
setTimeout(launchConfetti,2000);

// ═══════════════════════════════════════════
//  TEAM PAGE EXPLOSIVE EFFECTS
// ═══════════════════════════════════════════

// --- Particle Background ---
function initTeamParticles(){
  const canvas=document.getElementById('teamParticleCanvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  let w,h;
  function resize(){w=canvas.width=canvas.parentElement.offsetWidth;h=canvas.height=canvas.parentElement.offsetHeight;}
  resize(); window.addEventListener('resize',resize);
  const particles=[];
  const colors=['#6c63ff','#f64f59','#43e97b','#4facfe','#fee140','#fbc2eb'];
  for(let i=0;i<80;i++){
    particles.push({
      x:Math.random()*w,y:Math.random()*h,
      vx:(Math.random()-0.5)*0.8,vy:(Math.random()-0.5)*0.8,
      r:Math.random()*3+1,
      color:colors[Math.floor(Math.random()*colors.length)],
      alpha:Math.random()*0.5+0.2,
      pulse:Math.random()*Math.PI*2
    });
  }
  function drawParticles(){
    ctx.clearRect(0,0,w,h);
    particles.forEach((p,i)=>{
      p.pulse+=0.02;
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0)p.x=w; if(p.x>w)p.x=0;
      if(p.y<0)p.y=h; if(p.y>h)p.y=0;
      const a=p.alpha*(0.6+0.4*Math.sin(p.pulse));
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.color;ctx.globalAlpha=a;ctx.fill();
      // Draw connections
      for(let j=i+1;j<particles.length;j++){
        const p2=particles[j];
        const dx=p.x-p2.x,dy=p.y-p2.y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<120){
          ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p2.x,p2.y);
          ctx.strokeStyle=p.color;ctx.globalAlpha=(1-dist/120)*0.15;
          ctx.lineWidth=0.5;ctx.stroke();
        }
      }
    });
    ctx.globalAlpha=1;
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

// --- Matrix Rain ---
function initTeamMatrix(){
  const canvas=document.getElementById('teamMatrixCanvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  let w,h;
  function resize(){w=canvas.width=canvas.parentElement.offsetWidth;h=canvas.height=canvas.parentElement.offsetHeight;}
  resize(); window.addEventListener('resize',resize);
  const chars='FOURDEVBOYSMIXIGAMING01<>{}[]#@!$%^&*HTMLCSSJS'.split('');
  const cols=Math.floor(w/18);
  const drops=Array(cols).fill(1);
  function drawMatrix(){
    ctx.fillStyle='rgba(10,10,26,0.05)';
    ctx.fillRect(0,0,w,h);
    ctx.font='14px monospace';
    drops.forEach((y,i)=>{
      const c=chars[Math.floor(Math.random()*chars.length)];
      const x=i*18;
      const hue=(i/cols)*360;
      ctx.fillStyle=`hsla(${hue},80%,60%,0.8)`;
      ctx.fillText(c,x,y*18);
      if(y*18>h && Math.random()>0.975) drops[i]=0;
      drops[i]++;
    });
  }
  setInterval(drawMatrix,60);
}

// --- Firework Burst ---
function launchTeamFireworks(){
  const colors=['#6c63ff','#f64f59','#43e97b','#4facfe','#fee140','#ff6b6b','#fbc2eb','#a8edea'];
  for(let f=0;f<8;f++){
    setTimeout(()=>{
      const cx=Math.random()*window.innerWidth;
      const cy=Math.random()*window.innerHeight*0.5+50;
      for(let i=0;i<30;i++){
        const p=document.createElement('div');
        p.className='firework-particle';
        const angle=(i/30)*Math.PI*2;
        const speed=Math.random()*150+80;
        const color=colors[Math.floor(Math.random()*colors.length)];
        const size=Math.random()*5+2;
        p.style.cssText=`
          position:fixed;left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;
          background:${color};border-radius:50%;z-index:99999;pointer-events:none;
          box-shadow:0 0 6px ${color},0 0 12px ${color};
        `;
        document.body.appendChild(p);
        const tx=Math.cos(angle)*speed;
        const ty=Math.sin(angle)*speed;
        p.animate([
          {transform:'translate(0,0) scale(1)',opacity:1},
          {transform:`translate(${tx}px,${ty+50}px) scale(0)`,opacity:0}
        ],{duration:Math.random()*800+600,easing:'cubic-bezier(0.25,0.46,0.45,0.94)'});
        setTimeout(()=>p.remove(),1500);
      }
    },f*300);
  }
}

// --- Lightning Flash ---
function teamLightningFlash(){
  for(let i=0;i<3;i++){
    setTimeout(()=>{
      const flash=document.createElement('div');
      flash.className='lightning-flash';
      document.body.appendChild(flash);
      setTimeout(()=>flash.remove(),200);
    },i*200);
  }
}

// --- Emoji Rain ---
function teamEmojiRain(){
  const emojis=['🎮','🎬','💻','🎧','⭐','🔥','💜','🎵','🚀','✨','🏆','👑','💎','🎯','⚡'];
  for(let i=0;i<40;i++){
    setTimeout(()=>{
      const em=document.createElement('div');
      em.className='emoji-rain';
      em.textContent=emojis[Math.floor(Math.random()*emojis.length)];
      em.style.left=Math.random()*100+'vw';
      em.style.animationDuration=(Math.random()*2+2)+'s';
      document.body.appendChild(em);
      setTimeout(()=>em.remove(),4500);
    },i*120);
  }
}

// --- Card Ripple Effect ---
function teamCardRipple(e,card){
  const rect=card.getBoundingClientRect();
  const rip=document.createElement('div');
  rip.className='ripple';
  rip.style.left=(e.clientX-rect.left)+'px';
  rip.style.top=(e.clientY-rect.top)+'px';
  rip.style.width='100px';rip.style.height='100px';
  rip.style.marginLeft='-50px';rip.style.marginTop='-50px';
  card.appendChild(rip);
  setTimeout(()=>rip.remove(),800);
}

// --- Sparkles around avatars ---
function spawnTeamSparkles(){
  const avatars=document.querySelectorAll('.team-avatar-explosive');
  avatars.forEach(av=>{
    setInterval(()=>{
      if(!document.getElementById('page-team').classList.contains('active'))return;
      const spark=document.createElement('div');
      spark.className='sparkle';
      const colors=['#6c63ff','#f64f59','#43e97b','#4facfe','#fee140'];
      spark.style.background=colors[Math.floor(Math.random()*colors.length)];
      spark.style.left=(Math.random()*140)+'px';
      spark.style.top=(Math.random()*140)+'px';
      spark.style.boxShadow=`0 0 6px ${spark.style.background}`;
      av.appendChild(spark);
      setTimeout(()=>spark.remove(),1500);
    },500);
  });
}

// --- Team Stats Counter Animation ---
function animateTeamStats(){
  document.querySelectorAll('.team-stat-number[data-count]').forEach(el=>{
    const target=parseInt(el.getAttribute('data-count'));
    let current=0;
    const increment=target/60;
    const timer=setInterval(()=>{
      current+=increment;
      if(current>=target){current=target;clearInterval(timer);}
      el.textContent=Math.floor(current)+(target===100?'%':'+').replace('+','');
      if(target===100)el.textContent=Math.floor(current)+'%';
      else if(target>=100)el.textContent=Math.floor(current)+'+';
      else el.textContent=Math.floor(current);
    },30);
  });
}

// --- Team Skill Bars Animation ---
function animateTeamSkills(){
  document.querySelectorAll('.team-skill-fill[data-width]').forEach(bar=>{
    setTimeout(()=>{
      bar.style.width=bar.getAttribute('data-width')+'%';
    },500);
  });
}

// --- 3D Tilt Effect on Team Cards ---
function initTeamTilt(){
  document.querySelectorAll('.team-card-explosive').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const rect=card.getBoundingClientRect();
      const x=(e.clientX-rect.left)/rect.width-0.5;
      const y=(e.clientY-rect.top)/rect.height-0.5;
      card.style.transform=`perspective(1000px) rotateY(${x*15}deg) rotateX(${-y*15}deg) translateY(-10px) scale(1.02)`;
    });
    card.addEventListener('mouseleave',()=>{
      card.style.transform='perspective(1000px) rotateY(0) rotateX(0) translateY(0) scale(1)';
      card.style.transition='transform 0.6s cubic-bezier(0.23,1,0.32,1)';
    });
    card.addEventListener('mouseenter',()=>{
      card.style.transition='transform 0.1s ease-out';
    });
  });
}

// --- Hook into showPage ---
const origShowPage=showPage;
window.showPage=function(id,el){
  origShowPage(id,el);
  if(id==='team'){
    // Show team reveal overlay first
    showTeamReveal();
    // Big entrance effects after reveal
    setTimeout(()=>{
      teamLightningFlash();
    },200);
    setTimeout(()=>launchTeamFireworks(),400);
    setTimeout(()=>teamEmojiRain(),1000);
    setTimeout(()=>{
      animateTeamStats();
      animateTeamSkills();
    },600);
  }
};

// --- Team Reveal Overlay ---
function showTeamReveal(){
  const overlay=document.getElementById('teamRevealOverlay');
  if(!overlay) return;
  // Reset: remove closing class, reset member animations
  overlay.classList.remove('closing');
  overlay.querySelectorAll('.reveal-member').forEach(m=>{
    m.style.animation='none';
    m.offsetHeight; // force reflow
  });
  overlay.querySelector('.reveal-title').style.animation='none';
  overlay.querySelector('.reveal-line').style.animation='none';
  overlay.querySelectorAll('.reveal-spotlight').forEach(s=>{s.style.animation='none';});
  overlay.querySelector('.reveal-skip').style.animation='none';
  overlay.querySelectorAll('.reveal-photo-glow').forEach(g=>{g.style.animation='none';});
  // Force reflow
  void overlay.offsetHeight;
  // Re-apply animations
  overlay.querySelector('.reveal-title').style.animation='revealTitleIn 0.8s 0.2s ease-out forwards';
  overlay.querySelector('.reveal-line').style.animation='lineExpand 1s 0.6s ease-out forwards';
  const spots=overlay.querySelectorAll('.reveal-spotlight');
  spots[0].style.animation='spotReveal 0.6s 0.3s ease-out forwards';
  spots[1].style.animation='spotReveal 0.6s 0.5s ease-out forwards';
  spots[2].style.animation='spotReveal 0.6s 0.7s ease-out forwards';
  spots[3].style.animation='spotReveal 0.6s 0.9s ease-out forwards';
  const members=overlay.querySelectorAll('.reveal-member');
  members[0].style.animation='memberRevealIn 0.9s 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards';
  members[1].style.animation='memberRevealIn 0.9s 1.1s cubic-bezier(0.34,1.56,0.64,1) forwards';
  members[2].style.animation='memberRevealIn 0.9s 1.4s cubic-bezier(0.34,1.56,0.64,1) forwards';
  members[3].style.animation='memberRevealIn 0.9s 1.7s cubic-bezier(0.34,1.56,0.64,1) forwards';
  overlay.querySelectorAll('.reveal-photo-glow').forEach(g=>{
    g.style.animation='photoGlowIn 1s 1.5s ease-out forwards';
  });
  overlay.querySelector('.reveal-skip').style.animation='skipFadeIn 0.5s 2.5s ease-out forwards';
  // Show overlay
  overlay.classList.add('active');
  // Auto close after 4.5s
  clearTimeout(window._teamRevealTimer);
  window._teamRevealTimer=setTimeout(()=>closeTeamReveal(),4500);
}

function closeTeamReveal(){
  clearTimeout(window._teamRevealTimer);
  const overlay=document.getElementById('teamRevealOverlay');
  if(!overlay||!overlay.classList.contains('active')) return;
  overlay.classList.add('closing');
  // Launch extra fireworks on close for impact
  launchTeamFireworks();
  setTimeout(()=>{
    overlay.classList.remove('active','closing');
  },800);
}

// --- Initialize team effects on DOM ready ---
document.addEventListener('DOMContentLoaded',()=>{
  initTeamParticles();
  initTeamMatrix();
  spawnTeamSparkles();
  initTeamTilt();
  spawnGroupPhotoSparkles();
});

// --- Group Photo Sparkles ---
function spawnGroupPhotoSparkles(){
  const container=document.getElementById('teamPhotoSparkles');
  if(!container) return;
  const colors=['#6c63ff','#f64f59','#43e97b','#4facfe','#fee140','#fbc2eb','#fff'];
  setInterval(()=>{
    if(!document.getElementById('page-team').classList.contains('active'))return;
    const spark=document.createElement('div');
    spark.className='team-photo-sparkle';
    const size=Math.random()*6+3;
    const color=colors[Math.floor(Math.random()*colors.length)];
    spark.style.cssText=`
      width:${size}px;height:${size}px;
      background:${color};
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      box-shadow:0 0 ${size*2}px ${color};
    `;
    container.appendChild(spark);
    setTimeout(()=>spark.remove(),2000);
  },300);
}

// ===========================
// MINIGAME PAGE
// ===========================

// --- Game Tab Switcher ---
function switchGame(gameId, btn) {
  document.querySelectorAll('.game-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.game-tab').forEach(t => t.classList.remove('active'));
  const panel = document.getElementById('game-' + gameId);
  if (panel) panel.classList.add('active');
  if (btn) btn.classList.add('active');
}

// ==========================================
// GAME 1: QUIZ - Độ Mixi Knowledge
// ==========================================
const quizQuestions = [
  {
    q: "Tên thật của Độ Mixi là gì?",
    opts: ["Phùng Thanh Độ", "Nguyễn Văn Độ", "Trần Minh Độ", "Lê Thanh Độ"],
    ans: 0
  },
  {
    q: "Độ Mixi sinh năm bao nhiêu?",
    opts: ["1987", "1989", "1992", "1994"],
    ans: 1
  },
  {
    q: "Quê quán Độ Mixi ở đâu?",
    opts: ["Hà Nội", "Cao Bằng", "Bắc Kạn", "Lạng Sơn"],
    ans: 1
  },
  {
    q: "Biệt danh 'Tộc Trưởng' của Độ Mixi bắt nguồn từ game nào?",
    opts: ["PUBG", "CS:GO", "Free Fire", "Clash of Clans"],
    ans: 0
  },
  {
    q: "Kênh YouTube MixiGaming đạt mốc bao nhiêu triệu sub (tính đến 2026)?",
    opts: ["5 triệu", "7 triệu", "8 triệu", "10 triệu"],
    ans: 2
  },
  {
    q: "Đội tuyển eSports của Độ Mixi có tên là gì?",
    opts: ["Team Flash", "Refund Gaming", "GAM Esports", "SBTC Esports"],
    ans: 1
  },
  {
    q: "Bài hát nổi tiếng nào của Độ Mixi có hơn 100 triệu view?",
    opts: ["Đến Bao Giờ", "Độ Tộc 2", "Nà Na Na Na", "Tìm Em Trong Mơ"],
    ans: 1
  },
  {
    q: "Giải bóng đá do Độ Mixi tổ chức có tên là gì?",
    opts: ["Mixi League", "MixiCup", "Tộc Cup", "Bộ Tộc League"],
    ans: 1
  },
  {
    q: "Độ Mixi tham gia chương trình truyền hình thực tế nào năm 2022?",
    opts: ["Running Man VN", "Sao Nhập Ngũ", "2 Ngày 1 Đêm", "The Amazing Race"],
    ans: 1
  },
  {
    q: "Biệt phủ 7 tầng của Độ Mixi nằm ở đường nào tại Hà Nội?",
    opts: ["Phố Huế", "Yên Lãng", "Giải Phóng", "Láng Hạ"],
    ans: 1
  },
  {
    q: "Cộng đồng fan của Độ Mixi được gọi là gì?",
    opts: ["Mixi Army", "Bộ Tộc", "Tộc Mixi", "Mixers"],
    ans: 1
  },
  {
    q: "Độ Mixi từng đạt giải gì tại PUBG?",
    opts: ["Top 1 thế giới", "Vô địch Châu Á", "Đại diện VN thi PGI 2018", "Không tham gia thi đấu"],
    ans: 2
  }
];

let quizState = {};

function startQuiz() {
  const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
  quizState = {
    questions: shuffled,
    current: 0,
    score: 0,
    correct: 0,
    wrong: 0,
    startTime: Date.now(),
    timer: null,
    timeLeft: 15
  };
  document.getElementById('quizStart').style.display = 'none';
  document.getElementById('quizResult').style.display = 'none';
  document.getElementById('quizContent').style.display = 'block';
  document.querySelector('.quiz-header').style.display = 'block';
  showQuizQuestion();
}

function showQuizQuestion() {
  const qs = quizState;
  if (qs.current >= qs.questions.length) return endQuiz();
  const q = qs.questions[qs.current];
  document.getElementById('quizQuestionNum').textContent = `Câu ${qs.current + 1}/${qs.questions.length}`;
  document.getElementById('quizScore').textContent = `Điểm: ${qs.score}`;
  document.getElementById('quizProgressBar').style.width = ((qs.current) / qs.questions.length * 100) + '%';

  document.getElementById('quizQuestion').textContent = q.q;
  const optsEl = document.getElementById('quizOptions');
  optsEl.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('div');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(i);
    optsEl.appendChild(btn);
  });

  // Timer
  qs.timeLeft = 15;
  document.getElementById('quizTime').textContent = qs.timeLeft;
  clearInterval(qs.timer);
  qs.timer = setInterval(() => {
    qs.timeLeft--;
    document.getElementById('quizTime').textContent = qs.timeLeft;
    if (qs.timeLeft <= 0) {
      clearInterval(qs.timer);
      selectAnswer(-1); // time out
    }
  }, 1000);
}

function selectAnswer(idx) {
  clearInterval(quizState.timer);
  const q = quizState.questions[quizState.current];
  const opts = document.querySelectorAll('.quiz-option');
  opts.forEach(o => o.style.pointerEvents = 'none');

  if (idx === q.ans) {
    opts[idx].classList.add('correct');
    quizState.score += 10;
    quizState.correct++;
  } else {
    if (idx >= 0) opts[idx].classList.add('wrong');
    opts[q.ans].classList.add('correct');
    quizState.wrong++;
  }

  setTimeout(() => {
    quizState.current++;
    showQuizQuestion();
  }, 1200);
}

function endQuiz() {
  const qs = quizState;
  clearInterval(qs.timer);
  const totalTime = Math.round((Date.now() - qs.startTime) / 1000);
  document.getElementById('quizContent').style.display = 'none';
  document.querySelector('.quiz-header').style.display = 'none';
  document.getElementById('quizResult').style.display = 'block';

  document.getElementById('resultScore').textContent = `${qs.score}/${qs.questions.length * 10}`;
  document.getElementById('resultCorrect').textContent = qs.correct;
  document.getElementById('resultWrong').textContent = qs.wrong;
  document.getElementById('resultTime').textContent = totalTime + 's';

  let icon, title, msg;
  const pct = qs.correct / qs.questions.length;
  if (pct >= 0.9) { icon = '🏆'; title = 'Tộc Trưởng Thứ Thiệt!'; msg = 'Bạn là fan cứng của Độ Mixi!'; }
  else if (pct >= 0.7) { icon = '🥈'; title = 'Khá Lắm!'; msg = 'Bạn khá hiểu về Tộc Trưởng rồi đó!'; }
  else if (pct >= 0.5) { icon = '😊'; title = 'Tạm Được!'; msg = 'Cần xem thêm video Độ Mixi nhé!'; }
  else { icon = '📚'; title = 'Cần Học Thêm!'; msg = 'Hãy theo dõi MixiGaming nhiều hơn nha!'; }

  document.getElementById('resultIcon').textContent = icon;
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultMessage').textContent = msg;

  // Save best
  const best = localStorage.getItem('mixiQuizBest');
  if (!best || qs.score > parseInt(best)) localStorage.setItem('mixiQuizBest', qs.score);
  updateLeaderboard();
}

// ==========================================
// GAME 2: MEMORY CARDS
// ==========================================
// Các icon liên quan đến Độ Mixi: PUBG, headshot, Refund Gaming, MixiCup, stream, Cao Bằng, Bộ Tộc, music
const memoryItems = [
  { emoji: '🔫', label: 'PUBG' },
  { emoji: '🎯', label: 'Headshot' },
  { emoji: '🏆', label: 'Refund Gaming' },
  { emoji: '⚽', label: 'MixiCup' },
  { emoji: '📺', label: 'Stream' },
  { emoji: '🏔️', label: 'Cao Bằng' },
  { emoji: '👨‍👩‍👦‍👦', label: 'Bộ Tộc' },
  { emoji: '🎤', label: 'Độ Tộc 2' },
];
const memoryEmojis = memoryItems.map(m => m.emoji);
let memState = {};

function startMemory() {
  const pairs = [...memoryEmojis, ...memoryEmojis].sort(() => Math.random() - 0.5);
  memState = {
    cards: pairs,
    flipped: [],
    matched: 0,
    moves: 0,
    startTime: Date.now(),
    timer: null,
    locked: false
  };

  document.getElementById('memoryStart').style.display = 'none';
  document.getElementById('memoryResult').style.display = 'none';
  document.getElementById('memoryGrid').style.display = 'grid';

  const grid = document.getElementById('memoryGrid');
  grid.innerHTML = '';
  pairs.forEach((emoji, i) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.index = i;
    const item = memoryItems.find(m => m.emoji === emoji);
    card.innerHTML = `
      <div class="memory-card-front"><span class="mem-logo">MG</span></div>
      <div class="memory-card-back"><span class="mem-emoji">${emoji}</span><span class="mem-label">${item ? item.label : ''}</span></div>
    `;
    card.onclick = () => flipCard(card, i);
    grid.appendChild(card);
  });

  updateMemoryUI();
  clearInterval(memState.timer);
  memState.timer = setInterval(() => {
    document.getElementById('memoryTime').textContent = Math.round((Date.now() - memState.startTime) / 1000);
  }, 1000);
}

function flipCard(card, idx) {
  if (memState.locked) return;
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
  if (memState.flipped.length >= 2) return;

  card.classList.add('flipped');
  memState.flipped.push({ card, idx, emoji: memState.cards[idx] });

  if (memState.flipped.length === 2) {
    memState.moves++;
    memState.locked = true;
    const [a, b] = memState.flipped;

    if (a.emoji === b.emoji) {
      setTimeout(() => {
        a.card.classList.add('matched');
        b.card.classList.add('matched');
        memState.matched++;
        memState.flipped = [];
        memState.locked = false;
        updateMemoryUI();
        if (memState.matched === memoryEmojis.length) endMemory();
      }, 500);
    } else {
      setTimeout(() => {
        a.card.classList.remove('flipped');
        b.card.classList.remove('flipped');
        memState.flipped = [];
        memState.locked = false;
      }, 800);
    }
    updateMemoryUI();
  }
}

function updateMemoryUI() {
  document.getElementById('memoryMoves').textContent = `Lượt: ${memState.moves}`;
  document.getElementById('memoryPairs').textContent = `Cặp: ${memState.matched}/${memoryEmojis.length}`;
}

function endMemory() {
  clearInterval(memState.timer);
  const totalTime = Math.round((Date.now() - memState.startTime) / 1000);
  document.getElementById('memoryGrid').style.display = 'none';
  document.getElementById('memoryResult').style.display = 'block';
  document.getElementById('memResultMoves').textContent = memState.moves;
  document.getElementById('memResultTime').textContent = totalTime + 's';

  const best = localStorage.getItem('mixiMemoryBest');
  if (!best || memState.moves < parseInt(best)) localStorage.setItem('mixiMemoryBest', memState.moves);
  updateLeaderboard();
}

// ==========================================
// GAME 3: REACTION TIME TEST
// ==========================================
let reactionState = { phase: 'idle', timeout: null, startTime: 0, times: [], best: Infinity };

function startReaction() {
  const box = document.getElementById('reactionBox');
  hideAllReactionScreens();
  document.getElementById('reactionWait').style.display = 'block';
  box.className = 'reaction-box waiting';
  reactionState.phase = 'waiting';

  const delay = 1500 + Math.random() * 3500; // 1.5s - 5s random
  clearTimeout(reactionState.timeout);
  reactionState.timeout = setTimeout(() => {
    hideAllReactionScreens();
    document.getElementById('reactionGo').style.display = 'block';
    box.className = 'reaction-box go';
    reactionState.phase = 'go';
    reactionState.startTime = Date.now();
  }, delay);
}

function handleReactionClick() {
  if (reactionState.phase === 'waiting') {
    // Clicked too early
    clearTimeout(reactionState.timeout);
    hideAllReactionScreens();
    document.getElementById('reactionTooSoon').style.display = 'block';
    document.getElementById('reactionBox').className = 'reaction-box';
    reactionState.phase = 'idle';
  } else if (reactionState.phase === 'go') {
    const time = Date.now() - reactionState.startTime;
    reactionState.times.push(time);
    if (time < reactionState.best) reactionState.best = time;

    hideAllReactionScreens();
    document.getElementById('reactionResult').style.display = 'block';
    document.getElementById('reactionBox').className = 'reaction-box';
    reactionState.phase = 'idle';

    document.getElementById('reactionTimeResult').textContent = time + 'ms';
    document.getElementById('reactionAttempts').textContent = reactionState.times.length;
    document.getElementById('reactionBest').textContent = reactionState.best + 'ms';

    const avg = Math.round(reactionState.times.reduce((a, b) => a + b, 0) / reactionState.times.length);
    document.getElementById('reactionAvg').textContent = avg + 'ms';

    let emoji, msg;
    if (time < 200) { emoji = '🏆'; msg = 'HEADSHOT! Phản xạ ngang Độ Mixi thời PGI 2018!'; }
    else if (time < 300) { emoji = '🔫'; msg = 'Bắn tỉa chuẩn! Xứng đáng vào Refund Gaming!'; }
    else if (time < 400) { emoji = '🎯'; msg = 'Tạm được! Cần luyện thêm PUBG với Tộc Trưởng!'; }
    else { emoji = '💀'; msg = 'Bạn đã bị tiêu diệt! Tộc Trưởng thất vọng lắm...'; }

    document.getElementById('reactionEmoji').textContent = emoji;
    document.getElementById('reactionMsg').textContent = msg;

    // Save best
    const saved = localStorage.getItem('mixiReactionBest');
    if (!saved || reactionState.best < parseInt(saved)) localStorage.setItem('mixiReactionBest', reactionState.best);
    updateLeaderboard();
  }
}

function hideAllReactionScreens() {
  ['reactionContent', 'reactionWait', 'reactionGo', 'reactionResult', 'reactionTooSoon']
    .forEach(id => document.getElementById(id).style.display = 'none');
}

// --- Leaderboard ---
function updateLeaderboard() {
  const quizBest = localStorage.getItem('mixiQuizBest');
  const memBest = localStorage.getItem('mixiMemoryBest');
  const reactBest = localStorage.getItem('mixiReactionBest');

  if (quizBest) document.getElementById('lbQuiz').textContent = quizBest + ' điểm';
  if (memBest) document.getElementById('lbMemory').textContent = memBest + ' lượt';
  if (reactBest) document.getElementById('lbReaction').textContent = reactBest + 'ms';
}

// Load leaderboard on page load
document.addEventListener('DOMContentLoaded', updateLeaderboard);