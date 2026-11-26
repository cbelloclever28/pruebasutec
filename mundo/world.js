import * as THREE from 'three';
import { HOUSES } from './houses.js';

// ---------- Parámetros del mundo ----------
const RING = 26;          // distancia de cada casa al centro
const HW = 10, HD = 8, HH = 5.5; // ancho, profundidad, alto de las casas
const PLAYER_R = 0.7;
const WORLD_R = 46;
const SPEED = 7.5;
const DOOR_DIST = 2.6;

const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...extra });

function shadowed(obj) {
  obj.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return obj;
}

// Pseudo-aleatorio con semilla (el mundo es siempre igual)
function rng(seed) {
  return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
}

// ---------- Texturas de texto ----------
function signTexture(text, bg) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 220;
  const g = c.getContext('2d');
  g.fillStyle = '#ffffff';
  g.beginPath(); g.roundRect(0, 0, c.width, c.height, 40); g.fill();
  g.fillStyle = bg;
  g.beginPath(); g.roundRect(12, 12, c.width - 24, c.height - 24, 32); g.fill();
  g.fillStyle = '#ffffff';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  let size = 96;
  do { g.font = `800 ${size}px Poppins, sans-serif`; size -= 4; } while (g.measureText(text).width > c.width - 90 && size > 30);
  g.fillText(text, c.width / 2, c.height / 2 + 6);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function emojiTexture(emoji, color) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = color;
  g.beginPath(); g.arc(128, 128, 118, 0, Math.PI * 2); g.fill();
  g.lineWidth = 12; g.strokeStyle = '#fff'; g.stroke();
  g.font = '130px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(emoji, 128, 138);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---------- Macaquito ----------
function makeMonkey() {
  const g = new THREE.Group();
  const fur = mat(0x8a5a32);
  const furDark = mat(0x6b4224);
  const skin = mat(0xf1c9a0);
  const black = mat(0x1a1a1a, { roughness: 0.3 });
  const white = mat(0xffffff, { roughness: 0.3 });
  const pack = mat(0xF2661C);

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 18), fur);
  body.scale.set(1, 1.1, 0.9); body.position.y = 1.15; g.add(body);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 16), skin);
  belly.scale.set(0.85, 1, 0.5); belly.position.set(0, 1.08, 0.3); g.add(belly);

  // Mochila UTEC
  const bag = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.75, 0.32), pack);
  bag.position.set(0, 1.25, -0.5); g.add(bag);
  const flap = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.25, 0.34), mat(0x5B2C82));
  flap.position.set(0, 1.55, -0.5); g.add(flap);

  // Cabeza
  const head = new THREE.Group(); head.position.y = 2.0; g.add(head);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.5, 28, 20), fur); head.add(skull);
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 18), skin);
  face.scale.set(1.05, 0.9, 0.6); face.position.set(0, -0.02, 0.28); head.add(face);
  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 16), skin);
  muzzle.scale.set(1.2, 0.85, 0.8); muzzle.position.set(0, -0.15, 0.46); head.add(muzzle);
  for (const s of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), white);
    eye.position.set(s * 0.15, 0.08, 0.5); head.add(eye);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), black);
    pupil.position.set(s * 0.15, 0.08, 0.59); head.add(pupil);
    const shine = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), white);
    shine.position.set(s * 0.15 + 0.025, 0.11, 0.645); head.add(shine);
    const nostril = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), furDark);
    nostril.position.set(s * 0.05, -0.08, 0.67); head.add(nostril);
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 12), fur);
    ear.scale.set(1, 1, 0.45); ear.position.set(s * 0.52, 0.05, 0); head.add(ear);
    const inner = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), skin);
    inner.scale.set(1, 1, 0.4); inner.position.set(s * 0.56, 0.05, 0.05); head.add(inner);
  }
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.018, 8, 20, Math.PI), furDark);
  smile.rotation.z = Math.PI; smile.position.set(0, -0.2, 0.65); head.add(smile);
  const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.25, 10), furDark);
  tuft.position.set(0, 0.52, 0.05); tuft.rotation.x = 0.3; head.add(tuft);

  // Brazos y piernas (con pivote para animar)
  const limb = (x, y, len, r, parentMat) => {
    const pivot = new THREE.Group(); pivot.position.set(x, y, 0);
    const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 6, 12), parentMat);
    m.position.y = -len / 2 - r * 0.5; pivot.add(m);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(r * 1.25, 12, 10), skin);
    hand.position.y = -len - r * 1.2; pivot.add(hand);
    g.add(pivot);
    return pivot;
  };
  const armL = limb(-0.56, 1.5, 0.7, 0.12, fur);
  const armR = limb(0.56, 1.5, 0.7, 0.12, fur);
  armL.rotation.z = -0.15; armR.rotation.z = 0.15;
  const legL = limb(-0.25, 0.75, 0.38, 0.14, fur);
  const legR = limb(0.25, 0.75, 0.38, 0.14, fur);

  // Cola enrulada
  const tailPivot = new THREE.Group(); tailPivot.position.set(0, 0.85, -0.45); g.add(tailPivot);
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -0.1, -0.4), new THREE.Vector3(0, 0.2, -0.8),
    new THREE.Vector3(0, 0.7, -0.85), new THREE.Vector3(0, 0.95, -0.55), new THREE.Vector3(0, 0.75, -0.35),
  ]);
  tailPivot.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.07, 8), fur));

  shadowed(g);
  g.userData = { head, armL, armR, legL, legR, tailPivot, body };
  return g;
}

// ---------- Casa ----------
function makeHouse(h) {
  const g = new THREE.Group();
  const col = new THREE.Color(h.color);
  const wallCol = col.clone().lerp(new THREE.Color(0xffffff), 0.78);

  const base = new THREE.Mesh(new THREE.BoxGeometry(HW + 0.8, 0.4, HD + 0.8), mat(0xd8d2c4));
  base.position.y = 0.2; g.add(base);
  const walls = new THREE.Mesh(new THREE.BoxGeometry(HW, HH, HD), mat(wallCol));
  walls.position.y = 0.4 + HH / 2; g.add(walls);
  // franja de color
  const band = new THREE.Mesh(new THREE.BoxGeometry(HW + 0.05, 0.5, HD + 0.05), mat(col));
  band.position.y = 0.65; g.add(band);

  // techo piramidal
  const ex = HW / 2 + 0.7, ez = HD / 2 + 0.7;
  const roof = new THREE.Mesh(new THREE.ConeGeometry(ex * Math.SQRT2, 3.4, 4), mat(col, { roughness: 0.6 }));
  roof.rotation.y = Math.PI / 4; roof.scale.z = ez / ex;
  roof.position.y = 0.4 + HH + 1.7; g.add(roof);

  // puerta
  const fz = HD / 2;
  const frame = new THREE.Mesh(new THREE.BoxGeometry(2.6, 3.7, 0.3), mat(col));
  frame.position.set(0, 0.4 + 1.85, fz + 0.05); g.add(frame);
  const door = new THREE.Mesh(new THREE.BoxGeometry(2.0, 3.3, 0.35), mat(0x3a2a20, { roughness: 0.6 }));
  door.position.set(0, 0.4 + 1.65, fz + 0.07); g.add(door);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), mat(0xffd43b, { metalness: 0.6, roughness: 0.3 }));
  knob.position.set(0.65, 2.0, fz + 0.3); g.add(knob);

  // ventanas
  const glass = mat(0xbfe9ff, { roughness: 0.15, metalness: 0.1, emissive: 0x3aa0d0, emissiveIntensity: 0.15 });
  const winFrame = mat(0xffffff);
  const addWindow = (x, y, z, ry) => {
    const w = new THREE.Group();
    const f = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.6, 0.2), winFrame); w.add(f);
    const gl = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.3, 0.22), glass); w.add(gl);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.3, 0.25), winFrame); w.add(bar);
    w.position.set(x, y, z); w.rotation.y = ry; g.add(w);
  };
  addWindow(-3.3, 2.5, fz + 0.05, 0);
  addWindow(3.3, 2.5, fz + 0.05, 0);
  for (const s of [-1, 1]) { addWindow(s * (HW / 2 + 0.05), 3, -1.5, Math.PI / 2); addWindow(s * (HW / 2 + 0.05), 3, 1.5, Math.PI / 2); }

  // cartel
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(8.6, 8.6 * 220 / 1024),
    new THREE.MeshBasicMaterial({ map: signTexture(h.sign, h.color) })
  );
  sign.position.set(0, 0.4 + HH - 0.95, fz + 0.04); g.add(sign);

  // alfombra de entrada brillante
  const mat2 = new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.4, roughness: 0.5 });
  const mat3 = new THREE.Mesh(new THREE.CircleGeometry(1.5, 32), mat2);
  mat3.rotation.x = -Math.PI / 2; mat3.position.set(0, 0.03, fz + 1.6); g.add(mat3);

  // macetas
  for (const s of [-1, 1]) {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.3, 0.6, 12), mat(0xb5653a));
    pot.position.set(s * 1.9, 0.7, fz + 0.6); g.add(pot);
    const bush = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 1), mat(0x3f9b4a));
    bush.position.set(s * 1.9, 1.3, fz + 0.6); g.add(bush);
  }

  shadowed(g);
  sign.castShadow = false;

  // ícono flotante
  const icon = new THREE.Sprite(new THREE.SpriteMaterial({ map: emojiTexture(h.icon, h.color) }));
  icon.scale.set(3, 3, 3); icon.position.y = 0.4 + HH + 5; g.add(icon);

  g.traverse(o => { o.userData.houseId = h.id; });
  return { group: g, icon, glow: mat2 };
}

// ---------- Árbol ----------
function makeTree(r) {
  const g = new THREE.Group();
  const s = 0.8 + r() * 0.7;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25 * s, 0.35 * s, 2 * s, 8), mat(0x7a5134));
  trunk.position.y = s; g.add(trunk);
  const greens = [0x4caf50, 0x3f9b4a, 0x66bb6a, 0x2e8b57];
  const c = greens[Math.floor(r() * greens.length)];
  if (r() < 0.5) {
    for (let i = 0; i < 3; i++) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry((1.8 - i * 0.45) * s, 1.8 * s, 9), mat(c));
      cone.position.y = (2.2 + i * 1.0) * s; g.add(cone);
    }
  } else {
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6 * s, 1), mat(c, { flatShading: true }));
    crown.position.y = 3 * s; g.add(crown);
    const crown2 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.0 * s, 1), mat(c, { flatShading: true }));
    crown2.position.set(0.9 * s, 2.5 * s, 0.4 * s); g.add(crown2);
  }
  return { group: shadowed(g), radius: 0.5 * s };
}

// ---------- Banana ----------
function makeBanana() {
  const g = new THREE.Group();
  const b = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.13, 10, 20, Math.PI * 0.85), mat(0xffd43b, { roughness: 0.5 }));
  b.rotation.z = Math.PI * 1.07; g.add(b);
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.18, 6), mat(0x5a3d1e));
  tip.position.set(0.38, 0.12, 0); tip.rotation.z = -0.8; g.add(tip);
  return shadowed(g);
}

// =================================================================
export async function startWorld(root) {
  try { await document.fonts.ready; } catch { /* sin fuentes, igual sigue */ }

  const $ = id => root.querySelector('#' + id);
  const canvas = $('worldCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const SKY = 0xbfe6f7;
  scene.background = new THREE.Color(SKY);
  scene.fog = new THREE.Fog(SKY, 50, 120);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 300);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x6a8f4e, 1.15));
  const sun = new THREE.DirectionalLight(0xfff4e0, 1.8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -35, right: 35, top: 35, bottom: -35, near: 1, far: 120 });
  sun.shadow.bias = -0.0004;
  scene.add(sun, sun.target);

  // ---- Suelo, plaza y caminos ----
  const ground = new THREE.Mesh(new THREE.CircleGeometry(160, 64), mat(0x8ccf68));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  const plaza = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 0.12, 64), mat(0xeee6d4));
  plaza.position.y = 0.06; plaza.receiveShadow = true; scene.add(plaza);
  const plazaRing = new THREE.Mesh(new THREE.TorusGeometry(10, 0.25, 8, 64), mat(0xd3c8b0));
  plazaRing.rotation.x = Math.PI / 2; plazaRing.position.y = 0.12; scene.add(plazaRing);

  const circles = []; // colisiones circulares {x,z,r}
  const boxes = [];   // colisiones de casas {x,z,rot,ex,ez}

  // Monumento central: anillos con los colores UTEC
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.9, 1.2, 24), mat(0xffffff));
  ped.position.y = 0.6; scene.add(shadowed(ped));
  const rings = new THREE.Group(); rings.position.y = 3.6; scene.add(rings);
  [0x0FA8DE, 0xF2661C, 0x5B2C82].forEach((c, i) => {
    const t = new THREE.Mesh(new THREE.TorusGeometry(1.6 - i * 0.35, 0.16, 12, 48), mat(c, { roughness: 0.4, metalness: 0.2 }));
    t.castShadow = true; rings.add(t);
  });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.45, 0), mat(0xffd43b, { emissive: 0xffb300, emissiveIntensity: 0.5, flatShading: true }));
  rings.add(core);
  circles.push({ x: 0, z: 0, r: 1.9 });

  // ---- Casas ----
  const houses = HOUSES.map((h, i) => {
    const a = i * Math.PI / 2;
    const x = Math.sin(a) * RING, z = -Math.cos(a) * RING;
    const rot = Math.atan2(-x, -z);
    const { group, icon: iconSprite, glow } = makeHouse(h);
    group.position.set(x, 0, z); group.rotation.y = rot;
    scene.add(group);
    const dir = new THREE.Vector2(-x, -z).normalize();
    const door = new THREE.Vector3(x + dir.x * (HD / 2 + 1.6), 0, z + dir.y * (HD / 2 + 1.6));
    boxes.push({ x, z, rot, ex: HW / 2 + 0.4, ez: HD / 2 + 0.4 });

    // camino de la plaza a la puerta
    const len = RING - HD / 2 - 10 + 0.6;
    const path = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.08, len), mat(0xe2d8c2));
    const mid = 10 + len / 2 - 0.3;
    path.position.set(-dir.x * mid, 0.04, -dir.y * mid); path.rotation.y = rot;
    path.receiveShadow = true; scene.add(path);

    return { ...h, group, iconSprite, glow, door, dir, rot, baseIconY: iconSprite.position.y };
  });

  // ---- Árboles ----
  const r = rng(7);
  const nearHouse = (x, z, pad) => houses.some(h => Math.hypot(x - h.group.position.x, z - h.group.position.z) < pad);
  const onPath = (x, z) => (Math.abs(x) < 4 && Math.abs(z) < RING) || (Math.abs(z) < 4 && Math.abs(x) < RING);
  const trees = [];
  let placed = 0, tries = 0;
  while (placed < 110 && tries < 3000) {
    tries++;
    const ang = r() * Math.PI * 2;
    const dist = placed < 40 ? 13 + r() * 33 : 48 + r() * 30;
    const x = Math.cos(ang) * dist, z = Math.sin(ang) * dist;
    if (nearHouse(x, z, 10.5) || onPath(x, z)) continue;
    if (circles.some(c => Math.hypot(c.x - x, c.z - z) < c.r + 2.2)) continue;
    const t = makeTree(r);
    t.group.position.set(x, 0, z); t.group.rotation.y = r() * Math.PI;
    scene.add(t.group);
    trees.push(t.group);
    circles.push({ x, z, r: t.radius });
    placed++;
  }

  // Bancos en la plaza
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + i * Math.PI / 2;
    const bench = new THREE.Group();
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.15, 0.7), mat(0xb5793f)); seat.position.y = 0.55; bench.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.6, 0.12), mat(0xb5793f)); back.position.set(0, 0.95, -0.3); bench.add(back);
    for (const s of [-1, 1]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.6), mat(0x444444)); leg.position.set(s * 1.1, 0.28, 0); bench.add(leg); }
    bench.position.set(Math.sin(a) * 7.5, 0, -Math.cos(a) * 7.5);
    bench.rotation.y = Math.atan2(-bench.position.x, -bench.position.z);
    scene.add(shadowed(bench));
    circles.push({ x: bench.position.x, z: bench.position.z, r: 1.2 });
  }

  // Nubes
  const clouds = [];
  const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, flatShading: true });
  for (let i = 0; i < 12; i++) {
    const c = new THREE.Group();
    for (let j = 0; j < 4; j++) {
      const p = new THREE.Mesh(new THREE.IcosahedronGeometry(2 + r() * 2, 1), cloudMat);
      p.position.set(j * 2.5 - 4, r() * 1.2, r() * 2); c.add(p);
    }
    const a = r() * Math.PI * 2, d = 20 + r() * 60;
    c.position.set(Math.cos(a) * d, 28 + r() * 10, Math.sin(a) * d);
    scene.add(c); clouds.push(c);
  }

  // Bananas para juntar
  const bananas = [];
  const bananaSpots = [[6, 14], [-14, 6], [14, -8], [-8, -15], [18, 18], [-19, -19], [20, -19], [-17, 17], [0, 35], [35, 0], [-35, 3], [3, -36]];
  for (const [x, z] of bananaSpots) {
    const b = makeBanana(); b.position.set(x, 1.1, z); scene.add(b);
    bananas.push({ mesh: b, taken: false, phase: Math.random() * 6 });
  }
  let bananaCount = 0;
  const bananaEl = $('bananaCount');
  bananaEl.textContent = `🍌 0/${bananas.length}`;

  // ---- Macaquito ----
  const monkey = makeMonkey();
  monkey.position.set(0, 0, 6);
  monkey.rotation.y = Math.PI;
  scene.add(monkey);
  const shadowBlob = new THREE.Mesh(new THREE.CircleGeometry(0.7, 24), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18 }));
  shadowBlob.rotation.x = -Math.PI / 2; shadowBlob.position.y = 0.14; scene.add(shadowBlob);

  // ---- Estado y controles ----
  const keys = new Set();
  const joy = { x: 0, y: 0, active: false };
  let camYaw = 0, camPitch = 0.42, camDist = 13;
  let target = null;           // punto al que camina (click)
  let route = [];              // puntos intermedios camino a una casa
  let stuckTime = 0;
  let targetHouse = null;      // casa a la que va para entrar
  let nearHouseObj = null;
  let insideHouse = null;
  let running = true;
  let walkPhase = 0;
  const vel = new THREE.Vector3();

  const isTyping = () => document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
  window.addEventListener('keydown', e => {
    if (!running || isTyping()) return;
    if (insideHouse) { if (e.code === 'Escape') exitHouse(); return; }
    if ((e.code === 'KeyE' || e.code === 'Enter') && nearHouseObj) { enterHouse(nearHouseObj); return; }
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
    keys.add(e.code);
    target = null; targetHouse = null; route = [];
  });
  window.addEventListener('keyup', e => keys.delete(e.code));
  window.addEventListener('blur', () => keys.clear());

  // Arrastrar para girar cámara / click para caminar
  const pointers = new Map();
  let down = null;
  canvas.addEventListener('pointerdown', e => {
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    down = { x: e.clientX, y: e.clientY, moved: 0, id: e.pointerId };
  });
  canvas.addEventListener('pointermove', e => {
    const p = pointers.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    if (down && down.id === e.pointerId) down.moved += Math.abs(dx) + Math.abs(dy);
    camYaw -= dx * 0.006;
    camPitch = THREE.MathUtils.clamp(camPitch + dy * 0.004, 0.12, 1.1);
  });
  const endPointer = e => {
    pointers.delete(e.pointerId);
    if (down && down.id === e.pointerId && down.moved < 8 && !insideHouse) handleClick(e.clientX, e.clientY);
    down = null;
  };
  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', e => { pointers.delete(e.pointerId); down = null; });
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    camDist = THREE.MathUtils.clamp(camDist + e.deltaY * 0.01, 7, 24);
  }, { passive: false });

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const houseGroups = houses.map(h => h.group);
  function handleClick(cx, cy) {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((cx - rect.left) / rect.width) * 2 - 1, -((cy - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(houseGroups, true)[0];
    if (hit) { goToHouse(houses.find(h => h.id === hit.object.userData.houseId)); return; }
    const g = raycaster.intersectObject(ground)[0];
    if (g) { target = new THREE.Vector3(g.point.x, 0, g.point.z); targetHouse = null; route = []; stuckTime = 0; }
  }
  // Ruta por la red de caminos: (volver a la plaza) → entrada del camino → puerta
  function goToHouse(h) {
    if (!h) return;
    const p = monkey.position;
    const along = -(p.x * h.dir.x + p.z * h.dir.y);          // distancia sobre el eje de la casa
    const lateral = Math.abs(p.x * h.dir.y - p.z * h.dir.x); // separación del eje
    route = [];
    if (!(lateral < 2 && along > 8)) {
      const r = Math.hypot(p.x, p.z);
      if (r > 10.5) route.push(new THREE.Vector3(p.x / r * 8.5, 0, p.z / r * 8.5));
      route.push(new THREE.Vector3(-h.dir.x * 9.5, 0, -h.dir.y * 9.5));
    }
    route.push(h.door.clone());
    target = route.shift(); targetHouse = h; stuckTime = 0;
  }

  // Esquiva árboles, bancos y el monumento cuando camina solo
  function steer(pos, dir) {
    const lx = -dir.z, lz = dir.x;
    let ax = 0, az = 0;
    for (const c of circles) {
      const dx = c.x - pos.x, dz = c.z - pos.z;
      const ahead = dx * dir.x + dz * dir.z;
      if (ahead < 0 || ahead > 4) continue;
      const lat = dx * lx + dz * lz, rad = c.r + PLAYER_R + 0.5;
      if (Math.abs(lat) > rad) continue;
      const side = lat >= 0 ? -1 : 1;
      const k = (1 - Math.abs(lat) / rad) * (1 - ahead / 4) * 3;
      ax += lx * side * k; az += lz * side * k;
    }
    dir.x += ax; dir.z += az; dir.normalize();
  }

  // Joystick táctil
  const joyEl = $('joystick'), knob = $('knob');
  let joyId = null;
  const joyMove = e => {
    const rct = joyEl.getBoundingClientRect();
    const cx = rct.left + rct.width / 2, cy = rct.top + rct.height / 2;
    let dx = e.clientX - cx, dy = e.clientY - cy;
    const max = rct.width / 2 - 10, len = Math.hypot(dx, dy);
    if (len > max) { dx *= max / len; dy *= max / len; }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    joy.x = dx / max; joy.y = -dy / max;
  };
  joyEl.addEventListener('pointerdown', e => {
    e.stopPropagation(); joyId = e.pointerId; joyEl.setPointerCapture(e.pointerId);
    joy.active = true; target = null; targetHouse = null; route = []; joyMove(e);
  });
  joyEl.addEventListener('pointermove', e => { if (e.pointerId === joyId) joyMove(e); });
  const joyEnd = e => {
    if (e.pointerId !== joyId) return;
    joyId = null; joy.active = false; joy.x = joy.y = 0; knob.style.transform = '';
  };
  joyEl.addEventListener('pointerup', joyEnd);
  joyEl.addEventListener('pointercancel', joyEnd);

  // Menú de casas
  const nav = $('houseNav');
  for (const h of houses) {
    const b = document.createElement('button');
    b.innerHTML = `<span class="dot" style="background:${h.color}">${h.icon}</span><span>${h.title}</span>`;
    b.title = `Ir a ${h.title}`;
    b.addEventListener('click', () => { if (!insideHouse) goToHouse(h); });
    nav.appendChild(b);
  }

  // Ayuda que se desvanece
  const help = $('help');
  setTimeout(() => help.classList.add('fade'), 9000);

  // Toast
  const toastEl = $('toast');
  let toastTimer;
  const toast = msg => {
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  };

  // Puerta / panel
  const prompt = $('doorPrompt'), doorText = $('doorText'), doorBtn = $('doorBtn');
  doorBtn.addEventListener('click', () => nearHouseObj && enterHouse(nearHouseObj));
  const panel = $('housePanel');
  $('panelClose').addEventListener('click', exitHouse);
  $('panelExit').addEventListener('click', exitHouse);
  panel.addEventListener('click', e => { if (e.target === panel) exitHouse(); });

  function enterHouse(h) {
    insideHouse = h; target = null; targetHouse = null; route = []; keys.clear();
    panel.style.setProperty('--house', h.color);
    $('panelIcon').textContent = h.icon;
    $('panelTitle').textContent = h.title;
    $('panelIntro').textContent = h.intro;
    const grid = $('panelGrid');
    grid.innerHTML = '';
    for (const it of h.items) {
      const a = document.createElement('a');
      a.className = 'panel-item'; a.href = it.url || '#';
      if (it.url && it.url !== '#') { a.target = '_blank'; a.rel = 'noopener'; }
      a.innerHTML = `<span class="pi-icon">${it.icon}</span><h3></h3><p></p>`;
      a.querySelector('h3').textContent = it.title;
      a.querySelector('p').textContent = it.text;
      grid.appendChild(a);
    }
    prompt.hidden = true;
    panel.hidden = false;
    $('panelExit').focus();
  }
  function exitHouse() {
    if (!insideHouse) return;
    const h = insideHouse;
    insideHouse = null;
    panel.hidden = true;
    // el macaquito sale un par de pasos hacia la plaza
    monkey.position.set(h.door.x + h.dir.x * 1.5, 0, h.door.z + h.dir.y * 1.5);
    monkey.rotation.y = Math.atan2(h.dir.x, h.dir.y);
    camYaw = Math.atan2(h.dir.x, h.dir.y); // cámara del lado de la plaza, mirando la casa
  }

  // ---- Colisiones ----
  function resolve(p) {
    for (const c of circles) {
      const dx = p.x - c.x, dz = p.z - c.z, d = Math.hypot(dx, dz), min = c.r + PLAYER_R;
      if (d < min && d > 1e-4) { p.x = c.x + dx / d * min; p.z = c.z + dz / d * min; }
    }
    for (const b of boxes) {
      const cos = Math.cos(b.rot), sin = Math.sin(b.rot);
      const dx = p.x - b.x, dz = p.z - b.z;
      let lx = dx * cos - dz * sin, lz = dx * sin + dz * cos;
      const ex = b.ex + PLAYER_R, ez = b.ez + PLAYER_R;
      if (Math.abs(lx) < ex && Math.abs(lz) < ez) {
        if (ex - Math.abs(lx) < ez - Math.abs(lz)) lx = Math.sign(lx) * ex; else lz = Math.sign(lz) * ez;
        p.x = b.x + lx * cos + lz * sin;
        p.z = b.z - lx * sin + lz * cos;
      }
    }
    const d = Math.hypot(p.x, p.z);
    if (d > WORLD_R) { p.x *= WORLD_R / d; p.z *= WORLD_R / d; }
  }

  function cameraBlocked(c) {
    if (c.y > HH + 4.5) return false;
    for (const b of boxes) {
      const cos = Math.cos(b.rot), sin = Math.sin(b.rot);
      const dx = c.x - b.x, dz = c.z - b.z;
      if (Math.abs(dx * cos - dz * sin) < b.ex + 0.6 && Math.abs(dx * sin + dz * cos) < b.ez + 0.6) return true;
    }
    return false;
  }

  // ---- Tamaño ----
  function resize() {
    const w = root.clientWidth, h = root.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < h ? 68 : 55;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  // ---- Loop ----
  const clock = new THREE.Clock();
  const camTarget = new THREE.Vector3();
  const lookAt = new THREE.Vector3();
  const occRay = new THREE.Raycaster();
  const occDir = new THREE.Vector3();
  let firstFrame = true;

  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    // Entrada → dirección
    let ix = 0, iy = 0;
    if (!insideHouse) {
      if (keys.has('KeyW') || keys.has('ArrowUp')) iy += 1;
      if (keys.has('KeyS') || keys.has('ArrowDown')) iy -= 1;
      if (keys.has('KeyA') || keys.has('ArrowLeft')) ix -= 1;
      if (keys.has('KeyD') || keys.has('ArrowRight')) ix += 1;
      if (joy.active) { ix += joy.x; iy += joy.y; }
    }
    const fwd = new THREE.Vector3(-Math.sin(camYaw), 0, -Math.cos(camYaw));
    const right = new THREE.Vector3(Math.cos(camYaw), 0, -Math.sin(camYaw));
    const want = new THREE.Vector3().addScaledVector(fwd, iy).addScaledVector(right, ix);
    let speedFactor = Math.min(want.length(), 1);

    if (speedFactor < 0.05 && target && !insideHouse) {
      want.subVectors(target, monkey.position); want.y = 0;
      const dist = want.length();
      const last = route.length === 0;
      if (dist < (last ? 0.35 : 1.2)) {
        if (!last) { target = route.shift(); speedFactor = 1; want.subVectors(target, monkey.position); want.y = 0; }
        else {
          target = null;
          if (targetHouse) { const h = targetHouse; targetHouse = null; enterHouse(h); }
          want.set(0, 0, 0); speedFactor = 0;
        }
      } else speedFactor = last ? Math.min(1, dist / 1.2 + 0.3) : 1;
      if (target && want.lengthSq() > 1e-4) { want.normalize(); steer(monkey.position, want); }
    }
    if (want.lengthSq() > 1e-4) want.normalize();
    vel.lerp(want.multiplyScalar(SPEED * speedFactor), 1 - Math.exp(-12 * dt));

    const prev = monkey.position.clone();
    monkey.position.addScaledVector(vel, dt);
    resolve(monkey.position);
    const moved = monkey.position.distanceTo(prev) / dt;
    // si quedó trabado camino a un objetivo, lo cancela
    stuckTime = (target && speedFactor > 0.2 && moved < 0.8) ? stuckTime + dt : 0;
    if (stuckTime > 1.2) { target = null; targetHouse = null; route = []; stuckTime = 0; }

    const speed = Math.hypot(vel.x, vel.z);
    if (speed > 0.3) {
      const ang = Math.atan2(vel.x, vel.z);
      let diff = ang - monkey.rotation.y;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      monkey.rotation.y += diff * (1 - Math.exp(-14 * dt));
    }

    // Animación
    const u = monkey.userData;
    const walking = Math.min(speed / SPEED, 1);
    walkPhase += dt * (4 + speed * 1.6);
    const sw = Math.sin(walkPhase) * 0.9 * walking;
    u.legL.rotation.x = sw; u.legR.rotation.x = -sw;
    u.armL.rotation.x = -sw * 0.9; u.armR.rotation.x = sw * 0.9;
    const bob = Math.abs(Math.sin(walkPhase)) * 0.12 * walking + Math.sin(t * 2) * 0.02 * (1 - walking);
    u.body.position.y = 1.15 + bob; u.head.position.y = 2.0 + bob;
    u.head.rotation.z = Math.sin(t * 1.3) * 0.06 * (1 - walking);
    u.tailPivot.rotation.y = Math.sin(t * 2.5) * 0.35;
    u.tailPivot.rotation.x = -0.1 + Math.sin(walkPhase) * 0.1 * walking;
    shadowBlob.position.x = monkey.position.x; shadowBlob.position.z = monkey.position.z;

    // Decoración animada
    rings.children.forEach((c, i) => { c.rotation.x = t * (0.6 + i * 0.3); c.rotation.y = t * (0.4 + i * 0.25) * (i % 2 ? -1 : 1); });
    rings.position.y = 3.6 + Math.sin(t * 1.5) * 0.15;
    for (const h of houses) {
      h.iconSprite.position.y = h.baseIconY + Math.sin(t * 2 + h.rot) * 0.35;
      h.glow.emissiveIntensity = 0.3 + (Math.sin(t * 3) * 0.5 + 0.5) * (h === nearHouseObj ? 0.9 : 0.3);
    }
    for (const c of clouds) { c.position.x += dt * 0.6; if (c.position.x > 90) c.position.x = -90; }

    // Bananas
    for (const b of bananas) {
      if (b.taken) continue;
      b.mesh.rotation.y += dt * 2;
      b.mesh.position.y = 1.1 + Math.sin(t * 3 + b.phase) * 0.2;
      if (Math.hypot(b.mesh.position.x - monkey.position.x, b.mesh.position.z - monkey.position.z) < 1.4) {
        b.taken = true; b.mesh.visible = false; bananaCount++;
        bananaEl.textContent = `🍌 ${bananaCount}/${bananas.length}`;
        toast(bananaCount === bananas.length ? '¡Juntaste todas las bananas! 🐒🎉' : '¡Banana! 🍌');
      }
    }

    // Puerta cercana
    let near = null;
    if (!insideHouse) {
      for (const h of houses) {
        if (monkey.position.distanceTo(h.door) < DOOR_DIST) { near = h; break; }
      }
    }
    if (near !== nearHouseObj) {
      nearHouseObj = near;
      if (near && !targetHouse) {
        doorText.textContent = `${near.icon} ${near.title}`;
        prompt.style.setProperty('--house', near.color);
        prompt.hidden = false;
      } else prompt.hidden = true;
    }

    // Cámara en tercera persona
    // acerca la cámara si quedaría dentro de una casa
    let dist = camDist;
    for (; dist > 2.5; dist -= 0.5) {
      const hz = dist * Math.cos(camPitch);
      camTarget.set(
        monkey.position.x + Math.sin(camYaw) * hz,
        monkey.position.y + 1.5 + dist * Math.sin(camPitch),
        monkey.position.z + Math.cos(camYaw) * hz
      );
      if (!cameraBlocked(camTarget)) break;
    }
    if (firstFrame) { camera.position.copy(camTarget); firstFrame = false; }
    else camera.position.lerp(camTarget, 1 - Math.exp(-7 * dt));
    lookAt.set(monkey.position.x, monkey.position.y + 1.8, monkey.position.z);
    camera.lookAt(lookAt);

    // Árboles entre la cámara y el macaquito se vuelven transparentes
    occRay.set(camera.position, occDir.subVectors(lookAt, camera.position).normalize());
    occRay.far = camera.position.distanceTo(lookAt);
    const hidden = new Set(occRay.intersectObjects(trees, true).map(i => i.object.parent));
    for (const tr of trees) {
      const want = hidden.has(tr) ? 0.25 : 1;
      for (const c of tr.children) {
        const m = c.material;
        if (m.opacity === want) continue;
        if (!m.transparent) { m.transparent = true; m.needsUpdate = true; }
        m.opacity += (want - m.opacity) * Math.min(1, dt * 10);
        if (Math.abs(m.opacity - want) < 0.02) m.opacity = want;
        if (m.opacity === 1) { m.transparent = false; m.needsUpdate = true; }
      }
    }

    // El sol sigue al jugador para sombras nítidas
    sun.position.set(monkey.position.x + 25, 45, monkey.position.z + 18);
    sun.target.position.copy(monkey.position);

    renderer.render(scene, camera);
  }
  tick();

  return {
    pause() { running = false; keys.clear(); },
    resume() { if (running) return; running = true; clock.getDelta(); resize(); tick(); },
  };
}
