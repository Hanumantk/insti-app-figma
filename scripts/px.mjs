import fs from 'node:fs'; import { PNG } from 'pngjs'
const [file, ...pts] = process.argv.slice(2)
const p = PNG.sync.read(fs.readFileSync(file))
for (const s of pts) { const [x, y] = s.split(',').map(Number); const i = (y * p.width + x) * 4; console.log(s, [...p.data.slice(i, i + 3)].map(v => v.toString(16).padStart(2, '0')).join('')) }
