export const spring = {
  snappy: { damping: 18, stiffness: 220, mass: 0.7 },
  bouncy: { damping: 12, stiffness: 180, mass: 0.8 },
  soft: { damping: 22, stiffness: 160, mass: 0.9 },
} as const;

export const stagger = {
  item: 45,
  section: 80,
} as const;

export const duration = {
  fast: 180,
  normal: 280,
  slow: 380,
} as const;
