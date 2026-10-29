import React from 'react';
import {
  ShieldCheck,
  Compass,
  MessageSquare,
  Users,
  CheckCircle2,
  ArrowRight,
  Plane,
  HeartHandshake,
  MapPin,
  Mail,
  PhoneCall,
  Clock,
} from 'lucide-react';
import { FARE_DISCLAIMER, DISPLAY_PHONE } from '../lib/constants';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 pb-16">
      {/* 1. Header Hero */}
      <section className="bg-[#102A43] text-white py-16 sm:py-20 border-b border-[#071A2B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-4">
          <div className="text-xs font-bold text-sky-300 uppercase tracking-wider">
            About Our Business
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading">
            Dedicated Flight Booking Assistance for Nigerian Travelers
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Muna-AirSpace was founded with a singular purpose: to make domestic and international flight planning clear, accessible, and stress-free.
          </p>
        </div>
      </section>

      {/* 2. Core Story & Who We Are */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6 space-y-4">
            <div className="text-xs font-bold text-[#102A43] uppercase tracking-wider">
              Our Story & Philosophy
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              A Personal Approach to Travel in an Impersonal Digital World
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Navigating multiple airline portals, deciphering fluctuating exchange rates, and understanding differing baggage allowances can be overwhelming for travelers.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              At <strong>Muna-AirSpace</strong>, we bridge the gap. We serve as your dedicated travel booking assistant, taking your itinerary preferences, comparing real options across operating airlines, and communicating directly with you on WhatsApp to ensure your booking is handled properly with accredited providers.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('/booking')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#102A43] text-white text-xs font-bold hover:bg-[#071A2B] transition-all cursor-pointer"
              >
                <span>Book a Flight Enquiry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="md:col-span-6 rounded-2xl overflow-hidden shadow-sm border border-slate-200 aspect-4/3">
            <img
              src="/images/dest_lagos_skyline_1793267887899.jpg"
              alt="Lagos Travel Hub"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="bg-white py-16 border-y border-slate-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#102A43] text-white flex items-center justify-center">
                <Compass className="w-5 h-5 text-sky-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">Our Mission</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To simplify air travel for Nigerians traveling domestically and internationally by delivering trustworthy itinerary consultations, transparent fare comparisons, and prompt, courteous customer assistance.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#102A43] text-white flex items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-sky-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">Our Vision</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To become Nigeria’s most trusted flight enquiry and travel coordination partner, recognized for honesty, client-first communication, and unwavering consumer security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Business Values & Principles */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-1">
            Our Commitments
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Built on Transparency & Security
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            The principles that guide every travel consultation we provide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5">
            <div className="text-[#102A43] font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Fare Honesty</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never quote artificially depressed fares to lure clients. We state clearly when prices are indicative estimates and verify live airline tariffs before booking.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5">
            <div className="text-[#102A43] font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero Financial Secrets</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never request private banking PINs, card CVVs, or OTPs. All ticketing payments are conducted through legitimate and verifiable payment channels.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5">
            <div className="text-[#102A43] font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Attentive Service</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We understand travel emergencies, student relocation deadlines, and family visits. We treat each enquiry with speed, diligence, and respect.
            </p>
          </div>
        </div>

        {/* Regulatory Advisory Box */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#102A43]" />
            <span>Operational & Service Scope Disclosure</span>
          </h4>
          <p>
            Muna-AirSpace acts as an independent flight booking assistance and enquiry platform. We do not operate aircraft or set airline baggage and cancellation penalties. Contracts of air carriage are issued in accordance with the operating airline’s conditions of carriage. Sample fares shown across this platform are strictly for indicative guidance.
          </p>
        </div>

        {/* About Us Contact & Office Location Box */}
        <div className="bg-[#102A43] text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <div className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                Visit & Contact Our Team
              </div>
              <h3 className="text-xl font-bold font-heading text-white">
                Muna-AirSpace Headquarters & Customer Care
              </h3>
            </div>
            <a
              href="https://wa.me/2348167693869"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Direct WhatsApp: 081-67-6938-69</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs">
            <div className="space-y-1">
              <div className="text-slate-400 font-semibold flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-300" />
                <span>Physical Office Address</span>
              </div>
              <p className="text-slate-200 font-medium leading-relaxed">
                NO 1, Jim Ovia Street, River Park Estate, Abuja.
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-sky-300" />
                <span>Customer Contact Email</span>
              </div>
              <a
                href="mailto:enquiry@muna-airspace.com"
                className="text-sky-200 hover:text-white font-medium block truncate underline decoration-white/20"
              >
                enquiry@muna-airspace.com
              </a>
              <span className="text-slate-400 text-[11px] block">
                Prompt travel planning assistance
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-300" />
                <span>Operating Hours</span>
              </div>
              <p className="text-slate-200 font-medium">
                Mon – Sat: 8:00 AM – 7:00 PM WAT
              </p>
              <p className="text-slate-400 text-[11px]">
                Urgent flight enquiries answered via WhatsApp
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-6">
        <h3 className="text-2xl font-bold text-slate-900 font-heading">
          Have an upcoming trip to plan?
        </h3>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Contact our team today to discuss domestic flight routes across Nigeria or international flights to the UK, Canada, UAE, and beyond.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('/booking')}
            className="px-6 py-3 rounded-xl bg-[#102A43] hover:bg-[#071A2B] text-white font-bold text-xs shadow-sm cursor-pointer"
          >
            Start Booking Enquiry
          </button>
          <button
            onClick={() => onNavigate('/contact')}
            className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs cursor-pointer"
          >
            Contact Information
          </button>
        </div>
      </section>
    </div>
  );
};
