import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertProductSchema, 
  insertCartItemSchema,
  insertWishlistItemSchema,
  insertOrderSchema,
  insertOrderItemSchema
} from "@shared/schema";
import { PRODUCTS, CATEGORIES } from "../client/src/lib/constants";

// Type for sessions
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

// Authentication middleware
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized - Please login" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes prefix
  const apiRouter = app.route("/api");
  
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Create user (password should be hashed in production)
      const user = await storage.createUser({
        username: validatedData.username,
        password: validatedData.password, // In production, hash this password
        email: validatedData.email,
        fullName: validatedData.fullName,
        phoneNumber: validatedData.phoneNumber,
        address: validatedData.address
      });
      
      // Set session
      req.session.userId = user.id;
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Find user
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) { // In production, compare hashed passwords
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set session
      req.session.userId = user.id;
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
  
  app.get("/api/auth/user", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const user = await storage.getUser(req.session.userId);
      
      if (!user) {
        req.session.destroy((err) => {
          if (err) console.error("Error destroying invalid session:", err);
        });
        return res.status(401).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      // In a real app, these would come from the database
      res.status(200).json(PRODUCTS);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = PRODUCTS.find(p => p.id === productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      // In a real app, these would come from the database
      res.status(200).json(CATEGORIES);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/categories/:id", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const category = CATEGORIES.find(c => c.id === categoryId);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Products by category
  app.get("/api/categories/:id/products", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const products = PRODUCTS.filter(p => p.categoryId === categoryId);
      
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Search products
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(200).json([]);
      }
      
      const results = PRODUCTS
        .filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
        .map(product => ({
          id: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.discountPrice || product.price,
          category: CATEGORIES.find(c => c.id === product.categoryId)?.name || '',
        }));
      
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Order routes
  app.post("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const { items, shippingAddress, paymentMethod, totalAmount } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Order must contain at least one item" });
      }
      
      // Create order
      const order = await storage.createOrder({
        userId: req.session.userId as number,
        totalAmount,
        status: "pending",
        shippingAddress,
        paymentMethod,
      });
      
      // Create order items
      const orderItemPromises = items.map(item => {
        return storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });
      });
      
      const orderItems = await Promise.all(orderItemPromises);
      
      // Return the created order with items
      res.status(201).json({
        ...order,
        items: orderItems,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/orders", isAuthenticated, async (req, res) => {
    try {
      // Get orders for the current user
      const orders = await storage.getOrders(req.session.userId);
      
      // Get items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          return {
            ...order,
            items,
          };
        })
      );
      
      res.status(200).json(ordersWithItems);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/orders/:id", isAuthenticated, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrderById(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Ensure the order belongs to the current user
      if (order.userId !== req.session.userId) {
        return res.status(403).json({ message: "You don't have permission to view this order" });
      }
      
      // Get order items
      const items = await storage.getOrderItems(orderId);
      
      res.status(200).json({
        ...order,
        items,
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
