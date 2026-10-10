import { test } from '@playwright/test'
import { FRAMES } from './frames'

// Screenshots every frame state at 1512px into qa/<name>-build.png (role switcher hidden via ?demo=0).
// Run a subset with:  npx playwright test qa/capture.spec.ts -g "home-"
for (const f of FRAMES) {
  test(f.name, async ({ page }) => {
    await page.addInitScript((role) => {
      localStorage.setItem('insti-demo-v1', JSON.stringify({ state: { role }, version: 0 }))
    }, f.role)
    const sep = f.path.includes('?') ? '&' : '?'
    await page.goto(f.path + sep + 'demo=0')
    await page.waitForFunction(() => '__insti' in window)
    if (f.setup) await page.evaluate(f.setup)
    await page.evaluate(() => document.fonts.ready)
    await page.waitForLoadState('networkidle')
    await page.evaluate(() =>
      Promise.all(
        [...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r }))),
      ),
    )
    await page.waitForTimeout(250)
    await page.screenshot({ path: `qa/${f.name}-build.png`, fullPage: f.fullPage })
  })
}
