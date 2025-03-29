import {
  users, User, InsertUser,
  services, Service, InsertService,
  galleryItems, GalleryItem, InsertGalleryItem,
  bookingSlots, BookingSlot, InsertBookingSlot,
  bookings, Booking, InsertBooking,
  waitlistEntries, WaitlistEntry, InsertWaitlistEntry,
  contactMessages, ContactMessage, InsertContactMessage,
  products, Product, InsertProduct, UpdateProduct
} from "@shared/schema";
import { hashPassword } from "./auth";
import { IStorage } from "./storage";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";
import PostgresStore from "connect-pg-simple";

const pgSessionStore = PostgresStore(session);
const MemoryStore = createMemoryStore(session);

export class PostgresStorage implements IStorage {
  sessionStore: any;

  constructor() {
    // Use PostgreSQL session store in production, memory store in development
    if (process.env.NODE_ENV === 'production') {
      this.sessionStore = new pgSessionStore({
        conString: process.env.DATABASE_URL,
        tableName: 'session'
      });
    } else {
      this.sessionStore = new MemoryStore({
        checkPeriod: 86400000 // Prune expired sessions every 24h
      });
    }
    
    // Initialize admin user if it doesn't exist
    this.initAdminUser();
  }

  private async initAdminUser() {
    try {
      const adminUser = await this.getUserByUsername('admin');
      if (!adminUser) {
        await this.createUser({
          username: "admin",
          password: "admin123", // This will be hashed in createUser
          email: "sparshgupta643@gmail.com",
          isAdmin: true
        });
        console.log("Admin user created successfully");
      }
    } catch (error) {
      console.error("Error initializing admin user:", error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.email, email));
    return results[0];
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.googleId, googleId));
    return results[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const hashedPassword = await hashPassword(user.password);
    const insertData = { ...user, password: hashedPassword };
    const results = await db.insert(users).values(insertData).returning();
    return results[0];
  }

  async updateUserGoogleId(userId: number, googleId: string): Promise<User | undefined> {
    const results = await db.update(users)
      .set({ googleId })
      .where(eq(users.id, userId))
      .returning();
    return results[0];
  }

  async updateUserAdminStatus(userId: number, isAdmin: boolean): Promise<User | undefined> {
    const results = await db.update(users)
      .set({ isAdmin })
      .where(eq(users.id, userId))
      .returning();
    return results[0];
  }

  // Service operations
  async getServices(): Promise<Service[]> {
    return db.select().from(services);
  }

  async getService(id: number): Promise<Service | undefined> {
    const results = await db.select().from(services).where(eq(services.id, id));
    return results[0];
  }

  async createService(service: InsertService): Promise<Service> {
    const results = await db.insert(services).values(service).returning();
    return results[0];
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined> {
    const results = await db.update(services)
      .set(service)
      .where(eq(services.id, id))
      .returning();
    return results[0];
  }

  async deleteService(id: number): Promise<boolean> {
    const results = await db.delete(services).where(eq(services.id, id)).returning();
    return results.length > 0;
  }

  // Gallery operations
  async getGalleryItems(): Promise<GalleryItem[]> {
    return db.select().from(galleryItems);
  }

  async getGalleryItemsByCategory(category: string): Promise<GalleryItem[]> {
    return db.select().from(galleryItems).where(eq(galleryItems.category, category));
  }

  async getFeaturedGalleryItems(): Promise<GalleryItem[]> {
    return db.select().from(galleryItems).where(eq(galleryItems.featured, true));
  }

  async getGalleryItem(id: number): Promise<GalleryItem | undefined> {
    const results = await db.select().from(galleryItems).where(eq(galleryItems.id, id));
    return results[0];
  }

  async createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem> {
    const results = await db.insert(galleryItems).values(item).returning();
    return results[0];
  }

  async updateGalleryItem(id: number, item: Partial<InsertGalleryItem>): Promise<GalleryItem | undefined> {
    const results = await db.update(galleryItems)
      .set(item)
      .where(eq(galleryItems.id, id))
      .returning();
    return results[0];
  }

  async deleteGalleryItem(id: number): Promise<boolean> {
    const results = await db.delete(galleryItems).where(eq(galleryItems.id, id)).returning();
    return results.length > 0;
  }

  // Booking slot operations
  async getBookingSlots(): Promise<BookingSlot[]> {
    return db.select().from(bookingSlots);
  }

  async getAvailableBookingSlots(): Promise<BookingSlot[]> {
    return db.select().from(bookingSlots).where(eq(bookingSlots.available, true));
  }

  async getBookingSlot(id: number): Promise<BookingSlot | undefined> {
    const results = await db.select().from(bookingSlots).where(eq(bookingSlots.id, id));
    return results[0];
  }

  async createBookingSlot(slot: InsertBookingSlot): Promise<BookingSlot> {
    console.log("Creating booking slot with data:", slot);
    const validatedData = { ...slot };
    console.log("Validated data:", validatedData);
    const results = await db.insert(bookingSlots).values(validatedData).returning();
    return results[0];
  }

  async updateBookingSlot(id: number, slot: Partial<InsertBookingSlot>): Promise<BookingSlot | undefined> {
    const results = await db.update(bookingSlots)
      .set(slot)
      .where(eq(bookingSlots.id, id))
      .returning();
    return results[0];
  }

  async deleteBookingSlot(id: number): Promise<boolean> {
    const results = await db.delete(bookingSlots).where(eq(bookingSlots.id, id)).returning();
    return results.length > 0;
  }

  // Booking operations
  async getBookings(): Promise<Booking[]> {
    return db.select().from(bookings);
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const results = await db.select().from(bookings).where(eq(bookings.id, id));
    return results[0];
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    // First, mark the slot as unavailable
    await db.update(bookingSlots)
      .set({ available: false })
      .where(eq(bookingSlots.id, booking.slotId));
      
    // Then create the booking
    const results = await db.insert(bookings).values(booking).returning();
    return results[0];
  }

  async updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking | undefined> {
    const results = await db.update(bookings)
      .set(booking)
      .where(eq(bookings.id, id))
      .returning();
    return results[0];
  }

  async deleteBooking(id: number): Promise<boolean> {
    const results = await db.delete(bookings).where(eq(bookings.id, id)).returning();
    return results.length > 0;
  }

  // Waitlist operations
  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return db.select().from(waitlistEntries);
  }

  async getWaitlistEntry(id: number): Promise<WaitlistEntry | undefined> {
    const results = await db.select().from(waitlistEntries).where(eq(waitlistEntries.id, id));
    return results[0];
  }

  async createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const results = await db.insert(waitlistEntries).values(entry).returning();
    return results[0];
  }

  async deleteWaitlistEntry(id: number): Promise<boolean> {
    const results = await db.delete(waitlistEntries).where(eq(waitlistEntries.id, id)).returning();
    return results.length > 0;
  }

  // Contact message operations
  async getContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const results = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return results[0];
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const results = await db.insert(contactMessages).values(message).returning();
    return results[0];
  }

  async markContactMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const results = await db.update(contactMessages)
      .set({ read: true })
      .where(eq(contactMessages.id, id))
      .returning();
    return results[0];
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    const results = await db.delete(contactMessages).where(eq(contactMessages.id, id)).returning();
    return results.length > 0;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return db.select().from(products).where(eq(products.featured, true));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return db.select().from(products).where(eq(products.category, category));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const results = await db.select().from(products).where(eq(products.id, id));
    return results[0];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const results = await db.insert(products).values(product).returning();
    return results[0];
  }

  async updateProduct(id: string, product: UpdateProduct): Promise<Product | undefined> {
    const results = await db.update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return results[0];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const results = await db.delete(products).where(eq(products.id, id)).returning();
    return results.length > 0;
  }

  // Booking email notifications
  async updateBookingEmailStatus(id: number, emailSent: boolean): Promise<Booking | undefined> {
    const results = await db.update(bookings)
      .set({ emailSent })
      .where(eq(bookings.id, id))
      .returning();
    return results[0];
  }

  async getBookingsNeedingEmails(): Promise<Booking[]> {
    return db.select().from(bookings).where(eq(bookings.emailSent, false));
  }
} 