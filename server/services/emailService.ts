import nodemailer from 'nodemailer';
import { Booking, Service, BookingSlot } from '@shared/schema';
import { formatDate, formatTime } from '../utils';

// Initialize the nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || '',
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Jelly Jessy Nails <noreply@jellyjess-nails.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export async function sendBookingConfirmation(
  booking: Booking,
  service: Service,
  slot: BookingSlot
): Promise<boolean> {
  const bookingDate = formatDate(slot.startTime);
  const bookingTime = formatTime(slot.startTime);
  const endTime = formatTime(slot.endTime);
  
  // Calculate the final price (service price - booking fee)
  const bookingFee = 15 * 100; // £15 in pence
  const finalPrice = (service.price - bookingFee) / 100; // Convert back to pounds
  const totalPrice = service.price / 100; // Convert to pounds

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #9c4f7c; margin-bottom: 10px; }
        .booking-details { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 30px; }
        .booking-details h2 { color: #9c4f7c; margin-top: 0; }
        .detail-row { margin-bottom: 15px; }
        .detail-label { font-weight: bold; }
        .cta-button { display: inline-block; background-color: #9c4f7c; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; margin-top: 20px; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #777; }
        .social-links { margin-top: 20px; }
        .social-links a { margin: 0 10px; color: #9c4f7c; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Booking is Confirmed!</h1>
          <p>Thank you for booking with Jelly Jessy Nails</p>
        </div>
        
        <div class="booking-details">
          <h2>Booking Details</h2>
          
          <div class="detail-row">
            <span class="detail-label">Service:</span> ${service.name}
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Date:</span> ${bookingDate}
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Time:</span> ${bookingTime} - ${endTime}
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Name:</span> ${booking.customerName}
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Payment:</span> £15 deposit paid (will be deducted from final price)
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Remaining Amount:</span> £${finalPrice.toFixed(2)} (to be paid at appointment)
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Total:</span> £${totalPrice.toFixed(2)}
          </div>
        </div>
        
        <div>
          <h3>Important Information</h3>
          <p>Please remember:</p>
          <ul>
            <li>Arrive on time for your appointment</li>
            <li>If you need to cancel, please give at least 48 hours notice to receive a refund of your booking fee</li>
            <li>If you arrive more than 20 minutes late, your appointment may be cancelled without a refund</li>
          </ul>
          
          <p>Looking forward to seeing you!</p>
        </div>
        
        <div class="social-links">
          <p>Follow me for nail inspiration:</p>
          <a href="https://instagram.com/jellyjess_nails">Instagram: @jellyjess_nails</a><br>
          <a href="https://tiktok.com/@jellyjess_nails">TikTok: @jellyjess_nails</a>
        </div>
        
        <div class="footer">
          <p>Jelly Jessy Nails</p>
          <p>If you have any questions, please reply to this email or contact us through Instagram</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: booking.customerEmail,
    subject: 'Your Nail Appointment is Confirmed!',
    html,
  });
} 