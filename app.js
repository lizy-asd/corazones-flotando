/* ====== util ====== */
const rand = (a, b) => Math.random() * (b - a) + a;
const choice = a => a[Math.floor(Math.random() * a.length)];

/* ====== detectar móvil ====== */
const IS_MOBILE = window.matchMedia("(max-width: 768px)").matches;

/* ====== estrellas ====== */
function createStars(id, count) {
  const el = document.getElementById(id);
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "star";
    s.style.left = rand(0, 100) + "vw";
    s.style.top = rand(0, 100) + "vh";
    s.style.setProperty("--tw", rand(1.6, 2.8) + "s");
    s.style.setProperty("--dr", rand(20, 40) + "s");
    frag.appendChild(s);
  }
  el.appendChild(frag);
}

/* ====== constelaciones suaves ====== */
function drawConstellations() {
  const svg = document.querySelector(".constellations");
  const NS = "http://www.w3.org/2000/svg";
  for (let c = 0; c < 3; c++) {
    const group = document.createElementNS(NS, "polyline");
    const pts = [];
    const cx = rand(10, 90),
      cy = rand(10, 50);
    for (let i = 0; i < 6; i++) {
      pts.push(cx + rand(-15, 15) + "," + (cy + rand(-10, 10)));
    }
    group.setAttribute("points", pts.join(" "));
    group.setAttribute("opacity", rand(0.15, 0.35).toFixed(2));
    svg.appendChild(group);
  }
}

/* ====== nubes ====== */
function createClouds(id, count, yMin, yMax, sizeMin, sizeMax) {
  const el = document.getElementById(id);
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const c = document.createElement("span");
    c.className = "cloud";
    c.style.setProperty("--w", rand(sizeMin, sizeMax) + "vmin");
    c.style.setProperty("--y", rand(yMin, yMax) + "vh");
    c.style.setProperty("--spd", rand(70, 150) + "s");
    c.style.left = rand(-40, 100) + "vw";
    frag.appendChild(c);
  }
  el.appendChild(frag);
}

/* ====== estrellas fugaces ====== */
function shootingStar() {
  const s = document.createElement("span");
  s.className = "shooting";
  s.style.setProperty("--rot", rand(-30, -15) + "deg");
  s.style.setProperty("--sx", rand(-20, -5) + "vw");
  s.style.setProperty("--sy", rand(5, 35) + "vh");
  s.style.setProperty("--ex", rand(25, 45) + "vw");
  s.style.setProperty("--ey", rand(-20, -35) + "vh");
  document.body.appendChild(s);
  s.addEventListener("animationend", () => s.remove(), { once: true });
}

// en móvil, menos fugaces para ahorrar
const STAR_INTERVAL = IS_MOBILE ? 9000 : 4500;
setInterval(() => {
  if (document.visibilityState === "visible") shootingStar();
}, STAR_INTERVAL);

/* ====== parallax desactivado ====== */
function parallax() { /* vacío a propósito */ }

/* ====== generar fondo ====== */
createStars("stars-back", IS_MOBILE ? 80 : 120);
createStars("stars-mid", IS_MOBILE ? 60 : 90);
createStars("stars-front", IS_MOBILE ? 40 : 60);
drawConstellations();
createClouds("clouds-back", IS_MOBILE ? 4 : 5, 10, 40, 30, 46);
createClouds("clouds-mid", IS_MOBILE ? 5 : 6, 25, 65, 28, 40);
createClouds("clouds-front", IS_MOBILE ? 3 : 4, 55, 85, 34, 48);

/* limpiar transform de pruebas anteriores */
["#stars-back", "#stars-mid", "#stars-front",
 "#clouds-back", "#clouds-mid", "#clouds-front", ".aurora"]
  .forEach(sel => {
    document.querySelectorAll(sel).forEach(el => (el.style.transform = ""));
  });

/* ====== corazones + frases ====== */
const layer = document.getElementById("hearts-layer");
const tplHeart = document.getElementById("heart-template");
const tplPhrase = document.getElementById("phrase-template");
const tplParticle = document.getElementById("particle-template");

const PHRASES = [
  "Te amo💝","Mi vida💐","Me encantas💞","Te extraño siempre💞",
  "Siempre tú💞","Contigo por siempre💞","Gracias por existir💞",
  "Para siempre tú💖","Quédate siempre💞","Tu amor me hace crecer💞","Gracias por amarme💞"
];

function spawnHeart() {
  const h = tplHeart.content.firstElementChild.cloneNode(true);
  h.style.left = rand(6, 94) + "vw";
  h.style.top = "110vh";
  const s = rand(40, 70);
  h.style.width = h.style.height = s + "px";
  h.style.animation = `floatUp ${rand(9, 15)}s linear forwards`;
  h.addEventListener("animationend", () => h.remove(), { once: true });

  // usar pointerdown (no click) para que sea más rápido en móvil
  h.addEventListener(
    "pointerdown",
    e => {
      e.preventDefault();
      h.blur?.();
      popHeart(e, h);
    },
    { passive: true }
  );
  layer.appendChild(h);
}

function popHeart(e, heart) {
  const r = layer.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  showPhrase(x, y);
  burst(x, y);
  heart.remove();
}

function showPhrase(x, y) {
  const el = tplPhrase.content.firstElementChild.cloneNode(true);
  el.textContent = choice(PHRASES);
  el.style.left = x + "px";
  el.style.top = y + "px";
  layer.appendChild(el);
  setTimeout(() => el.remove(), 1400);
}

function burst(x, y) {
  // menos partículas en móvil
  const count = IS_MOBILE ? 8 : 14;
  const frag = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const p = tplParticle.content.firstElementChild.cloneNode(true);
    const a = ((Math.PI * 2) * i) / count + rand(-0.15, 0.15);
    const d = rand(26, 90);
    p.style.left = x + "px";
    p.style.top = y + "px";
    p.style.setProperty("--tx", Math.cos(a) * d + "px");
    p.style.setProperty("--ty", Math.sin(a) * d + "px");
    frag.appendChild(p);
    p.addEventListener("animationend", () => p.remove(), { once: true });
  }

  layer.appendChild(frag);
}

/* activar corazones (menos al inicio en móvil) */
const INITIAL_HEARTS = IS_MOBILE ? 10 : 14;
for (let i = 0; i < INITIAL_HEARTS; i++) spawnHeart();

(function loop() {
  spawnHeart();
  setTimeout(loop, rand(800, 1300));
})();

/* chispitas al tocar el cielo (sin duplicar con corazones) */
document.body.addEventListener(
  "pointerdown",
  e => {
    // si tocamos un corazón, solo se encarga el corazón
    if (e.target.closest(".heart")) return;
    const r = layer.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    burst(x, y);
  },
  { passive: true }
);
