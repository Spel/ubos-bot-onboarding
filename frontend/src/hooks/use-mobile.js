import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook to detect if the current viewport is mobile
 * @returns {boolean} - True if the viewport is mobile
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Use matchMedia for better performance
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Modern browsers
    if (mql.addEventListener) {
      mql.addEventListener('change', handleResize);
    } 
    // Older browsers
    else if (mql.addListener) {
      mql.addListener(handleResize);
    }

    // Set initial value
    handleResize();

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handleResize);
      } else if (mql.removeListener) {
        mql.removeListener(handleResize);
      }
    };
  }, []);

  return isMobile;
}
