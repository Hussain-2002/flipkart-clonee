import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { addToCart } from '@/lib/slices/cartSlice';
import { toggleWishlistItem } from '@/lib/slices/wishlistSlice';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/ui/rating';
import { 
  Plus, 
  Minus, 
  Heart, 
  ShoppingCart, 
  Share2,
  Truck,
  RotateCcw,
  Shield
} from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { getImageUrl, handleImageError } from '@/lib/image-utils';


interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [pincode, setPincode] = useState('');

  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const isInWishlist = wishlistItems.some(item => item.id === product.id);

  // Mock product images array (in a real app, these would come from the API)
  const productImages = [
    product.imageUrl,
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80",
    "https://images.unsplash.com/photo-1505739998589-00fc191ce01d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80"
  ];

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity }));
    // Navigate to checkout
    window.location.href = '/checkout';
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlistItem(product));
  };

  const handlePincodeCheck = () => {
    // In a real app, this would check delivery availability
    console.log(`Checking delivery for pincode: ${pincode}`);
  };


  const calculateDiscountPercentage = () => {
    if (!product.discountPrice) return null;
    return Math.round(((product.price - product.discountPrice) / product.price) * 100);
  };

  const calculateEmi = (price: number) => {
    // Simple EMI calculation (price / 12 months)
    return formatPrice(Math.round(price / 12));
  };

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row -mx-4">
          {/* Product Images Section */}
          <div className="md:w-1/2 px-4 mb-6 md:mb-0">
            <div className="sticky top-20">
              {/* Main Image */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                <div className="relative group">
                  <img 
                    src={getImageUrl(productImages[selectedImage])} 
                    alt={product.name} 
                    className="w-full h-96 object-contain p-4"
                    onError={handleImageError}
                  />

                  {/* Image Zoom Overlay - would need additional JS for zoom functionality */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity" />
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex space-x-2 overflow-x-auto">
                {productImages.map((img, index) => (
                  <button 
                    key={index}
                    className={`border-2 rounded-md overflow-hidden ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={getImageUrl(img)} 
                      alt={`${product.name} - thumbnail ${index + 1}`} 
                      className="w-16 h-16 object-contain p-1"
                      onError={handleImageError}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="md:w-1/2 px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>

            <div className="flex items-center mb-4">
              <Rating value={product.rating} />
              <span className="ml-2 text-sm text-gray-600">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.discountPrice || product.price)}
                </span>

                {product.discountPrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-base font-medium text-green-600">
                      {calculateDiscountPercentage()}% off
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm text-gray-600">
                includes all taxes
              </p>
            </div>

            {/* EMI & Exchange offers */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm mb-3">
                <div className="font-medium mb-1">EMI available from {calculateEmi(product.discountPrice || product.price)}/month</div>
                <a href="#" className="text-primary text-xs">View plans</a>
              </div>

              <div className="text-sm">
                <div className="font-medium mb-1">Exchange offer up to ₹2,000 off</div>
                <a href="#" className="text-primary text-xs">Check availability</a>
              </div>
            </div>

            {/* Product description */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">About this item</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description}
                {" Premium quality product with 1-year warranty. Made with high-quality materials for durability and performance. Includes all accessories in the box."}
              </p>
            </div>

            {/* Quantity selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center">
                <button 
                  className="border border-gray-300 rounded-l-md px-3 py-2 text-gray-600 hover:bg-gray-50"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity === 1}
                >
                  <Minus size={16} />
                </button>
                <span className="border-t border-b border-gray-300 px-4 py-2 text-center w-12">{quantity}</span>
                <button 
                  className="border border-gray-300 rounded-r-md px-3 py-2 text-gray-600 hover:bg-gray-50"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity === 10}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Delivery information */}
            <div className="mb-6">
              <div className="flex items-start">
                <Truck className="h-5 w-5 text-gray-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-2">Delivery</h3>
                  <div className="flex items-center mb-2 space-x-2">
                    <input
                      type="text"
                      placeholder="Enter pincode"
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm w-32"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handlePincodeCheck}
                    >
                      Check
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Free delivery within 2-4 days
                  </p>
                </div>
              </div>
            </div>

            {/* Seller information */}
            <div className="mb-6 border-t border-b border-gray-200 py-4">
              <div className="text-sm">
                <p className="mb-1">
                  <span className="text-gray-600">Sold by:</span> 
                  <a href="#" className="text-primary ml-1 font-medium">TechRetailer Pvt Ltd</a>
                </p>
                <div className="flex flex-wrap items-center text-xs text-gray-500 gap-4">
                  <span className="flex items-center">
                    <Shield className="h-4 w-4 mr-1" /> 10-day returns
                  </span>
                  <span className="flex items-center">
                    <RotateCcw className="h-4 w-4 mr-1" /> 1 year warranty
                  </span>
                  <span className="flex items-center">
                    <Truck className="h-4 w-4 mr-1" /> Free delivery
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button 
                className="flex-1 gap-2 bg-primary hover:bg-primary-dark"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={18} />
                Add to Cart
              </Button>

              <Button 
                className="flex-1 gap-2"
                variant="secondary"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>

              <Button 
                variant="outline" 
                size="icon"
                className={isInWishlist ? "text-red-500 border-red-500" : ""}
                onClick={handleToggleWishlist}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`} />
              </Button>

              <Button 
                variant="outline" 
                size="icon"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}