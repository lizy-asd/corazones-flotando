/* ====== util ====== */
const rand=(a,b)=>Math.random()*(b-a)+a;
const choice=a=>a[Math.floor(Math.random()*a.length)];

/* ====== estrellas ====== */
function createStars(id,count){
  const el=document.getElementById(id);
  for(let i=0;i<count;i++){
    const s=document.createElement('span');
    s.className='star';
    s.style.left=rand(0,100)+'vw';
    s.style.top =rand(0,100)+'vh';
    s.style.setProperty('--tw',rand(1.6,2.8)+'s');
    s.style.setProperty('--dr',rand(20,40)+'s');
    el.appendChild(s);
  }
}

/* ====== constelaciones suaves ====== */
function drawConstellations(){
  const svg=document.querySelector('.constellations');
  const NS='http://www.w3.org/2000/svg';
  for(let c=0;c<3;c++){
    const group=document.createElementNS(NS,'polyline');
    const pts=[];
    const cx=rand(10,90), cy=rand(10,50);
    for(let i=0;i<6;i++){
      pts.push((cx+rand(-15,15))+','+(cy+rand(-10,10)));
    }
    group.setAttribute('points',pts.join(' '));
    group.setAttribute('opacity',rand(0.15,0.35).toFixed(2));
    svg.appendChild(group);
  }
}

/* ====== nubes ====== */
function createClouds(id,count,yMin,yMax,sizeMin,sizeMax){
  const el=document.getElementById(id);
  for(let i=0;i<count;i++){
    const c=document.createElement('span');
    c.className='cloud';
    c.style.setProperty('--w',rand(sizeMin,sizeMax)+'vmin');
    c.style.setProperty('--y',rand(yMin,yMax)+'vh');
    c.style.setProperty('--spd',rand(70,150)+'s');
    c.style.left=rand(-40,100)+'vw';
    el.appendChild(c);
  }
}

/* ====== estrellas fugaces cada cierto rato ====== */
function shootingStar(){
  const s=document.createElement('span');
  s.className='shooting';
  s.style.setProperty('--rot', (rand(-30,-15))+'deg');
  s.style.setProperty('--sx',  rand(-20, -5)+'vw');
  s.style.setProperty('--sy',  rand(5, 35)+'vh');
  s.style.setProperty('--ex',  rand(25, 45)+'vw');
  s.style.setProperty('--ey',  rand(-20,-35)+'vh');
  document.body.appendChild(s);
  s.addEventListener('animationend',()=>s.remove(),{once:true});
}
setInterval(()=>{ if(document.visibilityState==='visible') shootingStar(); }, rand(3500,6000));

/* ====== parallax desactivado ====== */
/* (Quitamos listeners y no modificamos transform en ninguna capa) */
function parallax(){ /* intencionalmente vacío */ }

/* ====== generar fondo ====== */
createStars('stars-back',  120);
createStars('stars-mid',    90);
createStars('stars-front',  60);
drawConstellations();
createClouds('clouds-back',  5, 10, 40, 30, 46);
createClouds('clouds-mid',   6, 25, 65, 28, 40);
createClouds('clouds-front', 4, 55, 85, 34, 48);

/* Por si quedó algún transform de pruebas anteriores, lo limpiamos una vez */
['#stars-back','#stars-mid','#stars-front',
 '#clouds-back','#clouds-mid','#clouds-front','.aurora']
  .forEach(sel=>{
    document.querySelectorAll(sel).forEach(el=> el.style.transform = '');
  });

/* ====== (opcional) corazones + frases ====== */
const layer=document.getElementById('hearts-layer');
const tplHeart=document.getElementById('heart-template');
const tplPhrase=document.getElementById('phrase-template');
const tplParticle=document.getElementById('particle-template');

const PHRASES=[
  "Te amo💝","Mi vida💐","Me encantas💞","Te extraño siempre💞",
  " Siempre tú💞","Contigo por siemprte💞","Gracias por existir💞","Para siempre tú💖","Quédate siempre💞","Tu amor me hace crecer💞","Gracias por amarme💞"
];

function spawnHeart(){
  const h=tplHeart.content.firstElementChild.cloneNode(true);
  h.style.left=rand(6,94)+'vw'; h.style.top='110vh';
  const s=rand(40,70); h.style.width=h.style.height=s+'px';
  h.style.animation=`floatUp ${rand(9,15)}s linear forwards`;
  h.addEventListener('animationend',()=>h.remove(),{once:true});
  h.addEventListener('click',e=>popHeart(e,h),{passive:true});
  layer.appendChild(h);
}
function popHeart(e,heart){
  const r=layer.getBoundingClientRect();
  const x=e.clientX-r.left, y=e.clientY-r.top;
  showPhrase(x,y); burst(x,y); heart.remove();
}
function showPhrase(x,y){
  const el=tplPhrase.content.firstElementChild.cloneNode(true);
  el.textContent=choice(PHRASES);
  el.style.left=x+'px'; el.style.top=y+'px';
  layer.appendChild(el);
  setTimeout(()=>el.remove(),1400);
}
function burst(x,y){
  for(let i=0;i<14;i++){
    const p=tplParticle.content.firstElementChild.cloneNode(true);
    const a=(Math.PI*2*i)/14 + rand(-0.15,0.15);
    const d=rand(26,90);
    p.style.left=x+'px'; p.style.top=y+'px';
    p.style.setProperty('--tx', Math.cos(a)*d+'px');
    p.style.setProperty('--ty', Math.sin(a)*d+'px');
    layer.appendChild(p);
    p.addEventListener('animationend',()=>p.remove(),{once:true});
  }
}

/* activar corazones (si no los quieres, comenta estas 2 líneas) */
for(let i=0;i<14;i++) spawnHeart();
(function loop(){ spawnHeart(); setTimeout(loop, rand(800,1300)); })();

/* chispitas al tocar el cielo */
document.body.addEventListener('pointerdown',e=>{
  const r=layer.getBoundingClientRect();
  const x=e.clientX-r.left, y=e.clientY-r.top;
  burst(x,y);
},{passive:true});
