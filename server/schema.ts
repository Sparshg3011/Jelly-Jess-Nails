import { 
  pgTable, 
  text, 
  timestamp, 
  boolean, 
  pgEnum, 
  uuid, 
  integer, 
  json,
  numeric,
  serial
} from 'drizzle-orm/pg-core';

export const productCategoryEnum = pgEnum('product_category', [
  'press-on-nails',
  'nail-accessories',
  'gift-cards'
]);

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: numeric('price').notNull(),
  category: productCategoryEnum('category').notNull(),
  imageUrl: text('image_url').notNull(),
  featured: boolean('featured').default(false).notNull(),
  inStock: boolean('in_stock').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}); 

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  serviceId: integer('service_id').notNull(),
  slotId: integer('slot_id').notNull(),
  paymentStatus: text('payment_status').default('pending'),
  paymentId: text('payment_id'),
  bookingDate: timestamp('booking_date').defaultNow(),
  emailSent: boolean('email_sent').default(false).notNull(),
  notes: text('notes'),
  acceptedTerms: boolean('accepted_terms').default(false),
  acceptedCancellation: boolean('accepted_cancellation').default(false)
}); 