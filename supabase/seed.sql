-- Muna-AirSpace Seed Data
-- 14 Realistic Initial Flight Offers (Domestic Nigerian & International)

INSERT INTO public.site_content (key, content)
VALUES (
  'main_settings',
  '{
    "hero_headline": "Your Journey Begins with Muna-AirSpace.",
    "hero_subtext": "Discover flights across Nigeria and around the world. Let us help you plan your next journey with confidence.",
    "whatsapp_number": "2348167693869",
    "contact_phone": "+234 816 769 3869",
    "contact_email": "enquiry@muna-airspace.com",
    "business_hours": "Monday – Saturday: 8:00 AM – 7:00 PM (WAT)",
    "office_location": "NO 1, Jim Ovia Street, River Park Estate, Abuja.",
    "notice_text": "Muna-AirSpace is an independent travel booking assistance business. We assist customers with route comparisons, fare consultations, and seamless booking handoffs."
  }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET content = EXCLUDED.content;

INSERT INTO public.flight_offers (
  id, title, origin_city, origin_code, destination_city, destination_code,
  country, region, category, trip_type, indicative_fare, currency,
  display_label, description, image_url, is_featured, is_active, travel_notes
)
VALUES
  ('off-001', 'Lagos to Abuja Executive Shuttle', 'Lagos', 'LOS', 'Abuja', 'ABV', 'Nigeria', 'West Africa', 'domestic', 'one-way', 145000, 'NGN', 'Sample Fare (Indicative)', 'Frequent daily domestic connection between Nigeria’s commercial nerve center and the federal capital territory.', '/images/dest_abuja_rock_1793267886361.jpg', true, true, 'Multiple daily departures. Standard 20kg checked baggage.'),
  ('off-002', 'Abuja to Lagos Return Express', 'Abuja', 'ABV', 'Lagos', 'LOS', 'Nigeria', 'West Africa', 'domestic', 'return', 285000, 'NGN', 'Sample Fare (Indicative)', 'Round-trip assistance for business executives and family visits with flexible morning and evening departures.', '/images/dest_lagos_skyline_1793267887899.jpg', true, true, 'Includes return leg within 14 days of departure date.'),
  ('off-003', 'Lagos to London Heathrow Direct & 1-Stop', 'Lagos', 'LOS', 'London', 'LHR', 'United Kingdom', 'Europe', 'international', 'return', 1950000, 'NGN', 'Sample Fare (Indicative)', 'Premier route connecting Nigeria to the UK for studies, holiday, business, and diaspora reunions.', '/images/dest_london_bridge_1793267887832.jpg', true, true, 'Valid UK visa required. Options with 2 x 23kg checked bags.'),
  ('off-004', 'Lagos to Dubai Leisure & Trade', 'Lagos', 'LOS', 'Dubai', 'DXB', 'United Arab Emirates', 'Middle East', 'international', 'return', 1450000, 'NGN', 'Sample Fare (Indicative)', 'Shopping, international conferences, and holiday getaways with trusted middle-eastern airline connections.', '/images/dest_dubai_skyline_1793267887900.jpg', true, true, 'UAE tourist visa or entry permit assistance guidance available.'),
  ('off-005', 'Lagos to Port Harcourt Garden City Flight', 'Lagos', 'LOS', 'Port Harcourt', 'PHC', 'Nigeria', 'West Africa', 'domestic', 'one-way', 155000, 'NGN', 'Sample Fare (Indicative)', 'Reliable route connecting Lagos to Rivers State for corporate oil and gas business and family commitments.', '/images/hero_aircraft_clouds_1793267885903.jpg', false, true, 'Approx 1 hour flight time. Direct domestic service.'),
  ('off-006', 'Lagos to Owerri Heartland Link', 'Lagos', 'LOS', 'Owerri', 'QOW', 'Nigeria', 'West Africa', 'domestic', 'one-way', 160000, 'NGN', 'Sample Fare (Indicative)', 'Convenient travel to Imo State and surrounding Eastern heartland commercial centers.', '/images/dest_abuja_rock_1793267886361.jpg', false, true, 'Fast domestic hop. Recommend early enquiry for weekend dates.'),
  ('off-007', 'Abuja to Kano Northern Commerce', 'Abuja', 'ABV', 'Kano', 'KAN', 'Nigeria', 'West Africa', 'domestic', 'one-way', 135000, 'NGN', 'Sample Fare (Indicative)', 'Rapid route between the federal capital and northern Nigeria’s primary trading hub.', '/images/dest_lagos_skyline_1793267887899.jpg', false, true, '45-minute flight time. Safe and time-saving alternative to road travel.'),
  ('off-008', 'Lagos to Sokoto Caliphate Route', 'Lagos', 'LOS', 'Sokoto', 'SKO', 'Nigeria', 'West Africa', 'domestic', 'one-way', 175000, 'NGN', 'Sample Fare (Indicative)', 'Connecting southwest Nigeria with historical Sokoto for official visits and academic travel.', '/images/dest_abuja_rock_1793267886361.jpg', false, true, 'Scheduled flights operated by selected domestic carriers.'),
  ('off-009', 'Asaba to Abuja Capital Corridor', 'Asaba', 'ABB', 'Abuja', 'ABV', 'Nigeria', 'West Africa', 'domestic', 'return', 270000, 'NGN', 'Sample Fare (Indicative)', 'Direct service from Asaba International Airport serving Delta State and Onitsha commercial belt.', '/images/dest_abuja_rock_1793267886361.jpg', false, true, 'High demand on Mondays and Fridays.'),
  ('off-010', 'Abuja to Enugu Coal City Shuttle', 'Abuja', 'ABV', 'Enugu', 'ENU', 'Nigeria', 'West Africa', 'domestic', 'one-way', 140000, 'NGN', 'Sample Fare (Indicative)', 'Direct hop connecting Abuja to Akanu Ibiam International Airport in Enugu.', '/images/hero_aircraft_clouds_1793267885903.jpg', false, true, 'Quick 50 minute flight time.'),
  ('off-011', 'Lagos to Johannesburg Rainbow Nation Flight', 'Lagos', 'LOS', 'Johannesburg', 'JNB', 'South Africa', 'Southern Africa', 'international', 'return', 1650000, 'NGN', 'Sample Fare (Indicative)', 'Connecting West Africa to South Africa with nonstop and 1-stop options for trade and tourism.', '/images/dest_dubai_skyline_1793267887900.jpg', false, true, 'Approx 6 hours direct flight duration.'),
  ('off-012', 'Lagos to Toronto Pearson Student & Relocation', 'Lagos', 'LOS', 'Toronto', 'YYZ', 'Canada', 'North America', 'international', 'one-way', 1850000, 'NGN', 'Sample Fare (Indicative)', 'Popular transatlantic route for international students and permanent residency travelers.', '/images/dest_london_bridge_1793267887832.jpg', true, true, 'Transit visa required depending on stopover (e.g., Paris, Amsterdam, London).'),
  ('off-013', 'Lagos to New York JFK Gateway', 'Lagos', 'LOS', 'New York', 'JFK', 'United States', 'North America', 'international', 'return', 2200000, 'NGN', 'Sample Fare (Indicative)', 'Transatlantic connections to the US East Coast with major alliance partner carriers.', '/images/dest_london_bridge_1793267887832.jpg', false, true, 'Valid US B1/B2 or student visa required before booking confirmation.'),
  ('off-014', 'Abuja to London Heathrow Connection', 'Abuja', 'ABV', 'London', 'LHR', 'United Kingdom', 'Europe', 'international', 'return', 2100000, 'NGN', 'Sample Fare (Indicative)', 'Direct and 1-stop options departing from Abuja Nnamdi Azikiwe International Airport to London.', '/images/dest_london_bridge_1793267887832.jpg', false, true, 'British Airways direct departures and European stopover carriers.')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  indicative_fare = EXCLUDED.indicative_fare,
  is_featured = EXCLUDED.is_featured,
  is_active = EXCLUDED.is_active;
