
/**
 * Image utility functions for handling image loading and fallbacks
 */

// Default placeholder image if product image fails to load
export const DEFAULT_PLACEHOLDER = 'https://via.placeholder.com/400x400?text=Product+Image';

/**
 * Get image URL with fallback support
 */
export function getImageUrl(imagePath: string): string {
  // If image is already a full URL, return it
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Otherwise, assume it's a relative path and return it
  return imagePath;
}

/**
 * Handle image loading error by replacing with placeholder
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement, Event>): void {
  const img = event.currentTarget;
  img.src = DEFAULT_PLACEHOLDER;
  img.onerror = null; // Prevent infinite error loop if placeholder also fails
}
