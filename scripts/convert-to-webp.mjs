// scripts/convert-to-webp.mjs
// Convierte todos los PNGs de pictogramas a WebP con nombres limpios
// Uso: node scripts/convert-to-webp.mjs

import sharp from "sharp";
import { readdir, unlink } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "../public");

// Mapa: filename_original → nombre_limpio
const RENAME_MAP = {
  "pictogram_gato_1779213395825.png":    "pictogram_gato.webp",
  "pictogram_perro_1779213438574.png":   "pictogram_perro.webp",
  "pictogram_pato_1779215858368.png":    "pictogram_pato.webp",
  "pictogram_mama_1779213410725.png":    "pictogram_mama.webp",
  "pictogram_papa_1779213458849.png":    "pictogram_papa.webp",
  "pictogram_ni_o_1779215870493.png":    "pictogram_nino.webp",
  "pictogram_pan_1779215959532.png":     "pictogram_pan.webp",
  "pictogram_agua_1779213484193.png":    "pictogram_agua.webp",
  "pictogram_sol_1779213423108.png":     "pictogram_sol.webp",
  "pictogram_luna_1779215884307.png":    "pictogram_luna.webp",
  "pictogram_flor_1779215938568.png":    "pictogram_flor.webp",
  "pictogram_casa_1779213471267.png":    "pictogram_casa.webp",
  "pictogram_amor_1779213496900.png":    "pictogram_amor.webp",
  "pictogram_feliz_1779215897003.png":   "pictogram_feliz.webp",
  "pictogram_familia_1779215922915.png": "pictogram_familia.webp",
};

async function convert() {
  const files = await readdir(publicDir);
  let converted = 0;

  for (const [original, cleanName] of Object.entries(RENAME_MAP)) {
    if (!files.includes(original)) {
      console.warn(`⚠️  No encontrado: ${original}`);
      continue;
    }

    const inputPath  = join(publicDir, original);
    const outputPath = join(publicDir, cleanName);

    try {
      await sharp(inputPath)
        .webp({ quality: 88, effort: 4 })
        .resize(400, 400, { fit: "cover", withoutEnlargement: true })
        .toFile(outputPath);

      console.log(`✅  ${original} → ${cleanName}`);
      converted++;

      // Intentar borrar el PNG (puede fallar si el proceso lo tiene abierto)
      try { await unlink(inputPath); }
      catch { console.log(`   ℹ️  PNG mantenido (en uso): ${original}`); }
    } catch (err) {
      console.error(`❌  Error convirtiendo ${original}:`, err.message);
    }
  }

  console.log(`\n🎉  Conversión completada: ${converted}/${Object.keys(RENAME_MAP).length} archivos`);
  console.log(`📦  Formato WebP, 400×400px, quality 88`);
}

convert();
