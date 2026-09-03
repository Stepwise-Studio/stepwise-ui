export interface DocsNavItem {
  href: string
  label: string
}

export interface DocsNavSection {
  label: string
  items: DocsNavItem[]
}

export const textEffectsNav: DocsNavItem[] = [
  { href: '/docs/circle-annotation',    label: 'Circle Annotation' },
  { href: '/docs/fade-text',            label: 'Fade Text' },
  { href: '/docs/scramble-text',        label: 'Scramble Text' },
  { href: '/docs/shimmer-text',         label: 'Shimmer Text' },
  { href: '/docs/squiggly-underline',   label: 'Squiggly Underline' },
  { href: '/docs/typewriter',           label: 'Typewriter' },
]

export const backgroundsNav: DocsNavItem[] = [
  { href: '/docs/diagonal-lines',   label: 'Diagonal Lines' },
  { href: '/docs/dotted-grid',      label: 'Dotted Grid' },
  { href: '/docs/dotted-spotlight', label: 'Dotted Spotlight' },
  { href: '/docs/zigzag-lines',     label: 'Zigzag Lines' },
]

export const componentsNav: DocsNavItem[] = [
  { href: '/docs/accordion',             label: 'Accordion' },
  { href: '/docs/apple-select',          label: 'Apple Select' },
  { href: '/docs/avatar',                label: 'Avatar' },
  { href: '/docs/breadcrumbs',           label: 'Breadcrumbs' },
  { href: '/docs/button',                label: 'Button' },
  { href: '/docs/calendar',              label: 'Calendar' },
  { href: '/docs/checkbox',              label: 'Checkbox' },
  { href: '/docs/chip',                  label: 'Chip' },
  { href: '/docs/color-picker',          label: 'Color Picker' },
  { href: '/docs/color-swatch',          label: 'Color Swatch' },
  { href: '/docs/combobox',              label: 'Combobox' },
  { href: '/docs/command',               label: 'Command Palette' },
  { href: '/docs/conversation-timeline', label: 'Conversation Timeline' },
  { href: '/docs/date-picker',           label: 'Date Picker' },
  { href: '/docs/dot-grid-loader',       label: 'Dot Grid Loader' },
  { href: '/docs/drawer',                label: 'Drawer' },
  { href: '/docs/dropdown-menu',         label: 'Dropdown Menu' },
  { href: '/docs/file-uploader',         label: 'File Uploader' },
  { href: '/docs/folder',                label: 'Folder' },
  { href: '/docs/glow-button',           label: 'Glow Button' },
  { href: '/docs/input',                 label: 'Input' },
  { href: '/docs/kbd',                   label: 'Kbd' },
  { href: '/docs/modal',                 label: 'Modal' },
  { href: '/docs/multiselect',           label: 'Multiselect' },
  { href: '/docs/otp-input',             label: 'OTP Input' },
  { href: '/docs/pagination',            label: 'Pagination' },
  { href: '/docs/popover',               label: 'Popover' },
  { href: '/docs/progress',              label: 'Progress' },
  { href: '/docs/qty-input',             label: 'Quantity Input' },
  { href: '/docs/radio',                 label: 'Radio' },
  { href: '/docs/scale',                 label: 'Scale' },
  { href: '/docs/scroll-area',           label: 'Scroll Area' },
  { href: '/docs/segment',               label: 'Segment' },
  { href: '/docs/select',                label: 'Select' },
  { href: '/docs/selection-frame',       label: 'Selection Frame' },
  { href: '/docs/separator',             label: 'Separator' },
  { href: '/docs/slider',                label: 'Slider' },
  { href: '/docs/loaders',               label: 'Spinner' },
  { href: '/docs/table',                 label: 'Table' },
  { href: '/docs/theme-toggle',          label: 'Theme Toggle' },
  { href: '/docs/time-picker',           label: 'Time Picker' },
  { href: '/docs/toast',                 label: 'Toast' },
  { href: '/docs/toggle',                label: 'Toggle' },
  { href: '/docs/tooltip',               label: 'Tooltip' },
  { href: '/docs/typography',            label: 'Typography' },
  { href: '/docs/video-player',          label: 'Video Player' },
]

export const cardsNav: DocsNavItem[] = [
  { href: '/docs/frame',         label: 'Frame' },
  { href: '/docs/pricing-card',  label: 'Pricing Card' },
  { href: '/docs/product-card',  label: 'Product Card' },
  { href: '/docs/profile-card',  label: 'Profile Card' },
]

export const carouselsNav: DocsNavItem[] = [
  { href: '/docs/arc-carousel',  label: 'Arc' },
  { href: '/docs/lens-carousel', label: 'Lens' },
]

export const gettingStartedNav: DocsNavItem[] = [
  { href: '/docs/introduction', label: 'Introduction' },
  { href: '/docs/quick-start',  label: 'Quick Start' },
  { href: '/docs/cli',          label: 'CLI' },
  { href: '/docs/agents',       label: 'Agents' },
]

export const docsNav: DocsNavSection[] = [
  { label: 'Getting Started', items: gettingStartedNav },
  { label: 'All Components',  items: componentsNav },
  { label: 'Backgrounds',     items: backgroundsNav },
  { label: 'Cards',           items: cardsNav },
  { label: 'Carousels',       items: carouselsNav },
  { label: 'Text Effects',    items: textEffectsNav },
]
