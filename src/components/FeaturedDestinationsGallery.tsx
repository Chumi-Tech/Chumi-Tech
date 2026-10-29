import React, { useState, useEffect } from 'react';
import {
  Compass,
  ArrowRight,
  Clock,
  Plane,
  Sparkles,
  MapPin,
  ExternalLink,
  MessageSquare,
  Thermometer,
  ShieldCheck,
  Calendar,
  X,
} from 'lucide-react';
import { WHATSAPP_NUMBER } from '../lib/constants';

interface DestinationItem {
  id: string;
  name: string;
  code: string;
  country: string;
  category: 'domestic' | 'international';
  image: string;
  description: string;
  longDescription: string;
  flightDuration: string;
  typicalAirlines: string[];
  climateNote: string;
  timezone: string;
  indicativeStartingFare: string;
  highlights: string[];
  travelTip: string;
}

const DESTINATIONS: DestinationItem[] = [
  {
    id: 'lagos',
    name: 'Lagos',
    code: 'LOS',
    country: 'Nigeria',
    category: 'domestic',
    image: '/src/assets/images/dest_lagos_skyline_1793267887899.jpg',
    description: 'Nigeria’s pulsating commercial nerve center, Atlantic coastal energy, and cultural powerhouse.',
    longDescription:
      'Lagos is West Africa’s most vibrant commercial metropolis. From the financial boardrooms of Victoria Island and Marina to the beaches of Lekki and rich arts culture, Lagos is Nigeria’s primary international gateway and domestic hub.',
    flightDuration: 'Hub / Domestic Base',
    typicalAirlines: ['Air Peace', 'Ibom Air', 'Arik Air', 'United Nigeria'],
    climateNote: 'Tropical Breeze · 30°C',
    timezone: 'Africa/Lagos',
    indicativeStartingFare: 'From ₦145,000',
    highlights: ['Lekki-Ikoyi Link Bridge', 'Victoria Island Financial District', 'Nike Art Gallery', 'Tarkwa Bay'],
    travelTip: 'Morning flights from Lagos Domestic (MMA2) are ideal to avoid expressway traffic.',
  },
  {
    id: 'abuja',
    name: 'Abuja',
    code: 'ABV',
    country: 'Nigeria',
    category: 'domestic',
    image: '/src/assets/images/dest_abuja_rock_1793267886361.jpg',
    description: 'The Federal Capital Territory beneath the towering natural monument of Aso Rock.',
    longDescription:
      'Abuja offers wide tree-lined boulevards, national governmental institutions, and serene mountainous landscapes. Connecting business executives, diplomats, and families across the nation daily.',
    flightDuration: '1h 10m from Lagos',
    typicalAirlines: ['Air Peace', 'Ibom Air', 'Max Air', 'Aero Contractors'],
    climateNote: 'Sunny Savannah · 31°C',
    timezone: 'Africa/Lagos',
    indicativeStartingFare: 'From ₦145,000',
    highlights: ['Aso Rock Monolith', 'National Mosque & Christian Centre', 'Millennium Park', 'Jabi Lake'],
    travelTip: 'Book Abuja departures at least 3 days in advance for peak executive Monday/Friday shuttles.',
  },
  {
    id: 'london',
    name: 'London',
    code: 'LHR',
    country: 'United Kingdom',
    category: 'international',
    image: '/src/assets/images/dest_london_bridge_1793267887832.jpg',
    description: 'Premier global hub for university studies, corporate finance, and Nigerian diaspora reunions.',
    longDescription:
      'Connecting Nigeria to the United Kingdom with daily direct and one-stop flights. London is the leading travel destination for Nigerian students, business leaders, and family visits.',
    flightDuration: '6h 35m Direct from Lagos',
    typicalAirlines: ['British Airways', 'Virgin Atlantic', 'Air Peace', 'Qatar Airways', 'Lufthansa'],
    climateNote: 'Mild Twilight · 16°C',
    timezone: 'Europe/London',
    indicativeStartingFare: 'From ₦1,950,000',
    highlights: ['Tower Bridge & River Thames', 'Westminster & Big Ben', 'Canary Wharf', 'Oxford Street'],
    travelTip: 'UK Standard Visitor or Student Visa must be verified before ticketing.',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    code: 'DXB',
    country: 'United Arab Emirates',
    category: 'international',
    image: '/src/assets/images/dest_dubai_skyline_1793267887900.jpg',
    description: 'Futuristic oasis of luxury shopping, world-class architecture, and global trade fairs.',
    longDescription:
      'Dubai is Nigeria’s favorite destination for luxury holidays, business conferences, international trade, and family entertainment. Offering modern airport facilities and renowned hospitality.',
    flightDuration: '7h 45m Direct from Lagos',
    typicalAirlines: ['Emirates', 'Qatar Airways', 'EgyptAir', 'Ethiopian Airlines'],
    climateNote: 'Golden Desert Glow · 32°C',
    timezone: 'Asia/Dubai',
    indicativeStartingFare: 'From ₦1,450,000',
    highlights: ['Burj Khalifa & Dubai Mall', 'Palm Jumeirah', 'Dubai Marina', 'Gold & Spice Souks'],
    travelTip: 'UAE entry permits or tourist visas can be processed alongside your flight enquiry.',
  },
  {
    id: 'johannesburg',
    name: 'Johannesburg',
    code: 'JNB',
    country: 'South Africa',
    category: 'international',
    image: '/src/assets/images/dest_joburg_skyline_1793269256130.jpg',
    description: 'Southern Africa’s golden metropolis with rich culture, corporate commerce, and scenic safaris.',
    longDescription:
      'Known as Egoli (City of Gold), Johannesburg is the financial heartbeat of South Africa. Seamlessly connecting Nigerian business delegates, conference attendees, and holidaymakers.',
    flightDuration: '6h 10m Direct from Lagos',
    typicalAirlines: ['South African Airways', 'Air Peace', 'RwandAir', 'Kenya Airways'],
    climateNote: 'Pleasant Breeze · 22°C',
    timezone: 'Africa/Johannesburg',
    indicativeStartingFare: 'From ₦1,650,000',
    highlights: ['Nelson Mandela Bridge', 'Sandton Financial City', 'Soweto Heritage', 'Cradle of Humankind'],
    travelTip: 'Yellow fever vaccination card and valid South African visitor visa required.',
  },
  {
    id: 'toronto',
    name: 'Toronto',
    code: 'YYZ',
    country: 'Canada',
    category: 'international',
    image: '/src/assets/images/dest_toronto_skyline_1793269256746.jpg',
    description: 'Dynamic Canadian economic center welcoming Nigerian scholars, skilled workers, and families.',
    longDescription:
      'Canada’s largest city and cultural melting pot. An increasingly essential route for Nigerian university students, permanent residents, and transatlantic commerce.',
    flightDuration: '14h 20m 1-Stop from Lagos',
    typicalAirlines: ['Air Canada partner airlines', 'Air France', 'KLM', 'British Airways', 'Delta'],
    climateNote: 'Crisp Evening · 14°C',
    timezone: 'America/Toronto',
    indicativeStartingFare: 'From ₦1,850,000',
    highlights: ['CN Tower & Waterfront', 'University of Toronto', 'Financial District', 'Niagara Falls Excursions'],
    travelTip: 'Ensure transit visa rules are checked depending on your European or US layover point.',
  },
];

interface FeaturedDestinationsGalleryProps {
  onNavigate: (path: string, params?: Record<string, string>) => void;
}

export const FeaturedDestinationsGallery: React.FC<FeaturedDestinationsGalleryProps> = ({
  onNavigate,
}) => {
  const [filter, setFilter] = useState<'all' | 'domestic' | 'international'>('all');
  const [selectedDestination, setSelectedDestination] = useState<DestinationItem | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Update clock periodically for living atmosphere
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredDestinations = DESTINATIONS.filter((d) => {
    if (filter === 'all') return true;
    return d.category === filter;
  });

  const handleExploreOffers = (dest: DestinationItem) => {
    onNavigate('/menu', { search: dest.name });
  };

  const handleBookFlight = (dest: DestinationItem) => {
    onNavigate('/booking', {
      destination: `${dest.name} (${dest.code})`,
      origin: 'Lagos (LOS)',
      tripType: 'return',
    });
  };

  const handleWhatsAppEnquiry = (dest: DestinationItem) => {
    const text = encodeURIComponent(
      `Hello Muna-AirSpace! I am interested in flight options and current confirmed fares to *${dest.name} (${dest.code}), ${dest.country}*. Kindly assist with schedule and airline options.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  // Helper to format local time in target destination timezone
  const getDestinationLocalTime = (tz: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(new Date());
    } catch {
      return '12:00 PM';
    }
  };

  return (
    <section className="relative py-20 bg-[#071A2B] text-white overflow-hidden">
      {/* 5D Multi-Layer Spatial Lighting Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-500 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-indigo-500 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-blue-600 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-300 uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>5D Modern Destination Experience</span>
              <span aria-hidden="true">·</span>
              <span>Global Horizons</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading">
              Featured Flight Destinations
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Explore premier Nigerian commercial capitals and iconic international cities with high-fidelity visual immersion, indicative fares, live local times, and instant WhatsApp booking handoff.
            </p>
          </div>

          {/* Category Filter Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-white text-[#071A2B] shadow-md font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              All Hubs ({DESTINATIONS.length})
            </button>
            <button
              onClick={() => setFilter('domestic')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filter === 'domestic'
                  ? 'bg-white text-[#071A2B] shadow-md font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Nigeria Domestic
            </button>
            <button
              onClick={() => setFilter('international')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filter === 'international'
                  ? 'bg-white text-[#071A2B] shadow-md font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              International
            </button>
          </div>
        </div>

        {/* 5D Gallery Cards Grid with Perspective and Depth */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest) => {
            const localTime = getDestinationLocalTime(dest.timezone);

            return (
              <div
                key={dest.id}
                onClick={() => setSelectedDestination(dest)}
                className="group relative rounded-3xl overflow-hidden bg-gradient-to-b from-white/10 to-white/5 border border-white/15 backdrop-blur-xl shadow-2xl hover:shadow-sky-500/10 hover:border-sky-400/50 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1.5"
                style={{
                  perspective: '1000px',
                }}
              >
                {/* 5D Panoramic Image Container with Measured Scrim */}
                <div className="relative aspect-16/10 overflow-hidden bg-slate-900">
                  <img
                    src={dest.image}
                    alt={`${dest.name}, ${dest.country}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle specular gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071A2B] via-[#071A2B]/40 to-transparent opacity-90" />

                  {/* Top Floating Badges: Dimension 4 (Time & Atmosphere) */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono text-[11px] flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-sky-300" />
                      <span>{localTime} local</span>
                    </span>

                    <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-sky-200 font-bold text-[11px] uppercase tracking-wider font-mono">
                      {dest.code}
                    </span>
                  </div>

                  {/* Atmospheric Tag & Flight Duration Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-1 drop-shadow">
                      <Thermometer className="w-3 h-3 text-sky-300" />
                      <span>{dest.climateNote}</span>
                    </span>

                    <span className="flex items-center gap-1 drop-shadow font-medium">
                      <Plane className="w-3 h-3 text-sky-300 -rotate-45" />
                      <span>{dest.flightDuration}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body & 5D Spatial Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Destination Title & Country */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                        <h3 className="text-xl font-bold text-white font-heading tracking-tight group-hover:text-sky-300 transition-colors">
                          {dest.name}
                        </h3>
                      </div>
                      <span className="text-xs text-slate-400 capitalize">{dest.country}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mt-2.5 line-clamp-2">
                      {dest.description}
                    </p>

                    {/* Highlights Pills */}
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {dest.highlights.slice(0, 3).map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Footer with Indicative Fare */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                        Indicative Fare
                      </span>
                      <span className="text-sm font-extrabold text-sky-300 font-mono">
                        {dest.indicativeStartingFare}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDestination(dest);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white text-white hover:text-[#071A2B] text-xs font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Explorer Action */}
        <div className="text-center pt-4">
          <button
            onClick={() => onNavigate('/menu')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
          >
            <span>View All Available Flights in Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5D Destination Insight Modal (Full Interactive Immersion) */}
      {selectedDestination && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#071A2B] border border-white/20 text-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl my-8 space-y-6">
            {/* Modal Header Media Panorama */}
            <div className="relative aspect-16/9 bg-slate-900 overflow-hidden">
              <img
                src={selectedDestination.image}
                alt={selectedDestination.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071A2B] via-black/40 to-black/20" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedDestination(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & IATA Code in Header */}
              <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-300 uppercase tracking-widest mb-1">
                    <span>{selectedDestination.category} Destination</span>
                    <span aria-hidden="true">·</span>
                    <span>Airport IATA: {selectedDestination.code}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                    {selectedDestination.name}, {selectedDestination.country}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-300 block uppercase font-semibold">
                    Indicative Fare
                  </span>
                  <span className="text-base sm:text-lg font-mono font-bold text-sky-300">
                    {selectedDestination.indicativeStartingFare}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 pt-0 text-xs">
              <p className="text-sm text-slate-200 leading-relaxed">
                {selectedDestination.longDescription}
              </p>

              {/* 5D Travel Specification Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-sky-300">
                    <Plane className="w-4 h-4 -rotate-45" />
                    <span>Flight Logistics</span>
                  </div>
                  <div className="text-slate-300">
                    Duration: <strong>{selectedDestination.flightDuration}</strong>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Operating Airlines: {selectedDestination.typicalAirlines.join(', ')}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-sky-300">
                    <Clock className="w-4 h-4" />
                    <span>Time & Climate</span>
                  </div>
                  <div className="text-slate-300">
                    Current Local Time:{' '}
                    <strong>{getDestinationLocalTime(selectedDestination.timezone)}</strong>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Atmosphere: {selectedDestination.climateNote}
                  </div>
                </div>
              </div>

              {/* Travel Advisory & Highlights */}
              <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-800/60 space-y-2 text-slate-300">
                <div className="flex items-center gap-1.5 font-bold text-sky-200">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>Muna-AirSpace Booking & Advisory Tip:</span>
                </div>
                <p className="text-[11px] leading-relaxed">{selectedDestination.travelTip}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleBookFlight(selectedDestination);
                    setSelectedDestination(null);
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#071A2B] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Plane className="w-4 h-4 -rotate-45" />
                  <span>Book Flight to {selectedDestination.name}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleWhatsAppEnquiry(selectedDestination);
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Enquire on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleExploreOffers(selectedDestination);
                    setSelectedDestination(null);
                  }}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all border border-white/15"
                >
                  View Offers
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
