import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES, PROMOTIONAL_CARDS } from '@/lib/constants';

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = HERO_SLIDES.length;

  // Auto-rotate slides
  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveSlide((current) => (current + 1) % totalSlides);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  const goToPrevSlide = () => {
    setActiveSlide((current) => (current - 1 + totalSlides) % totalSlides);
  };

  const goToNextSlide = () => {
    setActiveSlide((current) => (current + 1) % totalSlides);
  };

  return (
    <section className="w-full bg-white">
      {/* Hero Carousel */}
      <div className="relative overflow-hidden" style={{ height: '400px' }}>
        {/* Carousel Items */}
        <div className="relative h-full">
          {HERO_SLIDES.map((slide, index) => (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <div className={`h-full w-full bg-gradient-to-r ${slide.bgColor} flex items-center`}>
                <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center">
                  <div className="w-full md:w-1/2 text-white space-y-4 mb-8 md:mb-0">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{slide.title}</h1>
                    <p className="text-lg md:text-xl opacity-90">{slide.description}</p>
                    <Button 
                      asChild
                      className="bg-white text-primary hover:bg-gray-100 px-6 py-3"
                    >
                      <Link href="/products">{slide.buttonText}</Link>
                    </Button>
                  </div>
                  <div className="w-full md:w-1/2 flex justify-center">
                    <img 
                      src={slide.imageUrl} 
                      alt={slide.title} 
                      className="max-h-72 object-contain rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Navigation Arrows */}
        <button 
          onClick={goToPrevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button 
          onClick={goToNextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white z-20"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Carousel Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {HERO_SLIDES.map((_, index) => (
            <button 
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === activeSlide ? 'bg-white' : 'bg-white opacity-50 hover:opacity-100'
              } transition-opacity`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Promotional Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROMOTIONAL_CARDS.map(card => (
            <div 
              key={card.id}
              className={`bg-gradient-to-r ${card.bgColor} rounded-lg p-4 text-white flex items-center shadow hover:shadow-lg transition-shadow`}
            >
              <div className="mr-4">
                <img 
                  src={card.imageUrl} 
                  alt={card.title} 
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">{card.title}</h3>
                <p className="text-sm opacity-90">{card.description}</p>
                <Link href="/products" className="text-xs font-medium underline">Shop Now</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
