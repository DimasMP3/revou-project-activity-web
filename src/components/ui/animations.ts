// Animation utilities and variants for modern UI
export const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } }
};

export const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// CSS class-based animations for fallback
export const animationClasses = {
  slideIn: 'transform transition-all duration-300 ease-out translate-x-0 opacity-100',
  slideInLeft: 'transform transition-all duration-300 ease-out translate-x-0 opacity-100',
  slideInLeftHidden: 'transform transition-all duration-300 ease-out -translate-x-4 opacity-0',
  fadeIn: 'transition-opacity duration-200 ease-in-out opacity-100',
  fadeInHidden: 'transition-opacity duration-200 ease-in-out opacity-0',
  scaleIn: 'transform transition-all duration-200 ease-out scale-100 opacity-100',
  scaleInHidden: 'transform transition-all duration-200 ease-out scale-95 opacity-0',
  hover: 'transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg',
  cardHover: 'transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl',
  buttonHover: 'transition-all duration-150 ease-in-out hover:scale-105 active:scale-95',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce'
};