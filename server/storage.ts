import { 
  users, User, InsertUser,
  services, Service, InsertService,
  galleryItems, GalleryItem, InsertGalleryItem,
  bookingSlots, BookingSlot, InsertBookingSlot,
  bookings, Booking, InsertBooking,
  waitlistEntries, WaitlistEntry, InsertWaitlistEntry,
  contactMessages, ContactMessage, InsertContactMessage,
  products,
  type InsertBooking,
  type InsertService,
  type InsertGalleryItem,
  type InsertBookingSlot,
  type InsertUser,
  type InsertWaitlistEntry,
  type InsertContactMessage,
  type InsertProduct,
  type Product,
  type UpdateProduct,
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
// Import helper for password hashing
import { hashPassword } from "./auth";
import { PostgresStorage } from "./postgres-storage";
import { eq } from "drizzle-orm";

const MemoryStore = createMemoryStore(session);

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserGoogleId(userId: number, googleId: string): Promise<User | undefined>;
  updateUserAdminStatus(userId: number, isAdmin: boolean): Promise<User | undefined>;
  
  // Service operations
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Gallery operations
  getGalleryItems(): Promise<GalleryItem[]>;
  getGalleryItemsByCategory(category: string): Promise<GalleryItem[]>;
  getFeaturedGalleryItems(): Promise<GalleryItem[]>;
  getGalleryItem(id: number): Promise<GalleryItem | undefined>;
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
  updateGalleryItem(id: number, item: Partial<InsertGalleryItem>): Promise<GalleryItem | undefined>;
  deleteGalleryItem(id: number): Promise<boolean>;
  
  // Booking slot operations
  getBookingSlots(): Promise<BookingSlot[]>;
  getAvailableBookingSlots(): Promise<BookingSlot[]>;
  getBookingSlot(id: number): Promise<BookingSlot | undefined>;
  createBookingSlot(slot: InsertBookingSlot): Promise<BookingSlot>;
  updateBookingSlot(id: number, slot: Partial<InsertBookingSlot>): Promise<BookingSlot | undefined>;
  deleteBookingSlot(id: number): Promise<boolean>;
  
  // Booking operations
  getBookings(): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking | undefined>;
  deleteBooking(id: number): Promise<boolean>;
  
  // Waitlist operations
  getWaitlistEntries(): Promise<WaitlistEntry[]>;
  getWaitlistEntry(id: number): Promise<WaitlistEntry | undefined>;
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  deleteWaitlistEntry(id: number): Promise<boolean>;
  
  // Contact message operations
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markContactMessageAsRead(id: number): Promise<ContactMessage | undefined>;
  deleteContactMessage(id: number): Promise<boolean>;

  // Session store
  sessionStore: any; // Using any for the session store to avoid type issues

  // Products functions
  getProducts(): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(data: InsertProduct): Promise<Product>;
  updateProduct(id: string, data: UpdateProduct): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Update booking with email notification status
  updateBookingEmailStatus(id: number, emailSent: boolean): Promise<any | null>;

  // Get bookings that need email notifications
  getBookingsNeedingEmails(): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private services: Map<number, Service>;
  private galleryItems: Map<number, GalleryItem>;
  private bookingSlots: Map<number, BookingSlot>;
  private bookings: Map<number, Booking>;
  private waitlistEntries: Map<number, WaitlistEntry>;
  private contactMessages: Map<number, ContactMessage>;
  
  // Counters for IDs
  private userId: number = 1;
  private serviceId: number = 1;
  private galleryItemId: number = 1;
  private bookingSlotId: number = 1;
  private bookingId: number = 1;
  private waitlistEntryId: number = 1;
  private contactMessageId: number = 1;
  
  sessionStore: any; // Using any for the session store type

  constructor() {
    // Initialize maps first
    this.users = new Map();
    this.services = new Map();
    this.galleryItems = new Map();
    this.bookingSlots = new Map();
    this.bookings = new Map();
    this.waitlistEntries = new Map();
    this.contactMessages = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // Prune expired sessions every 24h
    });
    
    // Create admin user with hardcoded credentials
    // For development, using a plain text password that will be compared directly
    // This works because comparePasswords has a fallback for non-hashed passwords
    this.users.set(1, {
      id: 1,
      username: "admin",
      password: "admin123",
      email: "admin@jellyjessynails.com",
      isAdmin: true,
      googleId: null
    });
    this.userId = 2; // Increment ID counter
    
    // Initialize some sample services
    this.initializeServices();
    
    // Initialize gallery items
    this.initializeGalleryItems();
    
    // Initialize booking slots
    this.initializeBookingSlots();
  }

  // Initialize sample services
  private initializeServices() {
    const sampleServices: InsertService[] = [
      {
        name: "Signature Manicure",
        description: "Our classic treatment includes cuticle care, nail shaping, hand massage, and premium polish application.",
        price: 4500, // $45.00
        duration: 60,
        category: "Manicure",
        imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371"
      },
      {
        name: "Luxury Gel Extensions",
        description: "Long-lasting, durable extensions with custom designs and embellishments of your choice.",
        price: 7500, // $75.00
        duration: 90,
        category: "Extensions",
        imageUrl: "https://images.unsplash.com/photo-1604902396830-aca29e19b067"
      },
      {
        name: "Nail Art Design",
        description: "Custom hand-painted designs, 3D elements, and creative expression for truly unique nails.",
        price: 3000, // $30.00
        duration: 45,
        category: "Art",
        imageUrl: "https://images.unsplash.com/photo-1601055903647-ddf1ee9701b7"
      },
      {
        name: "Paraffin Treatment",
        description: "Deeply moisturizing wax treatment that softens skin and relieves joint pain and stiffness.",
        price: 3500, // $35.00
        duration: 30,
        category: "Spa",
        imageUrl: "https://images.unsplash.com/photo-1607779097040-017f887063e0"
      },
      {
        name: "Luxury Pedicure",
        description: "Relaxing foot soak, exfoliation, callus removal, massage, and perfect polish application.",
        price: 6000, // $60.00
        duration: 75,
        category: "Pedicure",
        imageUrl: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b"
      },
      {
        name: "Crystal & Gem Add-ons",
        description: "Premium embellishments including Swarovski crystals, pearls, and custom jewelry elements.",
        price: 2000, // $20.00
        duration: 20,
        category: "Add-ons",
        imageUrl: "https://images.unsplash.com/photo-1604902396754-c70de17cd793"
      }
    ];

    for (const service of sampleServices) {
      this.createService(service);
    }
  }

  // Initialize sample gallery items
  private initializeGalleryItems() {
    const sampleGalleryItems: InsertGalleryItem[] = [
      {
        title: "French Tips",
        description: "Classic with a twist",
        imageUrl: "https://images.unsplash.com/photo-1604902396830-aca29e19b067",
        category: "French Tips",
        featured: true
      },
      {
        title: "Floral Dreams",
        description: "Hand-painted artistry",
        imageUrl: "https://images.unsplash.com/photo-1632344506497-35a5e4438f59",
        category: "Floral",
        featured: true
      },
      {
        title: "Modern Geometry",
        description: "Bold & contemporary",
        imageUrl: "https://images.unsplash.com/photo-1636018942147-d4e398acdf8c",
        category: "Geometric",
        featured: true
      },
      {
        title: "Diamond Dust",
        description: "Luxury that shines",
        imageUrl: "https://images.unsplash.com/photo-1604902396754-c70de17cd793",
        category: "Glitter & Gems",
        featured: true
      },
      {
        title: "Pink Marble",
        description: "Elegant stone texture",
        imageUrl: "https://images.unsplash.com/photo-1613457818149-b01f21fb39c7",
        category: "Geometric",
        featured: false
      },
      {
        title: "Pastel Ombre",
        description: "Smooth color transitions",
        imageUrl: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b",
        category: "Glitter & Gems",
        featured: false
      },
      {
        title: "Spring Blooms",
        description: "Delicate floral patterns",
        imageUrl: "https://images.unsplash.com/photo-1601055903647-ddf1ee9701b7",
        category: "Floral",
        featured: false
      },
      {
        title: "Minimalist Lines",
        description: "Clean geometric design",
        imageUrl: "https://images.unsplash.com/photo-1625063590254-271f583f3d34",
        category: "Geometric",
        featured: false
      }
    ];

    for (const item of sampleGalleryItems) {
      this.createGalleryItem(item);
    }
  }

  // Initialize booking slots
  private initializeBookingSlots() {
    // Create slots for the next 7 days
    const now = new Date();
    const startDate = new Date(now);
    startDate.setHours(9, 0, 0, 0); // Start at 9 AM
    
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + day);
      
      // Create slots from 9 AM to 6 PM with 1.5 hour intervals
      for (let hour = 9; hour < 18; hour += 1.5) {
        const startHour = Math.floor(hour);
        const startMinute = (hour % 1) * 60;
        
        const endHour = Math.floor(hour + 1.5);
        const endMinute = ((hour + 1.5) % 1) * 60;
        
        const slotStartTime = new Date(currentDate);
        slotStartTime.setHours(startHour, startMinute, 0, 0);
        
        const slotEndTime = new Date(currentDate);
        slotEndTime.setHours(endHour, endMinute, 0, 0);
        
        this.createBookingSlot({
          startTime: slotStartTime,
          endTime: slotEndTime,
          available: true
        });
      }
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.googleId === googleId);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const hashedPassword = await hashPassword(user.password);
    
    const newUser: User = {
      id,
      username: user.username,
      password: hashedPassword,
      email: user.email,
      isAdmin: user.isAdmin ?? false,
      googleId: user.googleId || null
    };
    
    this.users.set(id, newUser);
    return newUser;
  }
  
  async updateUserGoogleId(userId: number, googleId: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      googleId
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserAdminStatus(userId: number, isAdmin: boolean): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      isAdmin
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Service operations
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.serviceId++;
    const service: Service = { 
      ...insertService, 
      id,
      imageUrl: insertService.imageUrl ?? null
    };
    this.services.set(id, service);
    return service;
  }

  async updateService(id: number, updateData: Partial<InsertService>): Promise<Service | undefined> {
    const service = this.services.get(id);
    if (!service) return undefined;
    
    const updatedService = { ...service, ...updateData };
    this.services.set(id, updatedService);
    return updatedService;
  }

  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
  }

  // Gallery operations
  async getGalleryItems(): Promise<GalleryItem[]> {
    return Array.from(this.galleryItems.values());
  }

  async getGalleryItemsByCategory(category: string): Promise<GalleryItem[]> {
    return Array.from(this.galleryItems.values()).filter(
      item => item.category === category
    );
  }

  async getFeaturedGalleryItems(): Promise<GalleryItem[]> {
    return Array.from(this.galleryItems.values()).filter(
      item => item.featured
    );
  }

  async getGalleryItem(id: number): Promise<GalleryItem | undefined> {
    return this.galleryItems.get(id);
  }

  async createGalleryItem(insertItem: InsertGalleryItem): Promise<GalleryItem> {
    const id = this.galleryItemId++;
    const item: GalleryItem = { 
      ...insertItem, 
      id,
      description: insertItem.description ?? null,
      featured: insertItem.featured ?? false
    };
    this.galleryItems.set(id, item);
    return item;
  }

  async updateGalleryItem(id: number, updateData: Partial<InsertGalleryItem>): Promise<GalleryItem | undefined> {
    const item = this.galleryItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updateData };
    this.galleryItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteGalleryItem(id: number): Promise<boolean> {
    return this.galleryItems.delete(id);
  }

  // Booking slot operations
  async getBookingSlots(): Promise<BookingSlot[]> {
    return Array.from(this.bookingSlots.values());
  }

  async getAvailableBookingSlots(): Promise<BookingSlot[]> {
    return Array.from(this.bookingSlots.values()).filter(
      slot => slot.available
    );
  }

  async getBookingSlot(id: number): Promise<BookingSlot | undefined> {
    return this.bookingSlots.get(id);
  }

  async createBookingSlot(insertSlot: InsertBookingSlot): Promise<BookingSlot> {
    const id = this.bookingSlotId++;
    const slot: BookingSlot = { 
      ...insertSlot, 
      id,
      available: insertSlot.available ?? true
    };
    this.bookingSlots.set(id, slot);
    return slot;
  }

  async updateBookingSlot(id: number, updateData: Partial<InsertBookingSlot>): Promise<BookingSlot | undefined> {
    const slot = this.bookingSlots.get(id);
    if (!slot) return undefined;
    
    const updatedSlot = { ...slot, ...updateData };
    this.bookingSlots.set(id, updatedSlot);
    return updatedSlot;
  }

  async deleteBookingSlot(id: number): Promise<boolean> {
    return this.bookingSlots.delete(id);
  }

  // Booking operations
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingId++;
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      bookingDate: new Date(),
      paymentStatus: insertBooking.paymentStatus ?? "pending",
      paymentId: insertBooking.paymentId ?? null
    };
    this.bookings.set(id, booking);
    
    // Mark the slot as unavailable
    const slot = this.bookingSlots.get(insertBooking.slotId);
    if (slot) {
      this.updateBookingSlot(slot.id, { available: false });
    }
    
    return booking;
  }

  async updateBooking(id: number, updateData: Partial<InsertBooking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, ...updateData };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  async deleteBooking(id: number): Promise<boolean> {
    const booking = this.bookings.get(id);
    if (booking) {
      // Mark the slot as available again
      const slot = this.bookingSlots.get(booking.slotId);
      if (slot) {
        this.updateBookingSlot(slot.id, { available: true });
      }
    }
    return this.bookings.delete(id);
  }

  // Waitlist operations
  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return Array.from(this.waitlistEntries.values());
  }

  async getWaitlistEntry(id: number): Promise<WaitlistEntry | undefined> {
    return this.waitlistEntries.get(id);
  }

  async createWaitlistEntry(insertEntry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const id = this.waitlistEntryId++;
    const entry: WaitlistEntry = { ...insertEntry, id, createdAt: new Date() };
    this.waitlistEntries.set(id, entry);
    return entry;
  }

  async deleteWaitlistEntry(id: number): Promise<boolean> {
    return this.waitlistEntries.delete(id);
  }

  // Contact message operations
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessages.get(id);
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageId++;
    const message: ContactMessage = { 
      ...insertMessage, 
      id, 
      createdAt: new Date(),
      read: false
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async markContactMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const message = this.contactMessages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, read: true };
    this.contactMessages.set(id, updatedMessage);
    return updatedMessage;
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    return this.contactMessages.delete(id);
  }

  // Products functions
  async getProducts(): Promise<Product[]> {
    try {
      return await this.getDb().select().from(products);
    } catch (error) {
      console.error("Error getting products:", error);
      return [];
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      return await this.getDb()
        .select()
        .from(products)
        .where(eq(products.featured, true));
    } catch (error) {
      console.error("Error getting featured products:", error);
      return [];
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      return await this.getDb()
        .select()
        .from(products)
        .where(eq(products.category, category));
    } catch (error) {
      console.error(`Error getting products for category ${category}:`, error);
      return [];
    }
  }

  async getProduct(id: string): Promise<Product | undefined> {
    try {
      const result = await this.getDb()
        .select()
        .from(products)
        .where(eq(products.id, id))
        .limit(1);
      
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error(`Error getting product ${id}:`, error);
      return undefined;
    }
  }

  async createProduct(data: InsertProduct): Promise<Product> {
    try {
      const result = await this.getDb()
        .insert(products)
        .values(data)
        .returning();
      
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error("Error creating product:", error);
      return undefined;
    }
  }

  async updateProduct(id: string, data: UpdateProduct): Promise<Product | undefined> {
    try {
      const result = await this.getDb()
        .update(products)
        .set(data)
        .where(eq(products.id, id))
        .returning();
      
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      return undefined;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const result = await this.getDb()
        .delete(products)
        .where(eq(products.id, id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      return false;
    }
  }

  // Update booking with email notification status
  async updateBookingEmailStatus(id: number, emailSent: boolean): Promise<any | null> {
    try {
      const result = await this.getDb()
        .update(bookings)
        .set({ emailSent })
        .where(eq(bookings.id, id))
        .returning();
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error(`Error updating booking email status ${id}:`, error);
      return null;
    }
  }

  // Get bookings that need email notifications
  async getBookingsNeedingEmails(): Promise<any[]> {
    try {
      return await this.getDb()
        .select()
        .from(bookings)
        .where(eq(bookings.emailSent, false))
        .where(eq(bookings.paymentStatus, "confirmed"));
    } catch (error) {
      console.error("Error getting bookings needing emails:", error);
      return [];
    }
  }
}

// Use PostgreSQL storage in all environments to ensure DB persistence
export const storage = new PostgresStorage();
