import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertProductSchema, 
  insertCartItemSchema,
  insertWishlistItemSchema,
  insertOrderSchema
} from "@shared/schema";
import { PRODUCTS, CATEGORIES } from "../client/src/lib/constants";

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
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
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

  const httpServer = createServer(app);

  return httpServer;
}
