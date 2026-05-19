// lib/vocabulary.ts — Banco de palabras para Ecosistema Lectoescritura
export type Difficulty = "easy" | "medium";

export interface WordItem {
  id: string;
  word: string;
  syllables: string;
  difficulty: Difficulty;
  category: string;
  categoryLabel: string;
  emoji: string;
  tagId: string;
  color: string;
  colorBorder: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; border: string }> = {
  animales:   { bg: "#C8DFFE", border: "#A8C4F0" },
  alimentos:  { bg: "#FDE8D8", border: "#F0C9A8" },
  familia:    { bg: "#DDD4F5", border: "#C0B0E8" },
  casa:       { bg: "#FFF3C4", border: "#F0DC90" },
  cuerpo:     { bg: "#D4F5F0", border: "#A8E8E0" },
  naturaleza: { bg: "#C8EDD4", border: "#A2D8B0" },
  acciones:   { bg: "#F5D8D8", border: "#E0A8A8" },
  mi_familia: { bg: "#DDD4F5", border: "#C0B0E8" },
  mis_amigos: { bg: "#C8DFFE", border: "#A8C4F0" },
  valores:    { bg: "#C8EDD4", border: "#A2D8B0" },
  emociones:  { bg: "#FDE8D8", border: "#F0C9A8" },
  colores:    { bg: "#FFF3C4", border: "#F0DC90" },
};

const cc = (cat: string) => CATEGORY_COLORS[cat] ?? { bg: "#FFF8EE", border: "#E0DAF0" };

let _tag = 1;
const nt = () => `W${String(_tag++).padStart(3, "0")}`;

const m = (
  word: string, syllables: string, difficulty: Difficulty,
  category: string, categoryLabel: string, emoji: string
): WordItem => ({
  id: `${category}_${word}`,
  word, syllables, difficulty, category, categoryLabel, emoji,
  tagId: nt(),
  color: cc(category).bg,
  colorBorder: cc(category).border,
});

export const VOCABULARY: WordItem[] = [
  // ANIMALES
  m("gato","ga-to","easy","animales","Animales","🐱"),
  m("perro","pe-rro","easy","animales","Animales","🐶"),
  m("pato","pa-to","easy","animales","Animales","🦆"),
  m("vaca","va-ca","easy","animales","Animales","🐄"),
  m("pez","pez","easy","animales","Animales","🐟"),
  m("oso","o-so","easy","animales","Animales","🐻"),
  m("caballo","ca-ba-llo","medium","animales","Animales","🐴"),
  // ALIMENTOS
  m("pan","pan","easy","alimentos","Alimentos","🍞"),
  m("agua","a-gua","easy","alimentos","Alimentos","💧"),
  m("leche","le-che","easy","alimentos","Alimentos","🥛"),
  m("sopa","so-pa","easy","alimentos","Alimentos","🍲"),
  m("jugo","ju-go","easy","alimentos","Alimentos","🧃"),
  m("manzana","man-za-na","medium","alimentos","Alimentos","🍎"),
  m("galleta","ga-lle-ta","medium","alimentos","Alimentos","🍪"),
  // FAMILIA
  m("mamá","ma-má","easy","familia","Familia","👩"),
  m("papá","pa-pá","easy","familia","Familia","👨"),
  m("bebé","be-bé","easy","familia","Familia","👶"),
  m("niño","ni-ño","easy","familia","Familia","🧒"),
  m("niña","ni-ña","easy","familia","Familia","👧"),
  m("abuelo","a-bue-lo","medium","familia","Familia","👴"),
  m("abuela","a-bue-la","medium","familia","Familia","👵"),
  // CASA
  m("cama","ca-ma","easy","casa","Mi Casa","🛏️"),
  m("mesa","me-sa","easy","casa","Mi Casa","🪑"),
  m("silla","si-lla","easy","casa","Mi Casa","🪑"),
  m("baño","ba-ño","easy","casa","Mi Casa","🚿"),
  m("taza","ta-za","easy","casa","Mi Casa","☕"),
  m("plato","pla-to","easy","casa","Mi Casa","🍽️"),
  m("puerta","puer-ta","medium","casa","Mi Casa","🚪"),
  // CUERPO
  m("mano","ma-no","easy","cuerpo","Mi Cuerpo","🖐️"),
  m("pie","pie","easy","cuerpo","Mi Cuerpo","🦶"),
  m("ojo","o-jo","easy","cuerpo","Mi Cuerpo","👁️"),
  m("boca","bo-ca","easy","cuerpo","Mi Cuerpo","👄"),
  m("nariz","na-riz","medium","cuerpo","Mi Cuerpo","👃"),
  m("pelo","pe-lo","easy","cuerpo","Mi Cuerpo","💇"),
  m("oreja","o-re-ja","medium","cuerpo","Mi Cuerpo","👂"),
  // NATURALEZA
  m("sol","sol","easy","naturaleza","Naturaleza","☀️"),
  m("luna","lu-na","easy","naturaleza","Naturaleza","🌙"),
  m("flor","flor","easy","naturaleza","Naturaleza","🌸"),
  m("árbol","ár-bol","medium","naturaleza","Naturaleza","🌳"),
  // ACCIONES
  m("comer","co-mer","medium","acciones","Acciones","🍽️"),
  m("dormir","dor-mir","medium","acciones","Acciones","😴"),
  m("jugar","ju-gar","medium","acciones","Acciones","🎮"),
  m("saltar","sal-tar","medium","acciones","Acciones","🏃"),
  m("mirar","mi-rar","medium","acciones","Acciones","👁️"),
  // MI FAMILIA
  m("yo","yo","easy","mi_familia","Mi Familia","🫂"),
  m("hermano","her-ma-no","medium","mi_familia","Mi Familia","👦"),
  m("hermana","her-ma-na","medium","mi_familia","Mi Familia","👧"),
  m("tío","tí-o","easy","mi_familia","Mi Familia","🧔"),
  m("tía","tí-a","easy","mi_familia","Mi Familia","👩"),
  m("primo","pri-mo","medium","mi_familia","Mi Familia","🧒"),
  m("prima","pri-ma","medium","mi_familia","Mi Familia","👧"),
  m("familia","fa-mi-lia","medium","mi_familia","Mi Familia","👨‍👩‍👧‍👦"),
  m("mascota","mas-co-ta","medium","mi_familia","Mi Familia","🐾"),
  // MIS AMIGOS
  m("amigo","a-mi-go","medium","mis_amigos","Mis Amigos","🤝"),
  m("amiga","a-mi-ga","medium","mis_amigos","Mis Amigos","👫"),
  m("compartir","com-par-tir","medium","mis_amigos","Mis Amigos","🎁"),
  m("juntos","jun-tos","medium","mis_amigos","Mis Amigos","🤲"),
  // VALORES
  m("amor","a-mor","medium","valores","Valores","❤️"),
  m("paz","paz","easy","valores","Valores","🕊️"),
  m("gracias","gra-cias","medium","valores","Valores","🙏"),
  m("perdón","per-dón","medium","valores","Valores","💛"),
  m("ayudar","a-yu-dar","medium","valores","Valores","🤲"),
  m("respetar","res-pe-tar","medium","valores","Valores","🌟"),
  // EMOCIONES
  m("feliz","fe-liz","medium","emociones","Emociones","😊"),
  m("triste","tris-te","medium","emociones","Emociones","😢"),
  m("asustado","a-sus-ta-do","medium","emociones","Emociones","😨"),
  m("cansado","can-sa-do","medium","emociones","Emociones","😴"),
  m("tranquilo","tran-qui-lo","medium","emociones","Emociones","😌"),
  m("contento","con-ten-to","medium","emociones","Emociones","😄"),
  // COLORES
  m("rojo","ro-jo","easy","colores","Colores","🔴"),
  m("azul","a-zul","easy","colores","Colores","🔵"),
  m("verde","ver-de","easy","colores","Colores","🟢"),
  m("amarillo","a-ma-ri-llo","medium","colores","Colores","🟡"),
  m("morado","mo-ra-do","medium","colores","Colores","🟣"),
  m("naranja","na-ran-ja","medium","colores","Colores","🟠"),
  m("rosa","ro-sa","easy","colores","Colores","🩷"),
];

const CATEGORY_EMOJI: Record<string,string> = {
  animales:"🐾", alimentos:"🍎", familia:"👨‍👩‍👧", casa:"🏠",
  cuerpo:"🫶", naturaleza:"🌿", acciones:"⚡", mi_familia:"💕",
  mis_amigos:"🤝", valores:"🌟", emociones:"😊", colores:"🎨",
};

export const CATEGORIES = Array.from(
  new Map(VOCABULARY.map((w) => [
    w.category,
    {
      id: w.category,
      label: w.categoryLabel,
      emoji: CATEGORY_EMOJI[w.category] ?? "📚",
      color: cc(w.category).bg,
      border: cc(w.category).border,
      count: VOCABULARY.filter((v) => v.category === w.category).length,
    },
  ])).values()
);

export const findByTagId = (tagId: string) => VOCABULARY.find((w) => w.tagId === tagId);
export const findByWord  = (word: string)  => VOCABULARY.find((w) => w.word.toLowerCase() === word.toLowerCase());
export const getByCategory = (cat: string) => VOCABULARY.filter((w) => w.category === cat);
