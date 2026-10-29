import { BookingEnquiry } from '../types';
import { WHATSAPP_NUMBER } from './constants';

/**
 * Normalizes any phone number into international format for WhatsApp wa.me links
 * e.g., '081-67-6938-69' -> '2348167693869'
 */
export function normalizeWhatsAppNumber(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.startsWith('0')) {
    return '234' + digitsOnly.slice(1);
  }
  if (digitsOnly.startsWith('234')) {
    return digitsOnly;
  }
  return digitsOnly || WHATSAPP_NUMBER;
}

/**
 * Generates an enquiry reference number
 * e.g., MAS-2026-4821
 */
export function generateReferenceNumber(): string {
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `MAS-2026-${randomPart}`;
}

/**
 * Constructs a structured, polite WhatsApp booking enquiry message
 */
export function buildWhatsAppMessage(enquiry: BookingEnquiry): string {
  const lines: string[] = [
    `✈️ *FLIGHT BOOKING ENQUIRY — MUNA-AIRSPACE*`,
    `Ref: *${enquiry.reference_number}*`,
    ``,
    `👤 *Passenger Details:*`,
    `• Name: ${enquiry.full_name}`,
    `• Phone: ${enquiry.phone}`,
    enquiry.email ? `• Email: ${enquiry.email}` : '',
    enquiry.current_city ? `• Current City: ${enquiry.current_city}` : '',
    ``,
    `🛫 *Route & Schedule:*`,
    `• From: ${enquiry.departure_airport}`,
    `• To: ${enquiry.destination_airport}`,
    `• Trip Type: ${enquiry.trip_type === 'return' ? 'Round Trip (Return)' : 'One Way'}`,
    `• Departure Date: ${enquiry.departure_date}`,
    enquiry.trip_type === 'return' && enquiry.return_date ? `• Return Date: ${enquiry.return_date}` : '',
    `• Flexible with dates: ${enquiry.flexible_dates ? 'Yes (± 1-2 days)' : 'No (Strict dates)'}`,
    ``,
    `👥 *Travelers & Cabin:*`,
    `• Adults: ${enquiry.adults}`,
    enquiry.children > 0 ? `• Children (2-11 yrs): ${enquiry.children}` : '',
    enquiry.infants > 0 ? `• Infants (< 2 yrs): ${enquiry.infants}` : '',
    `• Cabin Class: ${formatCabin(enquiry.cabin_preference)}`,
    enquiry.preferred_airline ? `• Preferred Airline: ${enquiry.preferred_airline}` : '',
    enquiry.passport_status ? `• Passport Status: ${enquiry.passport_status}` : '',
    ``,
    enquiry.travel_requests ? `📝 *Special Requests / Notes:*\n${enquiry.travel_requests}\n` : '',
    `_Hello Muna-AirSpace! I submitted this flight enquiry through your website. Kindly provide available flight options, current confirmed fares, and payment instructions._`,
  ];

  return lines.filter(Boolean).join('\n');
}

function formatCabin(cabin: string): string {
  switch (cabin) {
    case 'economy':
      return 'Economy Class';
    case 'premium_economy':
      return 'Premium Economy';
    case 'business':
      return 'Business Class';
    case 'first':
      return 'First Class';
    default:
      return cabin;
  }
}

/**
 * Creates the complete wa.me link with encoded message
 */
export function createWhatsAppUrl(enquiry: BookingEnquiry, customPhone?: string): string {
  const targetNumber = normalizeWhatsAppNumber(customPhone || WHATSAPP_NUMBER);
  const message = buildWhatsAppMessage(enquiry);
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Creates general contact enquiry WhatsApp link
 */
export function createGeneralWhatsAppUrl(subject: string, name?: string): string {
  const targetNumber = normalizeWhatsAppNumber(WHATSAPP_NUMBER);
  const greeting = name ? `Hello Muna-AirSpace, my name is ${name}.` : 'Hello Muna-AirSpace!';
  const message = `${greeting}\n\nI would like to enquire about: *${subject}*.\nKindly let me know how to proceed. Thank you!`;
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}
