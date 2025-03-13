import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { 
  increaseQuantity, 
  decreaseQuantity, 
  removeFromCart,
  applyCoupon,
  removeCoupon 
} from '@/lib/slices/cartSlice';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus, Trash2, ArrowLeft, ShoppingCart } from 'lucide-react';

export default function Cart() {
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  
  const dispatch = useDispatch();
  const { items, appliedCoupon, couponDiscount } = useSelector((state: RootState) => state.cart);
  
  const handleApplyCoupon = () => {
    if (!couponCode) {
      setCouponError('Please enter a coupon code');
      return;
    }
    
    // In a real app, this would validate with an API call
    if (couponCode.toUpperCase() === 'SAVE10') {
      dispatch(applyCoupon({ code: couponCode, discount: 10 }));
      setCouponError('');
    } else if (couponCode.toUpperCase() === 'WELCOME20') {
      dispatch(applyCoupon({ code: couponCode, discount: 20 }));
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };
  
  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponCode('');
    setCouponError('');
  };
  
  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      return total + (item.product.discountPrice || item.product.price) * item.quantity;
    }, 0);
  };
  
  const calculateTax = (subtotal: number) => {
    return Math.round(subtotal * 0.10); // 10% tax
  };
  
  const calculateDiscount = (subtotal: number) => {
    if (!appliedCoupon) return 0;
    return Math.round(subtotal * (couponDiscount / 100));
  };
  
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const discount = calculateDiscount(subtotal);
    return subtotal + tax - discount;
  };
  
  const formatPrice = (price: number) => {
    return `₹${(price / 100).toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-4">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-bold text-lg">Cart Items ({items.length})</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {items.map(item => (
                    <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center">
                      <div className="flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name} 
                          className="w-20 h-20 object-contain rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <Link 
                          href={`/product/${item.product.id}`}
                          className="font-medium text-gray-900 hover:text-primary"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-gray-500 mb-2">{item.product.brand}</p>
                        
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button 
                              className="px-2 py-1 text-gray-500 hover:text-gray-700"
                              onClick={() => dispatch(decreaseQuantity(item.product.id))}
                              disabled={item.quantity === 1}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-2 py-1 text-sm">{item.quantity}</span>
                            <button 
                              className="px-2 py-1 text-gray-500 hover:text-gray-700"
                              onClick={() => dispatch(increaseQuantity(item.product.id))}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          
                          <div className="space-x-4 flex items-center">
                            <div className="text-right">
                              <span className="font-semibold">
                                {formatPrice((item.product.discountPrice || item.product.price) * item.quantity)}
                              </span>
                              {item.quantity > 1 && (
                                <div className="text-xs text-gray-500">
                                  {formatPrice(item.product.discountPrice || item.product.price)} each
                                </div>
                              )}
                            </div>
                            
                            <button 
                              className="text-gray-400 hover:text-red-500"
                              onClick={() => dispatch(removeFromCart(item.product.id))}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                  <Link 
                    href="/products" 
                    className="text-primary hover:text-primary-dark flex items-center"
                  >
                    <ArrowLeft size={16} className="mr-1" /> Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-bold text-lg">Order Summary</h2>
                </div>
                
                <div className="p-4 space-y-4">
                  {/* Coupon Code */}
                  <div className="mb-4">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-2">
                        <div>
                          <span className="text-sm text-green-600 font-medium">
                            Coupon <span className="uppercase">{appliedCoupon}</span> applied!
                          </span>
                          <p className="text-xs text-green-500">You saved {formatPrice(calculateDiscount(calculateSubtotal()))}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          className="h-7 text-red-500 hover:text-red-700 hover:bg-red-50 p-0 px-2"
                          onClick={handleRemoveCoupon}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Apply Coupon
                        </label>
                        <div className="flex items-center">
                          <Input
                            type="text"
                            placeholder="Enter coupon code"
                            className="flex-grow"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                          />
                          <Button 
                            className="ml-2"
                            onClick={handleApplyCoupon}
                          >
                            Apply
                          </Button>
                        </div>
                        {couponError && (
                          <p className="text-xs text-red-500 mt-1">{couponError}</p>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          Try coupon codes: SAVE10, WELCOME20
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Price Details */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-medium mb-2">Price Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Price ({items.length} item{items.length > 1 ? 's' : ''})
                        </span>
                        <span>{formatPrice(calculateSubtotal())}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Charges</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      
                      {appliedCoupon && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount</span>
                          <span className="text-green-600">
                            -{formatPrice(calculateDiscount(calculateSubtotal()))}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span>{formatPrice(calculateTax(calculateSubtotal()))}</span>
                      </div>
                      
                      <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                        <span>Total Amount</span>
                        <span>{formatPrice(calculateTotal())}</span>
                      </div>
                    </div>
                    
                    {appliedCoupon && (
                      <div className="mt-2 text-green-600 text-sm font-medium">
                        You will save {formatPrice(calculateDiscount(calculateSubtotal()))} on this order
                      </div>
                    )}
                  </div>
                  
                  {/* Checkout Button */}
                  <Button className="w-full mt-4">
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
