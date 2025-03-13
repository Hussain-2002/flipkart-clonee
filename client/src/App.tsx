import { Switch, Route } from "wouter";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { store } from "./lib/store";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";

import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetails from "@/pages/product-details";
import Cart from "@/pages/cart";
import Wishlist from "@/pages/wishlist";
import Orders from "@/pages/orders";
import Checkout from "@/pages/checkout";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/product/:id" component={ProductDetails} />
      <Route path="/cart" component={Cart} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Category Routes */}
      <Route path="/category/:categoryId" component={Products} />
      <Route path="/category/:categoryId/:subCategory" component={Products} />
      
      {/* Protected Routes */}
      <ProtectedRoute path="/wishlist" component={Wishlist} />
      <ProtectedRoute path="/orders" component={Orders} />
      <ProtectedRoute path="/checkout" component={Checkout} />
      
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow">
              <Router />
            </div>
            <Footer />
            <CartSidebar />
          </div>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
