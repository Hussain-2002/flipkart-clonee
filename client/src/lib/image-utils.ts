
/**
 * Image utility functions for handling image loading and fallbacks
 */

// Default placeholder image if product image fails to load
export const DEFAULT_PLACEHOLDER = 'https://via.placeholder.com/400x400?text=Product+Image';

// Base URL for images served from the public folder
export const IMAGE_BASE_URL = '/images/products';

/**
 * Get image URL with proper fallback support
 * 
 * @param imagePath The path or URL of the image
 * @returns A properly formatted image URL
 */
export function getImageUrl(imagePath: string): string {
  // If image is already a full URL, return it
  if (imagePath && (imagePath.startsWith('http') || imagePath.startsWith('/'))) {
    return imagePath;
  }
  
  // If imagePath is empty or undefined, return placeholder
  if (!imagePath) {
    return DEFAULT_PLACEHOLDER;
  }
  
  // Otherwise, assume it's a relative path and prepend the base URL
  return `${IMAGE_BASE_URL}/${imagePath}`;
}

/**
 * Handle image loading error by replacing with placeholder
 * 
 * @param event The image error event
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement, Event>): void {
  const img = event.currentTarget;
  img.src = DEFAULT_PLACEHOLDER;
  img.onerror = null; // Prevent infinite error loop if placeholder also fails
}
