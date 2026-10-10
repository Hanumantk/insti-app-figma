// Compares qa/<name>-figma.png with qa/<name>-build.png.
// Writes qa/compare/<name>.png (Figma | Build | Diff) and prints the mismatch %.
// Usage: node scripts/diff.mjs [name-filter]
import fs from 'node:fs'
import path from 'node:path'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const dir = path.resolve('qa')
const out = path.join(dir, 'compare')
fs.mkdirSync(out, { recursive: true })
const only = process.argv[2]

function pad(img, w, h) {
  const o = new PNG({ width: w, height: h })
  o.data.fill(0)
  for (let i = 3; i < o.data.length; i += 4) o.data[i] = 255
  PNG.bitblt(img, o, 0, 0, Math.min(img.width, w), Math.min(img.height, h), 0, 0)
  return o
}

const rows = []
for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('-figma.png'))) {
  const name = f.replace('-figma.png', '')
  if (only && !name.includes(only)) continue
  const bp = path.join(dir, `${name}-build.png`)
  if (!fs.existsSync(bp)) continue
  const a = PNG.sync.read(fs.readFileSync(path.join(dir, f)))
  const b = PNG.sync.read(fs.readFileSync(bp))
  const w = Math.max(a.width, b.width)
  const h = Math.max(a.height, b.height)
  const A = pad(a, w, h)
  const B = pad(b, w, h)
  const D = new PNG({ width: w, height: h })
  const n = pixelmatch(A.data, B.data, D.data, w, h, { threshold: 0.15, includeAA: false })
  const sbs = new PNG({ width: w * 3, height: h })
  ;[A, B, D].forEach((img, i) => PNG.bitblt(img, sbs, 0, 0, w, h, i * w, 0))
  fs.writeFileSync(path.join(out, `${name}.png`), PNG.sync.write(sbs))
  rows.push({ name, figma: `${a.width}x${a.height}`, build: `${b.width}x${b.height}`, mismatch: ((100 * n) / (w * h)).toFixed(2) + '%' })
}
console.table(rows)
