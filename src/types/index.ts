/**
 * Muna-AirSpace Types
 */

export type TripType = 'one-way' | 'return';
export type FlightCategory = 'domestic' | 'international';
export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';

export interface FlightOffer {
  id: string;
  title: string;
  origin_city: string;
  origin_code: string;
  destination_city: string;
  destination_code: string;
  country: string;
  region: string;
  category: FlightCategory;
  trip_type: TripType;
  indicative_fare: number;
  currency: 'NGN' | 'USD' | 'GBP';
  display_label: string;
  description: string;
  image_url: string;
  is_featured: boolean;
  is_active: boolean;
  travel_notes?: string;
  created_at: string;
  updated_at: string;
}

export type EnquiryStatus = 'new' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';

export interface BookingEnquiry {
  id: string;
  reference_number: string;
  full_name: string;
  phone: string;
  email: string;
  current_city: string;
  departure_airport: string;
  destination_airport: string;
  departure_date: string;
  return_date?: string;
  trip_type: TripType;
  adults: number;
  children: number;
  infants: number;
  cabin_preference: CabinClass;
  preferred_airline?: string;
  flexible_dates: boolean;
  passport_status?: string;
  travel_requests?: string;
  status: EnquiryStatus;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
}

export interface SiteSettings {
  hero_headline: string;
  hero_subtext: string;
  whatsapp_number: string;
  contact_phone: string;
  contact_email: string;
  business_hours: string;
  office_location: string;
  notice_text: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin';
  last_login?: string;
}
