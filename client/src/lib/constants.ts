export const CATEGORIES = [
  {
    id: 1,
    name: "Electronics",
    icon: "fas fa-mobile-alt",
    subCategories: ["Smartphones", "Laptops", "Audio", "Cameras", "Accessories"],
    color: "blue",
    imageUrl: "https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png"
  },
  {
    id: 2,
    name: "Fashion",
    icon: "fas fa-tshirt",
    subCategories: ["Men's Clothing", "Women's Clothing", "Shoes", "Watches", "Accessories"],
    color: "green",
    imageUrl: "https://rukminim1.flixcart.com/flap/128/128/image/c12afc017e6f24cb.png"
  },
  {
    id: 3,
    name: "Home",
    icon: "fas fa-couch",
    subCategories: ["Furniture", "Kitchen", "Bedding", "Decor", "Appliances"],
    color: "red",
    imageUrl: "https://rukminim1.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg"
  },
  {
    id: 4,
    name: "Appliances",
    icon: "fas fa-book",
    subCategories: ["TVs", "Refrigerators", "Washing Machines", "Air Conditioners", "Microwaves"],
    color: "yellow",
    imageUrl: "https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png"
  },
  {
    id: 5,
    name: "Beauty",
    icon: "fas fa-spa",
    subCategories: ["Skincare", "Makeup", "Haircare", "Fragrances", "Personal Care"],
    color: "pink",
    imageUrl: "https://rukminim1.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png"
  },
  {
    id: 6,
    name: "Toys",
    icon: "fas fa-futbol",
    subCategories: ["Remote Control Toys", "Educational Toys", "Soft Toys", "Action Figures", "Board Games"],
    color: "indigo",
    imageUrl: "https://rukminim1.flixcart.com/flap/128/128/image/69c6589653afdb9a.png"
  },
  {
    id: 7,
    name: "Grocery",
    icon: "fas fa-shopping-basket",
    subCategories: ["Staples", "Snacks", "Beverages", "Personal Care", "Household"],
    color: "green",
    imageUrl: "https://rukminim1.flixcart.com/flap/128/128/image/29327f40e9c4d26b.png"
  },
  {
    id: 8,
    name: "Mobiles",
    icon: "fas fa-mobile-alt",
    subCategories: ["iPhone", "Samsung", "Xiaomi", "Realme", "OPPO"],
    color: "blue",
    imageUrl: "https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png"
  }
];

// Generate a function to create products with unique IDs
// Create a base URL for all images
const IMAGE_BASE_URL = '/images/products';

// For development testing, use placeholder images from picsum.photos
const getPlaceholderImage = (id) => `https://picsum.photos/id/${200 + id}/400/400`;

function generateProducts() {
  const products = [];
  let id = 1;

  // Electronics Products (Category ID: 1) - 40 products
  const electronicsBrands = ["Apple", "Samsung", "Sony", "Bose", "JBL", "Philips", "Canon", "Nikon", "HP", "Dell", "Lenovo", "Asus", "Xiaomi", "OnePlus", "LG"];
  const electronicsNames = [
    "Premium Wireless Headphones", "Gaming Laptop 15.6\"", "4K Smart TV", "DSLR Camera", "Wireless Earbuds", 
    "Bluetooth Speaker", "Smart Fitness Tracker", "Tablet Pro", "Ultrabook", "Professional Microphone",
    "Home Theater System", "Gaming Console", "Drone with 4K Camera", "Curved Monitor", "Wireless Mouse",
    "Mechanical Keyboard", "External SSD", "Smart Home Hub", "Portable Power Bank", "Wi-Fi Router"
  ];
  
  for (let i = 0; i < 40; i++) {
    const price = Math.floor(Math.random() * 5000000) + 499900; // Between INR 4,999 and 54,999
    const discountPercentage = Math.floor(Math.random() * 30) + 10; // Between 10% and 40%
    const discountPrice = Math.floor(price * (1 - discountPercentage / 100));
    
    products.push({
      id: id++,
      name: `${electronicsBrands[i % electronicsBrands.length]} ${electronicsNames[i % electronicsNames.length]} ${i + 1}`,
      description: `High-quality electronics product with premium features and specifications.`,
      price: price,
      discountPrice: discountPrice,
      discountPercentage: discountPercentage,
      rating: (Math.floor(Math.random() * 20) + 30) / 10, // Between 3.0 and 5.0
      reviewCount: Math.floor(Math.random() * 300) + 50, // Between 50 and 350
      categoryId: 1,
      brand: electronicsBrands[i % electronicsBrands.length],
      imageUrl: `https://flipkart-images.vercel.app/electronics/${i % 20 + 1}.jpg`,
      stock: Math.floor(Math.random() * 50) + 5 // Between 5 and 55
    });
  }
  
  // Fashion Products (Category ID: 2) - 40 products
  const fashionBrands = ["Adidas", "Nike", "Puma", "Levis", "Zara", "H&M", "Calvin Klein", "Tommy Hilfiger", "Gap", "Reebok", "Under Armour", "Forever 21", "Gucci", "Fossil", "Michael Kors"];
  const fashionNames = [
    "Running Shoes", "Slim Fit Jeans", "Formal Shirt", "Designer Watch", "Leather Handbag", 
    "Casual T-Shirt", "Sport Shorts", "Winter Jacket", "Stylish Sunglasses", "Dress Sandals",
    "Workout Leggings", "Cotton Socks", "Denim Jacket", "Formal Suit", "Leather Belt",
    "Graphic Tee", "High Heels", "Backpack", "Woolen Sweater", "Athletic Shorts"
  ];
  
  for (let i = 0; i < 40; i++) {
    const price = Math.floor(Math.random() * 500000) + 99900; // Between INR 999 and 5,999
    const discountPercentage = Math.floor(Math.random() * 40) + 10; // Between 10% and 50%
    const discountPrice = Math.floor(price * (1 - discountPercentage / 100));
    
    products.push({
      id: id++,
      name: `${fashionBrands[i % fashionBrands.length]} ${fashionNames[i % fashionNames.length]} ${i + 1}`,
      description: `Trendy fashion item with premium materials and comfort.`,
      price: price,
      discountPrice: discountPrice,
      discountPercentage: discountPercentage,
      rating: (Math.floor(Math.random() * 20) + 30) / 10, // Between 3.0 and 5.0
      reviewCount: Math.floor(Math.random() * 200) + 30, // Between 30 and 230
      categoryId: 2,
      brand: fashionBrands[i % fashionBrands.length],
      imageUrl: `https://flipkart-images.vercel.app/fashion/${i % 20 + 1}.jpg`,
      stock: Math.floor(Math.random() * 100) + 10 // Between 10 and 110
    });
  }
  
  // Home Products (Category ID: 3) - 20 products
  const homeBrands = ["IKEA", "Urban Ladder", "Home Centre", "Bed Bath & Beyond", "Pottery Barn", "Crate & Barrel", "Ashley HomeStore", "Goodhome", "Nilkamal", "Godrej Interio"];
  const homeNames = [
    "Sofa Set", "Dining Table", "Bedside Lamp", "Wall Shelf", "Bean Bag", 
    "Coffee Table", "Kitchen Cabinet", "Study Desk", "Wardrobe", "Floor Mat"
  ];
  
  for (let i = 0; i < 20; i++) {
    const price = Math.floor(Math.random() * 5000000) + 299900; // Between INR 2,999 and 52,999
    const discountPercentage = Math.floor(Math.random() * 35) + 5; // Between 5% and 40%
    const discountPrice = Math.floor(price * (1 - discountPercentage / 100));
    
    products.push({
      id: id++,
      name: `${homeBrands[i % homeBrands.length]} ${homeNames[i % homeNames.length]} ${i + 1}`,
      description: `Quality home furniture and decor for modern living.`,
      price: price,
      discountPrice: discountPrice,
      discountPercentage: discountPercentage,
      rating: (Math.floor(Math.random() * 15) + 35) / 10, // Between 3.5 and 5.0
      reviewCount: Math.floor(Math.random() * 150) + 20, // Between 20 and 170
      categoryId: 3,
      brand: homeBrands[i % homeBrands.length],
      imageUrl: `https://flipkart-images.vercel.app/home/${i % 15 + 1}.jpg`,
      stock: Math.floor(Math.random() * 30) + 5 // Between 5 and 35
    });
  }
  
  // Appliances Products (Category ID: 4) - 20 products
  const appliancesBrands = ["LG", "Samsung", "Whirlpool", "Bosch", "Philips", "Havells", "Bajaj", "Prestige", "Godrej", "Panasonic"];
  const appliancesNames = [
    "Refrigerator", "Washing Machine", "Microwave Oven", "Air Conditioner", "Water Purifier", 
    "Air Fryer", "Mixer Grinder", "Induction Cooktop", "Electric Kettle", "Vacuum Cleaner"
  ];
  
  for (let i = 0; i < 20; i++) {
    const price = Math.floor(Math.random() * 8000000) + 499900; // Between INR 4,999 and 84,999
    const discountPercentage = Math.floor(Math.random() * 25) + 10; // Between 10% and 35%
    const discountPrice = Math.floor(price * (1 - discountPercentage / 100));
    
    products.push({
      id: id++,
      name: `${appliancesBrands[i % appliancesBrands.length]} ${appliancesNames[i % appliancesNames.length]} ${i + 1}`,
      description: `Energy-efficient home appliance with advanced features.`,
      price: price,
      discountPrice: discountPrice,
      discountPercentage: discountPercentage,
      rating: (Math.floor(Math.random() * 15) + 35) / 10, // Between 3.5 and 5.0
      reviewCount: Math.floor(Math.random() * 200) + 30, // Between 30 and 230
      categoryId: 4,
      brand: appliancesBrands[i % appliancesBrands.length],
      imageUrl: `https://flipkart-images.vercel.app/appliances/${i % 15 + 1}.jpg`,
      stock: Math.floor(Math.random() * 25) + 3 // Between 3 and 28
    });
  }
  
  // Beauty Products (Category ID: 5) - 15 products
  const beautyBrands = ["Lakme", "Maybelline", "MAC", "L'Oreal", "Forest Essentials", "Kama Ayurveda", "The Body Shop", "Nivea", "Biotique", "Dove"];
  const beautyNames = [
    "Face Serum", "Lipstick", "Facial Cleanser", "Moisturizer", "Mascara", 
    "Eyeshadow Palette", "Hair Shampoo", "Body Lotion", "Sunscreen", "Face Mask"
  ];
  
  for (let i = 0; i < 15; i++) {
    const price = Math.floor(Math.random() * 200000) + 29900; // Between INR 299 and 2,299
    const discountPercentage = Math.floor(Math.random() * 30) + 10; // Between 10% and 40%
    const discountPrice = Math.floor(price * (1 - discountPercentage / 100));
    
    products.push({
      id: id++,
      name: `${beautyBrands[i % beautyBrands.length]} ${beautyNames[i % beautyNames.length]} ${i + 1}`,
      description: `Premium beauty product for skincare and personal care.`,
      price: price,
      discountPrice: discountPrice,
      discountPercentage: discountPercentage,
      rating: (Math.floor(Math.random() * 15) + 35) / 10, // Between 3.5 and 5.0
      reviewCount: Math.floor(Math.random() * 300) + 50, // Between 50 and 350
      categoryId: 5,
      brand: beautyBrands[i % beautyBrands.length],
      imageUrl: `https://flipkart-images.vercel.app/beauty/${i % 15 + 1}.jpg`,
      stock: Math.floor(Math.random() * 40) + 10 // Between 10 and 50
    });
  }
  
  // Toys Products (Category ID: 6) - 10 products
  const toysBrands = ["Lego", "Barbie", "Hot Wheels", "Nerf", "Fisher-Price", "Funskool", "Hasbro", "Disney", "Marvel", "Nintendo"];
  const toysNames = [
    "Building Blocks", "Action Figure", "Remote Car", "Board Game", "Educational Toy", 
    "Stuffed Animal", "Dollhouse", "Puzzle Set", "Robot Kit", "Card Game"
  ];
  
  for (let i = 0; i < 10; i++) {
    const price = Math.floor(Math.random() * 300000) + 19900; // Between INR 199 and 3,199
    const discountPercentage = Math.floor(Math.random() * 35) + 5; // Between 5% and 40%
    const discountPrice = Math.floor(price * (1 - discountPercentage / 100));
    
    products.push({
      id: id++,
      name: `${toysBrands[i % toysBrands.length]} ${toysNames[i % toysNames.length]} ${i + 1}`,
      description: `Fun and educational toy for children of all ages.`,
      price: price,
      discountPrice: discountPrice,
      discountPercentage: discountPercentage,
      rating: (Math.floor(Math.random() * 20) + 30) / 10, // Between 3.0 and 5.0
      reviewCount: Math.floor(Math.random() * 150) + 20, // Between 20 and 170
      categoryId: 6,
      brand: toysBrands[i % toysBrands.length],
      imageUrl: `https://flipkart-images.vercel.app/toys/${i % 10 + 1}.jpg`,
      stock: Math.floor(Math.random() * 35) + 5 // Between 5 and 40
    });
  }
  
  // Grocery Products (Category ID: 7) - 15 products
  const groceryBrands = ["Tata", "Amul", "Nestle", "Britannia", "Parle", "ITC", "Patanjali", "Dabur", "MTR", "Haldiram's"];
  const groceryNames = [
    "Premium Tea", "Whole Wheat Flour", "Organic Honey", "Cheese Slices", "Instant Noodles", 
    "Brown Rice", "Mixed Spices", "Protein Bar", "Breakfast Cereal", "Mixed Dry Fruits"
  ];
  
  for (let i = 0; i < 15; i++) {
    const price = Math.floor(Math.random() * 100000) + 4900; // Between INR 49 and 1,049
    const discountPercentage = Math.floor(Math.random() * 25) + 5; // Between 5% and 30%
    const discountPrice = Math.floor(price * (1 - discountPercentage / 100));
    
    products.push({
      id: id++,
      name: `${groceryBrands[i % groceryBrands.length]} ${groceryNames[i % groceryNames.length]} ${i + 1}`,
      description: `Fresh and high-quality grocery item for daily needs.`,
      price: price,
      discountPrice: discountPrice,
      discountPercentage: discountPercentage,
      rating: (Math.floor(Math.random() * 15) + 35) / 10, // Between 3.5 and 5.0
      reviewCount: Math.floor(Math.random() * 200) + 50, // Between 50 and 250
      categoryId: 7,
      brand: groceryBrands[i % groceryBrands.length],
      imageUrl: `https://flipkart-images.vercel.app/grocery/${i % 15 + 1}.jpg`,
      stock: Math.floor(Math.random() * 100) + 20 // Between 20 and 120
    });
  }
  
  // Mobile Products (Category ID: 8) - 20 products
  const mobileBrands = ["Apple", "Samsung", "Xiaomi", "OnePlus", "Realme", "OPPO", "Vivo", "Motorola", "Google", "Nokia"];
  const mobileNames = [
    "Smartphone Pro", "Foldable Phone", "Ultra Slim", "5G Phone", "Note Series", 
    "Camera Phone", "Gaming Phone", "Budget Phone", "Mini Phone", "Plus Series"
  ];
  
  for (let i = 0; i < 20; i++) {
    const price = Math.floor(Math.random() * 10000000) + 799900; // Between INR 7,999 and 107,999
    const discountPercentage = Math.floor(Math.random() * 30) + 5; // Between 5% and 35%
    const discountPrice = Math.floor(price * (1 - discountPercentage / 100));
    
    products.push({
      id: id++,
      name: `${mobileBrands[i % mobileBrands.length]} ${mobileNames[i % mobileNames.length]} ${i + 1}`,
      description: `Feature-rich smartphone with latest technology and specifications.`,
      price: price,
      discountPrice: discountPrice,
      discountPercentage: discountPercentage,
      rating: (Math.floor(Math.random() * 15) + 35) / 10, // Between 3.5 and 5.0
      reviewCount: Math.floor(Math.random() * 500) + 100, // Between 100 and 600
      categoryId: 8,
      brand: mobileBrands[i % mobileBrands.length],
      imageUrl: `https://flipkart-images.vercel.app/mobiles/${i % 20 + 1}.jpg`,
      stock: Math.floor(Math.random() * 30) + 5 // Between 5 and 35
    });
  }
  
  return products;
}

export const PRODUCTS = generateProducts();

export const HERO_SLIDES = [
  {
    id: 1,
    title: "Festival Season Sale",
    description: "Up to 70% off on electronics, fashion & more",
    buttonText: "Shop Now",
    imageUrl: "https://flipkart-images.vercel.app/banners/festival-sale.jpg",
    bgColor: "from-indigo-900 to-purple-800"
  },
  {
    id: 2,
    title: "New Arrivals",
    description: "Discover the latest products just added to our store",
    buttonText: "Explore Now",
    imageUrl: "https://flipkart-images.vercel.app/banners/new-arrivals.jpg",
    bgColor: "from-blue-800 to-cyan-700"
  },
  {
    id: 3,
    title: "Premium Collection",
    description: "Luxury products for the discerning customer",
    buttonText: "View Collection",
    imageUrl: "https://flipkart-images.vercel.app/banners/premium-collection.jpg",
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
