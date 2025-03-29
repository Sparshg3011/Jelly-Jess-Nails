import { storage } from '../storage';
import { sendBookingConfirmation } from '../services/emailService';

/**
 * Process bookings that need confirmation emails
 */
export async function processBookingEmails(): Promise<void> {
  try {
    // Get bookings that need emails (confirmed but no email sent yet)
    const bookingsNeedingEmails = await storage.getBookingsNeedingEmails();
    
    if (bookingsNeedingEmails.length === 0) {
      return;
    }
    
    console.log(`Processing ${bookingsNeedingEmails.length} booking confirmation emails...`);
    
    for (const booking of bookingsNeedingEmails) {
      try {
        // Get service and slot details
        const service = await storage.getService(booking.serviceId);
        const slot = await storage.getBookingSlot(booking.slotId);
        
        if (!service || !slot) {
          console.error(`Missing service or slot for booking ${booking.id}`);
          continue;
        }
        
        // Send confirmation email
        const emailSent = await sendBookingConfirmation(booking, service, slot);
        
        if (emailSent) {
          // Update booking to mark email as sent
          await storage.updateBookingEmailStatus(booking.id, true);
          console.log(`Confirmation email sent for booking ${booking.id}`);
        } else {
          console.error(`Failed to send confirmation email for booking ${booking.id}`);
        }
      } catch (error) {
        console.error(`Error processing booking email for booking ${booking.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in email worker:', error);
  }
}

/**
 * Start the email worker that runs at regular intervals
 */
export function startEmailWorker(intervalMs = 60000): NodeJS.Timeout {
  console.log('Starting email worker...');
  
  // Run once immediately
  processBookingEmails().catch(error => {
    console.error('Error in initial email worker run:', error);
  });
  
  // Then schedule regular runs
  return setInterval(() => {
    processBookingEmails().catch(error => {
      console.error('Error in scheduled email worker run:', error);
    });
  }, intervalMs);
} 