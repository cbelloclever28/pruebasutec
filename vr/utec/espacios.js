// Configuración del recorrido. Para sumar un espacio: agregá la foto 360°
// (equirectangular, 2:1) en vr/utec/img/ y una entrada acá.
//
// Ángulos en grados, medidos desde donde mira la persona al entrar:
//   yaw   → 0 = de frente, 90 = a la derecha, -90 = a la izquierda, 180 = atrás
//   pitch → 0 = horizonte, positivo = arriba, negativo = abajo
//
// "imagen: null" usa un espacio de prueba generado por código.

export const ESPACIOS = [
  {
    id: 'hall',
    nombre: 'Hall de entrada',
    texto: 'Bienvenida/o a UTEC. Encontrá las ruedas escondidas.',
    imagen: null,
    color: '#1a9fdc',
    ruedas: [
      { yaw: 35, pitch: -8 },
      { yaw: -70, pitch: 12 },
      { yaw: 150, pitch: -18 },
      { yaw: -140, pitch: 4 },
      { yaw: 95, pitch: 22 },
    ],
    enlaces: [{ a: 'lab', yaw: 0, pitch: -10 }],
  },
  {
    id: 'lab',
    nombre: 'Laboratorio',
    texto: 'Tecnología aplicada en todo el país.',
    imagen: null,
    color: '#7a4fd6',
    ruedas: [
      { yaw: -30, pitch: 15 },
      { yaw: 60, pitch: -20 },
      { yaw: 120, pitch: 6 },
      { yaw: -100, pitch: -12 },
      { yaw: 180, pitch: 18 },
    ],
    enlaces: [
      { a: 'hall', yaw: 180, pitch: -10 },
      { a: 'patio', yaw: 70, pitch: -10 },
    ],
  },
  {
    id: 'patio',
    nombre: 'Patio',
    texto: '15 años. Recién empezamos.',
    imagen: null,
    color: '#18a36b',
    ruedas: [
      { yaw: 20, pitch: 25 },
      { yaw: -55, pitch: -15 },
      { yaw: 110, pitch: -5 },
      { yaw: -160, pitch: 10 },
      { yaw: 160, pitch: -22 },
    ],
    enlaces: [{ a: 'lab', yaw: -110, pitch: -10 }],
  },
];
