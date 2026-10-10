// node scripts/crop.mjs <name> <x> <y> <w> <h>  →  qa/compare/_crop.png (Figma on top, build below)
import fs from 'node:fs'
import { PNG } from 'pngjs'

const [name, x, y, w, h] = [process.argv[2], ...process.argv.slice(3).map(Number)]
const a = PNG.sync.read(fs.readFileSync(`qa/${name}-figma.png`))
const b = PNG.sync.read(fs.readFileSync(`qa/${name}-build.png`))
const out = new PNG({ width: w, height: h * 2 + 4 })
out.data.fill(255)
for (let i = 0; i < w * 4; i += 4) out.data.writeUInt32BE(0xff0000ff, (h * w * 4) + i)
const cw = (img) => Math.min(w, img.width - x)
const ch = (img) => Math.min(h, img.height - y)
PNG.bitblt(a, out, x, y, cw(a), ch(a), 0, 0)
PNG.bitblt(b, out, x, y, cw(b), ch(b), 0, h + 4)
fs.mkdirSync('qa/compare', { recursive: true })
fs.writeFileSync('qa/compare/_crop.png', PNG.sync.write(out))
console.log('ok')
