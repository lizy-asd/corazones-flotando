/* ====== util ====== */
const rand = (a,b)=> Math.random()*(b-a)+a;
const choice = a => a[Math.floor(Math.random()*a.length)];

/* ====== perfil de rendimiento ====== */
const IS_LOWPOWER =
  window.matchMedia('(max-width: 480px), (prefers-reduced-motion: reduce)').matches ||
  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

let warmed = false;          // se activa cuando termina el warm-up
let firstBurstDone = false;  // control del primer estallido

/* ====== estrellas ====== */
function createStars(id,count){
  const el = document.getElementById(id);
  const frag = document.createDocumentFragment();
  for(let i=0;i<count;i++){
    const s = document.createElement('span');
    s.className = 'star';
    s.style.left = rand(0,100)+'vw';
    s.style.top  = rand(0,100)+'vh';
    s.style.setProperty('--tw', rand(1.6,2.8)+'s');
    s.style.setProperty('--dr', rand(20,40)+'s');
    frag.appendChild(s);
  }
  el.appendChild(frag);
}

/* ====== constelaciones ====== */
function drawConstellations(){
  const svg = document.querySelector('.constellations');
  const NS  = 'http://www.w3.org/2000/svg';
  for(let c=0;c<3;c++){
    const pl = document.createElementNS(NS,'polyline');
    const pts=[];
    const cx=rand(10,90), cy=rand(10,50);
    for(let i=0;i<6;i++) pts.push((cx+rand(-15,15))+','+(cy+rand(-10,10)));
    pl.setAttribute('points', pts.join(' '));
    pl.setAttribute('opacity', rand(0.15,0.35).toFixed(2));
    svg.appendChild(pl);
  }
}

/* ====== nubes ====== */
function createClouds(id,count,yMin,yMax,sizeMin,sizeMax){
  const el = document.getElementById(id);
  const frag = document.createDocumentFragment();
  for(let i=0;i<count;i++){
    const c = document.createElement('span');
    c.className='cloud';
    c.style.setProperty('--w',  rand(sizeMin,sizeMax)+'vmin');
    c.style.setProperty('--y',  rand(yMin,yMax)+'vh');
    c.style.setProperty('--spd',rand(70,150)+'s');
    c.style.left = rand(-40,100)+'vw';
    frag.appendChild(c);
  }
  el.appendChild(frag);
}

/* ====== estrellas fugaces ====== */
function shootingStar(){
  const s = document.createElement('span');
  s.className='shooting';
  s.style.setProperty('--rot', (rand(-30,-15))+'deg');
  s.style.setProperty('--sx',  rand(-20,-5)+'vw');
  s.style.setProperty('--sy',  rand(5,35)+'vh');
  s.style.setProperty('--ex',  rand(25,45)+'vw');
  s.style.setProperty('--ey',  rand(-20,-35)+'vh');
  document.body.appendChild(s);
  s.addEventListener('animationend', ()=>s.remove(), {once:true});
}
setInterval(()=>{ if(document.visibilityState==='visible') shootingStar(); }, 4500);

/* ====== parallax desactivado ====== */
function parallax(){}

/* ====== generar fondo ====== */
createStars('stars-back',  IS_LOWPOWER ? 80 : 120);
createStars('stars-mid',   IS_LOWPOWER ? 60 : 90);
createStars('stars-front', IS_LOWPOWER ? 40 : 60);
drawConstellations();
createClouds('clouds-back',  IS_LOWPOWER ? 4 : 5, 10, 40, 30, 46);
createClouds('clouds-mid',   IS_LOWPOWER ? 5 : 6, 25, 65, 28, 40);
createClouds('clouds-front', IS_LOWPOWER ? 3 : 4, 55, 85, 34, 48);

/* Limpieza de transform de pruebas anteriores */
['#stars-back','#stars-mid','#stars-front','#clouds-back','#clouds-mid','#clouds-front','.aurora']
  .forEach(sel=>{ document.querySelectorAll(sel).forEach(el=> el.style.transform=''); });

/* ====== corazones + frases ====== */
const layer       = document.getElementById('hearts-layer');
const tplHeart    = document.getElementById('heart-template');
const tplPhrase   = document.getElementById('phrase-template');
const tplParticle = document.getElementById('particle-template');

const PHRASES = [
  "Te amo💝","Mi vida💐","Me encantas💞","Te extraño siempre💞",
  "Siempre tú💞","Contigo por siempre💞","Gracias por existir💞",
  "Para siempre tú💖","Quédate siempre💞","Tu amor me hace crecer💞","Gracias por amarme💞"
];

function spawnHeart(){
  const h = tplHeart.content.firstElementChild.cloneNode(true);
  h.style.left = rand(6,94)+'vw';
  h.style.top  = '110vh';
  const s = rand(40,70); h.style.width = h.style.height = s+'px';
  h.style.animation = `floatUp ${rand(9,15)}s linear forwards`;
  h.addEventListener('animationend', ()=>h.remove(), {once:true});
  h.addEventListener('pointerdown', e => { e.currentTarget.blur?.(); popHeart(e,h); }, {passive:true});
  layer.appendChild(h);
}

function popHeart(e, heart){
  const r = layer.getBoundingClientRect();
  const x = e.clientX - r.left, y = e.clientY - r.top;
  showPhrase(x,y);
  burst(x,y);
  heart.remove();
}

function showPhrase(x,y){
  const el = tplPhrase.content.firstElementChild.cloneNode(true);
  el.textContent = choice(PHRASES);
  el.style.left = x+'px';
  el.style.top  = y+'px';
  // Primer frase: sin text-shadow (lo añade el CSS), para evitar hitch si aún no está cacheado
  if (!warmed) el.style.textShadow = 'none';
  layer.appendChild(el);
  setTimeout(()=>el.remove(), 1200);
}

function burst(x,y){
  // Primer burst ULTRA-LIGERO, luego normal/adaptativo
  const MAX   = IS_LOWPOWER ? 8 : 14;
  const count = !firstBurstDone ? 4 : (warmed ? MAX : Math.min(6,MAX));

  const frag = document.createDocumentFragment();
  for(let i=0;i<count;i++){
    const p = tplParticle.content.firstElementChild.cloneNode(true);
    const a = (Math.PI*2*i)/count + rand(-0.15,0.15);
    const d = rand(26,90);
    p.style.left = x+'px'; p.style.top = y+'px';
    p.style.setProperty('--tx', Math.cos(a)*d+'px');
    p.style.setProperty('--ty', Math.sin(a)*d+'px');
    // En el primer estallido y/o equipos modestos: sin sombras ni gradientes pesadas
    if (!firstBurstDone || IS_LOWPOWER){
      p.style.boxShadow = 'none';
      p.style.background = 'linear-gradient(145deg,#ff4f80,#ff8fb0)'; // sin radial
    }
    frag.appendChild(p);
    p.addEventListener('animationend', ()=>p.remove(), {once:true});
  }
  layer.appendChild(frag);
  firstBurstDone = true;
}

/* activar corazones */
for(let i=0;i<14;i++) spawnHeart();
(function loop(){ spawnHeart(); setTimeout(loop, rand(800,1300)); })();

/* toque en el cielo (ignora corazones para evitar doble efecto) */
document.body.addEventListener('pointerdown', e=>{
  if (e.target.closest('.heart')) return;
  const r = layer.getBoundingClientRect();
  burst(e.clientX - r.left, e.clientY - r.top);
}, {passive:true});

/* ====== WARM-UP AGRESIVO (ejecuta ya mismo) ====== */
(function warmUp(){
  if (warmed) return;
  // 1) crea 1 corazón off-screen y ejecuta su animación (compila SVG + keyframes)
  const h = tplHeart.content.firstElementChild.cloneNode(true);
  h.style.left='-200px'; h.style.top='110vh'; h.style.width=h.style.height='50px';
  h.style.animation='floatUp 0.8s linear forwards';
  layer.appendChild(h);
  h.addEventListener('animationend', ()=>h.remove(), {once:true});

  // 2) mini burst fuera de pantalla
  burst(-100,-100);

  // 3) mini frase oculta para cachear fuente
  const el = tplPhrase.content.firstElementChild.cloneNode(true);
  el.textContent = "✨";
  el.style.left='-9999px'; el.style.top='-9999px';
  el.style.textShadow='none';
  layer.appendChild(el);
  setTimeout(()=>el.remove(), 60);

  warmed = true;
})();
