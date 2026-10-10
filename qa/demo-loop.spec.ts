import { expect, test, type Page } from '@playwright/test'

// The live demo script from the brief, run end to end — then repeated after a reload.
const TITLE = 'Demo Night: Insti Open Mic'
const COMMENT = 'Please add the venue booking confirmation.'

async function asRole(page: Page, role: 'student' | 'gsha' | 'gsec') {
  await page.getByTestId(`role-${role}`).click()
}

test('create → reject → resend → approve → student feed', async ({ page }) => {
  page.on('dialog', (d) => d.accept())
  await page.goto('/login')
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  // Log in as GSHA (via the loading frame)
  await asRole(page, 'gsha')
  await page.getByTestId('login-sso').click()
  await expect(page).toHaveURL(/\/loading/)
  await expect(page).toHaveURL(/\/home$/, { timeout: 3000 })

  // GSHA creates an event with "+ Add"
  await page.getByTestId('fab-add').click()
  await expect(page).toHaveURL(/\/event\/new/)
  await page.getByTestId('f-type').click()
  await page.getByTestId('f-type-event').click()
  await page.getByTestId('f-title').fill(TITLE)
  await page.getByTestId('f-description').fill('An evening of music and poetry at the SAC lawns.')
  await page.getByTestId('f-date').fill('Sat, 24 Jan ')
  await page.getByTestId('f-time').fill('7:00 PM')
  await page.getByTestId('f-venue').fill('SAC Lawns')
  await page.getByTestId('add-club').click()
  await page.getByTestId('f-submit').click()
  await expect(page).toHaveURL(/tab=status/)
  const mine = page.getByTestId('status-card').filter({ hasText: TITLE })
  await expect(mine).toHaveAttribute('data-status', 'pending')

  // Student must not see it yet
  await asRole(page, 'student')
  await expect(page.getByTestId('events-row')).not.toContainText(TITLE)

  // GSec rejects it with a comment from the Approvals tab
  await asRole(page, 'gsec')
  await page.getByTestId('tab-approvals').click()
  const card = page.getByTestId('status-card').filter({ hasText: TITLE })
  await card.getByTestId('card-reject').click()
  await page.getByTestId('reject-text').fill(COMMENT)
  await page.getByTestId('reject-send').click()
  await expect(card).toHaveAttribute('data-status', 'rejected')

  // GSHA reads the comment (hover + click), edits, opens the event and resends
  await asRole(page, 'gsha')
  await page.getByTestId('tab-status').click()
  const rejected = page.getByTestId('status-card').filter({ hasText: TITLE })
  await rejected.getByTestId('comment-trigger').hover()
  await expect(page.getByTestId('comment-tooltip')).toContainText(COMMENT)
  await rejected.getByRole('button', { name: 'Edit' }).click()
  await expect(page).toHaveURL(/\/edit$/)
  await page.getByTestId('f-venue').fill('SAC Lawns (booking confirmed)')
  await page.getByTestId('f-submit').click()
  await expect(page.getByTestId('page-status')).toContainText('Event Rejected')
  await page.getByTestId('comment-trigger').click()
  await expect(page.getByTestId('comment-tooltip')).toContainText(COMMENT)
  await page.getByTestId('resend').click()
  await expect(page.getByTestId('page-status')).toContainText('Event Pending')

  // Survives a refresh
  await page.reload()
  await expect(page.getByTestId('page-status')).toContainText('Event Pending')

  // GSec approves from the event page
  await asRole(page, 'gsec')
  await page.getByTestId('page-approve').click()
  await expect(page).toHaveURL(/tab=approvals/)
  await expect(page.getByTestId('status-card').filter({ hasText: TITLE })).toHaveAttribute('data-status', 'approved')

  // Student sees it at the front of the Events row, with Interested/Going counting
  await asRole(page, 'student')
  await expect(page).toHaveURL(/\/home$/)
  const first = page.getByTestId('events-row').getByTestId('event-card').first()
  await expect(first).toContainText(TITLE)
  await first.click()
  await page.getByTestId('interested').click()
  await expect(page.getByTestId('interested-count')).toHaveText('1')

  // …and still after a reload
  await page.reload()
  await expect(page.getByTestId('interested-count')).toHaveText('1')
  await page.goto('/home')
  await expect(page.getByTestId('events-row').getByTestId('event-card').first()).toContainText(TITLE)
})

test('filter drawer filters the Events row; drawers close', async ({ page }) => {
  await page.goto('/home')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  const row = page.getByTestId('events-row')
  await expect(row.getByTestId('event-card')).toHaveCount(4)

  await page.getByTestId('filter-by').click()
  await page.getByTestId('day-Sun').click()
  await expect(row.getByTestId('event-card')).toHaveCount(1)
  await expect(row).toContainText('Literarium')
  await page.getByTestId('day-Sun').click()
  await page.getByTestId('club-tile').first().click()
  await expect(row.getByTestId('event-card')).toHaveCount(1)
  await expect(row).toContainText('Peer Connect')
  await page.getByTestId('filter-close').click()
  await expect(page.getByTestId('filter-panel')).toHaveCount(0)

  await page.getByTestId('announcements-button').click()
  await expect(page.getByTestId('announcements-panel')).toBeVisible()
  await page.getByTestId('announcements-back').click()
  await expect(page.getByTestId('announcements-panel')).toHaveCount(0)
})

test('reject modal closes on Esc and backdrop', async ({ page }) => {
  await page.goto('/home')
  await page.evaluate(() => { localStorage.clear(); localStorage.setItem('insti-demo-v1', JSON.stringify({ state: { role: 'gsec' }, version: 0 })) })
  await page.goto('/event/peer-connect')
  await page.getByTestId('page-reject').click()
  await expect(page.getByTestId('reject-modal')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('reject-modal')).toHaveCount(0)
  await page.getByTestId('page-reject').click()
  await page.mouse.click(100, 900)
  await expect(page.getByTestId('reject-modal')).toHaveCount(0)
})
