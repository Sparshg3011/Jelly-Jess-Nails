import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertServiceSchema, 
  insertGalleryItemSchema, 
  insertBookingSlotSchema, 
  insertBookingSchema,
  insertWaitlistEntrySchema,
  insertContactMessageSchema,
  insertProductZodSchema
} from "@shared/schema";
import { z } from "zod";
import { startEmailWorker } from "./workers/emailWorker";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);
  
  // Start email worker
  startEmailWorker();
  
  // Services routes
  app.get("/api/services", async (req, res) => {
    const services = await storage.getServices();
    res.json(services);
  });
  
  app.get("/api/services/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }
    
    const service = await storage.getService(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    res.json(service);
  });
  
  app.post("/api/services", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create service" });
    }
  });
  
  app.patch("/api/services/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }
    
    try {
      const validatedData = insertServiceSchema.partial().parse(req.body);
      const updatedService = await storage.updateService(id, validatedData);
      
      if (!updatedService) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json(updatedService);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to update service" });
    }
  });
  
  app.delete("/api/services/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }
    
    const success = await storage.deleteService(id);
    if (!success) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    res.status(204).end();
  });
  
  // Gallery routes
  app.get("/api/gallery", async (req, res) => {
    const category = req.query.category as string | undefined;
    const featured = req.query.featured === "true";
    
    let galleryItems;
    if (category) {
      galleryItems = await storage.getGalleryItemsByCategory(category);
    } else if (featured) {
      galleryItems = await storage.getFeaturedGalleryItems();
    } else {
      galleryItems = await storage.getGalleryItems();
    }
    
    res.json(galleryItems);
  });
  
  app.get("/api/gallery/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid gallery item ID" });
    }
    
    const item = await storage.getGalleryItem(id);
    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }
    
    res.json(item);
  });
  
  app.post("/api/gallery", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    try {
      const validatedData = insertGalleryItemSchema.parse(req.body);
      const item = await storage.createGalleryItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create gallery item" });
    }
  });
  
  app.patch("/api/gallery/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid gallery item ID" });
    }
    
    try {
      const validatedData = insertGalleryItemSchema.partial().parse(req.body);
      const updatedItem = await storage.updateGalleryItem(id, validatedData);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Gallery item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to update gallery item" });
    }
  });
  
  app.delete("/api/gallery/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid gallery item ID" });
    }
    
    const success = await storage.deleteGalleryItem(id);
    if (!success) {
      return res.status(404).json({ message: "Gallery item not found" });
    }
    
    res.status(204).end();
  });
  
  // Booking slots routes
  app.get("/api/booking-slots", async (req, res) => {
    const availableOnly = req.query.available === "true";
    
    const slots = availableOnly 
      ? await storage.getAvailableBookingSlots()
      : await storage.getBookingSlots();
    
    res.json(slots);
  });
  
  app.get("/api/booking-slots/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid booking slot ID" });
    }
    
    const slot = await storage.getBookingSlot(id);
    if (!slot) {
      return res.status(404).json({ message: "Booking slot not found" });
    }
    
    res.json(slot);
  });
  
  app.post("/api/booking-slots", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    try {
      console.log("Creating booking slot with data:", req.body);
      
      // Create Date objects from ISO strings if they're strings
      if (typeof req.body.startTime === 'string') {
        req.body.startTime = new Date(req.body.startTime);
      }
      if (typeof req.body.endTime === 'string') {
        req.body.endTime = new Date(req.body.endTime);
      }
      
      const validatedData = insertBookingSlotSchema.parse(req.body);
      console.log("Validated data:", validatedData);
      
      const slot = await storage.createBookingSlot(validatedData);
      res.status(201).json(slot);
    } catch (error) {
      console.error("Error creating booking slot:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      
      // Use a type guard to safely access error.message if it's an Error object
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to create booking slot", error: errorMessage });
    }
  });
  
  app.patch("/api/booking-slots/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid booking slot ID" });
    }
    
    try {
      console.log("Updating booking slot with data:", req.body);
      
      // Create Date objects from ISO strings if they're strings
      if (req.body.startTime && typeof req.body.startTime === 'string') {
        req.body.startTime = new Date(req.body.startTime);
      }
      if (req.body.endTime && typeof req.body.endTime === 'string') {
        req.body.endTime = new Date(req.body.endTime);
      }
      
      const validatedData = insertBookingSlotSchema.partial().parse(req.body);
      console.log("Validated update data:", validatedData);
      
      const updatedSlot = await storage.updateBookingSlot(id, validatedData);
      
      if (!updatedSlot) {
        return res.status(404).json({ message: "Booking slot not found" });
      }
      
      res.json(updatedSlot);
    } catch (error) {
      console.error("Error updating booking slot:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      
      // Use a type guard to safely access error.message if it's an Error object
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: "Failed to update booking slot", error: errorMessage });
    }
  });
  
  app.delete("/api/booking-slots/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid booking slot ID" });
    }
    
    const success = await storage.deleteBookingSlot(id);
    if (!success) {
      return res.status(404).json({ message: "Booking slot not found" });
    }
    
    res.status(204).end();
  });
  
  // Bookings routes
  app.get("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const bookings = await storage.getBookings();
    res.json(bookings);
  });
  
  app.get("/api/bookings/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }
    
    const booking = await storage.getBooking(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.json(booking);
  });
  
  app.post("/api/bookings", async (req, res) => {
    // Require authentication to book an appointment
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to book an appointment" });
    }
    
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      
      // Check if the slot is available
      const slot = await storage.getBookingSlot(validatedData.slotId);
      if (!slot || !slot.available) {
        return res.status(400).json({ message: "Selected time slot is not available" });
      }
      
      // Create booking
      const booking = await storage.createBooking(validatedData);
      
      // Mark slot as unavailable
      await storage.updateBookingSlot(validatedData.slotId, { available: false });
      
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });
  
  app.patch("/api/bookings/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }
    
    try {
      const validatedData = insertBookingSchema.partial().parse(req.body);
      const updatedBooking = await storage.updateBooking(id, validatedData);
      
      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(updatedBooking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to update booking" });
    }
  });
  
  app.delete("/api/bookings/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }
    
    // Get the booking to find its slot
    const booking = await storage.getBooking(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    // Delete the booking
    const success = await storage.deleteBooking(id);
    if (!success) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    // Make the slot available again
    await storage.updateBookingSlot(booking.slotId, { available: true });
    
    res.status(204).end();
  });
  
  // Waitlist routes
  app.get("/api/waitlist", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const entries = await storage.getWaitlistEntries();
    res.json(entries);
  });
  
  app.post("/api/waitlist", async (req, res) => {
    try {
      const validatedData = insertWaitlistEntrySchema.parse(req.body);
      const entry = await storage.createWaitlistEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create waitlist entry" });
    }
  });
  
  app.delete("/api/waitlist/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid waitlist entry ID" });
    }
    
    const success = await storage.deleteWaitlistEntry(id);
    if (!success) {
      return res.status(404).json({ message: "Waitlist entry not found" });
    }
    
    res.status(204).end();
  });
  
  // Contact message routes
  app.get("/api/contact", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const messages = await storage.getContactMessages();
    res.json(messages);
  });
  
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create contact message" });
    }
  });
  
  app.patch("/api/contact/:id/read", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid contact message ID" });
    }
    
    const updatedMessage = await storage.markContactMessageAsRead(id);
    if (!updatedMessage) {
      return res.status(404).json({ message: "Contact message not found" });
    }
    
    res.json(updatedMessage);
  });
  
  app.delete("/api/contact/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid contact message ID" });
    }
    
    const success = await storage.deleteContactMessage(id);
    if (!success) {
      return res.status(404).json({ message: "Contact message not found" });
    }
    
    res.status(204).end();
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    const category = req.query.category as string | undefined;
    const featured = req.query.featured === "true";
    
    let products;
    if (category) {
      products = await storage.getProductsByCategory(category);
    } else if (featured) {
      products = await storage.getFeaturedProducts();
    } else {
      products = await storage.getProducts();
    }
    
    res.json(products);
  });
  
  app.get("/api/products/:id", async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    
    const product = await storage.getProduct(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(product);
  });
  
  app.post("/api/products", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    try {
      const validatedData = insertProductZodSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });
  
  app.patch("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    
    try {
      const validatedData = insertProductZodSchema.partial().parse(req.body);
      const updatedProduct = await storage.updateProduct(id, validatedData);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });
  
  app.delete("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    
    const success = await storage.deleteProduct(id);
    if (!success) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(204).end();
  });

  const httpServer = createServer(app);
  
  return httpServer;
}
