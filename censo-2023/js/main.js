/* ==========================================================================
   Censo de Estudiantes UTEC 2025 — interacciones y render de datos
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initChrome();
  initTileMap();
  initCharts();
  initItrGrid();
  initClosingGrid();
});

/* ---------- Chrome: nav, progress bar, reveal, counters ---------- */
function initChrome() {
  const progressBar = document.getElementById("progressBar");
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    progressBar.style.width = pct + "%";
  });

  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", nav.classList.contains("open"));
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        const counter = entry.target.querySelector("[data-counter]");
        if (counter) animateCounter(counter);
        if (entry.target.hasAttribute("data-counter")) animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll("[data-reveal]").forEach(elx => io.observe(elx));
}

function animateCounter(node) {
  const target = +node.getAttribute("data-counter");
  const suffix = node.getAttribute("data-suffix") || "";
  const dur = 1200;
  const start = performance.now();
  function tick(now) {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    node.textContent = Math.round(target * eased).toLocaleString("es-UY") + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------- Tile map ---------- */
function seqColor(pct, max) {
  // sequential blue ramp (see dataviz skill palette.md)
  const steps = ["#cde2fb", "#9ec5f4", "#5598e7", "#2a78d6", "#184f95"];
  const t = Math.min(1, pct / max);
  const idx = Math.min(steps.length - 1, Math.floor(t * steps.length));
  return steps[idx];
}

function initTileMap() {
  const byId = {};
  CENSO.residenciaDepartamento.forEach(d => { byId[d.id] = d; });
  const max = Math.max(...CENSO.residenciaDepartamento.map(d => d.pct));

  const svg = document.getElementById("uyMap");
  const wrap = svg.closest(".map-wrap");
  const detailEl = document.getElementById("mapDetail");
  const legendEl = document.getElementById("mapLegend");

  const tooltip = el("div", "uy-map-tooltip");
  wrap.append(tooltip);

  const svgNS = "http://www.w3.org/2000/svg";
  svg.setAttribute("viewBox", URUGUAY_DEPT_PATHS.viewBox);

  URUGUAY_DEPT_PATHS.features.forEach(feat => {
    const dep = byId[feat.id];
    if (!dep) return;
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", feat.d);
    path.setAttribute("class", "uy-dept");
    path.setAttribute("fill", seqColor(dep.pct, max));
    path.setAttribute("tabindex", "0");
    path.setAttribute("role", "button");
    path.setAttribute("aria-label", `${dep.nombre}: ${fmtPct(dep.pct, 1)} de estudiantes residentes`);
    path.addEventListener("click", () => selectDept(dep, path));
    path.addEventListener("mouseenter", (e) => { showTooltip(feat, dep); selectDept(dep, path, true); });
    path.addEventListener("mousemove", (e) => moveTooltip(e));
    path.addEventListener("mouseleave", () => tooltip.classList.remove("show"));
    path.addEventListener("focus", () => selectDept(dep, path, true));
    svg.append(path);
  });

  // Small departments (Montevideo, Flores, etc.) get a leader-line-free label
  // only when there's room; skipped here in favor of the hover tooltip so
  // tiny shapes stay legible.

  function showTooltip(feat, dep) {
    tooltip.textContent = `${dep.nombre}: ${fmtPct(dep.pct, 1)}`;
    tooltip.classList.add("show");
  }
  function moveTooltip(e) {
    const r = wrap.getBoundingClientRect();
    tooltip.style.left = (e.clientX - r.left) + "px";
    tooltip.style.top = (e.clientY - r.top) + "px";
  }

  function selectDept(dep, path, hover) {
    if (!hover) svg.querySelectorAll(".uy-dept").forEach(p => p.classList.remove("is-active"));
    if (!hover) path.classList.add("is-active");
    detailEl.innerHTML = `
      <h4>${dep.nombre}</h4>
      <span class="md-pct">${fmtPct(dep.pct, 1)}</span>
      <p class="map-detail-hint" style="margin-top:6px;">de los estudiantes de UTEC residen en este departamento.</p>
      ${dep.nota ? `<p class="md-note">${dep.nota}</p>` : ""}
      ${dep.confirmado ? `<span class="md-confirmed">Cifra citada en el informe</span>` : `<span class="md-confirmed" style="background:#fdf3e3;color:#a3690b;">Leída del gráfico (Fig. 16)</span>`}
    `;
  }

  const ramp = el("div", "ramp");
  ["#cde2fb", "#9ec5f4", "#5598e7", "#2a78d6", "#184f95"].forEach(c => {
    const s = document.createElement("span");
    s.style.background = c;
    ramp.append(s);
  });
  legendEl.append(document.createTextNode("Menos "));
  legendEl.append(ramp);
  legendEl.append(document.createTextNode(" Más"));
}

/* ---------- Charts ---------- */
function initCharts() {
  const $ = id => document.getElementById(id);
  const years = Array.from({ length: 11 }, (_, i) => 2015 + i);

  // Razón de sexos (single line)
  renderMultiLine($("chartRazonSexos"), [
    { label: "Mujeres cada 100 varones", color: "#e87ba4", values: CENSO.razonSexosEvol.map(d => Math.round(d.v * 10) / 10) },
  ], { years, suffix: "", yMax: 70 });

  // Sexo split
  renderSplitBar($("chartSexoSplit"), [
    { label: "Masculino", pct: CENSO.sexo.masculino, color: "#2a78d6" },
    { label: "Femenino", pct: CENSO.sexo.femenino, color: "#e87ba4" },
  ]);

  // Tramos edad
  renderHBars($("chartTramosEdad"), CENSO.tramosEdad2025.map(d => ({ label: d.label, pct: d.pct })), { colorFn: () => "#2a78d6" });

  // Edad promedio evol
  renderMultiLine($("chartEdadEvol"), [
    { label: "Edad promedio", color: "#4a3aa7", values: CENSO.edadPromedioEvol.map(d => d.v) },
  ], { years, suffix: " años", yMax: 35 });

  // Ascendencia (multi, no exclusiva)
  renderHBars($("chartAscendencia"), CENSO.ascendencia.map(d => ({ label: d.label, pct: d.pct })),
    { colorFn: (_, i) => CHART_PALETTE[i], max: 100 });

  // Tipo de hogar
  renderHBars($("chartTipoHogar"), CENSO.tipoHogar2025.map(d => ({ label: d.label, pct: d.pct })), { colorFn: () => "#1baf7a" });

  // Hogar evol (3 lines)
  renderMultiLine($("chartHogarEvol"), [
    { label: "Con padres", color: "#2a78d6", values: CENSO.hogarEvol.map(d => d.padres) },
    { label: "Con cónyuge/pareja", color: "#eda100", values: CENSO.hogarEvol.map(d => d.conyuge) },
    { label: "Solo/a", color: "#eb6834", values: CENSO.hogarEvol.map(d => d.solo) },
  ], { years, yMax: 60 });

  // Clima educativo evol (stacked)
  renderStackedBarEvol($("chartClimaEducativo"), CENSO.climaEducativoEvol, ["bajo", "medio", "alto"],
    ["#e34948", "#eda100", "#1baf7a"], ["Bajo", "Medio", "Alto"], years);

  // Recursos evol (stacked)
  renderStackedBarEvol($("chartRecursos"), CENSO.recursosEvol, ["trabajo", "familia", "becas"],
    ["#eb6834", "#2a78d6", "#1baf7a"], ["Trabajo", "Aporte de la familia", "Becas"], years);

  // INSE
  renderHBars($("chartInse"), CENSO.inse2025.map(d => ({ label: d.label, pct: d.pct })),
    { colorFn: (_, i) => ["#184f95","#2a78d6","#5598e7","#9ec5f4","#eda100","#eb6834","#e34948"][i] });

  // EMS institución evol
  renderStackedBarEvol($("chartEmsInstitucion"), CENSO.emsInstitucionEvol, ["publico", "utu", "privado"],
    ["#2a78d6", "#1baf7a", "#4a3aa7"], ["Liceo público", "UTU", "Liceo privado"], years);

  // Orientación liceo
  renderHBars($("chartOrientacionLiceo"), CENSO.orientacionLiceo2025.map(d => ({ label: d.label, pct: d.pct })), { colorFn: (_, i) => CHART_PALETTE[i] });

  // Terciario donde
  renderHBars($("chartTerciarioDonde"), CENSO.terciarioPrevio.dondeEstudio.map(d => ({ label: d.label, pct: d.pct })), { colorFn: (_, i) => CHART_PALETTE[i] });

  // Terciario area
  renderHBars($("chartTerciarioArea"), CENSO.terciarioPrevio.areaConocimiento.map(d => ({ label: d.label, pct: d.pct })), { colorFn: (_, i) => CHART_PALETTE[i] });

  // Trabaja evol
  renderMultiLine($("chartTrabajaEvol"), [
    { label: "% que trabaja", color: "#eb6834", values: CENSO.trabajaEvol.map(d => d.v) },
  ], { years, yMax: 80 });

  // Categoria ocupacional evol
  renderStackedBarEvol($("chartCategoriaOcupacional"), CENSO.categoriaOcupacionalEvol, ["privado", "publico", "pasante"],
    ["#2a78d6", "#1baf7a", "#eda100"], ["Asalariado privado", "Asalariado público", "Pasante/Becario"], years);

  // Horas trabajo
  renderHBars($("chartHorasTrabajo"), CENSO.horasTrabajo2025.map(d => ({ label: d.label, pct: d.pct })), { colorFn: () => "#eb6834" });

  // Relación carrera evol
  renderStackedBarEvol($("chartRelacionCarrera"), CENSO.relacionCarreraEvol, ["directa", "indirecta", "no"],
    ["#1baf7a", "#eda100", "#e34948"], ["Directamente relacionada", "Relacionada indirectamente", "No relacionada"], years);

  // Ocupacion
  renderHBars($("chartOcupacion"), CENSO.ocupacion2025.slice(0, 8).map(d => ({ label: d.label, pct: d.pct })), { colorFn: (_, i) => CHART_PALETTE[i % CHART_PALETTE.length] });

  // Generacion ingreso
  renderHBars($("chartGeneracionIngreso"), CENSO.generacionIngreso.map(d => ({ label: String(d.anio), pct: d.pct })), { colorFn: () => "#4a3aa7" });

  // Carreras (sorted desc)
  const carrerasSorted = [...CENSO.carreras].sort((a, b) => b.pct - a.pct);
  renderHBars($("chartCarreras"), carrerasSorted.map(d => ({ label: d.nombre, pct: d.pct })), { colorFn: (_, i) => CHART_PALETTE[i % CHART_PALETTE.length], decimals: 1 });

  // Titulacion
  renderHBars($("chartTitulacion"), CENSO.titulacion.map(d => ({ label: d.label, pct: d.pct })), { colorFn: (_, i) => CHART_PALETTE[i] });

  // Modalidad
  renderHBars($("chartModalidad"), CENSO.modalidad2025.map(d => ({ label: d.label, pct: d.pct })), { colorFn: (_, i) => CHART_PALETTE[i] });
}

/* ---------- ITR grid ---------- */
function initItrGrid() {
  const grid = document.getElementById("itrGrid");
  CENSO.itr.forEach(itr => {
    const card = el("div", "itr-card");
    let stats = "";
    const addStat = (label, val) => { if (val !== null && val !== undefined) stats += `<div class="itr-stat"><span>${label}</span><b>${val}</b></div>`; };
    addStat("Matrícula UTEC", itr.pct + "%");
    addStat("% varones", itr.varonesPct !== null ? itr.varonesPct + "%" : null);
    addStat("Edad promedio", itr.edadProm !== null ? itr.edadProm + " años" : null);
    addStat("INSE bajo", itr.inseBajoPct !== null ? itr.inseBajoPct + "%" : null);
    addStat("Primera generación", itr.primeraGenPct !== null ? itr.primeraGenPct + "%" : null);
    addStat("Trabaja", itr.trabajaPct !== null ? itr.trabajaPct + "%" : null);

    const centros = itr.centros.map(c => `${c.n} (${c.pct}%)`).join(" · ");

    card.innerHTML = `
      <h4>${itr.nombre}</h4>
      <span class="itr-since">Activo desde ${itr.inicio}</span>
      <span class="itr-n">${itr.n.toLocaleString("es-UY")}</span>
      <span class="itr-n-label">estudiantes censados</span>
      ${stats}
      <p class="itr-centros">Centros: ${centros}</p>
    `;
    grid.append(card);
  });
}

/* ---------- Closing insight cards ---------- */
function initClosingGrid() {
  const grid = document.getElementById("closingGrid");
  const insights = [
    { icon: "📉", title: "Menos trabajo, más familia", text: "El trabajo dejó de ser la principal fuente de ingresos: cayó de 76% (2015) a 44% (2025), mientras el aporte familiar subió a 45%." },
    { icon: "🏠", title: "Cada vez más viven solos", text: "El 17% de los estudiantes vive solo, casi el triple que en 2015 (12%), en línea con la caída sostenida de convivencia con la pareja." },
    { icon: "💻", title: "La híbrida llegó para quedarse", text: "38% de las carreras se cursan en modalidad híbrida, permitiendo estudiar sin mudarse — clave para la diversificación territorial." },
    { icon: "🗺️", title: "La matrícula se mudó al norte", text: "Rivera pasó de 2,7% a 12,5% de los estudiantes residentes y Río Negro llegó a 18,3%, de la mano de la apertura de nuevos ITR." },
    { icon: "👩", title: "Más mujeres cada año", text: "La razón de sexos viene subiendo desde 2020 y llegó a 52 mujeres cada 100 varones en 2025, el valor más alto de la década." },
    { icon: "🎓", title: "Primera generación", text: "83% de los estudiantes es la primera persona de su familia en llegar a la universidad, un rasgo estable en toda la serie." },
  ];
  insights.forEach(i => {
    const card = el("div", "closing-card", `<span class="cc-icon">${i.icon}</span><h4>${i.title}</h4><p>${i.text}</p>`);
    card.setAttribute("data-reveal", "");
    grid.append(card);
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); } });
  }, { threshold: 0.1 });
  grid.querySelectorAll("[data-reveal]").forEach(c => io.observe(c));
}
