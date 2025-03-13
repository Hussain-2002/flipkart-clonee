import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { fetchProducts } from '@/lib/slices/productSlice';
import { removeFromWishlist } from '@/lib/slices/wishlistSlice';
import { addToCart } from '@/lib/slices/cartSlice';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/ui/rating';
import { Trash2, ShoppingCart, Heart, ArrowLeft } from 'lucide-react';

export default function Wishlist() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  
  const handleRemoveFromWishlist = (productId: number) => {
    dispatch(removeFromWishlist(productId));
  };
  
  const handleAddToCart = (product: any) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };
  
  const formatPrice = (price: number) => {
    return `₹${(price / 100).toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mx-auto mb-4">
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-4">
              Save items you love to buy them later or share with friends.
            </p>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center mb-4 justify-between">
              <div>
                <span className="text-sm text-gray-600">
                  {wishlistItems.length} item{wishlistItems.length > 1 ? 's' : ''} in your wishlist
                </span>
              </div>
              <Link 
                href="/products" 
                className="text-primary hover:text-primary-dark flex items-center"
              >
                <ArrowLeft size={16} className="mr-1" /> Continue Shopping
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlistItems.map(product => (
                <div 
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                >
                  <div className="relative">
                    <Link href={`/product/${product.id}`}>
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-48 object-contain p-4"
                      />
                    </Link>
                    <button 
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                      onClick={() => handleRemoveFromWishlist(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="p-4 flex-grow flex flex-col">
                    <div className="flex-grow">
                      <div className="flex items-center space-x-1 mb-1">
                        <Rating value={product.rating} />
                        <span className="text-xs text-gray-500 ml-1">
                          {product.rating} ({product.reviewCount})
                        </span>
                      </div>
                      
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-medium text-gray-900 mb-1 hover:text-primary">
                          {product.name}
                        </h3>
                      </Link>
                      
                      <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                      
                      <div className="flex items-baseline space-x-2 mb-2">
                        <span className="text-lg font-semibold text-gray-900">
                          {formatPrice(product.discountPrice || product.price)}
                        </span>
                        
                        {product.discountPrice && (
                          <>
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.price)}
                            </span>
                            <span className="text-xs font-medium text-green-600">
                              {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% off
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-primary hover:bg-primary-dark text-white py-2 flex items-center justify-center gap-2"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
