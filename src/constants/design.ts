export const colors = {
  bgPrimary: "#050505",
  bgSecondary: "#0B0B0F",
  card: "rgba(255,255,255,0.05)",
  cardBlur: "20px",
  border: "rgba(255,255,255,0.10)",
  borderBright: "rgba(255,255,255,0.12)",
  accent: "#3EE7E5",
  accentHover: "#66F6FF",
  chrome: "#D8D8D8",
  silver: "#BDBDBD",
  highlight: "#F5F5F5",
  danger: "#FF5555",
  success: "#50FA7B",
  warning: "#F5C542",
} as const;

export const spacing = [4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 120] as const;

export const radius = {
  sm: "12px",
  card: "20px",
  button: "18px",
  input: "16px",
  hero: "28px",
  panel: "32px",
} as const;

export const animation = {
  fast: 150,
  standard: 250,
  section: 450,
  hero: 700,
  loading: 1800,
} as const;

export const layout = {
  maxWidth: 1440,
  contentWidth: 1280,
  readingWidth: 720,
  registrationWidth: 650,
} as const;

export const breakpoints = {
  mobile: 640,
  tablet: 1024,
  laptop: 1440,
  ultraWide: 1920,
} as const;
