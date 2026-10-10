// node scripts/bands.mjs <name> [band=100]  → mismatch % per horizontal band, to find hotspots
import fs from 'node:fs'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const name = process.argv[2]
const band = Number(process.argv[3] ?? 100)
const a = PNG.sync.read(fs.readFileSync(`qa/${name}-figma.png`))
const b = PNG.sync.read(fs.readFileSync(`qa/${name}-build.png`))
const w = Math.min(a.width, b.width)
const h = Math.min(a.height, b.height)
const slice = (img, y, hh) => {
  const o = new PNG({ width: w, height: hh })
  PNG.bitblt(img, o, 0, y, w, hh, 0, 0)
  return o
}
for (let y = 0; y < h; y += band) {
  const hh = Math.min(band, h - y)
  const n = pixelmatch(slice(a, y, hh).data, slice(b, y, hh).data, null, w, hh, { threshold: 0.15, includeAA: false })
  const pct = (100 * n) / (w * hh)
  if (pct > 0.3) console.log(`${String(y).padStart(5)}-${y + hh}: ${pct.toFixed(2)}%`)
}
