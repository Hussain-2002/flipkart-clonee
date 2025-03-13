import { 
  User,
  Product,
  Category,
  CartItem,
  WishlistItem,
  Order,
  OrderItem 
} from '@shared/schema';

// Re-export types from schema
export type {
  User,
  Product,
  Category,
  CartItem,
  WishlistItem,
  Order,
  OrderItem
};

// Additional frontend types
export interface SearchSuggestion {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
}

export interface CartItemWithProduct {
  id: number;
  product: Product;
  quantity: number;
}

export interface HeroSlide {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  imageUrl: string;
  bgColor: string;
}

export interface PromotionalCard {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  bgColor: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface FlashSaleTime {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface CategoryWithSubcategories extends Category {
  subCategories: string[];
  color: string;
  icon: string;
  imageUrl: string;
}
