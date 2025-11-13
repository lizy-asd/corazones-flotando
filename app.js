/* ====== helpers ====== */
const rand   = (a,b)=> Math.random()*(b-a)+a;
const choice = arr => arr[Math.floor(Math.random()*arr.length)];
const IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;

/* ====== fondo: estrellas ====== */
function createStars(id, count){
  const el   = document.getElementById(id);
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

/* ====== fondo: nubes ====== */
function createClouds(id,count,yMin,yMax,sizeMin,sizeMax){
  const el   = document.getElementById(id);
  const frag = document.createDocumentFragment();
  for(let i=0;i<count;i++){
    const c = document.createElement('span');
    c.className = 'cloud';
    c.style.setProperty('--w',  rand(sizeMin,sizeMax)+'vmin');
    c.style.setProperty('--y',  rand(yMin,yMax)+'vh');
    c.style.setProperty('--spd',rand(70,150)+'s');
    c.style.left = rand(-40,100)+'vw';
    frag.appendChild(c);
  }
  el.appendChild(frag);
}

/* ====== generar fondo ====== */
createStars('stars-back',  IS_MOBILE ? 50 : 120);
createStars('stars-mid',   IS_MOBILE ? 40 : 90);
createStars('stars-front', IS_MOBILE ? 30 : 60);

createClouds('clouds-back',  IS_MOBILE ? 3 : 5, 10, 40, 30, 46);
createClouds('clouds-mid',   IS_MOBILE ? 4 : 6, 25, 65, 28, 40);
createClouds('clouds-front', IS_MOBILE ? 2 : 4, 55, 85, 34, 48);

/* limpiar posibles transforms antiguos */
['#stars-back','#stars-mid','#stars-front',
 '#clouds-back','#clouds-mid','#clouds-front','.aurora']
  .forEach(sel=>{
    document.querySelectorAll(sel).forEach(el=>el.style.transform='');
  });

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
  const size = rand(40,70);
  h.style.width = h.style.height = size+'px';
  h.style.animation = `floatUp ${rand(9,15)}s linear forwards`;

  // usamos pointerdown para que responda rápido en móvil
  h.addEventListener('pointerdown', e=>{
    e.preventDefault();
    h.blur?.();
    popHeart(e, h);
  }, {passive:true});

  h.addEventListener('animationend', ()=>h.remove(), {once:true});
  layer.appendChild(h);
}

function popHeart(e, heart){
  const rect = layer.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  showPhrase(x,y);
  burst(x,y);
  heart.remove();
}

function showPhrase(x,y){
  const el = tplPhrase.content.firstElementChild.cloneNode(true);
  el.textContent = choice(PHRASES);
  el.style.left = x+'px';
  el.style.top  = y+'px';
  layer.appendChild(el);
  setTimeout(()=>el.remove(), 1300);
}

function burst(x,y){
  // MUY poquitas partículas en móvil
  const count = IS_MOBILE ? 6 : 12;
  const frag  = document.createDocumentFragment();

  for(let i=0;i<count;i++){
    const p = tplParticle.content.firstElementChild.cloneNode(true);
    const a = (Math.PI*2*i)/count + rand(-0.15,0.15);
    const d = rand(26,70); // radio más corto (menos trabajo)
    p.style.left = x+'px';
    p.style.top  = y+'px';
    p.style.setProperty('--tx', Math.cos(a)*d+'px');
    p.style.setProperty('--ty', Math.sin(a)*d+'px');
    frag.appendChild(p);
    p.addEventListener('animationend', ()=>p.remove(), {once:true});
  }
  layer.appendChild(frag);
}

/* corazones flotando siempre */
const INITIAL = IS_MOBILE ? 8 : 14;
for(let i=0;i<INITIAL;i++) spawnHeart();
(function loop(){
  spawnHeart();
  setTimeout(loop, rand(900,1500));
})();

/* chispitas SOLO en escritorio (para ahorrar en móvil) */
if(!IS_MOBILE){
  document.body.addEventListener('pointerdown', e=>{
    if(e.target.closest('.heart')) return;
    const rect = layer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    burst(x,y);
  }, {passive:true});
}
