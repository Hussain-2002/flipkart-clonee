
/**
 * Application configuration settings
 */

// Images configuration
export const imagesConfig = {
  // Base path for product images in the public folder
  productImagesPath: '/images/products',
  
  // Fallback placeholder when images fail to load
  placeholder: 'https://via.placeholder.com/400x400?text=Product+Image',
  
  // For development, we can use these external image services
  externalServices: {
    picsum: (id: number) => `https://picsum.photos/id/${200 + id}/400/400`,
    placeholder: (width: number, height: number) => 
      `https://via.placeholder.com/${width}x${height}?text=Product+Image`
  }
};

// API configuration
export const apiConfig = {
  baseUrl: '/api',
  endpoints: {
    products: '/products',
    categories: '/categories',
    cart: '/cart',
    orders: '/orders'
  }
};
