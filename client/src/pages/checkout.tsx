import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { clearCart } from '@/lib/slices/cartSlice';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CreditCard, ShoppingCart, ChevronsLeft } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

// Address form schema
const addressSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  phoneNumber: z.string().min(10, { message: "Valid phone number is required" }),
  street: z.string().min(5, { message: "Street address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "ZIP code is required" }),
  country: z.string().min(2, { message: "Country is required" }),
});

// Payment form schema
const paymentSchema = z.object({
  paymentMethod: z.enum(["credit_card", "debit_card", "upi", "cod"], {
    required_error: "Please select a payment method",
  }),
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  upiId: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.paymentMethod === "credit_card" || data.paymentMethod === "debit_card") {
    if (!data.cardName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Card holder name is required",
        path: ["cardName"],
      });
    }
    if (!data.cardNumber || !/^\d{16}$/.test(data.cardNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid 16-digit card number is required",
        path: ["cardNumber"],
      });
    }
    if (!data.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiryDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid expiry date (MM/YY) is required",
        path: ["expiryDate"],
      });
    }
    if (!data.cvv || !/^\d{3}$/.test(data.cvv)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid 3-digit CVV is required",
        path: ["cvv"],
      });
    }
  } else if (data.paymentMethod === "upi") {
    if (!data.upiId || !data.upiId.includes('@')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid UPI ID is required",
        path: ["upiId"],
      });
    }
  }
  return data;
});

// Combined checkout schema
const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  paymentDetails: paymentSchema,
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [step, setStep] = useState<'address' | 'payment' | 'confirmation'>('address');
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const dispatch = useDispatch();
  
  const { items, appliedCoupon, couponDiscount } = useSelector((state: RootState) => state.cart);
  
  // Redirect if cart is empty
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: {
        fullName: "",
        phoneNumber: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
      },
      paymentDetails: {
        paymentMethod: "cod",
        cardName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        upiId: "",
      },
    },
  });
  
  // Calculate order totals
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
  
  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutFormValues) => {
      const orderData = {
        paymentMethod: data.paymentDetails.paymentMethod,
        shippingAddress: data.shippingAddress,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.discountPrice || item.product.price
        })),
        totalAmount: calculateTotal(),
      };
      
      const res = await apiRequest('POST', '/api/orders', orderData);
      return res.json();
    },
    onSuccess: () => {
      // Clear cart and redirect to success page
      dispatch(clearCart());
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      
      // Show success message
      toast({
        title: 'Order Placed Successfully',
        description: 'Thank you for your order! You can track its status in My Orders.',
      });
      
      // Redirect to order confirmation page
      navigate('/orders');
    },
    onError: (error: any) => {
      toast({
        title: 'Error Placing Order',
        description: error.message || 'An error occurred while placing your order. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  const handleAddressSubmit = (data: CheckoutFormValues) => {
    setStep('payment');
  };
  
  const handlePaymentSubmit = (data: CheckoutFormValues) => {
    createOrderMutation.mutate(data);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        {/* Checkout Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className={`flex items-center ${step === 'address' ? 'text-primary' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step === 'address' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="font-medium">Address</span>
          </div>
          
          <div className="w-16 mx-2 h-1 bg-gray-200">
            <div className={`h-full bg-primary transition-all ${step === 'address' ? 'w-0' : step === 'payment' ? 'w-1/2' : 'w-full'}`}></div>
          </div>
          
          <div className={`flex items-center ${step === 'payment' ? 'text-primary' : step === 'confirmation' ? 'text-primary' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step === 'payment' || step === 'confirmation' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="font-medium">Payment</span>
          </div>
          
          <div className="w-16 mx-2 h-1 bg-gray-200">
            <div className={`h-full bg-primary transition-all ${step === 'address' || step === 'payment' ? 'w-0' : 'w-full'}`}></div>
          </div>
          
          <div className={`flex items-center ${step === 'confirmation' ? 'text-primary' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step === 'confirmation' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="font-medium">Confirmation</span>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Form {...form}>
                <form onSubmit={
                  step === 'address' 
                    ? form.handleSubmit(handleAddressSubmit)
                    : form.handleSubmit(handlePaymentSubmit)
                }>
                  {/* Address Step */}
                  {step === 'address' && (
                    <div className="p-6">
                      <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                      
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="shippingAddress.fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="shippingAddress.phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="+91 9876543210" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="sm:col-span-2">
                          <FormField
                            control={form.control}
                            name="shippingAddress.street"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="123 Main Street, Apartment 4B" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="shippingAddress.city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Mumbai" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="shippingAddress.state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input placeholder="Maharashtra" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="shippingAddress.zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>PIN Code</FormLabel>
                              <FormControl>
                                <Input placeholder="400001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="shippingAddress.country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="India">India</SelectItem>
                                  <SelectItem value="United States">United States</SelectItem>
                                  <SelectItem value="Canada">Canada</SelectItem>
                                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                  <SelectItem value="Australia">Australia</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="mt-6 flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => navigate('/cart')}
                        >
                          <ChevronsLeft className="mr-2 h-4 w-4" />
                          Back to Cart
                        </Button>
                        
                        <Button type="submit">Continue to Payment</Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Payment Step */}
                  {step === 'payment' && (
                    <div className="p-6">
                      <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                      
                      <FormField
                        control={form.control}
                        name="paymentDetails.paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid gap-4 grid-cols-1 sm:grid-cols-2"
                              >
                                <div className="border rounded-lg p-4 cursor-pointer transition-all hover:border-primary hover:bg-primary/5">
                                  <RadioGroupItem 
                                    value="credit_card" 
                                    id="credit_card" 
                                    className="sr-only" 
                                  />
                                  <Label 
                                    htmlFor="credit_card" 
                                    className="flex items-start cursor-pointer gap-3"
                                  >
                                    <div className="w-5">
                                      <CreditCard className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium">Credit Card</p>
                                      <p className="text-sm text-gray-500">Pay securely with your credit card</p>
                                    </div>
                                  </Label>
                                </div>
                                
                                <div className="border rounded-lg p-4 cursor-pointer transition-all hover:border-primary hover:bg-primary/5">
                                  <RadioGroupItem 
                                    value="debit_card" 
                                    id="debit_card" 
                                    className="sr-only" 
                                  />
                                  <Label 
                                    htmlFor="debit_card" 
                                    className="flex items-start cursor-pointer gap-3"
                                  >
                                    <div className="w-5">
                                      <CreditCard className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium">Debit Card</p>
                                      <p className="text-sm text-gray-500">Pay directly from your bank account</p>
                                    </div>
                                  </Label>
                                </div>
                                
                                <div className="border rounded-lg p-4 cursor-pointer transition-all hover:border-primary hover:bg-primary/5">
                                  <RadioGroupItem 
                                    value="upi" 
                                    id="upi" 
                                    className="sr-only" 
                                  />
                                  <Label 
                                    htmlFor="upi" 
                                    className="flex items-start cursor-pointer gap-3"
                                  >
                                    <div className="w-5">
                                      <svg 
                                        className="h-5 w-5 text-primary" 
                                        fill="currentColor" 
                                        viewBox="0 0 36 36"
                                      >
                                        <path d="M12.5 36l2.3-8.2c-1.5-2-2.3-4.5-2.3-7.1 0-6.6 5.4-12 12-12s12 5.4 12 12-5.4 12-12 12c-2.3 0-4.5-.7-6.3-1.8L12.5 36z" />
                                      </svg>
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium">UPI</p>
                                      <p className="text-sm text-gray-500">Google Pay, PhonePe, Paytm & more</p>
                                    </div>
                                  </Label>
                                </div>
                                
                                <div className="border rounded-lg p-4 cursor-pointer transition-all hover:border-primary hover:bg-primary/5">
                                  <RadioGroupItem 
                                    value="cod" 
                                    id="cod" 
                                    className="sr-only" 
                                  />
                                  <Label 
                                    htmlFor="cod" 
                                    className="flex items-start cursor-pointer gap-3"
                                  >
                                    <div className="w-5">
                                      <ShoppingCart className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium">Cash on Delivery</p>
                                      <p className="text-sm text-gray-500">Pay when you receive your order</p>
                                    </div>
                                  </Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Card Details */}
                      {(form.watch('paymentDetails.paymentMethod') === 'credit_card' || 
                         form.watch('paymentDetails.paymentMethod') === 'debit_card') && (
                        <div className="mt-6 border rounded-lg p-4">
                          <h3 className="font-medium mb-4">Card Details</h3>
                          
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="paymentDetails.cardName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name on Card</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="paymentDetails.cardNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Card Number</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="1234 5678 9012 3456" 
                                      maxLength={16}
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="paymentDetails.expiryDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Expiry Date</FormLabel>
                                    <FormControl>
                                      <Input placeholder="MM/YY" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="paymentDetails.cvv"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>CVV</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="123" 
                                        maxLength={3}
                                        type="password"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* UPI Details */}
                      {form.watch('paymentDetails.paymentMethod') === 'upi' && (
                        <div className="mt-6 border rounded-lg p-4">
                          <h3 className="font-medium mb-4">UPI Details</h3>
                          
                          <FormField
                            control={form.control}
                            name="paymentDetails.upiId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>UPI ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="yourname@upi" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                      
                      <div className="mt-6 flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setStep('address')}
                        >
                          <ChevronsLeft className="mr-2 h-4 w-4" />
                          Back to Address
                        </Button>
                        
                        <Button 
                          type="submit"
                          disabled={createOrderMutation.isPending}
                        >
                          {createOrderMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Place Order
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </Form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-lg">Order Summary</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {items.map(item => (
                  <div key={item.id} className="p-4 flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        className="w-16 h-16 object-contain rounded-lg border border-gray-200"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium mt-1">
                        {formatPrice((item.product.discountPrice || item.product.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Price Details */}
              <div className="p-4 border-t border-gray-200">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}