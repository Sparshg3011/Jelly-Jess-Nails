import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  isAdmin: boolean("is_admin").default(false),
  googleId: text("google_id"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  isAdmin: true,
  googleId: true,
});

// Services model
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents
  duration: integer("duration").notNull(), // in minutes
  category: text("category").notNull(),
  imageUrl: text("image_url"),
});

export const insertServiceSchema = createInsertSchema(services).pick({
  name: true,
  description: true,
  price: true,
  duration: true,
  category: true,
  imageUrl: true,
});

// Gallery model
export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  featured: boolean("featured").default(false),
});

export const insertGalleryItemSchema = createInsertSchema(galleryItems).pick({
  title: true,
  description: true,
  imageUrl: true,
  category: true,
  featured: true,
});

// Products model for shop (Drizzle ORM model)
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(), // e.g., 'short', 'medium', 'long'
  inStock: boolean("in_stock").default(true),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  imageUrl: true,
  category: true,
  inStock: true,
  featured: true,
});

// Booking slots model
export const bookingSlots = pgTable("booking_slots", {
  id: serial("id").primaryKey(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  available: boolean("available").default(true),
});

export const insertBookingSlotSchema = createInsertSchema(bookingSlots).pick({
  startTime: true,
  endTime: true,
  available: true,
}).extend({
  // Add custom validation to ensure dates are handled properly
  startTime: z.date({
    required_error: "Start time is required",
    invalid_type_error: "Start time must be a valid date",
  }),
  endTime: z.date({
    required_error: "End time is required",
    invalid_type_error: "End time must be a valid date",
  }),
});

// Bookings model
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  serviceId: integer("service_id").notNull(),
  slotId: integer("slot_id").notNull(),
  paymentStatus: text("payment_status").default("pending"),
  paymentId: text("payment_id"),
  bookingDate: timestamp("booking_date").defaultNow(),
  emailSent: boolean("email_sent").default(false),
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  serviceId: true,
  slotId: true,
  paymentStatus: true,
  paymentId: true,
});

// Waitlist model
export const waitlistEntries = pgTable("waitlist_entries", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  interests: jsonb("interests").notNull(), // Array of service types they're interested in
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWaitlistEntrySchema = createInsertSchema(waitlistEntries).pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  interests: true,
});

// Contact message model
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  read: boolean("read").default(false),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

// Gallery categories model
export const galleryCategories = pgTable("gallery_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGalleryCategorySchema = createInsertSchema(galleryCategories).pick({
  name: true,
});

// ORM Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

export type GalleryItem = typeof galleryItems.$inferSelect;
export type InsertGalleryItem = z.infer<typeof insertGalleryItemSchema>;

export type ProductDb = typeof products.$inferSelect;
export type InsertProductDb = z.infer<typeof insertProductSchema>;

export type BookingSlot = typeof bookingSlots.$inferSelect;
export type InsertBookingSlot = z.infer<typeof insertBookingSlotSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type WaitlistEntry = typeof waitlistEntries.$inferSelect;
export type InsertWaitlistEntry = z.infer<typeof insertWaitlistEntrySchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

// Zod schema for product validation with category enum
export const productCategoryEnum = z.enum([
  'press-on-nails',
  'nail-accessories', 
  'gift-cards'
]);

export type ProductCategory = z.infer<typeof productCategoryEnum>;

export const productZodSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  category: productCategoryEnum,
  imageUrl: z.string().url("Image URL must be a valid URL"),
  featured: z.boolean().default(false),
  inStock: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const insertProductZodSchema = productZodSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateProductZodSchema = productZodSchema.partial().omit({ id: true, createdAt: true, updatedAt: true });

export type Product = z.infer<typeof productZodSchema>;
export type InsertProduct = z.infer<typeof insertProductZodSchema>;
export type UpdateProduct = z.infer<typeof updateProductZodSchema>;
