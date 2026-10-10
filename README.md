# Insti App (IIT Bombay): clickable prototype

A clickable, pixel-matched build of the Figma file
[Insti-app](https://www.figma.com/design/OAukLJFpgJhJfkSBkAYVzy/Insti-app?node-id=0-1),
covering three roles: **Student**, **GSHA** (event creator) and **GSec** (approver).
It is a portfolio demo, so fidelity to the Figma file comes first. Nothing was redesigned.

The iterated version, with a review-focused redesign and live insti.app posts, is in
[Hanumantk/insti-app-redesign](https://github.com/Hanumantk/insti-app-redesign).

Stack: Vite, React 18, TypeScript, Tailwind 3, React Router 6 and Zustand. There is no backend.
State lives in memory and is persisted to `localStorage` (key `insti-demo-v1`), so a demo
survives a refresh.

## Run it

```bash
npm install
npm run dev          # http://localhost:5530
```

For exact rendering, add the licensed font files first (see § Fonts). Without them the build falls
back to Helvetica Neue (if installed) or Arial, and the QA diffs will be higher.

| Command | What it does |
|---|---|
| `npm run build` | Type-check and production build to `dist/` |
| `npm run qa` | Screenshot every Figma frame state at 1512px → `qa/<name>-build.png` |
| `npm run qa:diff` | Compare against `qa/<name>-figma.png` → `qa/compare/<name>.png` (Figma, Build, Diff) and a mismatch table |
| `npm run test:loop` | Run the demo script below end to end in Chromium, including after a reload |

## Role switcher (demo control, not part of the design)

The dark pill in the bottom-left reads **View as: Student · GSHA · GSec**, followed by **Reset**.

- Switching role keeps the current route when that role has the screen. Otherwise you land on that role's home: the status and approvals tabs and the create/edit form are role-specific.
- The role sets which frame variant renders: the home tabs, the floating `+`, the buttons on cards, and the event-page header.
- On `/login`, all three buttons continue as the selected role, via the loading screen for about 800ms.
- **Reset** restores the Figma seed data.
- Add `?demo=0` to any URL to hide the pill for clean screenshots.

## Demo script (about 2 minutes)

1. Open `/`, pick **GSHA**, then click **Log In via SSO** (you'll see Loading, then Home).
2. Click the floating **+**. Choose **Select → Events**, fill in a title, day, time and venue, optionally upload a poster and add clubs, then **Submit**. You land on **Event status** with a yellow **Pending** pill.
3. Switch to **GSec** and open **Event Approvals**. Click **Reject ✕** on the new card, type a reason, then **Send**.
4. Switch to **GSHA** and open **Event status**. Hover or click the chat bubble to read GSec's comment. Click **Edit**, change something, then **Submit**. On the event page, click the chat bubble, then **Resend for approval**.
5. Switch to **GSec** and open the event (or the Approvals card). Click **Approve ✓**.
6. Switch to **Student**. The event is now first in the **Events** row. Open it and toggle **Interested / Going**; the counts update.

Refresh at any point and everything stays as it was.

## Routes

| Route | Frames |
|---|---|
| `/loading?next=…` | 1:118 · 232:124 · 232:336 (`&hold=1` keeps it on screen) |
| `/login` | 1:3 · 232:9 · 232:221 |
| `/home` | 75:358 (Student) · 1:219 (GSHA) · 75:107 (GSec) |
| `/home?drawer=filter` | 143:614 · 232:1774 · 232:2243 |
| `/home?drawer=announcements` | 110:2110 · 232:437 · 232:694 |
| `/home?tab=status` (GSHA) | 41:211 · `&tooltip=<id>` pins a comment tooltip open → 99:1289 |
| `/home?tab=approvals` (GSec) | 49:184 |
| `/event/:id` | 82:620 (Student) · 99:1022, 99:1157, 232:1629 (GSHA's own event) · 102:1506 (GSec) |
| `/event/:id?modal=reject` (GSec) | 103:1646 |
| `/event/new`, `/event/:id/edit` | 107:1820 (GSHA) · 232:2597 (GSec) · `?select=open` opens the type menu |

## Visual QA

`qa/frames.ts` lists all 26 frames from the brief's frame map. Each one has a matching
`qa/<name>-figma.png` (exported at 1:1 with the Figma MCP) and a `qa/<name>-build.png`.

Last run: every frame is at **0.0–1.9% pixel mismatch**, with identical frame heights.

| Mismatch | Frames |
|---|---|
| 0.00% | loading |
| 0.15% | reject modal |
| 0.2–0.75% | login, create forms, status/approval grids, announcements |
| ~1.6% | home pages |
| ~1.95% | event pages (includes the phone-number redaction, see below) |
| ~1.8% | filter drawers |

What is left is almost entirely text anti-aliasing (Figma's renderer against Chrome's) and image resampling.
These figures were measured with the licensed fonts installed (see § Fonts).

**Phone numbers redacted.** The Figma file's Peer Connect page lists three contact numbers. In this repo
the app shows "[number removed]" instead, and the numbers are covered by grey bars in the
`event-*-figma.png` references. `qa/compare/` isn't committed; regenerate it with `npm run qa:diff`.

Two fixes mattered most for fidelity:

- **Helvetica Neue vertical metrics.** Figma lays text out with the font's `hhea` metrics, while Chrome on Windows uses the larger `OS/2 win` metrics. That pushed every Helvetica line 3–5px down. `src/index.css` sets `ascent-override / descent-override / line-gap-override` to the `hhea` values.
- **Figma "auto" line height = CSS `normal`.** Tailwind's `leading-normal` is 1.5, so the code uses `leading-[normal]`.

## Decisions and deviations (please review)

- **Seed data uses separate records.** In Figma, Pit Trading is *Rejected* and AZeotropy *Pending* in the status grid, yet both appear in the Student feed. The feed is seeded exactly as in 75:358, and the GSHA's submissions are separate records with the 41:211 statuses. Seeded submissions that mirror a feed item never enter the feed themselves, so nothing appears twice. New events do enter the feed once approved.
- **Event pages for events other than Peer Connect.** Only Peer Connect has a full page in Figma. Other events use the same template with only the copy Figma has (the card text). The More details, Contact and Regards card is left out when there's nothing to put in it.
- **Posters on those pages.** Figma only has square card crops for ITC, UGAC and AI-ML, so the 549×777 poster frame shows them `contain`ed on white. Literarium uses its full poster.
- **GSec gets the floating `+`** (it's in 75:107). Events a GSec creates are approved straight away.
- **"Event Pending" header pill.** This creator event-page state isn't designed. It uses the card's pending colours with the same label pattern as "Event Approved" / "Event Rejected".
- **GSec event page.** Approve, Reject and Edit always show, as in 102:1506. After Approve, or Reject → Send, you return to the Approvals tab so the result is visible.
- **"Event Approvals" badge.** It shows the live number of pending submissions: **1** at seed, while Figma shows **2**. The "Announcements" (2) and bell (3) badges are static, as designed.
- **Rejected-card icons.** For the creator, a red-dot chat bubble shows when GSec left a comment (it opens the tooltip) and a red **!** shows otherwise. GSec always sees **!**. This follows 41:211 and 49:184.
- **Undesigned states, kept minimal:**
  - Selected filter chips and club tiles get a blue border.
  - Toggled Interested/Going buttons get the light-blue tint.
  - The chosen type replaces "Select" in the form.
  - Created events with no poster show the form's grey `#DADEE3` placeholder.
  - A filter with no matches leaves the Events row empty.
- **Filter drawer.** The Sun/Sat/Wed chips filter by weekday, and the club tiles filter by club (all eight tiles are "Pixels", as in Figma, so they all select Pixels). Club search filters the tiles. The Date/Month and time fields are drawn as designed but not wired.
- **Below 1512px** the canvas scales down with CSS `zoom` rather than reflowing. Above 1512px it is centred. The filter panel scrolls if the window is shorter than 982px.
- **Nav links** other than Events, and the search, bell, profile, share and footer links, are inert. They have no destination in the file.
- **Stray canvas nodes** 124:98 (a line) and 35:170 (a vector) sit outside any frame and were ignored. 75:559, a 34px white rule on the footer's top edge in every frame, *is* reproduced.

## Assets

Every image and icon was exported through the Figma MCP (`get_design_context` asset URLs) into
`public/assets/`, with readable names. **Every asset URL downloaded successfully**, so there are no nodes that need a manual export and no stand-in art.

The card posters are Figma's own rasterised "Union" masks, at 2x. The decorative squiggles are SVG exports, with each group's rotate-and-mirror `relativeTransform` applied as a CSS `matrix()`.

## Fonts (not included)

The design uses two commercial typefaces, **Helvetica Neue** and **Neue Montreal**. Their files are not in
this repo because they can't be redistributed. If you hold licences, put these files in `public/fonts/`:

```
HelveticaNeueRoman.otf   HelveticaNeueMedium.otf   HelveticaNeueBold.otf
NeueMontreal-Regular.otf NeueMontreal-Medium.otf   NeueMontreal-Bold.otf
```

Without them, text falls back to Helvetica Neue (if installed) or Arial. **DM Sans** (the wordmark) loads
from Google Fonts.

## Project layout

```
src/
  data/        types.ts, seed.ts (verbatim Figma copy)
  store/       useApp.ts (Zustand + persist; createEvent/approve/reject/resend…)
  lib/         assets.ts, events.ts (feed/filter helpers)
  components/  AppFrame, NavBar, Footer, Brand, HomeChrome (tabs, Announcements button, +),
               EventCard, RecommendedHero, StatusCard, CommentTooltip, FilterPanel,
               AnnouncementsPanel, RejectModal, RoleSwitcher, ui (pills, buttons, DateTime)
  pages/       AuthPages (loading, login), HomePage, EventPage, EventFormPage
qa/            frames.ts, capture.spec.ts, demo-loop.spec.ts, *-figma.png, *-build.png, compare/
scripts/       fetch.sh (asset download), diff.mjs, bands.mjs, crop.mjs, px.mjs (QA helpers)
```
