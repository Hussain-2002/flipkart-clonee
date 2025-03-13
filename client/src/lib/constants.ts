export const CATEGORIES = [
  {
    id: 1,
    name: "Electronics",
    icon: "fas fa-mobile-alt",
    subCategories: ["Smartphones", "Laptops", "Audio", "Cameras", "Accessories"],
    color: "blue"
  },
  {
    id: 2,
    name: "Fashion",
    icon: "fas fa-tshirt",
    subCategories: ["Men's Clothing", "Women's Clothing", "Shoes", "Watches", "Accessories"],
    color: "green"
  },
  {
    id: 3,
    name: "Home",
    icon: "fas fa-couch",
    subCategories: ["Furniture", "Kitchen", "Bedding", "Decor", "Appliances"],
    color: "red"
  },
  {
    id: 4,
    name: "Books",
    icon: "fas fa-book",
    subCategories: ["Fiction", "Non-Fiction", "Educational", "Comics", "Magazines"],
    color: "yellow"
  },
  {
    id: 5,
    name: "Beauty",
    icon: "fas fa-spa",
    subCategories: ["Skincare", "Makeup", "Haircare", "Fragrances", "Personal Care"],
    color: "pink"
  },
  {
    id: 6,
    name: "Sports",
    icon: "fas fa-futbol",
    subCategories: ["Fitness", "Outdoor", "Team Sports", "Water Sports", "Cycling"],
    color: "indigo"
  }
];

export const PRODUCTS = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    description: "Noise cancelling with 30h battery life",
    price: 799900, // in paisa (INR 7,999)
    discountPrice: 599900, // in paisa (INR 5,999)
    discountPercentage: 25,
    rating: 4.5,
    reviewCount: 128,
    categoryId: 1,
    brand: "SoundMax",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80",
    stock: 50
  },
  {
    id: 2,
    name: "Gaming Laptop 15.6\"",
    description: "16GB RAM, 512GB SSD, RTX 3060",
    price: 8999900, // in paisa (INR 89,999)
    discountPrice: 7649900, // in paisa (INR 76,499)
    discountPercentage: 15,
    rating: 4.0,
    reviewCount: 86,
    categoryId: 1,
    brand: "TechPro",
    imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80",
    stock: 10
  },
  {
    id: 3,
    name: "Pro Running Shoes",
    description: "Lightweight sports shoes with cushioning",
    price: 649900, // in paisa (INR 6,499)
    discountPrice: 449900, // in paisa (INR 4,499)
    discountPercentage: 31,
    rating: 5.0,
    reviewCount: 219,
    categoryId: 2,
    brand: "SportFlex",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80",
    stock: 75
  },
  {
    id: 4,
    name: "Premium Smartwatch",
    description: "Fitness tracker with heart rate monitor",
    price: 1299900, // in paisa (INR 12,999)
    discountPrice: 1049900, // in paisa (INR 10,499)
    discountPercentage: 19,
    rating: 4.5,
    reviewCount: 156,
    categoryId: 1,
    brand: "FitTech",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80",
    stock: 30
  },
  {
    id: 5,
    name: "Wireless Earbuds Pro",
    description: "Superior sound quality with noise cancellation",
    price: 499900, // in paisa (INR 4,999)
    discountPrice: 299900, // in paisa (INR 2,999)
    discountPercentage: 40,
    rating: 4.7,
    reviewCount: 325,
    categoryId: 1,
    brand: "AudioPlus",
    imageUrl: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80",
    stock: 15
  },
  {
    id: 6,
    name: "Vintage Polaroid Camera",
    description: "Instant photo printing with classic design",
    price: 699900, // in paisa (INR 6,999)
    discountPrice: 349900, // in paisa (INR 3,499)
    discountPercentage: 50,
    rating: 4.0,
    reviewCount: 89,
    categoryId: 1,
    brand: "RetroSnap",
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80",
    stock: 8
  },
  {
    id: 7,
    name: "Bluetooth Party Speaker",
    description: "Powerful bass with RGB lighting effects",
    price: 449900, // in paisa (INR 4,499)
    discountPrice: 179900, // in paisa (INR 1,799)
    discountPercentage: 60,
    rating: 5.0,
    reviewCount: 112,
    categoryId: 1,
    brand: "BeatBox",
    imageUrl: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80",
    stock: 20
  },
  {
    id: 8,
    name: "Smart Fitness Watch",
    description: "Health monitoring with exercise tracking",
    price: 799900, // in paisa (INR 7,999)
    discountPrice: 599900, // in paisa (INR 5,999)
    discountPercentage: 25,
    rating: 4.2,
    reviewCount: 178,
    categoryId: 1,
    brand: "FitTech",
    imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80",
    stock: 25
  }
];

export const HERO_SLIDES = [
  {
    id: 1,
    title: "Festival Season Sale",
    description: "Up to 70% off on electronics, fashion & more",
    buttonText: "Shop Now",
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    bgColor: "from-indigo-900 to-purple-800"
  },
  {
    id: 2,
    title: "New Arrivals",
    description: "Discover the latest products just added to our store",
    buttonText: "Explore Now",
    imageUrl: "https://images.unsplash.com/photo-1592842127677-c5166c90a7bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    bgColor: "from-blue-800 to-cyan-700"
  },
  {
    id: 3,
    title: "Premium Collection",
    description: "Luxury products for the discerning customer",
    buttonText: "View Collection",
    imageUrl: "https://images.unsplash.com/photo-1646641505974-394e56991a24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    bgColor: "from-red-900 to-amber-800"
  }
];

export const PROMOTIONAL_CARDS = [
  {
    id: 1,
    title: "Fashion Sale",
    description: "Up to 50% off",
    imageUrl: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
    bgColor: "from-pink-500 to-rose-500"
  },
  {
    id: 2,
    title: "Tech Deals",
    description: "Latest gadgets on sale",
    imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
    bgColor: "from-cyan-500 to-blue-500"
  },
  {
    id: 3,
    title: "Home Essentials",
    description: "New arrivals 30% off",
    imageUrl: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
    bgColor: "from-amber-500 to-orange-500"
  }
];

export const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Best Rating" }
];

export const FLASH_SALE_TIME = {
  hours: 8,
  minutes: 45,
  seconds: 32
};
