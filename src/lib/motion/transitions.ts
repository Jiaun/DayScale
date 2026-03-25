export const pageTransition = {
  duration: 0.34,
  ease: [0.22, 1, 0.36, 1],
} as const

export const pageVariants = {
  initial: {
    opacity: 0,
    y: 18,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: pageTransition,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
} as const

export const listVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
} as const

export const itemVariants = {
  initial: {
    opacity: 0,
    y: 14,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: pageTransition,
  },
} as const

export const panelVariants = {
  initial: {
    opacity: 0,
    scale: 0.985,
    y: 10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: pageTransition,
  },
} as const
