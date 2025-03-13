import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { openCart } from '@/lib/slices/cartSlice';
import { setSearchQuery, searchProducts } from '@/lib/slices/productSlice';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/lib/constants';
import { 
  ShoppingCart, 
  Heart, 
  Package, 
  User, 
  ChevronDown, 
  Search, 
  Menu, 
  X,
  LogIn,
  LogOut
} from 'lucide-react';

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const dispatch = useDispatch();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  
  const { user, logoutMutation } = useAuth();
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { searchQuery, searchResults } = useSelector((state: RootState) => state.products);
  
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchResultsRef.current && 
        !searchResultsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        dispatch(searchProducts(searchQuery));
        setShowSearchResults(true);
      } else {
        setShowSearchResults(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };
  
  const handleSearchResultClick = () => {
    setShowSearchResults(false);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleCartClick = () => {
    dispatch(openCart());
  };
  
  const formatPrice = (price: number) => {
    return `₹${(price / 100).toLocaleString('en-IN')}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Primary Navbar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center">
              <ShoppingCart className="text-primary mr-2 h-6 w-6" />
              <span className="text-xl font-bold text-primary">ShopEase</span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 mx-6">
            <div className="relative w-full max-w-xl">
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search for products, brands and more..."
                className="w-full py-2 px-4 pr-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
              >
                <Search size={16} />
              </Button>
              
              {/* Search Suggestions Panel */}
              {showSearchResults && searchResults.length > 0 && (
                <div 
                  ref={searchResultsRef}
                  className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2"
                >
                  {searchResults.map(result => (
                    <Link 
                      key={result.id} 
                      href={`/product/${result.id}`}
                      onClick={handleSearchResultClick}
                      className="flex items-center px-4 py-2 hover:bg-gray-100"
                    >
                      <img 
                        src={result.imageUrl} 
                        alt={result.name} 
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium">{result.name}</p>
                        <p className="text-xs text-gray-500">{result.category}</p>
                      </div>
                      <span className="ml-auto text-sm font-semibold">
                        {formatPrice(result.price)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/wishlist" 
              className="flex items-center text-sm font-medium hover:text-primary transition-colors"
            >
              <Heart size={16} className="mr-1" /> Wishlist
            </Link>
            <Link 
              href="/orders" 
              className="flex items-center text-sm font-medium hover:text-primary transition-colors"
            >
              <Package size={16} className="mr-1" /> Orders
            </Link>
            <div className="relative group">
              <button className="flex items-center text-sm font-medium hover:text-primary transition-colors">
                <User size={16} className="mr-1" /> Account
                <ChevronDown size={12} className="ml-1" />
              </button>
              {/* Account Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="py-2 px-4 border-b border-gray-100">
                  <p className="text-sm font-medium">Welcome</p>
                  <p className="text-xs text-gray-500">Access account & orders</p>
                </div>
                <div className="py-2">
                  <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">My Profile</Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-gray-100">My Orders</Link>
                  <Link href="/wishlist" className="block px-4 py-2 text-sm hover:bg-gray-100">My Wishlist</Link>
                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Logout</button>
                </div>
              </div>
            </div>
            {/* Cart Icon with Count */}
            <button 
              onClick={handleCartClick}
              className="relative flex items-center text-sm font-medium hover:text-primary transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-500 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="hidden md:block border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8 py-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map(category => (
              <div key={category.id} className="relative group">
                <Link 
                  href={`/category/${category.id}`} 
                  className="text-sm font-medium hover:text-primary whitespace-nowrap flex items-center"
                >
                  {category.name}
                  <ChevronDown size={12} className="ml-1" />
                </Link>
                {/* Category Dropdown */}
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                  <div className="py-2">
                    {category.subCategories.map((subCategory, index) => (
                      <Link 
                        key={index} 
                        href={`/category/${category.id}/${subCategory.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {subCategory}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu & Search */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          {/* Mobile Search */}
          <div className="px-4 py-3 bg-gray-50">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for products..."
                className="w-full py-2 px-4 pr-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
              >
                <Search size={16} />
              </Button>
            </div>
          </div>
          
          {/* Mobile Navigation Links */}
          <nav className="px-4 py-2 space-y-1 border-t border-gray-200">
            <Link 
              href="/"
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            {CATEGORIES.map(category => (
              <Link 
                key={category.id}
                href={`/category/${category.id}`}
                className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <Link 
              href="/wishlist"
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Wishlist
            </Link>
            <Link 
              href="/cart"
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cart {cartItemCount > 0 && `(${cartItemCount})`}
            </Link>
            <Link 
              href="/orders"
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Orders
            </Link>
            <Link 
              href="/profile"
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
