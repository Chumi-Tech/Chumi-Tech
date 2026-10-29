# Muna-AirSpace — Professional Travel & Flight Booking Website

A production-minded, responsive flight booking assistance and travel enquiry platform tailored for Nigerian travelers booking domestic flights across Nigeria (Lagos, Abuja, Port Harcourt, Kano, Enugu, Owerri, Asaba, etc.) and international destinations (London, Dubai, Johannesburg, Toronto, New York, etc.).

---

## 1. Key Features

- **Multi-Page Architecture**:
  - `/`: Hero, flight search & enquiry engine, popular flight offers, 4-step workflow, why choose Muna-AirSpace, destination photo gallery, FAQs, and booking CTA.
  - `/menu`: Complete flight offers and destination catalogue with real-time text search, domestic/international filters, one-way/return filters, price ceiling filter, and sorting.
  - `/about`: Brand story, mission, vision, operational disclosures, and service principles.
  - `/contact`: Contact enquiry form, direct WhatsApp chat, business hours, and phone/email details.
  - `/booking`: Complete booking enquiry form with route prefill from query parameters, passenger counts (adults, children, infants), cabin preference, flexible date option, review modal, and instant WhatsApp handoff.
  - `/admin/login`: Protected administrator sign-in.
  - `/admin`: Authenticated administrative dashboard with metrics, flight offer CRUD, booking enquiry status management, internal agency notes, contact message manager, site settings editor, and live Supabase migration viewer.

- **WhatsApp Enquiry Handoff**:
  - Automatically generates an enquiry reference number (e.g., `MAS-2026-8941`).
  - Pre-populates a structured, polite message with full itinerary, passenger details, and special requests.
  - Opens direct WhatsApp chat with the business owner (`081-67-6938-69` normalized to international format `2348167693869`).
  - Includes safe fallback with copy-to-clipboard functionality.

- **Dual-Mode Data Architecture**:
  - Connects to **Supabase PostgreSQL**, **Supabase Auth**, and **Supabase Storage** when configured.
  - Includes an automatic local storage repository with full initial demo seed data, ensuring the app is completely functional immediately.

- **Responsible Business Transparency**:
  - Explicitly informs visitors that sample fares are illustrative estimates for guidance and enquiry.
  - Reassures travelers that payment credentials (PINs, card CVVs, passwords) are never requested.

---

## 2. Environment Variables

Create a `.env` file in the project root (reference `.env.example`):

```bash
# Supabase Configuration
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your-public-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Business WhatsApp Phone Number (normalized international format without leading zero or '+')
# 081-67-6938-69 -> 2348167693869
VITE_WHATSAPP_NUMBER="2348167693869"

# Public site URL for production
VITE_SITE_URL="https://muna-airspace.com"
```

---

## 3. Supabase Database Setup & Migrations

### Step 1: Create a Supabase Project
1. Log in to [supabase.com](https://supabase.com) and create a new project.
2. Note your **Project URL** and **anon public key** from `Settings > API`.

### Step 2: Run SQL Migrations
1. In your Supabase Dashboard, open the **SQL Editor**.
2. Run the script located in `supabase/migrations/001_initial_schema.sql`.
   This creates:
   - `flight_offers` table with Row Level Security (RLS).
   - `booking_enquiries` table with secure insert policies for visitors and full read/write for authenticated admins.
   - `contact_messages` table.
   - `site_content` table.
   - Storage bucket `destination-images` with public read access.

### Step 3: Run the Seed Data
1. In the **SQL Editor**, run the script in `supabase/seed.sql`.
   This populates the initial 14 flight offers across domestic Nigerian and international routes, as well as initial site settings.

### Step 4: Create the First Administrator Account
1. In Supabase Dashboard, go to **Authentication > Users**.
2. Click **Add User > Create User**.
3. Enter:
   - **Email**: `admin@muna-airspace.com`
   - **Password**: `MunaAirspace2026!` (or your chosen secure password)
   - Ensure "Auto Confirm User" is checked.
4. You can now log in at `/admin/login`.

---

## 4. Local Development & Testing

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Deployment to Vercel

1. Push your repository to GitHub or GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. In Project Settings > Environment Variables, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_WHATSAPP_NUMBER`
4. Click **Deploy**. Vercel will build and host the application globally.
