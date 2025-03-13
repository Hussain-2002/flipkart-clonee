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
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const formatPrice = (price: number) => {
    return `₹${(price / 100).toLocaleString('en-IN')}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#2874f0] shadow-md">
      {/* Primary Navbar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex flex-col items-start">
              <div className="flex items-center">
                <span className="text-xl font-bold text-[#2874f0] italic">Flipkart</span>
              </div>
              <div className="flex items-center text-xs text-gray-500 -mt-1">
                <span className="text-[#9e9e9e] mr-1">Explore</span>
                <span className="text-[#f9cc16] font-medium">Plus</span>
                <span className="text-[#f9cc16] text-xs ml-0.5">+</span>
              </div>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 mx-6">
            <div className="relative w-full max-w-xl">
              <div className="flex items-center bg-white rounded-sm overflow-hidden">
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for products, brands and more..."
                  className="w-full py-3 px-4 pr-10 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#2874f0] hover:bg-[#2874f0] text-white h-full w-12 rounded-none"
                >
                  <Search size={18} />
                </Button>
              </div>
              
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
            {user ? (
              // Logged in - Show account dropdown
              <div className="relative group">
                <button className="flex items-center text-sm font-medium text-white hover:text-gray-100 transition-colors">
                  <User size={16} className="mr-1" /> 
                  {user.fullName.split(' ')[0]}
                  <ChevronDown size={12} className="ml-1" />
                </button>
                {/* Account Dropdown */}
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-sm shadow-lg border border-gray-200 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="py-3 px-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 rounded-full p-2">
                        <User className="h-5 w-5 text-[#2874f0]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Hello, {user.fullName.split(' ')[0]}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">My Profile</Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      <Package size={14} className="inline mr-2 text-gray-500" /> My Orders
                    </Link>
                    <Link href="/wishlist" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      <Heart size={14} className="inline mr-2 text-gray-500" /> My Wishlist
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 border-t border-gray-100 mt-1"
                    >
                      <LogOut size={14} className="inline mr-2 text-gray-500" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Not logged in - Show login button
              <Link 
                href="/auth" 
                className="px-10 py-1 bg-white text-[#2874f0] text-sm font-medium hover:bg-gray-100 transition-colors rounded-sm"
              >
                Login
              </Link>
            )}
            
            <Link 
              href="/wishlist" 
              className="flex flex-col items-center text-sm font-medium text-white hover:text-gray-100"
            >
              <Heart size={16} />
              <span className="text-xs mt-1">Wishlist</span>
            </Link>
            
            <Link 
              href="/orders" 
              className="flex flex-col items-center text-sm font-medium text-white hover:text-gray-100"
            >
              <Package size={16} />
              <span className="text-xs mt-1">Orders</span>
            </Link>
            
            {/* Cart Icon with Count */}
            <button 
              onClick={handleCartClick}
              className="flex flex-col items-center text-sm font-medium text-white hover:text-gray-100 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
              <span className="text-xs mt-1">Cart</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="hidden md:block bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-10 py-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map(category => (
              <div key={category.id} className="relative group">
                <Link 
                  href={`/category/${category.id}`} 
                  className="text-sm font-medium whitespace-nowrap flex flex-col items-center group"
                >
                  <div className="flex flex-col items-center">
                    <img 
                      src={category.imageUrl || `https://rukminim1.flixcart.com/flap/128/128/image/category-icon-${category.id}.png`} 
                      alt={category.name}
                      className="w-16 h-16 object-contain mb-1"
                    />
                    <span className="text-xs group-hover:text-[#2874f0] transition-colors">
                      {category.name}
                      {category.subCategories?.length > 0 && (
                        <ChevronDown size={10} className="inline ml-1" />
                      )}
                    </span>
                  </div>
                </Link>
                {/* Category Dropdown */}
                {category.subCategories?.length > 0 && (
                  <div className="absolute left-0 mt-1 w-60 bg-white rounded-sm shadow-lg border border-gray-200 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
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
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu & Search */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white">
          {/* Mobile Search */}
          <div className="px-4 py-3 bg-[#2874f0]">
            <div className="relative">
              <div className="flex items-center bg-white rounded-sm overflow-hidden">
                <Input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  className="w-full py-2 px-4 pr-10 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#2874f0] hover:bg-[#2874f0] text-white h-full w-10 rounded-none"
                >
                  <Search size={16} />
                </Button>
              </div>
            </div>
          </div>
          
          {/* User Section for Mobile */}
          <div className="bg-white px-4 py-3 border-b border-gray-200">
            {user ? (
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <User className="h-5 w-5 text-[#2874f0]" />
                </div>
                <div>
                  <p className="text-sm font-medium">{user.fullName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            ) : (
              <Link 
                href="/auth"
                className="block w-full py-2 bg-[#2874f0] text-white text-center rounded-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login / Register
              </Link>
            )}
          </div>
          
          {/* Mobile Navigation Links */}
          <nav className="bg-white">
            {/* Flipkart Plus Section */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="mr-3 text-[#2874f0]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Flipkart Plus</p>
                  <p className="text-xs text-gray-500">Superior experience with special rewards</p>
                </div>
              </div>
            </div>
            
            <Link 
              href="/"
              className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Home size={16} className="mr-3 text-gray-500" />
                <span className="text-sm">Home</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
            
            <Link 
              href="/orders"
              className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Package size={16} className="mr-3 text-gray-500" />
                <span className="text-sm">My Orders</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
            
            <Link 
              href="/cart"
              className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <ShoppingCart size={16} className="mr-3 text-gray-500" />
                <span className="text-sm">Cart {cartItemCount > 0 && `(${cartItemCount})`}</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
            
            <Link 
              href="/wishlist"
              className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Heart size={16} className="mr-3 text-gray-500" />
                <span className="text-sm">Wishlist</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
            
            {/* Categories Collapsible Section */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-2">TOP CATEGORIES</p>
              <div className="grid grid-cols-3 gap-3">
                {CATEGORIES.slice(0, 6).map(category => (
                  <Link 
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="flex flex-col items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-1">
                      <img 
                        src={category.imageUrl || `https://rukminim1.flixcart.com/flap/80/80/image/category-icon-${category.id}.png`}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs text-center">{category.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center px-4 py-3 border-b border-gray-100 w-full"
              >
                <LogOut size={16} className="mr-3 text-gray-500" />
                <span className="text-sm">Logout</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
