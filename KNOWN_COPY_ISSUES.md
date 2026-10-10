# Known copy issues

All copy in the prototype is verbatim from the Figma file (`OAukLJFpgJhJfkSBkAYVzy`).
Nothing below has been fixed. Decide case by case, then edit `src/data/seed.ts` (and the
component named for UI strings).

## Typos and spelling

| Copy as in Figma | Where | Node | Likely intent |
|---|---|---|---|
| `Communitites` | Nav bar, every page | 75:588 | `Communities` |
| `Peer Connect: A Listening Listening Circle for PhD` | Card, event page title, More details first line | 75:428, 82:873, 82:926 | `A Listening Circle for PhD` |
| `00:00 AM` | AZeotropy competition card | 75:523 | `12:00 AM` (the AI-ML card uses that) |
| `00:00 PM` | Filter drawer time field | 143:938 | Placeholder; `00:00` is not a 12-hour time |
| `What event is about ?` | Create form description placeholder | 107:1845 | `What is the event about?` |
| `Details about the event like what is it or about ? also if any rules/note...` | Create form, More details placeholder | 107:1868 | Grammar, plus a space before `?` |
| `The reason of rejecting this event ?` | Reject modal placeholder | 103:1787 | `Reason for rejecting this event?` |
| `To life. To surprises. To discovery` | Culturals@IITB club tile | 91:981 | No final full stop (the other taglines have none either) |

## Naming

| Copy | Where | Note |
|---|---|---|
| `GSSA` | Comment tooltip copy, every approver frame name | The brief calls this role **GSec**; the demo switcher uses GSec. |
| `Insti App` vs `InstiApp` | Nav uses a gap between the words, footer sets them tight | Two separate text layers in both, spaced differently. |
| `AZeotropy` | Competition title | Possibly a brand spelling. |

## Placeholder / duplicated content in the mock data

- **The status and approval grids (41:211, 49:184)** show `Wed, 21 Jan | 6:00 PM · Music Room H-8` on every card. That includes Literarium, which is `Sun, 18 Jan · Theatre Room, Old SAC` in the feed, and Pit Trading. AZeotropy shows `Deadline 21 Jan` there but `Deadline 15 Jan` in the feed.
- **Announcements drawer:** all four items are titled `Surbahaar auditions` with the same Symphony text, but three use other posters (cricket GC, badminton GC, Literarium).
- **Filter drawer:** all eight club tiles read `Pixels / Photography club`.
- **Peer Connect (an SWC event):** the contact is `Piyush Fitness Club Manager`, and the sign-offs come from the Photography & Fine Arts Secretary and the GS Cultural Affairs.
- **Comment tooltip:** the text is lorem-style UI copy (`In this field there will be a comment of reason why this event got rejected posted by GSSA…`). It's the seeded rejection comment for Pit Trading.

## Trailing spaces and stray characters (kept for fidelity)

- `Wed, 21 Jan `, `Sun, 18 Jan `, `Deadline 21 Jan `: date strings end with a space.
- `Events ` (create form type menu), `Pixels `, `Rang `, `Reject ` (GSec event page button).
- `AI-ML GC 2025-26 | Web and Coding Club` is followed by an empty second paragraph in Figma (75:494). Not reproduced, since it has no visible effect.
