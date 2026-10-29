import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { HomePage } from './pages/HomePage';
import { OffersPage } from './pages/OffersPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { BookingPage } from './pages/BookingPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { FlightOffer, AdminUser } from './types';
import { dataApi } from './lib/supabaseClient';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(
    typeof window !== 'undefined' ? window.location.pathname || '/' : '/'
  );
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [offers, setOffers] = useState<FlightOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<FlightOffer | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoadingOffers, setIsLoadingOffers] = useState(true);

  // Parse query parameters
  const parseQueryParams = () => {
    if (typeof window === 'undefined') return;
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const obj: Record<string, string> = {};
    params.forEach((val, key) => {
      obj[key] = val;
    });
    setQueryParams(obj);
  };

  // Synchronize routing with browser history and Supabase auth
  useEffect(() => {
    parseQueryParams();
    
    // Check initial admin session
    dataApi.getCurrentAdmin().then((user) => {
      if (user) setAdminUser(user);
    });

    // Listen to Supabase Auth state changes
    const unsubscribeAuth = dataApi.onAuthStateChange((user) => {
      setAdminUser(user);
    });

    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      parseQueryParams();
    };

    // Secret administrator shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigateTo('/admin');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      unsubscribeAuth();
    };
  }, []);

  // Fetch published offers
  useEffect(() => {
    setIsLoadingOffers(true);
    dataApi
      .getFlightOffers(false)
      .then((data) => setOffers(data))
      .catch((err) => console.error('Failed to load flight offers:', err))
      .finally(() => setIsLoadingOffers(false));
  }, []);

  const navigateTo = (path: string, params?: Record<string, string>) => {
    let url = path;
    if (params && Object.keys(params).length > 0) {
      const search = new URLSearchParams(params).toString();
      url = `${path}?${search}`;
      setQueryParams(params);
    } else {
      setQueryParams({});
    }

    try {
      window.history.pushState({}, '', url);
    } catch (e) {
      console.warn(e);
    }

    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOffer = (offer: FlightOffer) => {
    setSelectedOffer(offer);
    navigateTo('/booking', {
      offerId: offer.id,
      origin: `${offer.origin_city} (${offer.origin_code})`,
      destination: `${offer.destination_city} (${offer.destination_code})`,
      tripType: offer.trip_type,
    });
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    navigateTo('/admin');
  };

  const handleLogout = () => {
    dataApi.adminLogout();
    setAdminUser(null);
    navigateTo('/');
  };

  // Render Page based on currentPath
  const renderCurrentPage = () => {
    // Protected Admin routes (e.g. /admin, /admin/offers, /admin/enquiries)
    if (currentPath.startsWith('/admin')) {
      if (currentPath === '/admin/login') {
        if (adminUser) {
          return (
            <AdminDashboardPage
              adminUser={adminUser}
              onLogout={handleLogout}
              onNavigate={navigateTo}
            />
          );
        }
        return (
          <AdminLoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigate={navigateTo}
          />
        );
      }

      // Any other /admin path requires authenticated admin
      if (!adminUser) {
        return (
          <AdminLoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigate={navigateTo}
          />
        );
      }

      return (
        <AdminDashboardPage
          adminUser={adminUser}
          onLogout={handleLogout}
          onNavigate={navigateTo}
        />
      );
    }

    // Public multi-page routes
    if (currentPath === '/menu') {
      return (
        <OffersPage
          offers={offers}
          onSelectOffer={handleSelectOffer}
          onNavigate={navigateTo}
        />
      );
    }

    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigateTo} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    if (currentPath === '/booking') {
      return (
        <BookingPage
          queryParams={queryParams}
          selectedOffer={selectedOffer}
          onNavigate={navigateTo}
        />
      );
    }

    // Default: Home Page
    return (
      <HomePage
        offers={offers}
        onNavigate={navigateTo}
        onSelectOffer={handleSelectOffer}
      />
    );
  };

  // Hide public navbar and footer inside admin dashboard tab
  const isAdminView = currentPath === '/admin' && adminUser;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F3] text-[#111318]">
      {!isAdminView && (
        <Navbar
          currentPath={currentPath}
          onNavigate={navigateTo}
          isAdminLoggedIn={Boolean(adminUser)}
        />
      )}

      <main className="flex-1">{renderCurrentPage()}</main>

      {!isAdminView && <Footer onNavigate={navigateTo} />}

      {/* Floating WhatsApp Quick Action on public pages */}
      {!isAdminView && <WhatsAppFloat />}

      {/* Discreet return badge shown ONLY when an admin is already logged in and previewing public pages */}
      {!isAdminView && adminUser && (
        <div className="fixed bottom-4 left-4 z-40">
          <button
            onClick={() => navigateTo('/admin')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#102A43] text-white text-xs font-semibold shadow-lg border border-white/20 hover:bg-[#071A2B] transition-all cursor-pointer"
            title="Return to Admin Dashboard"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Admin Active → Dashboard</span>
          </button>
        </div>
      )}
    </div>
  );
}
