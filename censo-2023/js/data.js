/* ==========================================================================
   Censo 2023 Uruguay — dataset
   Recopilado de fuentes públicas (INE y cobertura de prensa) porque el PDF
   original compartido por el usuario no pudo descargarse en este entorno
   (Google Drive bloqueado por política de red). Ver sección de fuentes.
   ========================================================================== */

const CENSO = {
  nacional: {
    poblacionTotal: 3499451,
    hogares: 1373546,
    viviendas: 1659048,
    mujeresPct: 52.8,
    hombresPct: 46.5,
    tamHogar2023: 2.5,
    tamHogar1908: 5.7,
    edadMediana2023: 38,
    edadMediana2004: 29,
    menores15Pct2023: 18,
    menores15Pct1993: 28,
    mayores65Pct: 16,
    mayores65Personas: 545301,
    mayores35SuperanMitad: true,
    centenarios2023: 800,
    centenariosHace20: 400,
    nonagenarios: 26000,
    ruralPct1963: 19,
    ruralPct2023: 3.8,
    nacidosExteriorPct: 4,
    nacidosExteriorPersonas: 122151,
    hogaresUnipersonal1963: 11,
    hogaresUnipersonal1985: 15.1,
    hogaresUnipersonal2023: 29.2,
    hogares2p1985: 23.4,
    hogares2p2023: 29.4,
    hogares5p1985: 11.1,
    hogares5p2023: 5.1,
    hogares8p1985: 2.9,
    hogares8p2023: 0.4,
  },

  etnia: [
    { id: "blanca", label: "Blanca", y2011: 93.9, y2023: 88.0 },
    { id: "afro", label: "Afrodescendiente", y2011: 8.1, y2023: 10.6 },
    { id: "indigena", label: "Ascendencia indígena", y2011: 5.1, y2023: 6.4 },
    { id: "asiatica", label: "Ascendencia asiática", y2011: 0.5, y2023: 0.7 },
  ],

  educacion: [
    { id: "primaria", label: "Primaria", pct: 24.4 },
    { id: "sec_basica", label: "Secundaria básica", pct: 24.3 },
    { id: "bachillerato", label: "Bachillerato completo", pct: 19.3 },
    { id: "universitaria", label: "Universitaria", pct: 13.8 },
    { id: "terciaria", label: "Terciaria no universitaria", pct: 4.1 },
    { id: "magisterio", label: "Magisterio / formación docente", pct: 4.1 },
    { id: "posgrado", label: "Posgrado", pct: 3.0 },
  ],

  migracionOrigen: [
    { id: "venezuela", label: "Venezuela", pct: 27 },
    { id: "argentina", label: "Argentina", pct: 22 },
    { id: "cuba", label: "Cuba", pct: 20 },
    { id: "otros", label: "Otros países", pct: 31 },
  ],

  // Población por departamento — cifras del Censo 2023 tal como fueron
  // publicadas por medios uruguayos citando al INE. "growth" solo se
  // completa cuando la fuente consultada lo reportó explícitamente.
  departamentos: [
    { id: "artigas", nombre: "Artigas", pob: 77487, col: 1, row: 1 },
    { id: "rivera", nombre: "Rivera", pob: 109300, col: 3, row: 1 },
    { id: "cerro_largo", nombre: "Cerro Largo", pob: 91025, col: 4, row: 1 },

    { id: "salto", nombre: "Salto", pob: 136197, col: 1, row: 2 },
    { id: "tacuarembo", nombre: "Tacuarembó", pob: 96013, col: 3, row: 2 },
    { id: "treinta_y_tres", nombre: "Treinta y Tres", pob: 47706, col: 4, row: 2,
      nota: "Una de las mayores caídas de población del país, según cobertura de prensa del Censo 2023." },

    { id: "paysandu", nombre: "Paysandú", pob: 121843, col: 1, row: 3 },
    { id: "durazno", nombre: "Durazno", pob: 62011, col: 3, row: 3 },
    { id: "lavalleja", nombre: "Lavalleja", pob: 59175, col: 4, row: 3 },
    { id: "rocha", nombre: "Rocha", pob: 80707, col: 5, row: 3 },

    { id: "rio_negro", nombre: "Río Negro", pob: 57334, col: 1, row: 4 },
    { id: "flores", nombre: "Flores", pob: 26271, col: 2, row: 4 },
    { id: "florida", nombre: "Florida", pob: 70325, col: 3, row: 4 },

    { id: "soriano", nombre: "Soriano", pob: 83685, col: 1, row: 5 },
    { id: "san_jose", nombre: "San José", pob: 119714, col: 2, row: 5 },
    { id: "canelones", nombre: "Canelones", pob: 609956, col: 3, row: 5,
      growth: 1.1, growthNote: "Segundo departamento que más creció por año en el período intercensal." },
    { id: "maldonado", nombre: "Maldonado", pob: 212951, col: 4, row: 5,
      growth: 1.8, growthNote: "El departamento que más creció por año en el período intercensal." },

    { id: "colonia", nombre: "Colonia", pob: 135797, col: 1, row: 6 },
    { id: "montevideo", nombre: "Montevideo", pob: 1302954, col: 3, row: 6,
      growth: -5.3, growthNote: "Perdió 72.586 habitantes respecto al censo 2011 (-5,3%)." },
  ],

  fuentes: [
    { titulo: "INE — Censo 2023, Uruguay", url: "https://www.gub.uy/instituto-nacional-estadistica/tematica/censo-2023" },
    { titulo: "OPP — Censo Nacional 2023 contabilizó 3.499.451 habitantes", url: "https://www.opp.gub.uy/es/noticias/censo-nacional-2023-contabilizo-3499451-habitantes-en-uruguay" },
    { titulo: "la diaria — El INE divulgó datos actualizados del Censo 2023 (hogares)", url: "https://ladiaria.com.uy/politica/articulo/2026/5/el-ine-divulgo-datos-actualizados-del-censo-2023-se-contabilizaron-1373546-hogares-en-todo-el-territorio-nacional/" },
    { titulo: "Teledoce — Cifras departamento por departamento", url: "https://www.teledoce.com/telemundo/nacionales/aumento-la-poblacion-de-uruguay-viven-3-499-451-personas-segun-datos-finales-del-censo-mira-los-datos-departamento-por-departamento/" },
    { titulo: "El Observador — El mapa de Uruguay tras el censo 2023", url: "https://www.elobservador.com.uy/nacional/montevideo-se-vacia-rocha-y-maldonado-crecen-mas-lo-proyectado-el-mapa-uruguay-el-censo-2023-n5974280" },
    { titulo: "Montevideo Portal — Hogares unipersonales y población rural", url: "https://www.montevideo.com.uy/Noticias/Doble-clic-al-censo-sube-cantidad-de-hogares-unipersonales-y-cae-la-poblacion-rural-uc909095" },
    { titulo: "Sociedad Uruguaya — Ascendencia étnico-racial", url: "https://www.sociedaduruguaya.org" },
    { titulo: "Infobae — Migración e inmigración reciente", url: "https://www.infobae.com/america/america-latina/2025/03/05/mas-de-100-mil-extranjeros-viven-en-uruguay-argentina-venezuela-y-cuba-son-los-principales-origenes/" },
  ],
};
