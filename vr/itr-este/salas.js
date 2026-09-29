// Salas del recorrido ITR Este – Minas. Cada sala muestra 5 fotos alrededor.
// Cada foto esconde una rueda en (u, v): u = 0 izquierda → 1 derecha,
// v = 0 arriba → 1 abajo, medido sobre la foto.

export const SALAS = [
  {
    id: 'hall',
    nombre: 'Hall de entrada',
    texto: '¡Bienvenidos al Instituto Tecnológico Regional Este!',
    fotos: [
      { img: 'img/foto-13.jpg', rueda: { u: 0.595, v: 0.515 } }, // mesa con sillas naranjas
      { img: 'img/foto-9.jpg',  rueda: { u: 0.735, v: 0.495 } }, // arriba de las papeleras
      { img: 'img/foto-17.jpg', rueda: { u: 0.44,  v: 0.595 } }, // mesa redonda
      { img: 'img/foto-12.jpg', rueda: { u: 0.30,  v: 0.585 } }, // puf azul
      { img: 'img/foto-18.jpg', rueda: { u: 0.73,  v: 0.555 } }, // silla amarilla junto al ventanal
    ],
  },
  {
    id: 'alto',
    nombre: 'Piso alto',
    texto: 'Espacios abiertos para estudiar, crear y encontrarse.',
    fotos: [
      { img: 'img/foto-2.jpg',  rueda: { u: 0.07, v: 0.63 } },  // puf azul
      { img: 'img/foto-10.jpg', rueda: { u: 0.38, v: 0.535 } }, // mesa de madera
      { img: 'img/foto-11.jpg', rueda: { u: 0.08, v: 0.63 } },  // sillón amarillo
      { img: 'img/foto-25.jpg', rueda: { u: 0.25, v: 0.545 } }, // mesa del pasillo
      { img: 'img/foto-3.jpg',  rueda: { u: 0.33, v: 0.45 } },  // locker azul
    ],
  },
  {
    id: 'aulas',
    nombre: 'Aulas, taller y recreo',
    texto: 'Acá se aprende haciendo.',
    fotos: [
      { img: 'img/foto-5.jpg', rueda: { u: 0.79, v: 0.40 } },  // estante de impresoras 3D
      { img: 'img/foto-6.jpg', rueda: { u: 0.46, v: 0.42 } },  // pantalla del aula
      { img: 'img/foto-7.jpg', rueda: { u: 0.84, v: 0.47 } },  // proyector
      { img: 'img/foto-8.jpg', rueda: { u: 0.40, v: 0.53 } },  // futbolito
      { img: 'img/foto-4.jpg', rueda: { u: 0.23, v: 0.545 } }, // mesa blanca
    ],
  },
];
