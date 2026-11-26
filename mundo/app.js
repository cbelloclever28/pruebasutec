// Navegación entre pantallas: portada → estudiante (mundo 3D) / docente.
const screens = {
  landing: document.getElementById('landing'),
  docente: document.getElementById('docente'),
  world: document.getElementById('world'),
};

function show(name) {
  for (const [k, el] of Object.entries(screens)) el.hidden = k !== name;
}

let world = null;
let starting = false;

async function goWorld() {
  show('world');
  if (world) { world.resume(); return; }
  if (starting) return;
  starting = true;
  const loading = document.getElementById('loading');
  try {
    const { startWorld } = await import('./world.js');
    world = await startWorld(screens.world);
    loading.hidden = true;
  } catch (err) {
    console.error(err);
    loading.innerHTML = '<p>No se pudo cargar el mundo 3D 😕<br><small>Revisá tu conexión o probá con otro navegador.</small></p>';
  } finally {
    starting = false;
  }
}

function goLanding() {
  if (world) world.pause();
  show('landing');
}

document.getElementById('btnEstudiante').addEventListener('click', goWorld);
document.getElementById('btnDocente').addEventListener('click', () => show('docente'));
document.getElementById('docenteBack').addEventListener('click', () => show('landing'));
document.getElementById('worldBack').addEventListener('click', goLanding);
