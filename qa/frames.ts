// One entry per Figma frame in the brief's frame map.
export type Frame = {
  name: string
  node: string
  path: string
  role: 'student' | 'gsha' | 'gsec'
  fullPage: boolean
  /** run in the page before the screenshot (store fixtures) */
  setup?: string
}

const rejectPeer =
  "__insti.getState().reject('sub-peer-connect', 'In this field there will be a comment of reason why this event got rejected posted by GSSA. The event creator can edit the event and resend it for approval.')"

export const FRAMES: Frame[] = [
  { name: 'loading', node: '1:118', path: '/loading?hold=1', role: 'student', fullPage: false },
  { name: 'loading-gsha', node: '232:124', path: '/loading?hold=1', role: 'gsha', fullPage: false },
  { name: 'loading-gsec', node: '232:336', path: '/loading?hold=1', role: 'gsec', fullPage: false },
  { name: 'login', node: '1:3', path: '/login', role: 'student', fullPage: false },
  { name: 'login-gsha', node: '232:9', path: '/login', role: 'gsha', fullPage: false },
  { name: 'login-gsec', node: '232:221', path: '/login', role: 'gsec', fullPage: false },
  { name: 'home-student', node: '75:358', path: '/home', role: 'student', fullPage: true },
  { name: 'home-gsha', node: '1:219', path: '/home', role: 'gsha', fullPage: true },
  { name: 'home-gsec', node: '75:107', path: '/home', role: 'gsec', fullPage: true },
  { name: 'filter-student', node: '143:614', path: '/home?drawer=filter', role: 'student', fullPage: false },
  { name: 'filter-gsha', node: '232:1774', path: '/home?drawer=filter', role: 'gsha', fullPage: false },
  { name: 'filter-gsec', node: '232:2243', path: '/home?drawer=filter', role: 'gsec', fullPage: false },
  { name: 'announcements-student', node: '110:2110', path: '/home?drawer=announcements', role: 'student', fullPage: false },
  { name: 'announcements-gsha', node: '232:437', path: '/home?drawer=announcements', role: 'gsha', fullPage: false },
  { name: 'announcements-gsec', node: '232:694', path: '/home?drawer=announcements', role: 'gsec', fullPage: false },
  { name: 'event-student', node: '82:620', path: '/event/peer-connect', role: 'student', fullPage: true },
  { name: 'event-gsha-approved', node: '99:1022', path: '/event/sub-peer-connect', role: 'gsha', fullPage: true },
  { name: 'event-gsha-rejected', node: '99:1157', path: '/event/sub-peer-connect', role: 'gsha', fullPage: true, setup: rejectPeer },
  { name: 'event-gsha-rejected-tooltip', node: '232:1629', path: '/event/sub-peer-connect?tooltip=open', role: 'gsha', fullPage: true, setup: rejectPeer },
  { name: 'event-gsec', node: '102:1506', path: '/event/peer-connect', role: 'gsec', fullPage: true },
  { name: 'event-gsec-reject-modal', node: '103:1646', path: '/event/peer-connect?modal=reject', role: 'gsec', fullPage: false },
  { name: 'status-gsha', node: '41:211', path: '/home?tab=status', role: 'gsha', fullPage: true },
  { name: 'status-gsha-tooltip', node: '99:1289', path: '/home?tab=status&tooltip=sub-pit-trading', role: 'gsha', fullPage: true },
  { name: 'approvals-gsec', node: '49:184', path: '/home?tab=approvals', role: 'gsec', fullPage: true },
  { name: 'create-gsha', node: '107:1820', path: '/event/new?select=open', role: 'gsha', fullPage: true },
  { name: 'create-gsec', node: '232:2597', path: '/event/new?select=open', role: 'gsec', fullPage: true },
]
