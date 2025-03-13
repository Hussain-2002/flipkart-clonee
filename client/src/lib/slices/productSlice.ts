import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { PRODUCTS } from '../constants';
import type { Product } from '@shared/schema';

interface SearchSuggestion {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
}

interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  searchResults: SearchSuggestion[];
  searchQuery: string;
  selectedCategory: number | null;
  selectedBrands: string[];
  priceRange: [number, number];
  sortBy: string;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: PRODUCTS,
  filteredProducts: PRODUCTS,
  searchResults: [],
  searchQuery: '',
  selectedCategory: null,
  selectedBrands: [],
  priceRange: [0, 1000000], // 0 to 10,000 INR in paisa
  sortBy: 'popular',
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      // Since we're using in-memory data, we'll just return our constants
      // In a real app, this would be an API call
      return PRODUCTS;
    } catch (error) {
      return rejectWithValue('Failed to fetch products');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query: string, { rejectWithValue }) => {
    try {
      // Mock search by filtering local data
      if (!query) return [];
      
      const results = PRODUCTS
        .filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
        .map(product => ({
          id: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.discountPrice || product.price,
          category: CATEGORIES.find(c => c.id === product.categoryId)?.name || '',
        }));
      
      return results;
    } catch (error) {
      return rejectWithValue('Failed to search products');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCategory: (state, action: PayloadAction<number | null>) => {
      state.selectedCategory = action.payload;
      state.filteredProducts = applyFilters(state);
    },
    setBrands: (state, action: PayloadAction<string[]>) => {
      state.selectedBrands = action.payload;
      state.filteredProducts = applyFilters(state);
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
      state.filteredProducts = applyFilters(state);
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
      state.filteredProducts = applySorting(applyFilters(state), action.payload);
    },
    resetFilters: (state) => {
      state.selectedCategory = null;
      state.selectedBrands = [];
      state.priceRange = [0, 1000000];
      state.sortBy = 'popular';
      state.filteredProducts = applySorting(state.products, 'popular');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.filteredProducts = applySorting(action.payload, state.sortBy);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchResults = action.payload as SearchSuggestion[];
      });
  },
});

// Helper functions for filtering and sorting
function applyFilters(state: ProductsState): Product[] {
  let filtered = state.products;
  
  if (state.selectedCategory !== null) {
    filtered = filtered.filter(product => product.categoryId === state.selectedCategory);
  }
  
  if (state.selectedBrands.length > 0) {
    filtered = filtered.filter(product => state.selectedBrands.includes(product.brand));
  }
  
  filtered = filtered.filter(product => {
    const price = product.discountPrice || product.price;
    return price >= state.priceRange[0] && price <= state.priceRange[1];
  });
  
  return applySorting(filtered, state.sortBy);
}

function applySorting(products: Product[], sortBy: string): Product[] {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price_low':
      return sorted.sort((a, b) => 
        (a.discountPrice || a.price) - (b.discountPrice || b.price)
      );
    case 'price_high':
      return sorted.sort((a, b) => 
        (b.discountPrice || b.price) - (a.discountPrice || a.price)
      );
    case 'newest':
      return sorted.sort((a, b) => b.id - a.id);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'popular':
    default:
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
  }
}

export const {
  setSearchQuery,
  setCategory,
  setBrands,
  setPriceRange,
  setSortBy,
  resetFilters,
} = productSlice.actions;

export default productSlice.reducer;

// Import this separately to avoid circular import issues
import { CATEGORIES } from '../constants';
