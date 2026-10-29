-- Muna-AirSpace Database Schema
-- Supabase PostgreSQL Migration 001

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. FLIGHT OFFERS TABLE
CREATE TABLE IF NOT EXISTS public.flight_offers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  origin_city TEXT NOT NULL,
  origin_code VARCHAR(10) NOT NULL,
  destination_city TEXT NOT NULL,
  destination_code VARCHAR(10) NOT NULL,
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('domestic', 'international')),
  trip_type TEXT NOT NULL CHECK (trip_type IN ('one-way', 'return')),
  indicative_fare NUMERIC(14, 2) NOT NULL DEFAULT 0,
  currency VARCHAR(5) NOT NULL DEFAULT 'NGN',
  display_label TEXT DEFAULT 'Sample Fare (Indicative)',
  description TEXT,
  image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  travel_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for searching and filtering
CREATE INDEX IF NOT EXISTS idx_offers_category ON public.flight_offers(category);
CREATE INDEX IF NOT EXISTS idx_offers_active ON public.flight_offers(is_active);
CREATE INDEX IF NOT EXISTS idx_offers_featured ON public.flight_offers(is_featured);
CREATE INDEX IF NOT EXISTS idx_offers_dest_code ON public.flight_offers(destination_code);

-- 2. BOOKING ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.booking_enquiries (
  id TEXT PRIMARY KEY,
  reference_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  current_city TEXT,
  departure_airport TEXT NOT NULL,
  destination_airport TEXT NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE,
  trip_type TEXT NOT NULL CHECK (trip_type IN ('one-way', 'return')),
  adults INT NOT NULL DEFAULT 1,
  children INT NOT NULL DEFAULT 0,
  infants INT NOT NULL DEFAULT 0,
  cabin_preference TEXT NOT NULL DEFAULT 'economy',
  preferred_airline TEXT,
  flexible_dates BOOLEAN NOT NULL DEFAULT false,
  passport_status TEXT,
  travel_requests TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'completed', 'cancelled')),
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.booking_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_ref ON public.booking_enquiries(reference_number);

-- 3. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. SITE CONTENT & CONFIGURATION
CREATE TABLE IF NOT EXISTS public.site_content (
  key TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.flight_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Flight Offers Policies:
-- Anyone can view active, published offers
CREATE POLICY "Public can view active flight offers"
  ON public.flight_offers
  FOR SELECT
  USING (is_active = true);

-- Authenticated admins can manage all flight offers
CREATE POLICY "Admins have full access to flight offers"
  ON public.flight_offers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Booking Enquiries Policies:
-- Anonymous public can insert booking requests, but cannot read or update anyone's enquiry
CREATE POLICY "Public can submit booking enquiries"
  ON public.booking_enquiries
  FOR INSERT
  WITH CHECK (true);

-- Only authenticated admins can read, update, or delete booking enquiries
CREATE POLICY "Admins have full access to booking enquiries"
  ON public.booking_enquiries
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Contact Messages Policies:
-- Public can submit messages
CREATE POLICY "Public can submit contact messages"
  ON public.contact_messages
  FOR INSERT
  WITH CHECK (true);

-- Only authenticated admins can read or manage contact messages
CREATE POLICY "Admins have full access to contact messages"
  ON public.contact_messages
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Site Content Policies:
-- Public can read site configuration
CREATE POLICY "Public can read site content"
  ON public.site_content
  FOR SELECT
  USING (true);

-- Only admins can modify site configuration
CREATE POLICY "Admins can update site content"
  ON public.site_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Storage bucket for destination images
INSERT INTO storage.buckets (id, name, public)
VALUES ('destination-images', 'destination-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view destination images
CREATE POLICY "Public can view destination images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'destination-images');

-- Admins can upload destination images
CREATE POLICY "Admins can upload destination images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'destination-images');
