/* ==========================================================================
   Censo UTEC 2025 — utilidades de gráficos (vanilla JS, sin librerías)
   ========================================================================== */

const CHART_PALETTE = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#4a3aa7", "#e34948", "#008300"];

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

function fmtPct(v, decimals) {
  const d = decimals === undefined ? (Number.isInteger(v) ? 0 : 1) : decimals;
  return v.toFixed(d).replace(".", ",") + "%";
}

/* ---------- Horizontal bar list ---------- */
function renderHBars(container, items, opts) {
  opts = opts || {};
  const max = opts.max || Math.max(...items.map(i => i.pct)) * 1.05;
  const wrap = el("div", "bars");
  items.forEach((item, idx) => {
    const row = el("div", "bar-row");
    row.append(el("span", "bar-row-label", item.label));
    const track = el("div", "bar-track");
    const fill = el("div", "bar-fill");
    fill.style.background = opts.colorFn ? opts.colorFn(item, idx) : CHART_PALETTE[idx % CHART_PALETTE.length];
    track.append(fill);
    row.append(track);
    row.append(el("span", "bar-value", (opts.prefix || "") + fmtPct(item.pct, opts.decimals) ));
    wrap.append(row);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      fill.style.width = Math.min(100, (item.pct / max) * 100) + "%";
    }));
  });
  container.innerHTML = "";
  container.append(wrap);
}

/* ---------- Split bar (2-3 segments, e.g. sexo) ---------- */
function renderSplitBar(container, segments) {
  const wrap = el("div", "split-bar");
  segments.forEach(seg => {
    const s = el("div", "split-seg", seg.pct + "%");
    s.style.background = seg.color;
    s.title = seg.label + ": " + seg.pct + "%";
    wrap.append(s);
    requestAnimationFrame(() => requestAnimationFrame(() => { s.style.width = seg.pct + "%"; }));
  });
  container.innerHTML = "";
  container.append(wrap);
  const legend = el("div", "legend");
  segments.forEach(seg => {
    const li = el("span", "legend-item");
    li.innerHTML = `<span class="legend-dot" style="background:${seg.color}"></span>${seg.label}`;
    legend.append(li);
  });
  container.append(legend);
}

/* ---------- Multi-series line chart (SVG) ---------- */
function renderMultiLine(container, series, opts) {
  opts = opts || {};
  const years = opts.years;
  const W = opts.width || 640, H = opts.height || 260;
  const padL = 34, padR = 14, padT = 16, padB = 26;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const allVals = series.flatMap(s => s.values);
  const yMax = opts.yMax !== undefined ? opts.yMax : Math.ceil(Math.max(...allVals) / 10) * 10 + 10;
  const yMin = opts.yMin !== undefined ? opts.yMin : 0;

  const x = i => padL + (innerW * i) / (years.length - 1);
  const y = v => padT + innerH - (innerH * (v - yMin)) / (yMax - yMin);

  let svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">`;

  const gridSteps = 4;
  for (let g = 0; g <= gridSteps; g++) {
    const val = yMin + ((yMax - yMin) * g) / gridSteps;
    svg += `<line class="lc-gridline" x1="${padL}" x2="${W - padR}" y1="${y(val)}" y2="${y(val)}" />`;
    svg += `<text class="lc-axis-label" x="${padL - 6}" y="${y(val) + 3}" text-anchor="end">${Math.round(val)}${opts.suffix || ""}</text>`;
  }
  years.forEach((yr, i) => {
    if (i % (opts.yearStep || 1) !== 0 && i !== years.length - 1) return;
    svg += `<text class="lc-axis-label" x="${x(i)}" y="${H - 6}" text-anchor="middle">${yr}</text>`;
  });

  series.forEach(s => {
    const pts = s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
    svg += `<polyline class="lc-line" points="${pts}" style="stroke:${s.color}" />`;
    s.values.forEach((v, i) => {
      svg += `<circle class="lc-dot" cx="${x(i)}" cy="${y(v)}" r="3" style="stroke:${s.color}" />`;
    });
  });

  years.forEach((yr, i) => {
    svg += `<rect class="lc-hit" data-idx="${i}" x="${x(i) - innerW / (years.length - 1) / 2}" y="${padT}" width="${innerW / (years.length - 1)}" height="${innerH}" />`;
  });

  svg += `</svg>`;

  const wrap = el("div", "line-chart-wrap");
  wrap.innerHTML = svg;
  const tooltip = el("div", "lc-tooltip");
  wrap.append(tooltip);

  const svgEl = wrap.querySelector("svg");
  svgEl.querySelectorAll(".lc-hit").forEach(hit => {
    hit.addEventListener("mouseenter", () => showTip(hit));
    hit.addEventListener("mousemove", () => showTip(hit));
    hit.addEventListener("mouseleave", () => tooltip.classList.remove("show"));
  });

  function showTip(hit) {
    const i = +hit.getAttribute("data-idx");
    const rect = svgEl.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    const px = (x(i) / W) * rect.width + (rect.left - wrapRect.left);
    const py = (y(Math.max(...series.map(s => s.values[i]))) / H) * rect.height + (rect.top - wrapRect.top);
    let html = `<b>${years[i]}</b><br>`;
    series.forEach(s => { html += `${s.label}: <b>${s.values[i]}${opts.suffix || "%"}</b><br>`; });
    tooltip.innerHTML = html;
    tooltip.style.left = px + "px";
    tooltip.style.top = py + "px";
    tooltip.classList.add("show");
  }

  container.innerHTML = "";
  container.append(wrap);

  if (series.length > 1) {
    const legend = el("div", "legend");
    series.forEach(s => {
      const li = el("span", "legend-item");
      li.innerHTML = `<span class="legend-dot" style="background:${s.color}"></span>${s.label}`;
      legend.append(li);
    });
    container.append(legend);
  }
}

/* ---------- Stacked bar over years ---------- */
function renderStackedBarEvol(container, data, keys, colors, labels, years, opts) {
  opts = opts || {};
  const W = opts.width || 640, H = opts.height || 260;
  const padL = 30, padR = 10, padT = 10, padB = 26;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const barW = (innerW / years.length) * 0.62;
  const gap = (innerW / years.length) * 0.38;

  let svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">`;
  [0, 25, 50, 75, 100].forEach(v => {
    const yy = padT + innerH - (innerH * v) / 100;
    svg += `<line class="lc-gridline" x1="${padL}" x2="${W - padR}" y1="${yy}" y2="${yy}" />`;
    svg += `<text class="lc-axis-label" x="${padL - 5}" y="${yy + 3}" text-anchor="end">${v}%</text>`;
  });

  years.forEach((yr, i) => {
    const row = data[i];
    let acc = 0;
    const bx = padL + i * (barW + gap) + gap / 2;
    keys.forEach((k, ki) => {
      const val = row[k] || 0;
      const y0 = padT + innerH - (innerH * acc) / 100;
      const y1 = padT + innerH - (innerH * (acc + val)) / 100;
      svg += `<rect x="${bx}" y="${y1}" width="${barW}" height="${Math.max(0, y0 - y1)}" fill="${colors[ki]}" rx="2"><title>${labels[ki]} ${yr}: ${val}%</title></rect>`;
      acc += val;
    });
    if (i % (opts.yearStep || 1) === 0 || i === years.length - 1) {
      svg += `<text class="lc-axis-label" x="${bx + barW / 2}" y="${H - 6}" text-anchor="middle">${yr}</text>`;
    }
  });
  svg += `</svg>`;

  container.innerHTML = "";
  const wrap = el("div", "line-chart-wrap");
  wrap.innerHTML = svg;
  container.append(wrap);

  const legend = el("div", "legend");
  keys.forEach((k, ki) => {
    const li = el("span", "legend-item");
    li.innerHTML = `<span class="legend-dot" style="background:${colors[ki]}"></span>${labels[ki]}`;
    legend.append(li);
  });
  container.append(legend);
}
