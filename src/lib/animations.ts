
import { useEffect, useState } from 'react';

// Animation types
export type FadeDirection = 'up' | 'down' | 'left' | 'right' | 'none';

// Custom hook for fade-in animation with direction
export const useFadeIn = (
  direction: FadeDirection = 'none', 
  delay: number = 0,
  duration: number = 600
) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Generate transform styles based on direction
  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up': return 'translateY(20px)';
        case 'down': return 'translateY(-20px)';
        case 'left': return 'translateX(20px)';
        case 'right': return 'translateX(-20px)';
        default: return 'none';
      }
    }
    return 'none';
  };

  const style = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
  };

  return style;
};

// Animation sequence for multiple elements
export const useAnimationSequence = (count: number, delay: number = 100) => {
  return Array.from({ length: count }, (_, i) => i * delay);
};
