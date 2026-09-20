interface IconProps {
  name: 'number' | 'people' | 'groups' | 'order' | 'history' | 'shield' | 'upload' | 'sparkles' | 'copy' | 'expand' | 'download' | 'close'
  size?: number
}

const paths: Record<IconProps['name'], React.ReactNode> = {
  number: <><path d="M7 3 5 21M19 3l-2 18M3 9h18M2 15h18" /></>,
  people: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-2a6 6 0 0 1 12 0v2M16 3.5a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 4 5v2" /></>,
  groups: <><circle cx="8" cy="7" r="3" /><circle cx="17" cy="7" r="3" /><path d="M2 20v-2a5 5 0 0 1 10 0v2M12 20v-2a5 5 0 0 1 10 0v2" /></>,
  order: <><path d="M9 6h12M9 12h12M9 18h12M4 5v2M4 11v2M4 17v2" /></>,
  history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
  upload: <><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></>,
  sparkles: <><path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3ZM5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14ZM19 13l.7 1.8 1.8.7-1.8.7L19 18l-.7-1.8-1.8-.7 1.8-.7L19 13Z" /></>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
  expand: <><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" /></>,
  download: <><path d="M12 3v13M7 11l5 5 5-5M4 21h16" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
}

export function Icon({ name, size = 20 }: IconProps) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}
