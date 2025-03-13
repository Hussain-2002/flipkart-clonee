import { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '@/lib/slices/productSlice';
import { PRODUCTS } from '@/lib/constants';
import ProductDetails from '@/components/product/ProductDetails';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    dispatch(fetchProducts());
    
    // Find product by ID
    const productId = parseInt(id);
    const foundProduct = PRODUCTS.find(p => p.id === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
    }
    
    // Simulate API loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [id, dispatch]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row -mx-4">
          {/* Skeleton for image */}
          <div className="md:w-1/2 px-4 mb-6 md:mb-0">
            <Skeleton className="h-96 w-full mb-4" />
            <div className="flex space-x-2">
              <Skeleton className="h-16 w-16" />
              <Skeleton className="h-16 w-16" />
              <Skeleton className="h-16 w-16" />
            </div>
          </div>
          
          {/* Skeleton for product details */}
          <div className="md:w-1/2 px-4">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/3 mb-8" />
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/4 mb-6" />
            <Skeleton className="h-32 w-full mb-6" />
            <Skeleton className="h-10 w-full mb-4" />
            <div className="flex space-x-4">
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-12 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">Sorry, we couldn't find the product you're looking for.</p>
        <a href="/" className="text-primary hover:underline">Go back to home page</a>
      </div>
    );
  }

  return <ProductDetails product={product} />;
}
