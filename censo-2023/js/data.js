/* ==========================================================================
   Censo Anual de Estudiantes UTEC 2025 — dataset
   Fuente: "Informe Censo de Estudiantes 2025", UTEC Innova — Programa de
   Evaluación y Estadística, Departamento de Innovación y Emprendimiento.
   Transcripto a partir de las páginas del informe subidas por el usuario
   (ver censo-2023/fuente/). Todas las cifras citan la figura/cuadro de
   origen en el propio informe.
   ========================================================================== */

const CENSO = {
  meta: {
    titulo: "Censo Anual de Estudiantes UTEC 2025",
    fuente: "UTEC Innova — Programa de Evaluación y Estadística, Departamento de Innovación y Emprendimiento",
    poblacionCensal: 3232,
    respondieron: 3231,
    coberturaGlobal: 94,
    periodoRelevamiento: "Abril–julio 2025, cuestionario auto-administrado on-line",
    carrerasOfrecidas: 17,
    itrCount: 4,
    localidadesResidencia: 209,
    barriosMontevideo: 49,
  },

  // Figura 1 — generación de ingreso
  generacionIngreso: [
    { anio: 2014, pct: 0 }, { anio: 2015, pct: 0 }, { anio: 2016, pct: 0 },
    { anio: 2017, pct: 1 }, { anio: 2018, pct: 2 }, { anio: 2019, pct: 3 },
    { anio: 2020, pct: 3 }, { anio: 2021, pct: 6 }, { anio: 2022, pct: 11 },
    { anio: 2023, pct: 13 }, { anio: 2024, pct: 22 }, { anio: 2025, pct: 39 },
  ],

  // Figura 2 — matrícula por ITR (2025)
  itr: [
    { id: "suroeste", nombre: "ITR Suroeste", pct: 65, n: 1557, inicio: 2014,
      centros: [{n:"Fray Bentos",pct:28},{n:"Paysandú",pct:16},{n:"La Paz",pct:2},{n:"Mercedes",pct:2},{n:"Nueva Helvecia",pct:1}],
      varonesPct: null, edadProm: null, inseBajoPct: null, primeraGenPct: null, trabajaPct: null,
      residenMismaRegionPct: 82, localidades: 114 },
    { id: "centro_sur", nombre: "ITR Centro Sur", pct: 27, n: 880, inicio: 2016,
      centros: [{n:"Durazno",pct:21},{n:"San José",pct:6}],
      varonesPct: 64, edadProm: 26, inseBajoPct: null, primeraGenPct: 83, trabajaPct: null,
      climaEducBajoPct: 54, viveConPadresPct: 55, viveSoloPct: 18, tieneHijosPct: 15,
      localidades: 99 },
    { id: "norte", nombre: "ITR Norte", pct: 16, n: 507, inicio: 2017,
      centros: [{n:"Rivera",pct:13},{n:"Melo",pct:3}],
      varonesPct: 75, edadProm: 24, inseBajoPct: 45, inseMedioPct: 48, inseAltoPct: 7,
      primeraGenPct: 86, trabajaPct: 33, climaEducBajoPct: 53,
      viveConPadresPct: 56, viveSoloPct: 16, tieneHijosPct: 10,
      residenMismaRegionPct: 94, localidades: 35, residenRiveraPct: 64 },
    { id: "este", nombre: "ITR Este", pct: 8, n: 287, inicio: 2022,
      centros: [{n:"Maldonado",pct:5},{n:"Minas",pct:3}],
      varonesPct: null, edadProm: null, inseBajoPct: 21, inseMedioPct: 45, inseAltoPct: 34,
      primeraGenPct: null, trabajaPct: null },
  ],

  // Figura 3 — matrícula por carrera 2025 (sigla, nombre, ITR, pct)
  carreras: [
    { sigla: "LTI", nombre: "Lic. en Tecnologías de la Información", pct: 22.0 },
    { sigla: "TI", nombre: "Tecnólogo en Informática", pct: 16.0 },
    { sigla: "IMEC", nombre: "Ingeniería en Mecatrónica", pct: 8.9 },
    { sigla: "ILOG", nombre: "Ingeniería en Logística", pct: 7.2 + 5.8 },
    { sigla: "IER", nombre: "Ingeniería en Energías Renovables", pct: 4.8 },
    { sigla: "IAGUA", nombre: "Ingeniería en Agua y Desarrollo Sostenible", pct: 4.6 },
    { sigla: "LAA", nombre: "Lic. en Análisis Alimentario", pct: 4.7 },
    { sigla: "IBIO", nombre: "Ingeniería Biomédica", pct: 3.7 },
    { sigla: "TQ", nombre: "Tecnólogo Químico", pct: 3.7 },
    { sigla: "TIM", nombre: "Tecnólogo Industrial Mecánico", pct: 3.2 },
    { sigla: "IAGRO", nombre: "Ingeniería Agroambiental", pct: 4.0 },
    { sigla: "ICA", nombre: "Ingeniería en Control y Automática", pct: 3.2 },
    { sigla: "LIDIA", nombre: "Lic. en Ingeniería de Datos e IA", pct: 3.2 },
    { sigla: "LJMC", nombre: "Lic. en Jazz y Música Creativa", pct: 1.9 },
    { sigla: "LCTL", nombre: "Lic. en Ciencia y Tecnología de Lácteos", pct: 1.6 },
    { sigla: "TMSPL", nombre: "Tecnólogo en Manejo de Sistemas de Producción Lechera", pct: 0.8 },
    { sigla: "TCA", nombre: "Tecnólogo en Control Ambiental", pct: 0.6 },
  ],

  titulacion: [
    { id: "ingenieria", label: "Ingeniería", pct: 43 },
    { id: "licenciatura", label: "Licenciatura", pct: 34 },
    { id: "tecnologo", label: "Tecnólogo", pct: 23 },
  ],

  modalidad2025: [
    { id: "presencial", label: "Presencial", pct: 60 },
    { id: "hibrida", label: "Híbrida", pct: 38 },
    { id: "semipresencial", label: "Semipresencial", pct: 2 },
    { id: "alternancia", label: "Alternancia e internado", pct: 0.8 },
  ],
  modalidadEvol: [
    {a:2015,presencial:22,hibrida:72,semipresencial:0,alternancia:5},
    {a:2016,presencial:25,hibrida:71,semipresencial:0,alternancia:4},
    {a:2017,presencial:35,hibrida:61,semipresencial:0.9,alternancia:3},
    {a:2018,presencial:45,hibrida:53,semipresencial:0.4,alternancia:2},
    {a:2019,presencial:46,hibrida:51,semipresencial:2,alternancia:1},
    {a:2020,presencial:60,hibrida:36,semipresencial:2,alternancia:1},
    {a:2021,presencial:59,hibrida:38,semipresencial:2,alternancia:1},
    {a:2022,presencial:57,hibrida:40,semipresencial:2,alternancia:0.8},
    {a:2023,presencial:59,hibrida:39,semipresencial:2,alternancia:0.6},
    {a:2024,presencial:57,hibrida:41,semipresencial:2,alternancia:0.9},
    {a:2025,presencial:60,hibrida:38,semipresencial:2,alternancia:0.8},
  ],

  // --- Perfil socio-demográfico ---
  sexo: { masculino: 66, femenino: 34 },
  razonSexosEvol: [
    {a:2015,v:60.87},{a:2016,v:64.2},{a:2017,v:52.63},{a:2018,v:43.04},{a:2019,v:42.92},
    {a:2020,v:43.71},{a:2021,v:44},{a:2022,v:44.38},{a:2023,v:46.74},{a:2024,v:48.67},{a:2025,v:51.83},
  ],
  generoAutopercibido: [
    { id: "mujer_cis", label: "Mujer cis", n: 1097 },
    { id: "hombre_cis", label: "Hombre cis", n: 2071 },
    { id: "no_responde", label: "Prefiere no responder", n: 44 },
    { id: "otras", label: "Otras identidades", n: 12 },
    { id: "mujer_trans", label: "Mujer trans", n: 7 },
    { id: "hombre_trans", label: "Hombre trans", n: 4 },
  ],

  edad: { min: 18, max: 70, promedio: 25, mediana: 22, moda: 20 },
  edadPromedioEvol: [
    {a:2015,v:29},{a:2016,v:30},{a:2017,v:29},{a:2018,v:26},{a:2019,v:27},{a:2020,v:26},
    {a:2021,v:26},{a:2022,v:25},{a:2023,v:25},{a:2024,v:25},{a:2025,v:25},
  ],
  tramosEdad2025: [
    { id: "h19", label: "Hasta 19", pct: 22 },
    { id: "20_24", label: "20 a 24", pct: 44 },
    { id: "25_29", label: "25 a 29", pct: 15 },
    { id: "30_34", label: "30 a 34", pct: 8 },
    { id: "35_39", label: "35 a 39", pct: 5 },
    { id: "40_44", label: "40 a 44", pct: 3 },
    { id: "45_49", label: "45 a 49", pct: 2 },
    { id: "50+", label: "50 o más", pct: 1 },
  ],

  ascendencia: [
    { id: "blanca", label: "Blanca", pct: 96 },
    { id: "indigena", label: "Indígena", pct: 19 },
    { id: "afro", label: "Afro o negra", pct: 16 },
    { id: "asiatica", label: "Asiática", pct: 3 },
    { id: "otra", label: "Otra", pct: 10 },
  ],
  ascendenciaPrincipal2025: [
    { id: "blanca", label: "Blanca", pct: 71 },
    { id: "ninguna", label: "Ninguna", pct: 15 },
    { id: "afro", label: "Afro o negra", pct: 5 },
    { id: "indigena", label: "Indígena", pct: 5 },
    { id: "otra", label: "Otra", pct: 4 },
  ],

  hijos: { sinHijos: 89, conHijos: 11, unHijoPct: 53, dosOMasPct: 47, mujeresPct: 15, varonesPct: 9 },

  nacimiento: {
    nacionalPct: 97, extranjeroPct: 3,
    paisesExtranjero: 16,
    top5Nacimiento: "Montevideo, Paysandú, Río Negro, Rivera y Soriano concentran el 55% de los nacimientos",
  },

  // Figura 16 — % de estudiantes residentes por departamento, 2025
  // Los dos valores marcados confirmado:true fueron citados textualmente
  // en el informe; el resto se leyó del mapa coroplético (Figura 16) y
  // la suma de las 19 cifras da ~98.7%, consistente con redondeo.
  residenciaDepartamento: [
    { id: "artigas", nombre: "Artigas", pct: 0.7, col: 1, row: 1 },
    { id: "rivera", nombre: "Rivera", pct: 12.5, col: 3, row: 1, confirmado: true, nota: "Subió de 2,7% (2015) a 12,5% (2025)." },
    { id: "cerro_largo", nombre: "Cerro Largo", pct: 2.1, col: 4, row: 1 },
    { id: "salto", nombre: "Salto", pct: 2, col: 1, row: 2 },
    { id: "tacuarembo", nombre: "Tacuarembó", pct: 3.1, col: 3, row: 2 },
    { id: "treinta_y_tres", nombre: "Treinta y Tres", pct: 1.1, col: 4, row: 2 },
    { id: "paysandu", nombre: "Paysandú", pct: 12.6, col: 1, row: 3 },
    { id: "durazno", nombre: "Durazno", pct: 7.1, col: 3, row: 3 },
    { id: "lavalleja", nombre: "Lavalleja", pct: 1, col: 4, row: 3 },
    { id: "rocha", nombre: "Rocha", pct: 0.3, col: 5, row: 3 },
    { id: "rio_negro", nombre: "Río Negro", pct: 18.3, col: 1, row: 4, confirmado: true, nota: "Subió de 10,8% (2015) a 18,3% (2025); es el departamento con más residentes." },
    { id: "flores", nombre: "Flores", pct: 1.2, col: 2, row: 4 },
    { id: "florida", nombre: "Florida", pct: 2.5, col: 3, row: 4 },
    { id: "soriano", nombre: "Soriano", pct: 6.6, col: 1, row: 5 },
    { id: "san_jose", nombre: "San José", pct: 5.9, col: 2, row: 5 },
    { id: "canelones", nombre: "Canelones", pct: 5.9, col: 3, row: 5 },
    { id: "maldonado", nombre: "Maldonado", pct: 6.0, col: 4, row: 5, nota: "En 2015 no tenía estudiantes residentes; en 2025 ya representa el 4,8%–6% de la matrícula." },
    { id: "colonia", nombre: "Colonia", pct: 4.1, col: 1, row: 6 },
    { id: "montevideo", nombre: "Montevideo", pct: 5.7, col: 3, row: 6 },
  ],

  trasladoRegularPct: 52,
  vivenLocalidadConCentroPct: 59,

  // --- Hogar ---
  tipoHogar2025: [
    { id: "nuclear_padres", label: "Nuclear de padres", pct: 38 },
    { id: "monoparental_padres", label: "Monoparental de padres", pct: 18 },
    { id: "unipersonal", label: "Unipersonal (vive solo/a)", pct: 17 },
    { id: "nuclear_sin_hijos", label: "Nuclear sin hijos (con pareja)", pct: 11 },
    { id: "nuclear_con_hijos", label: "Nuclear con hijos", pct: 7 },
    { id: "no_nuclear_compuesto", label: "No nuclear compuesto", pct: 4 },
    { id: "no_nuclear_extendido", label: "No nuclear extendido", pct: 3 },
    { id: "monoparental", label: "Monoparental (con hijos, sin pareja)", pct: 2 },
  ],
  hogarEvol: [
    {a:2015,padres:34,conyuge:46,solo:12},{a:2016,padres:37,conyuge:45,solo:12},
    {a:2017,padres:41,conyuge:38,solo:13},{a:2018,padres:44,conyuge:33,solo:13},
    {a:2019,padres:47,conyuge:28,solo:15},{a:2020,padres:56,conyuge:24,solo:12},
    {a:2021,padres:56,conyuge:23,solo:14},{a:2022,padres:52,conyuge:23,solo:15},
    {a:2023,padres:53,conyuge:21,solo:17},{a:2024,padres:56,conyuge:19,solo:16},
    {a:2025,padres:56,conyuge:18,solo:17},
  ],

  climaEducativoEvol: [
    {a:2015,bajo:52,medio:27,alto:18},{a:2016,bajo:51,medio:26,alto:20},
    {a:2017,bajo:54,medio:22,alto:21},{a:2018,bajo:56,medio:21,alto:19},
    {a:2019,bajo:57,medio:21,alto:19},{a:2020,bajo:55,medio:21,alto:21},
    {a:2021,bajo:56,medio:22,alto:22},{a:2022,bajo:55,medio:22,alto:22},
    {a:2023,bajo:53,medio:23,alto:23},{a:2024,bajo:52,medio:22,alto:23},
    {a:2025,bajo:52,medio:20,alto:25},
  ],
  primeraGeneracionPct: 83,

  // --- Socioeconómico ---
  recursosEvol: [
    {a:2015,familia:19,becas:1,trabajo:76},{a:2016,familia:21,becas:3,trabajo:72},
    {a:2017,familia:31,becas:3,trabajo:63},{a:2018,familia:37,becas:2,trabajo:56},
    {a:2019,familia:38,becas:5,trabajo:54},{a:2020,familia:43,becas:8,trabajo:45},
    {a:2021,familia:40,becas:6,trabajo:49},{a:2022,familia:41,becas:5,trabajo:50},
    {a:2023,familia:43,becas:8,trabajo:45},{a:2024,familia:43,becas:8,trabajo:44},
    {a:2025,familia:45,becas:6,trabajo:44},
  ],
  becaPct: 6,
  ingresoHogarModal: "30.001 a 40.000 pesos uruguayos mensuales",
  ingresoHogarBajoPct: 19,
  ingresoPersonalBajo40kPct: 61,

  inse2025: [
    { id: "bajo-", label: "Bajo−", pct: 12 },
    { id: "bajo+", label: "Bajo+", pct: 22 },
    { id: "medio-", label: "Medio−", pct: 22 },
    { id: "medio", label: "Medio", pct: 17 },
    { id: "medio+", label: "Medio+", pct: 14 },
    { id: "alto-", label: "Alto−", pct: 9 },
    { id: "alto+", label: "Alto+", pct: 4 },
  ],

  // --- Educativo ---
  institucionPrimariaPublicaPct: 87,
  institucionMediaBasicaPublicaPct: 86,
  institucionMediaSuperiorPublicaPct: 94,
  emsInstitucionEvol: [
    {a:2015,publico:64,utu:29,privado:5},{a:2016,publico:70,utu:23,privado:4},
    {a:2017,publico:69,utu:24,privado:4},{a:2018,publico:66,utu:27,privado:5},
    {a:2019,publico:65,utu:28,privado:5},{a:2020,publico:62,utu:29,privado:6},
    {a:2021,publico:60,utu:30,privado:7},{a:2022,publico:62,utu:29,privado:7},
    {a:2023,publico:63,utu:28,privado:7},{a:2024,publico:62,utu:30,privado:6},
    {a:2025,publico:63,utu:29,privado:6},
  ],
  orientacionLiceo2025: [
    { id: "cientifica", label: "Científica", pct: 50 },
    { id: "biologica", label: "Biológica", pct: 28 },
    { id: "humanistica", label: "Humanística", pct: 19 },
    { id: "arte", label: "Arte y Expresión", pct: 3 },
  ],
  orientacionUtu2025: [
    { id: "informatica", label: "Informática", pct: 39 },
    { id: "administracion", label: "Administración", pct: 12 },
    { id: "electromecanica", label: "Electromecánica", pct: 10 },
    { id: "otros", label: "Otros", pct: 39 },
  ],
  terciarioPrevio: {
    tuvoPct: 29, tituloPct: 10,
    universitarioPct: 61, noUniversitarioPct: 39,
    dondeEstudio: [
      { id: "udelar", label: "UDELAR", pct: 54 },
      { id: "utu", label: "DGETP-UTU", pct: 17 },
      { id: "privado", label: "Univ./instituto privado", pct: 7 },
      { id: "docente", label: "Formación en Educación", pct: 8 },
      { id: "otra", label: "Otra institución", pct: 15 },
    ],
    areaConocimiento: [
      { id: "ing_tec", label: "Ingenierías y Tecnologías", pct: 32 },
      { id: "sociales", label: "Ciencias Sociales / Humanidades", pct: 22 },
      { id: "naturales", label: "Ciencias Naturales y Exactas", pct: 12 },
      { id: "otras", label: "Otras", pct: 10 },
      { id: "medicas", label: "Ciencias Médicas", pct: 10 },
      { id: "docencia", label: "Docencia (áreas diversas)", pct: 9 },
      { id: "agrarias", label: "Ciencias Agrarias", pct: 5 },
    ],
  },
  actividadPrevioIngresoPct: 69,
  finalizoEmsUnAnioAntesPct: 53,

  // --- Laboral ---
  trabajaPct2025: 40,
  economicamenteActivoPct: 68,
  buscaTrabajoPct: 28,
  trabajaEvol: [
    {a:2015,v:71},{a:2016,v:74},{a:2017,v:60},{a:2018,v:53},{a:2019,v:51},
    {a:2020,v:43},{a:2021,v:45},{a:2022,v:46},{a:2023,v:41},{a:2024,v:39},{a:2025,v:40},
  ],
  trabajaMujeresPct: 43, trabajaVaronesPct: 38,
  edadPromEmpleados: 29, edadPromNoEmpleados: 22,
  categoriaOcupacionalEvol: [
    {a:2015,privado:49,publico:39,pasante:4},{a:2016,privado:50,publico:36,pasante:2},
    {a:2017,privado:45,publico:40,pasante:2},{a:2018,privado:48,publico:36,pasante:3},
    {a:2019,privado:46,publico:39,pasante:2},{a:2020,privado:46,publico:31,pasante:4},
    {a:2021,privado:52,publico:27,pasante:3},{a:2022,privado:55,publico:27,pasante:3},
    {a:2023,privado:55,publico:24,pasante:5},{a:2024,privado:51,publico:25,pasante:6},
    {a:2025,privado:54,publico:22,pasante:7},
  ],
  horasTrabajo2025: [
    { id: "h20", label: "Hasta 20 horas", pct: 14 },
    { id: "h21_30", label: "Entre 21 y 30 horas", pct: 13 },
    { id: "h31_40", label: "Entre 31 y 40 horas", pct: 30 },
    { id: "h41_50", label: "Entre 41 y 50 horas", pct: 37 },
    { id: "h50+", label: "Más de 50 horas", pct: 6 },
  ],
  ocupacion2025: [
    { id: "otra", label: "Otra", pct: 30 },
    { id: "tics", label: "Técnicos en TICs", pct: 14 },
    { id: "oficinistas", label: "Oficinistas", pct: 9 },
    { id: "prof_ciencias", label: "Profesionales de ciencias e ingeniería (nivel medio)", pct: 8 },
    { id: "apoyo_admin", label: "Otro personal de apoyo administrativo", pct: 7 },
    { id: "trato_publico", label: "Empleados en trato directo con el público", pct: 7 },
    { id: "docencia", label: "Profesionales de la enseñanza", pct: 7 },
    { id: "vendedores", label: "Vendedores", pct: 6 },
    { id: "servicios", label: "Trabajadores de servicios personales", pct: 4 },
    { id: "prof_tics", label: "Profesionales de TICs", pct: 4 },
    { id: "prof_ciencias2", label: "Profesionales de ciencias e ingeniería", pct: 4 },
  ],
  relacionCarreraEvol: [
    {a:2015,directa:54,indirecta:33,no:13},{a:2016,directa:45,indirecta:32,no:23},
    {a:2017,directa:41,indirecta:32,no:27},{a:2018,directa:44,indirecta:30,no:26},
    {a:2019,directa:44,indirecta:29,no:27},{a:2020,directa:44,indirecta:28,no:28},
    {a:2021,directa:44,indirecta:31,no:25},{a:2022,directa:44,indirecta:29,no:26},
    {a:2023,directa:46,indirecta:30,no:25},{a:2024,directa:46,indirecta:30,no:24},
    {a:2025,directa:38,indirecta:35,no:27},
  ],
  buscaTrabajoEvol: [
    {a:2015,v:24},{a:2016,v:32},{a:2017,v:36},{a:2018,v:36},{a:2019,v:42},
    {a:2020,v:36},{a:2021,v:40},{a:2022,v:40},{a:2023,v:38},{a:2024,v:39},{a:2025,v:37},
  ],

  fuentes: [
    { titulo: "Informe Censo de Estudiantes 2025 — UTEC Innova (Evaluación y Estadística)", url: "https://www.utec.edu.uy" },
    { titulo: "Programa de Evaluación y Estadística — Departamento de Innovación y Emprendimiento, UTEC", url: "https://www.utec.edu.uy" },
  ],
};
