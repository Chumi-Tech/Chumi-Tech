import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plane,
  Inbox,
  MessageSquare,
  FileText,
  Database,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Eye,
  LogOut,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  Upload,
  Copy,
  ChevronRight,
  Clock,
  Phone,
  Mail,
  Users,
} from 'lucide-react';
import {
  AdminUser,
  BookingEnquiry,
  ContactMessage,
  FlightOffer,
  SiteSettings,
  EnquiryStatus,
} from '../types';
import { dataApi, isSupabaseConfigured, supabaseUrl } from '../lib/supabaseClient';
import { OfferCard } from '../components/OfferCard';
import { normalizeWhatsAppNumber } from '../lib/whatsapp';
import { COMPLETE_MIGRATION_SQL } from '../lib/migrationSql';

interface AdminDashboardPageProps {
  adminUser: AdminUser;
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

type TabType = 'overview' | 'offers' | 'enquiries' | 'messages' | 'content' | 'database';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  adminUser,
  onLogout,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Data states
  const [offers, setOffers] = useState<FlightOffer[]>([]);
  const [enquiries, setEnquiries] = useState<BookingEnquiry[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & form states
  const [editingOffer, setEditingOffer] = useState<Partial<FlightOffer> | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [previewOffer, setPreviewOffer] = useState<FlightOffer | null>(null);
  const [deleteOfferId, setDeleteOfferId] = useState<string | null>(null);

  const [selectedEnquiry, setSelectedEnquiry] = useState<BookingEnquiry | null>(null);
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<string>('all');
  const [enquiryInternalNotes, setEnquiryInternalNotes] = useState('');

  const [offerSearch, setOfferSearch] = useState('');
  const [copiedMigration, setCopiedMigration] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Supabase test and seeding states
  const [connTest, setConnTest] = useState<{
    testing: boolean;
    result?: { connected: boolean; message: string; tablesExist: boolean };
  }>({
    testing: false,
  });
  const [seedingStatus, setSeedingStatus] = useState<{
    loading: boolean;
    message?: string;
    isError?: boolean;
  }>({
    loading: false,
  });

  const handleTestConnection = async () => {
    setConnTest({ testing: true });
    try {
      const res = await dataApi.testSupabaseConnection();
      setConnTest({ testing: false, result: res });
    } catch (e: any) {
      setConnTest({
        testing: false,
        result: { connected: false, tablesExist: false, message: e?.message || 'Failed test' },
      });
    }
  };

  const handleSeedSupabase = async () => {
    if (!window.confirm('This will seed the 14 default curated flight offers and site settings into your Supabase database. Proceed?')) {
      return;
    }
    setSeedingStatus({ loading: true, message: 'Seeding flight offers and settings to Supabase...' });
    try {
      const res = await dataApi.seedSupabaseDatabase();
      if (res.success) {
        setSeedingStatus({
          loading: false,
          message: `Successfully seeded ${res.count} flight offers and site configuration into your live Supabase database!`,
        });
        await loadData();
      } else {
        setSeedingStatus({
          loading: false,
          message: res.error || 'Seeding failed. Make sure tables are created in Supabase first.',
          isError: true,
        });
      }
    } catch (e: any) {
      setSeedingStatus({ loading: false, message: e?.message || 'Error executing seed', isError: true });
    }
  };

  // Load all dashboard data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [offersData, enquiriesData, messagesData, settingsData] = await Promise.all([
        dataApi.getFlightOffers(true), // Include inactive
        dataApi.getBookingEnquiries(),
        dataApi.getContactMessages(),
        dataApi.getSiteSettings(),
      ]);
      setOffers(offersData);
      setEnquiries(enquiriesData);
      setMessages(messagesData);
      setSiteSettings(settingsData);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- OFFER ACTIONS ---
  const handleOpenNewOffer = () => {
    setEditingOffer({
      title: '',
      origin_city: 'Lagos',
      origin_code: 'LOS',
      destination_city: '',
      destination_code: '',
      country: 'Nigeria',
      region: 'West Africa',
      category: 'domestic',
      trip_type: 'one-way',
      indicative_fare: 150000,
      currency: 'NGN',
      display_label: 'Sample Fare (Indicative)',
      description: '',
      image_url: '/images/hero_aircraft_clouds_1793267885903.jpg',
      is_featured: false,
      is_active: true,
      travel_notes: '',
    });
    setIsOfferModalOpen(true);
  };

  const handleEditOffer = (offer: FlightOffer) => {
    setEditingOffer({ ...offer });
    setIsOfferModalOpen(true);
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;

    try {
      await dataApi.saveFlightOffer(editingOffer);
      setIsOfferModalOpen(false);
      setEditingOffer(null);
      await loadData();
    } catch (err) {
      alert('Error saving offer');
    }
  };

  const handleDeleteOffer = async () => {
    if (!deleteOfferId) return;
    try {
      await dataApi.deleteFlightOffer(deleteOfferId);
      setDeleteOfferId(null);
      await loadData();
    } catch (err) {
      alert('Error deleting offer');
    }
  };

  const handleToggleActive = async (offer: FlightOffer) => {
    try {
      await dataApi.saveFlightOffer({ ...offer, is_active: !offer.is_active });
      await loadData();
    } catch (e) {
      console.warn(e);
    }
  };

  const handleToggleFeatured = async (offer: FlightOffer) => {
    try {
      await dataApi.saveFlightOffer({ ...offer, is_featured: !offer.is_featured });
      await loadData();
    } catch (e) {
      console.warn(e);
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingOffer) return;
    try {
      const url = await dataApi.uploadImage(file);
      setEditingOffer({ ...editingOffer, image_url: url });
    } catch (err) {
      alert('Image upload failed');
    }
  };

  // --- ENQUIRY ACTIONS ---
  const handleOpenEnquiry = (enquiry: BookingEnquiry) => {
    setSelectedEnquiry(enquiry);
    setEnquiryInternalNotes(enquiry.internal_notes || '');
  };

  const handleUpdateEnquiryStatus = async (status: EnquiryStatus) => {
    if (!selectedEnquiry) return;
    try {
      const updated = await dataApi.updateBookingEnquiry(selectedEnquiry.id, {
        status,
        internal_notes: enquiryInternalNotes,
      });
      if (updated) {
        setSelectedEnquiry(updated);
        await loadData();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleSaveEnquiryNotes = async () => {
    if (!selectedEnquiry) return;
    try {
      const updated = await dataApi.updateBookingEnquiry(selectedEnquiry.id, {
        internal_notes: enquiryInternalNotes,
      });
      if (updated) {
        setSelectedEnquiry(updated);
        alert('Notes saved successfully');
        await loadData();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // --- CONTENT SETTINGS SAVE ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSettings) return;
    try {
      await dataApi.updateSiteSettings(siteSettings);
      alert('Site settings updated successfully');
      await loadData();
    } catch (e) {
      alert('Failed to update settings');
    }
  };

  // Filtered lists
  const filteredOffers = offers.filter((o) => {
    if (!offerSearch.trim()) return true;
    const q = offerSearch.toLowerCase();
    return (
      o.title.toLowerCase().includes(q) ||
      o.origin_city.toLowerCase().includes(q) ||
      o.destination_city.toLowerCase().includes(q) ||
      o.destination_code.toLowerCase().includes(q)
    );
  });

  const filteredEnquiries = enquiries.filter((e) => {
    if (enquiryStatusFilter !== 'all' && e.status !== enquiryStatusFilter) {
      return false;
    }
    if (enquirySearch.trim()) {
      const q = enquirySearch.toLowerCase();
      return (
        e.reference_number.toLowerCase().includes(q) ||
        e.full_name.toLowerCase().includes(q) ||
        e.phone.toLowerCase().includes(q) ||
        e.destination_airport.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalOffers = offers.length;
  const activeOffers = offers.filter((o) => o.is_active).length;
  const featuredOffers = offers.filter((o) => o.is_featured).length;
  const newEnquiries = enquiries.filter((e) => e.status === 'new').length;
  const unreadMessages = messages.filter((m) => m.status === 'new').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Navigation Bar */}
      <header className="bg-[#071A2B] text-white border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center border border-sky-400/30">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight font-heading">
              Muna-AirSpace Admin
            </div>
            <div className="text-[10px] text-slate-400">
              Logged in: <span className="text-slate-200">{adminUser.email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('/')}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-rose-500/20 text-slate-200 hover:text-rose-200 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content & Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-3 space-y-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#102A43] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('offers')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'offers'
                  ? 'bg-[#102A43] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Plane className="w-4 h-4" />
                <span>Flight Offers</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                {totalOffers}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('enquiries')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'enquiries'
                  ? 'bg-[#102A43] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4" />
                <span>Booking Enquiries</span>
              </div>
              {newEnquiries > 0 ? (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-white">
                  {newEnquiries} new
                </span>
              ) : (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                  {enquiries.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-[#102A43] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>Contact Messages</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                {messages.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-[#102A43] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>Content & Contact Info</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'database'
                  ? 'bg-[#102A43] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4" />
                <span>Supabase & SQL Migration</span>
              </div>
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-400'
                }`}
                title={isSupabaseConfigured ? 'Supabase connected' : 'Local repo mode'}
              />
            </button>
          </div>

          {/* Database mode pill */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center justify-between font-semibold text-slate-800">
              <span>Database Engine:</span>
              <span className={isSupabaseConfigured ? 'text-emerald-600' : 'text-amber-600'}>
                {isSupabaseConfigured ? 'Supabase Cloud' : 'Local Repository'}
              </span>
            </div>
            <p className="text-[10px] leading-relaxed">
              {isSupabaseConfigured
                ? 'All operations sync with live PostgreSQL & Supabase Auth.'
                : 'Full CRUD operations active via local persistence. View the Supabase tab to connect.'}
            </p>
          </div>
        </aside>

        {/* Tab Content Area */}
        <main className="lg:col-span-9 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Total Offers
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tabular-nums font-heading">
                    {totalOffers}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {activeOffers} active · {totalOffers - activeOffers} draft
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Featured
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tabular-nums font-heading">
                    {featuredOffers}
                  </div>
                  <div className="text-[11px] text-slate-400">Highlighted on Homepage</div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    New Enquiries
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tabular-nums font-heading">
                    {newEnquiries}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {enquiries.length} total received
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Messages
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tabular-nums font-heading">
                    {unreadMessages}
                  </div>
                  <div className="text-[11px] text-slate-400">Unread contact inquiries</div>
                </div>
              </div>

              {/* Quick Actions & Recent Enquiries */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      Recent Flight Enquiries
                    </h3>
                    <p className="text-xs text-slate-500">
                      Customer requests submitted via web form and WhatsApp
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleOpenNewOffer}
                      className="px-3.5 py-2 rounded-xl bg-[#102A43] text-white text-xs font-semibold hover:bg-[#071A2B] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Offer</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('enquiries')}
                      className="text-xs text-[#102A43] hover:underline font-semibold"
                    >
                      View All
                    </button>
                  </div>
                </div>

                {enquiries.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                          <th className="pb-2.5">Reference</th>
                          <th className="pb-2.5">Passenger</th>
                          <th className="pb-2.5">Route</th>
                          <th className="pb-2.5">Travel Date</th>
                          <th className="pb-2.5">Status</th>
                          <th className="pb-2.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {enquiries.slice(0, 5).map((e) => (
                          <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 font-mono font-bold text-slate-800">
                              {e.reference_number}
                            </td>
                            <td className="py-3 font-semibold text-slate-900">{e.full_name}</td>
                            <td className="py-3 text-slate-600">
                              {e.departure_airport} → {e.destination_airport}
                            </td>
                            <td className="py-3 text-slate-600">{e.departure_date}</td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                                  e.status === 'new'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : e.status === 'in_progress'
                                    ? 'bg-amber-100 text-amber-800'
                                    : e.status === 'completed'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {e.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleOpenEnquiry(e)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px] cursor-pointer"
                              >
                                Inspect
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-4 text-center">No enquiries yet.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FLIGHT OFFERS MANAGEMENT */}
          {activeTab === 'offers' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-heading">
                      Flight Offers & Route Inventory
                    </h3>
                    <p className="text-xs text-slate-500">
                      Create, edit, publish, or remove sample flight offers for visitors.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenNewOffer}
                    className="px-4 py-2.5 rounded-xl bg-[#102A43] hover:bg-[#071A2B] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Flight Offer</span>
                  </button>
                </div>

                {/* Offer Search bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Filter offers by route, city, or title..."
                    value={offerSearch}
                    onChange={(e) => setOfferSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                  />
                </div>

                {/* Offers Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="pb-2.5">Title & Route</th>
                        <th className="pb-2.5">Category</th>
                        <th className="pb-2.5">Indicative Fare</th>
                        <th className="pb-2.5">Featured</th>
                        <th className="pb-2.5">Status</th>
                        <th className="pb-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOffers.map((offer) => (
                        <tr key={offer.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3">
                            <div className="font-bold text-slate-900 line-clamp-1">{offer.title}</div>
                            <div className="text-[11px] text-slate-500">
                              {offer.origin_city} ({offer.origin_code}) → {offer.destination_city} ({offer.destination_code})
                            </div>
                          </td>
                          <td className="py-3">
                            <span className="capitalize text-slate-700 font-medium">
                              {offer.category} ({offer.trip_type})
                            </span>
                          </td>
                          <td className="py-3 font-mono font-bold text-[#102A43]">
                            {offer.currency} {Number(offer.indicative_fare).toLocaleString()}
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => handleToggleFeatured(offer)}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                                offer.is_featured
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              {offer.is_featured ? 'Featured ★' : 'Standard'}
                            </button>
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => handleToggleActive(offer)}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                                offer.is_active
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {offer.is_active ? 'Published' : 'Draft / Inactive'}
                            </button>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setPreviewOffer(offer)}
                                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                                title="Preview Public Card"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleEditOffer(offer)}
                                className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-slate-100 rounded"
                                title="Edit Offer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteOfferId(offer.id)}
                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded"
                                title="Delete Offer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BOOKING ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-heading">
                      Booking Enquiries Management
                    </h3>
                    <p className="text-xs text-slate-500">
                      Manage customer travel requests, update status, and take notes.
                    </p>
                  </div>

                  {/* Status filter tabs */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium self-start sm:self-auto">
                    {['all', 'new', 'in_progress', 'completed'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setEnquiryStatusFilter(st)}
                        className={`px-2.5 py-1 rounded-md transition-colors capitalize ${
                          enquiryStatusFilter === st
                            ? 'bg-[#102A43] text-white font-semibold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Enquiry Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search by Reference ID (e.g. MAS-2026-...), passenger name, or phone..."
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                  />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="pb-2.5">Ref #</th>
                        <th className="pb-2.5">Passenger</th>
                        <th className="pb-2.5">Contact</th>
                        <th className="pb-2.5">Itinerary</th>
                        <th className="pb-2.5">Dates</th>
                        <th className="pb-2.5">Status</th>
                        <th className="pb-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredEnquiries.map((e) => (
                        <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 font-mono font-bold text-slate-900">
                            {e.reference_number}
                          </td>
                          <td className="py-3 font-semibold text-slate-900">{e.full_name}</td>
                          <td className="py-3 text-slate-600">{e.phone}</td>
                          <td className="py-3 text-slate-700">
                            {e.departure_airport} → {e.destination_airport}
                            <span className="block text-[10px] text-slate-400 capitalize">
                              {e.cabin_preference.replace('_', ' ')} · {e.adults} adult{e.adults > 1 ? 's' : ''}
                            </span>
                          </td>
                          <td className="py-3 text-slate-600">
                            {e.departure_date}
                            {e.return_date && <span> / {e.return_date}</span>}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                                e.status === 'new'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : e.status === 'in_progress'
                                  ? 'bg-amber-100 text-amber-800'
                                  : e.status === 'completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {e.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleOpenEnquiry(e)}
                              className="px-3 py-1 bg-[#102A43] hover:bg-[#071A2B] text-white rounded font-semibold text-[11px] cursor-pointer"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT MESSAGES */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  General Contact Messages
                </h3>
                <p className="text-xs text-slate-500">
                  Customer messages submitted through the /contact page.
                </p>
              </div>

              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-sm text-slate-900">{m.subject}</div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(m.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-600">
                        <span><strong>From:</strong> {m.full_name}</span>
                        <span><strong>Phone:</strong> {m.phone}</span>
                        <span><strong>Email:</strong> {m.email}</span>
                      </div>
                      <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                        {m.message}
                      </p>
                      <div className="pt-1 flex items-center gap-2">
                        <a
                          href={`https://wa.me/${normalizeWhatsAppNumber(m.phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-[#25D366] text-white rounded font-semibold text-[11px] inline-flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3 fill-white" />
                          <span>Reply on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-6 text-center">No contact messages yet.</p>
              )}
            </div>
          )}

          {/* TAB 5: CONTENT SETTINGS */}
          {activeTab === 'content' && siteSettings && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  Website Content & Business Settings
                </h3>
                <p className="text-xs text-slate-500">
                  Update homepage hero text, WhatsApp business number, and operating hours.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Homepage Hero Headline
                  </label>
                  <input
                    type="text"
                    value={siteSettings.hero_headline}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, hero_headline: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Homepage Supporting Subtext
                  </label>
                  <textarea
                    rows={3}
                    value={siteSettings.hero_subtext}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, hero_subtext: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Business WhatsApp Number (International format)
                    </label>
                    <input
                      type="text"
                      value={siteSettings.whatsapp_number}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, whatsapp_number: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                    />
                    <span className="text-[10px] text-slate-400">
                      Standard: 2348167693869 (corresponds to 081-67-6938-69)
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Display Telephone
                    </label>
                    <input
                      type="text"
                      value={siteSettings.contact_phone}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, contact_phone: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={siteSettings.contact_email}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, contact_email: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Business Operating Hours
                    </label>
                    <input
                      type="text"
                      value={siteSettings.business_hours}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, business_hours: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#102A43] hover:bg-[#071A2B] text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  Save Website Content
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: SUPABASE & SQL MIGRATIONS */}
          {activeTab === 'database' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    Supabase PostgreSQL Database & Storage Setup
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live connection status, database tables, Row Level Security (RLS), and schema migration.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                      isSupabaseConfigured
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Running in Local Mode'}</span>
                  </div>
                </div>
              </div>

              {/* Connected Project Credentials Card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Configured Supabase Project</span>
                  <button
                    onClick={handleTestConnection}
                    disabled={connTest.testing}
                    className="px-3 py-1 rounded-lg bg-[#102A43] hover:bg-[#071A2B] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${connTest.testing ? 'animate-spin' : ''}`} />
                    <span>{connTest.testing ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Project REST / API URL</span>
                    <span className="font-mono text-xs font-semibold text-slate-800 break-all">
                      {supabaseUrl || 'https://punuxvbyihagweoxptuf.supabase.co'}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Public Anon Key</span>
                      <span className="font-mono text-xs text-slate-600">
                        eyJhbGciOi...VRphaMg
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1bnV4dmJ5aWhhZ3dlb3hwdHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyNjc2MDksImV4cCI6MjEwODg0MzYwOX0.GyBO4JC4Y4zcc_yTLhf9oWY4tFxt6Z6d5j2_VRphaMg');
                        setCopiedKey(true);
                        setTimeout(() => setCopiedKey(false), 2000);
                      }}
                      className="text-xs text-[#102A43] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                    </button>
                  </div>
                </div>

                {/* Connection Test Diagnostics Banner */}
                {connTest.result && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                      connTest.result.connected && connTest.result.tablesExist
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : connTest.result.connected && !connTest.result.tablesExist
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">
                        {connTest.result.connected && connTest.result.tablesExist
                          ? 'Supabase Connection Verified & Active'
                          : connTest.result.connected
                          ? 'Connected to Project — Tables Migration Pending'
                          : 'Connection Error'}
                      </div>
                      <div className="text-[11px] mt-0.5 leading-relaxed">{connTest.result.message}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Seeding Controls */}
              <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-bold text-[#102A43]">Seed Initial Flight Offers & Site Data</h4>
                  <p className="text-[11px] text-slate-600">
                    Uploads all 14 curated Nigerian domestic and international flight offers and default business settings into your Supabase database.
                  </p>
                </div>
                <button
                  onClick={handleSeedSupabase}
                  disabled={seedingStatus.loading}
                  className="px-4 py-2 rounded-xl bg-[#102A43] hover:bg-[#071A2B] text-white font-bold text-xs shrink-0 cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
                >
                  {seedingStatus.loading ? 'Seeding...' : 'Seed Data to Supabase'}
                </button>
              </div>

              {seedingStatus.message && (
                <div
                  className={`p-3 rounded-xl border text-xs ${
                    seedingStatus.isError
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  }`}
                >
                  {seedingStatus.message}
                </div>
              )}

              {/* Step-by-Step Setup Guide */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700 leading-relaxed">
                <h4 className="font-bold text-slate-900">Setup Instructions for Supabase Dashboard:</h4>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-600">
                  <li>
                    Open your Supabase Project: <strong>punuxvbyihagweoxptuf</strong> at{' '}
                    <a
                      href="https://supabase.com/dashboard/project/punuxvbyihagweoxptuf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#102A43] font-bold underline inline-flex items-center gap-0.5"
                    >
                      supabase.com/dashboard <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    Click on <strong>SQL Editor</strong> in the left sidebar, click <strong>New Query</strong>, paste the complete SQL script below, and click <strong>Run</strong>.
                  </li>
                  <li>
                    In <strong>Authentication &gt; Users &gt; Add User</strong>, create your admin login account (e.g. <code>admin@muna-airspace.com</code>) with a strong password.
                  </li>
                  <li>
                    Click the <strong>Test Connection</strong> and <strong>Seed Data to Supabase</strong> buttons above to sync all curated flights and verify live read/write capability!
                  </li>
                </ol>
              </div>

              {/* Copy SQL Schema */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Complete Database Migration SQL (Tables, Indexes, RLS, Storage Bucket)
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(COMPLETE_MIGRATION_SQL);
                      setCopiedMigration(true);
                      setTimeout(() => setCopiedMigration(false), 2000);
                    }}
                    className="text-xs text-[#102A43] hover:underline font-bold flex items-center gap-1 cursor-pointer bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedMigration ? 'Copied Full Script!' : 'Copy Complete SQL Script'}</span>
                  </button>
                </div>
                <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-60 leading-relaxed">
                  <pre>{COMPLETE_MIGRATION_SQL.slice(0, 1500)}
                    {`\n... [${COMPLETE_MIGRATION_SQL.length - 1500} more characters — click 'Copy Complete SQL Script' above to copy all]`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* --- MODAL: CREATE / EDIT OFFER --- */}
      {isOfferModalOpen && editingOffer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                {editingOffer.id ? 'Edit Flight Offer' : 'Create New Flight Offer'}
              </h3>
              <button
                onClick={() => setIsOfferModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Offer Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lagos to Abuja Executive Morning Shuttle"
                  value={editingOffer.title || ''}
                  onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingOffer.category || 'domestic'}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, category: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="domestic">Domestic (Nigeria)</option>
                    <option value="international">International</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Trip Type</label>
                  <select
                    value={editingOffer.trip_type || 'one-way'}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, trip_type: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="one-way">One-Way</option>
                    <option value="return">Round Trip (Return)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Origin City</label>
                  <input
                    type="text"
                    value={editingOffer.origin_city || ''}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, origin_city: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Origin Code</label>
                  <input
                    type="text"
                    placeholder="LOS"
                    value={editingOffer.origin_code || ''}
                    onChange={(e) =>
                      setEditingOffer({
                        ...editingOffer,
                        origin_code: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg uppercase font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dest. City</label>
                  <input
                    type="text"
                    value={editingOffer.destination_city || ''}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, destination_city: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dest. Code</label>
                  <input
                    type="text"
                    placeholder="ABV"
                    value={editingOffer.destination_code || ''}
                    onChange={(e) =>
                      setEditingOffer({
                        ...editingOffer,
                        destination_code: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg uppercase font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Indicative Fare (Sample Amount)
                  </label>
                  <input
                    type="number"
                    value={editingOffer.indicative_fare || 0}
                    onChange={(e) =>
                      setEditingOffer({
                        ...editingOffer,
                        indicative_fare: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Currency</label>
                  <select
                    value={editingOffer.currency || 'NGN'}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, currency: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="NGN">NGN (₦ - Nigerian Naira)</option>
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                  </select>
                </div>
              </div>

              {/* Destination Image URL and Upload */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Destination Image (URL or Upload)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingOffer.image_url || ''}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, image_url: e.target.value })
                    }
                    placeholder="/images/... or https://..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingOffer.description || ''}
                  onChange={(e) =>
                    setEditingOffer({ ...editingOffer, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Travel Notes / Baggage</label>
                <input
                  type="text"
                  value={editingOffer.travel_notes || ''}
                  onChange={(e) =>
                    setEditingOffer({ ...editingOffer, travel_notes: e.target.value })
                  }
                  placeholder="e.g. Standard 20kg checked luggage, daily flight options"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingOffer.is_featured || false}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, is_featured: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#102A43]"
                  />
                  <span className="font-semibold text-slate-800">Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingOffer.is_active !== undefined ? editingOffer.is_active : true}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, is_active: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#102A43]"
                  />
                  <span className="font-semibold text-slate-800">Publish Immediately</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#102A43] hover:bg-[#071A2B] text-white font-bold text-xs"
                >
                  Save Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: ENQUIRY DETAILS & NOTES --- */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Enquiry Reference
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  {selectedEnquiry.reference_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            {/* Travel Breakdown */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Passenger Name:</span>
                <span className="font-bold text-slate-900">{selectedEnquiry.full_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Phone / WhatsApp:</span>
                <span className="font-bold text-[#102A43]">{selectedEnquiry.phone}</span>
              </div>
              {selectedEnquiry.email && (
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Email:</span>
                  <span className="text-slate-800">{selectedEnquiry.email}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Route:</span>
                <span className="font-semibold text-slate-900">
                  {selectedEnquiry.departure_airport} → {selectedEnquiry.destination_airport}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Trip & Dates:</span>
                <span className="font-semibold text-slate-900 capitalize">
                  {selectedEnquiry.trip_type} ({selectedEnquiry.departure_date}
                  {selectedEnquiry.return_date ? ` to ${selectedEnquiry.return_date}` : ''})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Travelers & Cabin:</span>
                <span className="font-semibold text-slate-900">
                  {selectedEnquiry.adults} Adults
                  {selectedEnquiry.children > 0 ? `, ${selectedEnquiry.children} Children` : ''} ·{' '}
                  <span className="capitalize">{selectedEnquiry.cabin_preference.replace('_', ' ')}</span>
                </span>
              </div>
              {selectedEnquiry.travel_requests && (
                <div className="py-1">
                  <span className="text-slate-500 block mb-1">Special Requests:</span>
                  <span className="text-slate-800 bg-white p-2 rounded block border border-slate-200">
                    {selectedEnquiry.travel_requests}
                  </span>
                </div>
              )}
            </div>

            {/* Direct WhatsApp Action with Customer */}
            <div>
              <a
                href={`https://wa.me/${normalizeWhatsAppNumber(selectedEnquiry.phone)}?text=${encodeURIComponent(
                  `Hello ${selectedEnquiry.full_name}, this is Muna-AirSpace regarding your booking enquiry (${selectedEnquiry.reference_number}) for ${selectedEnquiry.departure_airport} to ${selectedEnquiry.destination_airport}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Message Customer Directly on WhatsApp</span>
              </a>
            </div>

            {/* Status Selector & Internal Notes */}
            <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Update Status</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['new', 'contacted', 'in_progress', 'completed'] as EnquiryStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateEnquiryStatus(st)}
                      className={`py-1.5 px-2 rounded-lg font-semibold uppercase text-[10px] tracking-wider transition-colors cursor-pointer ${
                        selectedEnquiry.status === st
                          ? 'bg-[#102A43] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Internal Agency Notes (Admin Only)
                </label>
                <textarea
                  rows={3}
                  value={enquiryInternalNotes}
                  onChange={(e) => setEnquiryInternalNotes(e.target.value)}
                  placeholder="e.g. Quoted Air Peace morning flight at ₦145k. Waiting for passport bio-data page."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveEnquiryNotes}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg text-xs"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: CARD PREVIEW --- */}
      {previewOffer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Card Preview</span>
              <button
                onClick={() => setPreviewOffer(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>
            <OfferCard offer={previewOffer} onBook={() => alert('Preview mode')} />
          </div>
        </div>
      )}

      {/* --- MODAL: DELETE CONFIRMATION --- */}
      {deleteOfferId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center">
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Confirm Delete Offer?
            </h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete this flight offer? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteOfferId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOffer}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Delete Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
