/* ==========================================================================
   Gestión de Equipo — Comunicación UTEC
   Todo se guarda en localStorage del navegador (no hay backend).
   ========================================================================== */

const STORAGE_KEY = 'utec-equipo-data-v2';

const DEFAULT_DATA = [
  { sede: 'Montevideo', nombre: 'Paz', cargo: 'Coordinadora de Prensa' },
  { sede: 'Montevideo', nombre: 'Nati', cargo: 'Coordinadora de Audiovisual y Digital' },
  { sede: 'Montevideo', nombre: 'Andre', cargo: 'Analista I de Interna' },
  { sede: 'Montevideo', nombre: 'Jess', cargo: 'Analista I de Gestión' },
  { sede: 'Montevideo', nombre: 'Fierra', cargo: 'Analista I de Digital' },
  { sede: 'Montevideo', nombre: 'Andrius', cargo: 'Analista I de Audiovisual' },
  { sede: 'Montevideo', nombre: 'Gasti', cargo: 'Analista I de Audiovisual' },
  { sede: 'Rivera', nombre: 'Pato', cargo: 'Coordinadora' },
  { sede: 'Rivera', nombre: 'Ale', cargo: 'Analista' },
  { sede: 'Fray Bentos', nombre: 'Lou', cargo: 'Coordinadora' },
  { sede: 'Fray Bentos', nombre: 'Manu', cargo: 'Asistente' },
  { sede: 'Durazno', nombre: 'Ahira', cargo: 'Analista II', comentarios: 'Ascenso a Analista I en trámite.' },
  { sede: 'Durazno', nombre: 'Matías', cargo: 'Becario' },
].map((p, i) => ({
  id: 'p' + i,
  sede: p.sede,
  nombre: p.nombre,
  cargo: p.cargo,
  tareas: '',
  reuniones: '',
  ascenso: '',
  comentarios: p.comentarios || '',
}));

const SEDES_ORDEN = ['Montevideo', 'Rivera', 'Fray Bentos', 'Durazno'];

let state = loadState();
let saveTimer = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('No se pudo leer localStorage', e);
  }
  return DEFAULT_DATA.map(p => ({ ...p }));
}

function saveState(immediate) {
  const doSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setSavedIndicator();
    } catch (e) {
      console.warn('No se pudo guardar en localStorage', e);
    }
  };
  clearTimeout(saveTimer);
  if (immediate) {
    doSave();
  } else {
    saveTimer = setTimeout(doSave, 400);
  }
}

function setSavedIndicator() {
  const el = document.getElementById('saveIndicator');
  if (!el) return;
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  el.textContent = `Guardado automáticamente · ${hh}:${mm}`;
  el.classList.add('save-flash');
  setTimeout(() => el.classList.remove('save-flash'), 700);
}

function uid() {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function getPerson(id) {
  return state.find(p => p.id === id);
}

function updateField(id, field, value) {
  const person = getPerson(id);
  if (!person) return;
  person[field] = value;
  saveState(false);
}

function deletePerson(id) {
  const person = getPerson(id);
  if (!person) return;
  if (!confirm(`¿Eliminar a ${person.nombre} del equipo? Esta acción no se puede deshacer.`)) return;
  state = state.filter(p => p.id !== id);
  saveState(true);
  render();
}

function addPerson(sede) {
  const nombre = prompt(`Nombre de la nueva persona en ${sede}:`);
  if (!nombre || !nombre.trim()) return;
  const cargo = prompt('Cargo:') || '';
  state.push({
    id: uid(),
    sede,
    nombre: nombre.trim(),
    cargo: cargo.trim(),
    tareas: '',
    reuniones: '',
    ascenso: '',
    comentarios: '',
  });
  saveState(true);
  render();
}

function addSede() {
  const sede = prompt('Nombre de la nueva sede/lugar:');
  if (!sede || !sede.trim()) return;
  addPerson(sede.trim());
}

function insertToday(textareaId) {
  const ta = document.getElementById(textareaId);
  if (!ta) return;
  const today = new Date();
  const fecha = String(today.getDate()).padStart(2, '0') + '/' + String(today.getMonth() + 1).padStart(2, '0');
  const prefix = `${fecha} — `;
  const start = ta.selectionStart ?? ta.value.length;
  const before = ta.value.slice(0, start);
  const needsBreak = before.length > 0 && !before.endsWith('\n');
  const insertion = (needsBreak ? '\n' : '') + prefix;
  ta.value = before + insertion + ta.value.slice(start);
  ta.focus();
  const pos = start + insertion.length;
  ta.setSelectionRange(pos, pos);
  ta.dispatchEvent(new Event('input'));
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function autoGrow(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

function personCard(p) {
  return `
  <article class="person-card" data-id="${p.id}" data-nombre="${escapeHtml(p.nombre.toLowerCase())}">
    <div class="person-head">
      <div class="person-id">
        <input class="field-nombre" data-field="nombre" value="${escapeHtml(p.nombre)}" aria-label="Nombre">
        <input class="field-cargo" data-field="cargo" value="${escapeHtml(p.cargo)}" aria-label="Cargo" placeholder="Cargo">
      </div>
      <button class="btn-icon btn-delete" title="Eliminar de la lista" aria-label="Eliminar">&times;</button>
    </div>

    <div class="person-body">
      <div class="field-block">
        <label>Tareas en curso</label>
        <textarea data-field="tareas" placeholder="Escribí las tareas en curso…">${escapeHtml(p.tareas)}</textarea>
      </div>

      <div class="field-block">
        <div class="field-block-head">
          <label>Seguimiento de reuniones</label>
          <button class="btn-mini" data-action="insert-date" title="Insertar fecha de hoy">+ fecha</button>
        </div>
        <textarea data-field="reuniones" id="reuniones-${p.id}" placeholder="Ej: 12/08 — 1:1, revisamos objetivos del mes…">${escapeHtml(p.reuniones)}</textarea>
      </div>

      <div class="field-row">
        <div class="field-block">
          <label>Último ascenso</label>
          <input data-field="ascenso" value="${escapeHtml(p.ascenso)}" placeholder="Ej: Analista II → I, 03/2026">
        </div>
      </div>

      <div class="field-block">
        <label>Comentarios</label>
        <textarea data-field="comentarios" placeholder="Notas generales…">${escapeHtml(p.comentarios)}</textarea>
      </div>
    </div>
  </article>`;
}

function sedeSection(sede, personas) {
  return `
  <section class="sede-section" data-sede="${escapeHtml(sede)}">
    <div class="sede-head">
      <h2>${escapeHtml(sede)} <span class="sede-count">${personas.length}</span></h2>
      <button class="btn-mini btn-add" data-action="add-person" data-sede="${escapeHtml(sede)}">+ Agregar persona</button>
    </div>
    <div class="person-grid">
      ${personas.map(personCard).join('')}
    </div>
  </section>`;
}

function render() {
  const root = document.getElementById('app');
  const sedesPresentes = [...new Set(state.map(p => p.sede))];
  const sedesOrdenadas = [
    ...SEDES_ORDEN.filter(s => sedesPresentes.includes(s)),
    ...sedesPresentes.filter(s => !SEDES_ORDEN.includes(s)),
  ];

  root.innerHTML = sedesOrdenadas.map(sede => {
    const personas = state.filter(p => p.sede === sede);
    return sedeSection(sede, personas);
  }).join('');

  document.getElementById('totalCount').textContent = state.length;

  root.querySelectorAll('textarea').forEach(autoGrow);
  applyFilters();
}

function applyFilters() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const sedeFilter = document.getElementById('sedeFilter').value;

  document.querySelectorAll('.sede-section').forEach(section => {
    const sede = section.dataset.sede;
    const sedeVisible = sedeFilter === 'todas' || sedeFilter === sede;
    let anyVisible = false;

    section.querySelectorAll('.person-card').forEach(card => {
      const matches = sedeVisible && (q === '' || card.dataset.nombre.includes(q));
      card.style.display = matches ? '' : 'none';
      if (matches) anyVisible = true;
    });

    section.style.display = anyVisible ? '' : 'none';
  });
}

function exportJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `equipo-comunicacion-utec-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function exportCSV() {
  const headers = ['Lugar', 'Nombre', 'Cargo', 'Tareas en curso', 'Seguimiento de reuniones', 'Último ascenso', 'Comentarios'];
  const rows = state.map(p => [p.sede, p.nombre, p.cargo, p.tareas, p.reuniones, p.ascenso, p.comentarios]);
  const csvEscape = v => `"${String(v || '').replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map(r => r.map(csvEscape).join(',')).join('\r\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `equipo-comunicacion-utec-${stamp}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data)) throw new Error('Formato inválido');
      const normalized = data.map(p => ({
        id: p.id || uid(),
        sede: p.sede || 'Sin sede',
        nombre: p.nombre || '',
        cargo: p.cargo || '',
        tareas: p.tareas || '',
        reuniones: p.reuniones || '',
        ascenso: p.ascenso || '',
        comentarios: p.comentarios || '',
      }));
      if (!confirm(`Se van a importar ${normalized.length} personas y se reemplazarán los datos actuales. ¿Continuar?`)) return;
      state = normalized;
      saveState(true);
      render();
    } catch (e) {
      alert('No se pudo leer el archivo. Verificá que sea un JSON exportado desde esta página.');
    }
  };
  reader.readAsText(file);
}

function resetData() {
  if (!confirm('Esto va a borrar todos los cambios guardados y restaurar la lista original del equipo. ¿Continuar?')) return;
  state = DEFAULT_DATA.map(p => ({ ...p }));
  saveState(true);
  render();
}

function init() {
  render();

  document.getElementById('app').addEventListener('input', e => {
    const target = e.target;
    const card = target.closest('.person-card');
    if (!card || !target.dataset.field) return;
    updateField(card.dataset.id, target.dataset.field, target.value);
    if (target.dataset.field === 'nombre') {
      card.dataset.nombre = target.value.toLowerCase();
    }
    if (target.tagName === 'TEXTAREA') autoGrow(target);
  });

  document.getElementById('app').addEventListener('click', e => {
    const delBtn = e.target.closest('.btn-delete');
    if (delBtn) {
      const card = delBtn.closest('.person-card');
      deletePerson(card.dataset.id);
      return;
    }
    const dateBtn = e.target.closest('[data-action="insert-date"]');
    if (dateBtn) {
      const card = dateBtn.closest('.person-card');
      insertToday(`reuniones-${card.dataset.id}`);
      return;
    }
    const addBtn = e.target.closest('[data-action="add-person"]');
    if (addBtn) {
      addPerson(addBtn.dataset.sede);
      return;
    }
  });

  document.getElementById('searchInput').addEventListener('input', applyFilters);
  document.getElementById('sedeFilter').addEventListener('change', applyFilters);
  document.getElementById('addSedeBtn').addEventListener('click', addSede);
  document.getElementById('exportJsonBtn').addEventListener('click', exportJSON);
  document.getElementById('exportCsvBtn').addEventListener('click', exportCSV);
  document.getElementById('resetBtn').addEventListener('click', resetData);
  document.getElementById('importInput').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) importJSON(file);
    e.target.value = '';
  });
}

document.addEventListener('DOMContentLoaded', init);
