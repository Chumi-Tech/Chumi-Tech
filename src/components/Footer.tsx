import React from 'react';
import { Plane, PhoneCall, Mail, Clock, MapPin, MessageSquare } from 'lucide-react';
import { DISPLAY_PHONE, FARE_DISCLAIMER } from '../lib/constants';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#071A2B] text-slate-300 border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/15">
                <Plane className="w-4 h-4 text-sky-300 -rotate-45" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                Muna<span className="text-sky-300">-AirSpace</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Professional flight booking assistance for domestic Nigerian routes and international journeys. We help you plan with clarity, transparent fares, and dedicated WhatsApp support.
            </p>
            <div className="pt-1">
              <a
                href="https://wa.me/2348167693869"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] text-xs font-semibold border border-[#25D366]/30 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp: 081-67-6938-69</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Explore Routes</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-white transition-colors text-slate-400 cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/menu')}
                  className="hover:text-white transition-colors text-slate-400 cursor-pointer"
                >
                  Flight Offers & Catalogue
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/booking')}
                  className="hover:text-white transition-colors text-slate-400 cursor-pointer"
                >
                  Submit Travel Enquiry
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors text-slate-400 cursor-pointer"
                >
                  About Muna-AirSpace
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-white transition-colors text-slate-400 cursor-pointer"
                >
                  Contact & Assistance
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Nigerian Routes */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Key Flight Routes</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center justify-between py-1 border-b border-white/5">
                <span>Lagos (LOS) ⇄ Abuja (ABV)</span>
                <span className="text-sky-300">Daily</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-white/5">
                <span>Lagos (LOS) → Port Harcourt (PHC)</span>
                <span className="text-sky-300">Frequent</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-white/5">
                <span>Abuja (ABV) → Kano (KAN)</span>
                <span className="text-sky-300">Direct</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-white/5">
                <span>Lagos (LOS) ⇄ London (LHR)</span>
                <span className="text-sky-300">Intl</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-white/5">
                <span>Lagos (LOS) ⇄ Dubai (DXB)</span>
                <span className="text-sky-300">Intl</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Business Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Contact & Office</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="text-slate-200">
                  NO 1, Jim Ovia Street, River Park Estate, Abuja.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <a
                  href="mailto:enquiry@muna-airspace.com"
                  className="text-slate-300 hover:text-white transition-colors underline decoration-white/20"
                >
                  enquiry@muna-airspace.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <a href="tel:+2348167693869" className="hover:text-white transition-colors">
                  {DISPLAY_PHONE}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Mon – Sat: 8:00 AM – 7:00 PM WAT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory & Fare Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400 mb-8 leading-relaxed">
          <strong className="text-slate-200">Important Advisory: </strong>
          {FARE_DISCLAIMER}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div
            onDoubleClick={() => onNavigate('/admin/login')}
            className="cursor-default select-none"
            title="Muna-AirSpace"
          >
            © {new Date().getFullYear()} Muna-AirSpace. All rights reserved. Registered travel booking assistance.
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('/about')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Notice
            </button>
            <button
              onClick={() => onNavigate('/about')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
