// lib/exercises.ts — Ejercicios cloze con referencias a pictogramas Gemini
// Cada ejercicio vincula: oración incompleta + palabra correcta + imagen + tagId RFID

import { VOCABULARY, findByWord, type WordItem } from "./vocabulary";

export interface Exercise {
  id: string;
  sentence: string;   // Oración con "___" como hueco
  answer: string;     // Palabra correcta
  word: WordItem;     // Objeto completo de la palabra
  hint: string;       // Pista suave textual
  pictogramSrc: string; // Ruta imagen Gemini o fallback emoji
}

// Mapa: word → imagen generada por Gemini (en /public/)
const GEMINI_IMAGES: Record<string, string> = {
  // Animales
  gato:     "/pictogram_gato_1779213395825.png",
  perro:    "/pictogram_perro_1779213438574.png",
  pato:     "/pictogram_pato_1779215858368.png",
  // Alimentos
  pan:      "/pictogram_pan_1779215959532.png",
  agua:     "/pictogram_agua_1779213484193.png",
  // Familia
  mamá:     "/pictogram_mama_1779213410725.png",
  papá:     "/pictogram_papa_1779213458849.png",
  niño:     "/pictogram_ni_o_1779215870493.png",
  niña:     "/pictogram_ni_o_1779215870493.png",
  familia:  "/pictogram_familia_1779215922915.png",
  // Naturaleza
  sol:      "/pictogram_sol_1779213423108.png",
  luna:     "/pictogram_luna_1779215884307.png",
  flor:     "/pictogram_flor_1779215938568.png",
  // Casa
  casa:     "/pictogram_casa_1779213471267.png",
  // Valores
  amor:     "/pictogram_amor_1779213496900.png",
  // Emociones
  feliz:    "/pictogram_feliz_1779215897003.png",
  // Mi Familia
  mi_familia: "/pictogram_familia_1779215922915.png",
};

// Oraciones cloze (una por palabra del vocabulario)
const SENTENCES: Record<string, { sentence: string; hint: string }> = {
  // Animales
  gato:      { sentence: "El ___ duerme en mi casa",        hint: "Hace 'miau' y tiene bigotes 🐱" },
  perro:     { sentence: "Mi ___ me da la pata",            hint: "Hace 'guau' y mueve la cola 🐶" },
  pato:      { sentence: "El ___ nada en el lago",          hint: "Hace 'cuac' y tiene pico 🦆" },
  vaca:      { sentence: "La ___ nos da leche",             hint: "Vive en el campo y es grande 🐄" },
  pez:       { sentence: "El ___ vive en el agua",          hint: "Nada y tiene aletas 🐟" },
  oso:       { sentence: "El ___ come miel",                hint: "Es grande, peludo y marrón 🐻" },
  caballo:   { sentence: "El ___ corre muy rápido",         hint: "Tiene crines y corre en el campo 🐴" },
  // Alimentos
  pan:       { sentence: "Como ___ en el desayuno",         hint: "Es redondo, marrón y crujiente 🍞" },
  agua:      { sentence: "Bebo ___ cuando tengo sed",       hint: "Es transparente y refresca 💧" },
  leche:     { sentence: "La ___ es blanca y rica",         hint: "La da la vaca y es blanca 🥛" },
  sopa:      { sentence: "La ___ está calentita",           hint: "Se come con cuchara y está caliente 🍲" },
  jugo:      { sentence: "El ___ de naranja es dulce",      hint: "Es líquido, de colores y rico 🧃" },
  manzana:   { sentence: "La ___ es roja y crujiente",      hint: "Es una fruta redonda y roja 🍎" },
  galleta:   { sentence: "Me gusta comer ___",              hint: "Es dulce, redonda y crujiente 🍪" },
  // Familia
  mamá:      { sentence: "Mi ___ me abraza fuerte",         hint: "Te cuida y te quiere mucho 👩" },
  papá:      { sentence: "Mi ___ me lleva al parque",       hint: "Juega contigo y te protege 👨" },
  bebé:      { sentence: "El ___ duerme en su cuna",        hint: "Es muy pequeñito y lindo 👶" },
  niño:      { sentence: "El ___ juega con bloques",        hint: "Es un chico pequeño que juega 🧒" },
  niña:      { sentence: "La ___ baila con alegría",        hint: "Es una chica pequeña que baila 👧" },
  abuelo:    { sentence: "Mi ___ me cuenta cuentos",        hint: "Es mayor y te quiere mucho 👴" },
  abuela:    { sentence: "Mi ___ me hace galletas",         hint: "Es mayor y hace cosas ricas 👵" },
  // Casa
  cama:      { sentence: "Duermo en mi ___",                hint: "Ahí descansas por las noches 🛏️" },
  mesa:      { sentence: "Comemos en la ___",               hint: "Tiene cuatro patas y comes ahí 🪑" },
  silla:     { sentence: "Me siento en la ___",             hint: "Tiene respaldo y ahí te sientas 🪑" },
  baño:      { sentence: "Me lavo las manos en el ___",     hint: "Ahí te duchas y te lavas 🚿" },
  taza:      { sentence: "Bebo leche en una ___",           hint: "Es un recipiente para beber ☕" },
  plato:     { sentence: "La comida está en mi ___",        hint: "Ahí pones la comida para comer 🍽️" },
  puerta:    { sentence: "Abro la ___ de mi casa",          hint: "Sirve para entrar y salir 🚪" },
  // Cuerpo
  mano:      { sentence: "Con mi ___ puedo dibujar",        hint: "Tienes cinco dedos en ella 🖐️" },
  pie:       { sentence: "Camino con mi ___",               hint: "Está al final de tu pierna 🦶" },
  ojo:       { sentence: "Con mi ___ puedo ver",            hint: "Lo usas para mirar el mundo 👁️" },
  boca:      { sentence: "Con mi ___ como y hablo",         hint: "Ahí están tus dientes 👄" },
  nariz:     { sentence: "Con mi ___ huelo las flores",     hint: "Está en el centro de tu cara 👃" },
  pelo:      { sentence: "Me lavo el ___ con champú",       hint: "Crece en tu cabeza 💇" },
  oreja:     { sentence: "Con mi ___ escucho música",       hint: "La usas para escuchar sonidos 👂" },
  // Naturaleza
  sol:       { sentence: "El ___ brilla en el cielo",       hint: "Es grande, brillante y calienta 🌞" },
  luna:      { sentence: "La ___ sale de noche",            hint: "Brilla en el cielo de noche 🌙" },
  flor:      { sentence: "La ___ huele muy bonito",         hint: "Es colorida y perfumada 🌸" },
  árbol:     { sentence: "El ___ tiene muchas hojas",       hint: "Es alto, tiene ramas y hojas 🌳" },
  // Acciones
  comer:     { sentence: "Me gusta ___ con mi familia",     hint: "Lo haces con la boca y alimentos 🍽️" },
  dormir:    { sentence: "Necesito ___ para crecer",        hint: "Lo haces en tu cama por las noches 😴" },
  jugar:     { sentence: "Quiero ___ en el parque",         hint: "Lo haces con juguetes y amigos 🎮" },
  saltar:    { sentence: "Me gusta ___ a la cuerda",        hint: "Subes y bajas con tus pies 🏃" },
  mirar:     { sentence: "Me gusta ___ las estrellas",      hint: "Lo haces con tus ojos 👁️" },
  // Mi Familia
  yo:        { sentence: "___ soy especial y único",        hint: "¡Eres tú! El más importante 🫂" },
  hermano:   { sentence: "Mi ___ juega conmigo",            hint: "Es un niño de tu familia 👦" },
  hermana:   { sentence: "Mi ___ me cuida",                 hint: "Es una niña de tu familia 👧" },
  tío:       { sentence: "Mi ___ es muy divertido",         hint: "Es el hermano de tu mamá o papá 🧔" },
  tía:       { sentence: "Mi ___ me hace reír",             hint: "Es la hermana de tu mamá o papá 👩" },
  primo:     { sentence: "Mi ___ viene a jugar",            hint: "Es el hijo de tu tío o tía 🧒" },
  prima:     { sentence: "Mi ___ es mi amiga",              hint: "Es la hija de tu tío o tía 👧" },
  familia:   { sentence: "Mi ___ me quiere mucho",          hint: "Todos los que te aman y cuidan 👨‍👩‍👧‍👦" },
  mascota:   { sentence: "Mi ___ es mi amigo peludo",       hint: "Un animal que vive en tu casa 🐾" },
  // Mis Amigos
  amigo:     { sentence: "Mi ___ me hace reír",             hint: "Un niño con quien juegas 🤝" },
  amiga:     { sentence: "Mi ___ me ayuda siempre",         hint: "Una niña con quien juegas 👫" },
  compartir: { sentence: "Me gusta ___ mis juguetes",       hint: "Dar algo tuyo a un amigo 🎁" },
  juntos:    { sentence: "Jugamos ___ y nos divertimos",    hint: "Tú y otro al mismo tiempo 🤲" },
  // Valores
  amor:      { sentence: "El ___ nos une a todos",          hint: "Un sentimiento muy cálido ❤️" },
  paz:       { sentence: "La ___ nos hace felices",         hint: "Cuando todos están tranquilos 🕊️" },
  gracias:   { sentence: "Digo ___ cuando me ayudan",       hint: "Una palabra muy bonita de agradecer 🙏" },
  perdón:    { sentence: "Pido ___ cuando me equivoco",     hint: "Lo dices cuando cometes un error 💛" },
  ayudar:    { sentence: "Me gusta ___ a los demás",        hint: "Dar una mano a quien lo necesita 🤲" },
  respetar:  { sentence: "Debo ___ a todos",                hint: "Tratar bien a los demás 🌟" },
  // Emociones
  feliz:     { sentence: "Estoy ___ cuando juego",          hint: "Una emoción muy alegre 😊" },
  triste:    { sentence: "Estoy ___ cuando lloro",          hint: "Una emoción cuando algo te duele 😢" },
  asustado:  { sentence: "Estoy ___ cuando hay ruido",      hint: "Una emoción cuando algo da miedo 😨" },
  cansado:   { sentence: "Estoy ___ después de jugar",      hint: "Cuando necesitas descansar 😴" },
  tranquilo: { sentence: "Respiro y me pongo ___",          hint: "Cuando estás calmado y en paz 😌" },
  contento:  { sentence: "Estoy ___ con mi familia",        hint: "Una emoción muy bonita 😄" },
  // Colores
  rojo:      { sentence: "La manzana es ___",               hint: "El color de la manzana 🔴" },
  azul:      { sentence: "El cielo es ___",                 hint: "El color del mar y el cielo 🔵" },
  verde:     { sentence: "El árbol es ___",                 hint: "El color de las plantas 🟢" },
  amarillo:  { sentence: "El sol es ___",                   hint: "El color brillante del sol 🟡" },
  morado:    { sentence: "Las uvas son ___",                hint: "El color de las uvas 🟣" },
  naranja:   { sentence: "La naranja es ___",               hint: "El color de la naranja 🟠" },
  rosa:      { sentence: "La flor es ___",                  hint: "Un color suave y dulce 🩷" },
};

/** Construye el array de ejercicios a partir del vocabulario */
export function buildExercises(categoryId?: string): Exercise[] {
  const words = categoryId
    ? VOCABULARY.filter((w) => w.category === categoryId)
    : VOCABULARY;

  return words
    .filter((w) => SENTENCES[w.word])
    .map((w) => {
      const { sentence, hint } = SENTENCES[w.word];
      return {
        id: `ex_${w.id}`,
        sentence,
        answer: w.word,
        word: w,
        hint,
        pictogramSrc: GEMINI_IMAGES[w.word] ?? null,
      };
    });
}

/** Ejercicios de una categoría específica (aleatorios) */
export function getExercisesForCategory(categoryId: string, count = 5): Exercise[] {
  const all = buildExercises(categoryId);
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
