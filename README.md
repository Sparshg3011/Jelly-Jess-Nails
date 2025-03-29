# Jelly Jessy Nails

A full-featured web application for a nail art business, allowing clients to book appointments, view portfolios, and shop for press-on nail products.

## Features

- **Online Booking System**: Clients can book appointments for nail services
- **Admin Dashboard**: Complete management of bookings, services, gallery items, and products
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Nail Art Levels**: Showcases different service tiers with detailed descriptions
- **Portfolio Gallery**: Categorized display of nail art examples
- **Shop**: E-commerce functionality for press-on nails and accessories
- **Waitlist**: Allows potential customers to join a waitlist
- **Contact Form**: Easy client communication
- **Email Notifications**: Automated booking confirmation emails
- **Authentication**: Secure login with username/password or Google account

## Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS, Shadcn UI components
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with local and Google OAuth strategies
- **Email**: Nodemailer for transactional emails
- **State Management**: React Query for data fetching and caching
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sparshg3011/Jelly-Jess-Nails.git
   cd Jelly-Jess-Nails
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/jellyjess
   SESSION_SECRET=your_session_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@example.com
   EMAIL_PASSWORD=your_email_password
   EMAIL_FROM=Jelly Jessy Nails <noreply@jellyjess-nails.com>
   ```

4. Run database migrations:
   ```bash
   npm run db:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. The application will be available at `http://localhost:3000`

## Authentication

The application supports two authentication methods:

1. **Username/Password**: Default admin credentials:
   - Username: `admin`
   - Password: `admin123`

2. **Google OAuth**: Requires setting up OAuth credentials in the Google Developer Console

## Database Schema

The application uses the following main database tables:

- **users**: Admin user accounts
- **services**: Available nail services
- **booking_slots**: Available appointment time slots
- **bookings**: Client appointment bookings
- **gallery_items**: Portfolio images and details
- **products**: Press-on nail products for the shop
- **waitlist_entries**: Waitlist sign-ups
- **contact_messages**: Messages from the contact form

## License

MIT
