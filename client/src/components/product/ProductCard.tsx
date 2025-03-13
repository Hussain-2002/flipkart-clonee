import { useState } from 'react';
import { Link } from 'wouter';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { addToCart } from '@/lib/slices/cartSlice';
import { toggleWishlistItem } from '@/lib/slices/wishlistSlice';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Product } from '@/lib/types';
import { Rating } from '@/components/ui/rating';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  
  const isInWishlist = wishlistItems.some(item => item.id === product.id);
  
  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
  };
  
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleWishlistItem(product));
  };
  
  const formatPrice = (price: number) => {
    return `₹${(price / 100).toLocaleString('en-IN')}`;
  };
  
  const calculateDiscountPercentage = () => {
    if (!product.discountPrice) return null;
    return Math.round(((product.price - product.discountPrice) / product.price) * 100);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Product Image with Wishlist Button */}
      <div className="relative">
        <Link href={`/product/${product.id}`}>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-48 object-contain p-4"
          />
        </Link>
        <button 
          className={`absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center ${isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} transition-colors`}
          onClick={handleToggleWishlist}
        >
          <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      {/* Product Info */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex-grow">
          <div className="flex items-center space-x-1 mb-1">
            <Rating value={product.rating} />
            <span className="text-xs text-gray-500 ml-1">{product.rating} ({product.reviewCount})</span>
          </div>
          
          <Link href={`/product/${product.id}`}>
            <h3 className="font-medium text-gray-900 mb-1 hover:text-primary">{product.name}</h3>
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
                  {calculateDiscountPercentage()}% off
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <Button 
          className="w-full bg-primary hover:bg-primary-dark text-white py-2"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
