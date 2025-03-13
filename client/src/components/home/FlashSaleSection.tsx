import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/lib/slices/cartSlice';
import { PRODUCTS, FLASH_SALE_TIME } from '@/lib/constants';

export default function FlashSaleSection() {
  const [time, setTime] = useState(FLASH_SALE_TIME);
  const carouselRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  
  // Filter products with high discount percentage for flash sale
  const flashSaleProducts = PRODUCTS.filter(product => product.discountPercentage >= 25)
    .sort((a, b) => b.discountPercentage - a.discountPercentage);
  
  // Countdown timer
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(prevTime => {
        const newSeconds = prevTime.seconds - 1;
        
        if (newSeconds >= 0) {
          return { ...prevTime, seconds: newSeconds };
        }
        
        const newMinutes = prevTime.minutes - 1;
        
        if (newMinutes >= 0) {
          return { ...prevTime, minutes: newMinutes, seconds: 59 };
        }
        
        const newHours = prevTime.hours - 1;
        
        if (newHours >= 0) {
          return { hours: newHours, minutes: 59, seconds: 59 };
        }
        
        // Reset timer when it reaches 0
        return FLASH_SALE_TIME;
      });
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };
  
  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Flash Sale</h2>
            <p className="text-gray-600">Deals end in</p>
          </div>
          
          {/* Countdown Timer */}
          <div className="flex items-center space-x-2 mt-2 sm:mt-0 bg-white px-4 py-2 rounded-lg shadow">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{formatNumber(time.hours)}</div>
              <div className="text-xs text-gray-500">Hours</div>
            </div>
            <div className="text-xl font-bold text-gray-900">:</div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{formatNumber(time.minutes)}</div>
              <div className="text-xs text-gray-500">Mins</div>
            </div>
            <div className="text-xl font-bold text-gray-900">:</div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{formatNumber(time.seconds)}</div>
              <div className="text-xs text-gray-500">Secs</div>
            </div>
          </div>
        </div>

        {/* Flash Sale Products Carousel */}
        <div className="relative">
          {/* Products Wrapper */}
          <div 
            ref={carouselRef}
            className="overflow-x-auto flex space-x-4 pb-4 -mx-4 px-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {flashSaleProducts.map(product => (
              <div 
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex-shrink-0 w-64"
              >
                {/* Sale Badge */}
                <div className="relative">
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.discountPercentage}%
                  </div>
                  <Link href={`/product/${product.id}`}>
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-48 object-contain p-4"
                    />
                  </Link>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center space-x-1 mb-1">
                    {[...Array(5)].map((_, index) => {
                      const rating = Math.floor(product.rating);
                      const hasHalfStar = product.rating % 1 >= 0.5;
                      
                      if (index < rating) {
                        return <i key={index} className="fas fa-star text-yellow-400 text-xs"></i>;
                      } else if (index === rating && hasHalfStar) {
                        return <i key={index} className="fas fa-star-half-alt text-yellow-400 text-xs"></i>;
                      } else {
                        return <i key={index} className="far fa-star text-yellow-400 text-xs"></i>;
                      }
                    })}
                    <span className="text-xs text-gray-500 ml-1">{product.rating}</span>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                  <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-lg font-semibold text-gray-900">
                      ₹{(product.discountPrice / 100).toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{(product.price / 100).toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  {/* Progress Bar for Stock */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(90, Math.floor(Math.random() * 100))}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {Math.floor(Math.random() * 90) + 10}% sold
                    {Math.random() > 0.7 ? ' - Hurry!' : ''}
                  </div>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-primary-dark text-white py-2"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <Button 
            variant="secondary"
            className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-100 z-10 focus:outline-none hidden md:flex"
            onClick={scrollLeft}
          >
            <ChevronLeft size={20} />
          </Button>
          <Button 
            variant="secondary"
            className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-100 z-10 focus:outline-none hidden md:flex"
            onClick={scrollRight}
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </section>
  );
}
