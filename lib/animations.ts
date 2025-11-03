import { Variants } from "framer-motion";

/**
 * Animation configuration for consistent motion across the app.
 * All animations are subtle and sophisticated.
 */

// Easing curves
export const easing = {
  easeOut: [0.0, 0.0, 0.2, 1],
  easeInOut: [0.4, 0.0, 0.2, 1],
  spring: { type: "spring", stiffness: 300, damping: 30 },
} as const;

// Duration presets (in seconds)
export const duration = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.4,
} as const;

// Stagger delays
export const stagger = {
  fast: 0.03,
  normal: 0.05,
  slow: 0.1,
} as const;

/**
 * Page transition variants
 */
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: duration.fast,
    },
  },
};

/**
 * Fade in animation
 */
export const fadeInVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: duration.fast,
    },
  },
};

/**
 * Slide up and fade animation (for messages)
 */
export const slideUpVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: duration.fast,
    },
  },
};

/**
 * Scale and fade animation (for modals)
 */
export const scaleVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.96,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: duration.fast,
    },
  },
};

/**
 * Stagger container for list items
 */
export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: stagger.normal,
    },
  },
};

/**
 * Fast stagger container (for message children)
 */
export const fastStaggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: stagger.fast,
    },
  },
};

/**
 * Stagger item (child of stagger container)
 */
export const staggerItemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Button press animation (subtle scale)
 */
export const buttonPressVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  press: { scale: 0.98 },
};

/**
 * Card hover animation
 */
export const cardHoverVariants = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -2,
    scale: 1.01,
    transition: {
      duration: duration.fast,
      ease: easing.easeOut,
    }
  },
};

/**
 * Slide down animation (for navbar)
 */
export const slideDownVariants: Variants = {
  initial: {
    opacity: 0,
    y: -10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Crossfade variants (for loading states)
 */
export const crossfadeVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: duration.normal,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: duration.normal,
    },
  },
};
