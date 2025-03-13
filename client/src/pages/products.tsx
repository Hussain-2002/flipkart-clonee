import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute } from 'wouter';
import { RootState } from '@/lib/store';
import { 
  fetchProducts, 
  setCategory, 
  setBrands, 
  setPriceRange, 
  resetFilters 
} from '@/lib/slices/productSlice';
import { CATEGORIES } from '@/lib/constants';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

export default function Products() {
  const dispatch = useDispatch();
  const { products, filteredProducts, selectedCategory, selectedBrands, priceRange, loading } = 
    useSelector((state: RootState) => state.products);
  
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    price: true,
    ratings: true,
  });
  
  // Get category from URL params
  const [matchCategory, paramsCategory] = useRoute("/category/:categoryId");
  const [matchSubCategory, paramsSubCategory] = useRoute("/category/:categoryId/:subCategory");
  
  const productsPerPage = 12; // Show more products per page
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
  // Handle URL parameters for categories
  useEffect(() => {
    dispatch(fetchProducts());
    
    // Set category based on URL parameters
    if (matchCategory && paramsCategory.categoryId) {
      const categoryId = parseInt(paramsCategory.categoryId);
      if (!isNaN(categoryId) && CATEGORIES.some(cat => cat.id === categoryId)) {
        dispatch(setCategory(categoryId));
      }
    } else if (matchSubCategory && paramsSubCategory.categoryId) {
      const categoryId = parseInt(paramsSubCategory.categoryId);
      if (!isNaN(categoryId) && CATEGORIES.some(cat => cat.id === categoryId)) {
        dispatch(setCategory(categoryId));
        // Note: We could also filter by subcategory if needed
      }
    }
  }, [dispatch, matchCategory, paramsCategory, matchSubCategory, paramsSubCategory]);
  
  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [filteredProducts.length]);
  
  const handleCategoryClick = (categoryId: number) => {
    dispatch(selectedCategory === categoryId ? setCategory(null) : setCategory(categoryId));
  };
  
  const handleBrandChange = (brand: string) => {
    const updatedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    
    dispatch(setBrands(updatedBrands));
  };
  
  const handlePriceChange = (value: number[]) => {
    dispatch(setPriceRange([value[0] * 100, value[1] * 100])); // Convert to paisa
  };
  
  const handleResetFilters = () => {
    dispatch(resetFilters());
  };
  
  const toggleFilterSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };
  
  const formatPrice = (price: number) => {
    return `₹${(price / 100).toLocaleString('en-IN')}`;
  };
  
  // Get unique brands for filtering
  const uniqueBrands = Array.from(new Set(products.map(product => product.brand)));
  
  // Calculate min and max prices for the slider
  const minPrice = Math.floor(Math.min(...products.map(p => (p.discountPrice || p.price) / 100)));
  const maxPrice = Math.ceil(Math.max(...products.map(p => (p.discountPrice || p.price) / 100)));
  
  // Current price range in rupees for display
  const currentMinPrice = priceRange[0] / 100;
  const currentMaxPrice = priceRange[1] / 100;

  // Get category name if a category is selected
  const categoryName = selectedCategory 
    ? CATEGORIES.find(c => c.id === selectedCategory)?.name 
    : null;
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">
          {categoryName ? `${categoryName} Products` : 'All Products'}
        </h1>
        
        {/* Mobile filter button */}
        <div className="md:hidden mb-4">
          <Button 
            onClick={() => setShowFilters(!showFilters)}
            variant="outline" 
            className="w-full flex items-center justify-center"
          >
            <SlidersHorizontal size={16} className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`w-full md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Filters</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleResetFilters}
                  className="text-primary h-8 px-2"
                >
                  Clear All
                </Button>
              </div>
              
              {/* Categories Filter */}
              <div className="mb-4 border-b pb-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFilterSection('categories')}
                >
                  <h3 className="font-medium">Categories</h3>
                  {expandedSections.categories ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
                
                {expandedSections.categories && (
                  <div className="mt-2 space-y-1">
                    {CATEGORIES.map(category => (
                      <div 
                        key={category.id}
                        className={`px-2 py-1.5 rounded-md cursor-pointer text-sm ${
                          selectedCategory === category.id ? 'bg-primary text-white' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        {category.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Brands Filter */}
              <div className="mb-4 border-b pb-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFilterSection('brands')}
                >
                  <h3 className="font-medium">Brands</h3>
                  {expandedSections.brands ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
                
                {expandedSections.brands && (
                  <div className="mt-2 space-y-2">
                    {uniqueBrands.map(brand => (
                      <div key={brand} className="flex items-center">
                        <Checkbox 
                          id={`brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => handleBrandChange(brand)}
                        />
                        <Label 
                          htmlFor={`brand-${brand}`}
                          className="ml-2 text-sm"
                        >
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-4 border-b pb-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFilterSection('price')}
                >
                  <h3 className="font-medium">Price Range</h3>
                  {expandedSections.price ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
                
                {expandedSections.price && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                    <Slider
                      defaultValue={[currentMinPrice, currentMaxPrice]}
                      min={minPrice}
                      max={maxPrice}
                      step={100}
                      onValueChange={handlePriceChange}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
              
              {/* Rating Filter */}
              <div className="mb-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFilterSection('ratings')}
                >
                  <h3 className="font-medium">Ratings</h3>
                  {expandedSections.ratings ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
                
                {expandedSections.ratings && (
                  <div className="mt-2 space-y-2">
                    {[4, 3, 2, 1].map(rating => (
                      <div key={rating} className="flex items-center">
                        <Checkbox id={`rating-${rating}`} />
                        <Label 
                          htmlFor={`rating-${rating}`}
                          className="ml-2 text-sm flex items-center"
                        >
                          {rating}+ <i className="fas fa-star text-yellow-400 text-xs ml-1"></i>
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="flex-grow">
            {/* Active filters */}
            {(selectedCategory !== null || selectedBrands.length > 0 || 
              priceRange[0] > 0 || priceRange[1] < 1000000) && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">Active Filters:</span>
                
                {selectedCategory !== null && (
                  <span className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                    {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                    <button 
                      onClick={() => dispatch(setCategory(null))}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                
                {selectedBrands.map(brand => (
                  <span key={brand} className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                    {brand}
                    <button 
                      onClick={() => handleBrandChange(brand)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                
                {(priceRange[0] > 0 || priceRange[1] < 1000000) && (
                  <span className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                    {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                    <button 
                      onClick={() => dispatch(setPriceRange([0, 1000000]))}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}
            
            {/* Products count and sort */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                Showing <span className="font-medium">{filteredProducts.length}</span> products
              </div>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-4 h-80 animate-pulse">
                    <div className="bg-gray-200 h-40 rounded-md mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/2 mb-4"></div>
                    <div className="bg-gray-200 h-6 rounded w-1/3 mb-2"></div>
                    <div className="bg-gray-200 h-8 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filter criteria</p>
                <Button onClick={handleResetFilters}>Reset Filters</Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {currentProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ))}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
