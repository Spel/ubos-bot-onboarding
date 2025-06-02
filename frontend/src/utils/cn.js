/**
 * Utility function for conditionally joining class names together
 * Inspired by the classnames and clsx libraries
 * 
 * @param {...(string|Object|Array)} classes - Class names or objects with class names as keys and booleans as values
 * @returns {string} - Joined class names
 */
export function cn(...classes) {
  return classes
    .filter(Boolean)
    .flatMap(cls => {
      if (typeof cls === 'string') return cls;
      if (Array.isArray(cls)) return cn(...cls);
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key);
      }
      return '';
    })
    .join(' ')
    .trim();
}
