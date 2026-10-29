import React, { useState } from 'react';
import { Menu, X, Plane, PhoneCall } from 'lucide-react';
import { DISPLAY_PHONE } from '../lib/constants';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, isAdminLoggedIn }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Flight Offers', path: '/menu' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#102A43]/95 backdrop-blur-md border-b border-[#071A2B]/40 text-white transition-all shadow-sm">
      {/* Top micro bar with contact info & trust line */}
      <div className="bg-[#071A2B] text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300 font-medium">Nigerian Domestic & International Flight Booking Assistance</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-300">
            <a
              href="mailto:enquiry@muna-airspace.com"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <span>enquiry@muna-airspace.com</span>
            </a>
            <span className="text-white/20">|</span>
            <a
              href="tel:+2348167693869"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
              <span>{DISPLAY_PHONE}</span>
            </a>
            <span className="text-white/20">|</span>
            <span>Abuja Office: River Park Estate</span>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: Zone 1 (Brand) — Zone 2 (4 clean links) — Zone 3 (1 primary CTA + Admin Access) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNavClick('/')}
          className="flex items-center gap-2.5 text-left text-white group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/15 group-hover:bg-white/20 transition-all">
            <Plane className="w-5 h-5 text-sky-300 -rotate-45" />
          </div>
          <span className="text-xl font-extrabold tracking-tight font-heading whitespace-nowrap shrink-0">
            Muna<span className="text-sky-300">-AirSpace</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-200">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 rounded ${
                  isActive
                    ? 'text-white font-semibold border-b-2 border-sky-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('/booking')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#071A2B] bg-white hover:bg-slate-100 active:bg-slate-200 rounded-lg shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Book a Flight
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#071A2B] px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavClick(link.path)}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentPath === link.path
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('/booking')}
              className="w-full text-center py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-[#071A2B] bg-white hover:bg-slate-100 rounded-lg shadow-sm"
            >
              Book a Flight
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
