import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '@/lib/slices/productSlice';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import ProductListingSection from '@/components/home/ProductListingSection';
import FlashSaleSection from '@/components/home/FlashSaleSection';

export default function Home() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <main>
      <HeroSection />
      <CategorySection />
      <ProductListingSection />
      <FlashSaleSection />
    </main>
  );
}
