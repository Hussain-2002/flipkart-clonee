
/**
 * Application configuration
 */

// Base URL for the application
export const BASE_URL = import.meta.env.VITE_BASE_URL || '';

// Image paths
export const IMAGES = {
  // Base path for product images
  PRODUCTS: '/images/products',
  
  // Base path for category images
  CATEGORIES: '/images/categories',
  
  // Base path for brand images
  BRANDS: '/images/brands',
  
  // Placeholder images
  PLACEHOLDER: 'https://via.placeholder.com/400x400?text=Product+Image'
};
