import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  PhoneCall,
  Clock,
  Compass,
  Check,
  ChevronDown,
  Plane,
} from 'lucide-react';
import { FlightSearchBox } from '../components/FlightSearchBox';
import { OfferCard } from '../components/OfferCard';
import { FeaturedDestinationsGallery } from '../components/FeaturedDestinationsGallery';
import { FlightOffer } from '../types';
import { DISPLAY_PHONE, FARE_DISCLAIMER } from '../lib/constants';

interface HomePageProps {
  offers: FlightOffer[];
  onNavigate: (path: string, params?: Record<string, string>) => void;
  onSelectOffer: (offer: FlightOffer) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ offers, onNavigate, onSelectOffer }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const featuredOffers = offers.filter((o) => o.is_featured).slice(0, 4);

  const faqs = [
    {
      q: 'How does Muna-AirSpace assist with flight bookings?',
      a: 'We provide dedicated flight booking assistance for travelers across Nigeria and abroad. We review your travel itinerary, compare scheduled routes across verified airlines, present clear indicative options, and coordinate directly with you on WhatsApp to ensure your booking is arranged smoothly with authorized providers.',
    },
    {
      q: 'Are the fares shown on this website live or guaranteed?',
      a: 'All displayed sample fares are illustrative estimates for guidance and enquiry. Flight prices fluctuate in real time according to airline inventory, seasonal demand, exchange rates, and ticket class availability. Upon receiving your enquiry, Muna-AirSpace checks the latest confirmed live fares before any purchase is finalized.',
    },
    {
      q: 'How does the WhatsApp handoff work?',
      a: 'When you submit an enquiry form or click to book an offer, our system generates a unique reference number and pre-populates a structured summary of your route, dates, and passenger details. A WhatsApp chat link opens directly with our business line (081-67-6938-69). Simply tap "Send" in WhatsApp to begin chatting with our booking specialist.',
    },
    {
      q: 'Can you assist with domestic flights within Nigeria?',
      a: 'Yes! We actively assist with domestic routes between Lagos, Abuja, Port Harcourt, Kano, Enugu, Owerri, Asaba, Benin City, Sokoto, Calabar, and all operational commercial airports across Nigeria.',
    },
    {
      q: 'What payment methods are used for tickets?',
      a: 'For your security, Muna-AirSpace never asks for bank card details, ATM PINs, or confidential banking passwords on this website. Verified payment instructions for ticket issuance are provided directly and securely through official bank transfers or authorized travel booking agency channels.',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-[#071A2B] text-white pt-12 pb-24">
        {/* Background Aircraft Imagery */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero_aircraft_clouds_1793267885903.jpg"
            alt="Aircraft cruising above clouds"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40 scale-105"
          />
          {/* Measured Scrim Gradient for WCAG AA Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#071A2B]/85 via-[#071A2B]/75 to-[#071A2B]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full">
          <div className="max-w-3xl space-y-6 pt-6 pb-8">
            {/* Clean Unboxed Kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-sky-300 uppercase">
              <span>Nigerian Travel Assistance</span>
              <span aria-hidden="true">·</span>
              <span>Domestic & International Flights</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-heading text-balance">
              Your Journey Begins with <span className="text-sky-300">Muna-AirSpace</span>.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Discover flights across Nigeria and around the world. Let us help you plan your next journey with confidence, personalized guidance, and prompt WhatsApp assistance.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('/menu')}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-[#071A2B] font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-white/20 whitespace-nowrap shrink-0"
              >
                <span>Explore Flight Offers</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('/booking')}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-white/20 whitespace-nowrap shrink-0"
              >
                <span>Book a Flight</span>
              </button>
            </div>
          </div>

          {/* Embedded Flight Search / Enquiry Panel */}
          <div className="mt-6">
            <FlightSearchBox
              onSearchSubmit={(params) => {
                onNavigate('/booking', {
                  origin: params.origin,
                  destination: params.destination,
                  departureDate: params.departureDate,
                  returnDate: params.returnDate || '',
                  tripType: params.tripType,
                  adults: String(params.adults),
                  cabin: params.cabin,
                });
              }}
            />
          </div>
        </div>
      </section>

      {/* 2. POPULAR / FEATURED FLIGHT OFFERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-1">
              Curated Itineraries
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Popular Flight Offers
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Sample indicative fares for trending domestic Nigerian and global routes. Tap any offer to enquire directly on WhatsApp.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/menu')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#102A43] hover:text-[#071A2B] group cursor-pointer self-start sm:self-auto"
          >
            <span>View All Flight Offers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} onBook={onSelectOffer} />
          ))}
        </div>

        {/* Advisory banner below offers */}
        <div className="mt-8 p-4 rounded-xl bg-slate-100/80 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-[#102A43] shrink-0 mt-0.5" />
          <span>
            <strong>Note on Sample Fares:</strong> {FARE_DISCLAIMER}
          </span>
        </div>
      </section>

      {/* 3. HOW IT WORKS: 4-STEP EDITORIAL FLOW */}
      <section className="bg-white py-16 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-2">
              Simple & Transparent
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              How Muna-AirSpace Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Four straightforward steps to organize your flight enquiry with human care and reliable WhatsApp follow-up.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
              <span className="text-xs font-mono font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                01
              </span>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Choose Destination
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select your departure airport in Nigeria or abroad, your target destination, preferred dates, and traveler numbers.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
              <span className="text-xs font-mono font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                02
              </span>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Submit Travel Details
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provide your passenger name and contact information through our structured booking form to receive an enquiry reference.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
              <span className="text-xs font-mono font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                03
              </span>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Discuss on WhatsApp
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect directly with Muna-AirSpace on WhatsApp (081-67-6938-69) to review confirmed flight options, timings, and airline tariffs.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
              <span className="text-xs font-mono font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                04
              </span>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Complete Booking
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Finalize your ticket with authorized airline or agency providers and receive your confirmed e-ticket and itinerary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE MUNA-AIRSPACE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-bold text-[#102A43] uppercase tracking-wider">
              Authentic Service Commitment
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-heading leading-tight">
              Why Travelers Choose Muna-AirSpace
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Booking flights across Nigeria or internationally can often be confusing with unpredictable tariffs, route adjustments, and automated bots. Muna-AirSpace provides attentive, human-centered assistance.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Personal Flight Consultation</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Direct one-on-one assistance to evaluate the best airline combinations for your schedule and budget.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Transparent Fare Communication</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Clear breakdown of baggage rules, transit requirements, and genuine fare estimates before any commitment.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Fast WhatsApp Follow-Up</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    No endless customer service call queues. Talk directly with real people on Nigeria’s favorite messaging app.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Domestic & Diaspora Expertise</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Deep familiarity with Nigerian inter-state travel as well as UK, Canada, US, and Middle East routes.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('/about')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#102A43] hover:underline"
              >
                <span>Read more about our business</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Bento Visual Showcase */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden aspect-4/3 shadow-sm border border-slate-200">
                <img
                  src="/images/dest_abuja_rock_1793267886361.jpg"
                  alt="Aso Rock Abuja Nigeria"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative p-5 rounded-2xl overflow-hidden shadow-sm text-white">
                <img
                  src="/images/dest_lagos_skyline_1793267887899.jpg"
                  alt="Lagos skyline at dusk"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071A2B]/95 via-[#071A2B]/75 to-[#102A43]/30" />
                <div className="relative">
                  <div className="text-xs text-sky-300 font-semibold uppercase tracking-wider mb-1">
                    Domestic Network
                  </div>
                  <div className="text-lg font-bold font-heading">All Major Nigerian Hubs</div>
                  <p className="text-xs text-slate-200 mt-1">
                    Regular assistance for Lagos, Abuja, Port Harcourt, Kano, and southeastern routes.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="relative p-5 rounded-2xl overflow-hidden shadow-sm text-white">
                <img
                  src="/images/dest_dubai_skyline_1793267887900.jpg"
                  alt="Dubai skyline"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#071A2B]/95 via-[#071A2B]/75 to-[#102A43]/30" />
                <div className="relative">
                  <div className="text-xs text-sky-300 font-semibold uppercase tracking-wider mb-1">
                    International Travel
                  </div>
                  <div className="text-lg font-bold font-heading">Global Connections</div>
                  <p className="text-xs text-slate-200 mt-1">
                    Reliable guidance on flights to the UK, Middle East, North America, and across Africa.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden aspect-4/3 shadow-sm border border-slate-200">
                <img
                  src="/images/dest_london_bridge_1793267887832.jpg"
                  alt="London Tower Bridge"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 5D MODERN FEATURED DESTINATIONS GALLERY */}
      <FeaturedDestinationsGallery onNavigate={onNavigate} />

      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-10">
          <div className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-1">
            Got Questions?
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Important information on our booking assistance, fare verification, and customer communication.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-[#102A43] cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#102A43]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FINAL BOOKING CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="rounded-3xl bg-[#102A43] text-white p-8 sm:p-14 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="text-xs font-bold text-sky-300 uppercase tracking-wider">
              Ready to Travel?
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
              Plan Your Flight with Muna-AirSpace Today
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Whether you are flying across Nigeria for business or booking an international overseas trip, our team is ready to guide you on WhatsApp.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('/booking')}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-[#071A2B] font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Start Flight Enquiry</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="https://wa.me/2348167693869"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
