import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { setSortBy } from '@/lib/slices/productSlice';
import { SORT_OPTIONS } from '@/lib/constants';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';

export default function ProductListingSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const { filteredProducts, sortBy } = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch();
  
  const productsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
  const handleSortChange = (value: string) => {
    dispatch(setSortBy(value));
  };
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    
    // Scroll to top of products section
    window.scrollTo({
      top: document.getElementById('product-listing')?.offsetTop,
      behavior: 'smooth'
    });
  };

  return (
    <section id="product-listing" className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Popular Products</h2>
            <p className="text-gray-600">Top-rated products loved by customers</p>
          </div>
          
          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
            {/* Sorting Dropdown */}
            <div className="relative">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Filter Button - Mobile */}
            <Button 
              variant="outline" 
              className="md:hidden" 
              onClick={() => console.log('Open filter modal')}
            >
              <SlidersHorizontal size={16} className="mr-2" /> Filter
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Only show 5 page numbers at a time
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNumber)}
                      className="px-4 py-2"
                    >
                      {pageNumber}
                    </Button>
                  );
                }
                
                // Show ellipsis for skipped pages
                if (
                  (pageNumber === 2 && currentPage > 3) ||
                  (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return <span key={pageNumber} className="px-3 py-2 text-gray-500">...</span>;
                }
                
                return null;
              })}
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        )}
      </div>
    </section>
  );
}
