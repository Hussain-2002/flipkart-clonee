import { useState } from 'react';
import { Link } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the newsletter subscription
    console.log('Newsletter subscription for:', email);
    setEmail('');
    // Show success message or handle errors
  };

  return (
    <footer className="bg-gray-800 text-gray-200">
      {/* Newsletter Subscription */}
      <div className="container mx-auto px-4 py-8 border-b border-gray-700">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-xl font-bold mb-2">Subscribe to our Newsletter</h3>
          <p className="text-gray-400 mb-4">Get the latest updates, deals and exclusive offers straight to your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
      
      {/* Footer Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h4 className="font-bold text-lg mb-4">About Flipkart</h4>
            <p className="text-gray-400 text-sm mb-4">Flipkart is a modern e-commerce platform offering a wide range of products with amazing deals and discounts.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">Shop</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-white transition-colors">Categories</Link></li>
              <li><Link href="/flash-sale" className="text-gray-400 hover:text-white transition-colors">Flash Sale</Link></li>
              <li><Link href="/new-arrivals" className="text-gray-400 hover:text-white transition-colors">New Arrivals</Link></li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/profile" className="text-gray-400 hover:text-white transition-colors">My Account</Link></li>
              <li><Link href="/track-order" className="text-gray-400 hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="/wishlist" className="text-gray-400 hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors">Customer Support</Link></li>
              <li><Link href="/returns" className="text-gray-400 hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin size={16} className="mt-1 mr-2 text-gray-400" />
                <span className="text-gray-400">123 Commerce Street, Business District, New Delhi, India</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-gray-400" />
                <span className="text-gray-400">+91 1234567890</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-gray-400" />
                <span className="text-gray-400">support@flipkart.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 text-center md:text-left">© 2023 Flipkart. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <img src="https://cdn.pixabay.com/photo/2015/05/26/09/37/paypal-784404_1280.png" alt="PayPal" className="h-6" />
            <img src="https://cdn.pixabay.com/photo/2021/12/08/05/16/visa-6855547_1280.png" alt="Visa" className="h-6" />
            <img src="https://cdn.pixabay.com/photo/2015/05/26/09/37/master-card-784410_1280.png" alt="MasterCard" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
}
