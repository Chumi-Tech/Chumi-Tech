import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  ShieldCheck,
  RotateCcw,
  SlidersHorizontal,
  X,
  Plane,
  Sparkles,
} from 'lucide-react';
import { FlightOffer, FlightCategory, TripType } from '../types';
import { OfferCard } from '../components/OfferCard';
import { FARE_DISCLAIMER } from '../lib/constants';

interface OffersPageProps {
  offers: FlightOffer[];
  onSelectOffer: (offer: FlightOffer) => void;
  onNavigate: (path: string) => void;
}

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'dest_asc' | 'dest_desc';

export const OffersPage: React.FC<OffersPageProps> = ({ offers, onSelectOffer, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FlightCategory | 'all'>('all');
  const [selectedTripType, setSelectedTripType] = useState<TripType | 'all'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(3000000);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Quick price budget presets
  const budgetPresets = [
    { label: 'All Budgets', max: 3000000 },
    { label: 'Under ₦200k', max: 200000 },
    { label: '₦200k – ₦600k', max: 600000 },
    { label: '₦600k – ₦1.8M', max: 1800000 },
  ];

  // Dynamic real-time filtering and sorting
  const filteredAndSortedOffers = useMemo(() => {
    return offers
      .filter((offer) => {
        // Text search across destination, origin, airport code, country, title
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = offer.title.toLowerCase().includes(q);
          const matchOriginCity = offer.origin_city.toLowerCase().includes(q);
          const matchOriginCode = offer.origin_code.toLowerCase().includes(q);
          const matchDestCity = offer.destination_city.toLowerCase().includes(q);
          const matchDestCode = offer.destination_code.toLowerCase().includes(q);
          const matchCountry = offer.country.toLowerCase().includes(q);

          if (
            !matchTitle &&
            !matchOriginCity &&
            !matchOriginCode &&
            !matchDestCity &&
            !matchDestCode &&
            !matchCountry
          ) {
            return false;
          }
        }

        // Category filter (domestic vs international)
        if (selectedCategory !== 'all' && offer.category !== selectedCategory) {
          return false;
        }

        // Trip type filter (one-way vs return)
        if (selectedTripType !== 'all' && offer.trip_type !== selectedTripType) {
          return false;
        }

        // Price ceiling
        if (offer.indicative_fare > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price_asc':
            return a.indicative_fare - b.indicative_fare;
          case 'price_desc':
            return b.indicative_fare - a.indicative_fare;
          case 'dest_asc':
            return a.destination_city.localeCompare(b.destination_city);
          case 'dest_desc':
            return b.destination_city.localeCompare(a.destination_city);
          case 'newest':
          default:
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
  }, [offers, searchQuery, selectedCategory, selectedTripType, maxPrice, sortBy]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedCategory !== 'all' ||
    selectedTripType !== 'all' ||
    maxPrice < 3000000 ||
    sortBy !== 'newest';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTripType('all');
    setMaxPrice(3000000);
    setSortBy('newest');
  };

  const formattedMaxPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(maxPrice);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Page Title & Context */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#102A43] uppercase tracking-wider mb-1">
          <span>Flight Offers & Route Inventory</span>
          <span aria-hidden="true">·</span>
          <span>Updated Daily</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
          Explore Flight Offers & Indicative Fares
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Filter and sort through domestic Nigerian connections and top international routes. All displayed sample fares update in real-time based on your preferences.
        </p>
      </div>

      {/* Advisory Banner */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Indicative Pricing Notice: </strong>
          {FARE_DISCLAIMER}
        </p>
      </div>

      {/* Dynamic Filter Console */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Row 1: Search & Sort Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Box */}
          <div className="md:col-span-7 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search destination, airport code (e.g. ABV, LOS, LHR), city, or route..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-5 flex items-center gap-2">
            <div className="text-xs font-semibold text-slate-600 shrink-0 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#102A43]" />
              <span>Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
            >
              <option value="newest">Newest Offers First</option>
              <option value="price_asc">Price: Lowest to Highest</option>
              <option value="price_desc">Price: Highest to Lowest</option>
              <option value="dest_asc">Destination: A to Z</option>
              <option value="dest_desc">Destination: Z to A</option>
            </select>
          </div>
        </div>

        {/* Row 2: Category & Trip Type Segmented Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          {/* Route Category Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Travel Route Category
            </label>
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#102A43] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Routes
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('domestic')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === 'domestic'
                    ? 'bg-[#102A43] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Domestic (Nigeria)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('international')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === 'international'
                    ? 'bg-[#102A43] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                International
              </button>
            </div>
          </div>

          {/* Trip Type Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Trip Type
            </label>
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedTripType('all')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedTripType === 'all'
                    ? 'bg-[#102A43] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Any Type
              </button>
              <button
                type="button"
                onClick={() => setSelectedTripType('one-way')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedTripType === 'one-way'
                    ? 'bg-[#102A43] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                One-Way Flights
              </button>
              <button
                type="button"
                onClick={() => setSelectedTripType('return')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedTripType === 'return'
                    ? 'bg-[#102A43] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Round Trip (Return)
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: Price Range Slider & Presets */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#102A43]" />
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Maximum Indicative Fare:
              </label>
              <span className="font-extrabold text-[#102A43] text-sm tabular-nums">
                {maxPrice >= 3000000 ? 'Any Price (Up to ₦3,000,000+)' : `Up to ${formattedMaxPrice}`}
              </span>
            </div>

            {/* Quick Budget Presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              {budgetPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setMaxPrice(preset.max)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                    maxPrice === preset.max
                      ? 'bg-[#102A43] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              min="100000"
              max="3000000"
              step="50000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#102A43] cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>₦100,000</span>
              <span>₦1,000,000</span>
              <span>₦2,000,000</span>
              <span>₦3,000,000+</span>
            </div>
          </div>
        </div>

        {/* Active Filter Chips & Summary */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{filteredAndSortedOffers.length}</strong> of{' '}
              {offers.length} flight offers
            </span>

            {/* Active chips */}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                <span>Category: {selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="hover:text-slate-900 ml-0.5"
                  aria-label="Remove category filter"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedTripType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                <span>Type: {selectedTripType}</span>
                <button
                  onClick={() => setSelectedTripType('all')}
                  className="hover:text-slate-900 ml-0.5"
                  aria-label="Remove trip type filter"
                >
                  ✕
                </button>
              </span>
            )}

            {maxPrice < 3000000 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                <span>Max: {formattedMaxPrice}</span>
                <button
                  onClick={() => setMaxPrice(3000000)}
                  className="hover:text-slate-900 ml-0.5"
                  aria-label="Remove price filter"
                >
                  ✕
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                <span>Search: "{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-slate-900 ml-0.5"
                  aria-label="Remove search query"
                >
                  ✕
                </button>
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-[#102A43] hover:underline font-bold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Offers Grid */}
      {filteredAndSortedOffers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} onBook={onSelectOffer} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Plane className="w-6 h-6 text-[#102A43]" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-heading">
            No flight offers match your current filters
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Try expanding your price range, clearing your search query, or selecting "All Routes" to view more options.
          </p>
          <div className="pt-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-[#102A43] text-white text-xs font-semibold rounded-xl hover:bg-[#071A2B] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* Custom Itinerary Assistance Callout */}
      <div className="bg-[#102A43] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs font-bold text-sky-300 uppercase tracking-wider">
            Custom Travel Requests
          </div>
          <h3 className="text-lg font-bold font-heading">
            Looking for a specific Nigerian or global route not listed?
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            We provide flight enquiry assistance for all commercial airports across Nigeria and worldwide destinations. Submit your dates and we'll check live airline inventories.
          </p>
        </div>
        <button
          onClick={() => onNavigate('/booking')}
          className="px-5 py-2.5 rounded-xl bg-white text-[#071A2B] text-xs font-bold hover:bg-slate-100 transition-all whitespace-nowrap shadow-sm cursor-pointer"
        >
          Submit Custom Route Enquiry
        </button>
      </div>
    </div>
  );
};
