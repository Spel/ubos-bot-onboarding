/**
 * Utility function to merge class names with proper handling of conditional classes
 * Similar to the clsx/classnames libraries but simplified for our needs
 * @param  {...string} classes - Class names to be merged
 * @returns {string} - Merged class names
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
