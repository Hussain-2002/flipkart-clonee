import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { 
  closeCart, 
  increaseQuantity, 
  decreaseQuantity, 
  removeFromCart,
  applyCoupon,
  removeCoupon
} from '@/lib/slices/cartSlice';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Minus, Trash2 } from 'lucide-react';

export default function CartSidebar() {
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const dispatch = useDispatch();
  
  const { items, isOpen, appliedCoupon, couponDiscount } = useSelector((state: RootState) => state.cart);
  
  // Close cart when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Element;
      
      // If clicking outside the cart and the cart is open
      if (
        isOpen && 
        target.closest('#cartSidebar') === null && 
        !target.closest('button')?.hasAttribute('data-cart-trigger')
      ) {
        dispatch(closeCart());
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, dispatch]);
  
  const handleClose = () => {
    dispatch(closeCart());
  };
  
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
    <div 
      id="cartSidebar"
      className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Cart Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-bold text-lg">Your Cart ({items.length})</h3>
        <button 
          className="text-gray-400 hover:text-gray-600"
          onClick={handleClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Cart Items */}
      <div className="overflow-y-auto h-[calc(100%-180px)] p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
            <p className="text-gray-500 mb-4">Looks like you haven't added anything to your cart yet.</p>
            <Button onClick={handleClose}>Continue Shopping</Button>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="flex items-center pb-4 mb-4 border-b border-gray-200">
              <img 
                src={item.product.imageUrl} 
                alt={item.product.name} 
                className="w-16 h-16 object-contain rounded-lg mr-3"
              />
              <div className="flex-grow">
                <h4 className="text-sm font-medium text-gray-900">{item.product.name}</h4>
                <p className="text-xs text-gray-500">{item.product.brand}</p>
                <div className="flex items-center justify-between mt-1">
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
                  <span className="font-semibold text-gray-900">
                    {formatPrice((item.product.discountPrice || item.product.price) * item.quantity)}
                  </span>
                </div>
              </div>
              <button 
                className="ml-2 text-gray-400 hover:text-red-500"
                onClick={() => dispatch(removeFromCart(item.product.id))}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
      
      {/* Cart Footer */}
      {items.length > 0 && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
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
              </>
            )}
          </div>
          
          {/* Cart Summary */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">Free</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">{formatPrice(calculateTax(calculateSubtotal()))}</span>
            </div>
            
            {appliedCoupon && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-green-600">
                  -{formatPrice(calculateDiscount(calculateSubtotal()))}
                </span>
              </div>
            )}
            
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>
          </div>
          
          {/* Checkout Button */}
          <Button asChild className="w-full bg-primary hover:bg-primary-dark text-white py-3">
            <Link href="/checkout">
              Proceed to Checkout
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
