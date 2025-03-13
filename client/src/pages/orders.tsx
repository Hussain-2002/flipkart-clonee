import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Loader2, Package, PackageOpen, ShoppingBag, Truck, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Order, OrderItem } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PRODUCTS } from '@/lib/constants';

// Helper to format dates
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Helper to get status badge color
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'shipped':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Helper to get status icon
const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return <ShoppingBag className="h-4 w-4" />;
    case 'processing':
      return <PackageOpen className="h-4 w-4" />;
    case 'shipped':
      return <Truck className="h-4 w-4" />;
    case 'delivered':
      return <Check className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

// Helper to format price
const formatPrice = (price: number) => {
  return `₹${(price / 100).toLocaleString('en-IN')}`;
};

// Model for order with product details
interface OrderWithDetails extends Order {
  items: (OrderItem & { product: any })[];
}

export default function OrdersPage() {
  const { data: orders, isLoading, error } = useQuery<OrderWithDetails[]>({
    queryKey: ['/api/orders'],
    queryFn: async () => {
      try {
        const res = await apiRequest('GET', '/api/orders');
        const data = await res.json();
        
        // Enrich order items with product details
        return data.map((order: Order & { items: OrderItem[] }) => ({
          ...order,
          items: order.items.map(item => ({
            ...item,
            product: PRODUCTS.find(p => p.id === item.productId) || null,
          })),
        }));
      } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Error Loading Orders</h3>
          <p className="text-gray-600 mb-4">There was a problem loading your orders. Please try again.</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {!orders || orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mx-auto mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-4">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-bold text-lg">Order #{order.id}</h2>
                      <Badge className={`${getStatusColor(order.status)} border`}>
                        <span className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Placed on {formatDate(order.createdAt.toString())}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Order Total</p>
                    <p className="text-lg font-bold">{formatPrice(order.totalAmount)}</p>
                  </div>
                </div>

                <div className="p-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={`order-${order.id}`} className="border-none">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <span className="text-sm font-medium">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="divide-y divide-gray-100">
                          {order.items.map((item) => (
                            <div key={item.id} className="py-3 flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <img 
                                  src={item.product?.imageUrl} 
                                  alt={item.product?.name} 
                                  className="w-16 h-16 object-contain rounded-md border border-gray-200"
                                />
                              </div>
                              <div className="flex-grow">
                                <Link 
                                  href={`/product/${item.productId}`}
                                  className="font-medium text-gray-900 hover:text-primary"
                                >
                                  {item.product?.name || `Product #${item.productId}`}
                                </Link>
                                {item.product?.brand && (
                                  <p className="text-sm text-gray-500">{item.product.brand}</p>
                                )}
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-sm text-gray-500">
                                    Qty: {item.quantity}
                                  </span>
                                  <span className="font-medium">
                                    {formatPrice(item.price)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Shipping Address */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h3 className="font-medium mb-2">Shipping Address</h3>
                          {order.shippingAddress && typeof order.shippingAddress === 'object' ? (
                            <address className="text-sm text-gray-600 not-italic">
                              {order.shippingAddress.street}<br />
                              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                              {order.shippingAddress.country}
                            </address>
                          ) : (
                            <p className="text-sm text-gray-600">Address information not available</p>
                          )}
                        </div>
                        
                        {/* Payment Method */}
                        <div className="mt-4">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Payment Method:</span> {order.paymentMethod}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                
                {/* Order Actions */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-wrap gap-2 justify-end">
                  <Button variant="outline" size="sm">
                    Track Order
                  </Button>
                  {order.status.toLowerCase() !== 'delivered' && order.status.toLowerCase() !== 'cancelled' && (
                    <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                      Cancel Order
                    </Button>
                  )}
                  <Button size="sm">
                    Download Invoice
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}