import React, { useState } from 'react';
import { ArrowRightLeft, Calendar, Users, PlaneTakeoff, PlaneLanding, Search } from 'lucide-react';
import { CabinClass, TripType } from '../types';
import { NIGERIAN_AIRPORTS, INTERNATIONAL_DESTINATIONS } from '../lib/constants';

interface FlightSearchBoxProps {
  onSearchSubmit: (params: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    tripType: TripType;
    adults: number;
    cabin: CabinClass;
  }) => void;
  initialValues?: {
    origin?: string;
    destination?: string;
    tripType?: TripType;
  };
  compact?: boolean;
}

export const FlightSearchBox: React.FC<FlightSearchBoxProps> = ({
  onSearchSubmit,
  initialValues,
  compact = false,
}) => {
  const [tripType, setTripType] = useState<TripType>(initialValues?.tripType || 'return');
  const [origin, setOrigin] = useState(initialValues?.origin || 'Lagos (LOS)');
  const [destination, setDestination] = useState(initialValues?.destination || 'Abuja (ABV)');
  
  // Default to 5 days ahead for departure, 9 days for return
  const today = new Date();
  const departDefault = new Date(today);
  departDefault.setDate(today.getDate() + 5);
  const returnDefault = new Date(today);
  returnDefault.setDate(today.getDate() + 9);

  const [departureDate, setDepartureDate] = useState(departDefault.toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState(returnDefault.toISOString().split('T')[0]);
  const [adults, setAdults] = useState(1);
  const [cabin, setCabin] = useState<CabinClass>('economy');

  const handleSwapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit({
      origin,
      destination,
      departureDate,
      returnDate: tripType === 'return' ? returnDate : undefined,
      tripType,
      adults,
      cabin,
    });
  };

  const allAirports = [
    ...NIGERIAN_AIRPORTS.map((a) => `${a.city} (${a.code})`),
    ...INTERNATIONAL_DESTINATIONS.map((i) => `${i.city} (${i.code})`),
  ];

  return (
    <div
      className={`bg-white rounded-2xl shadow-xl border border-slate-200/80 transition-all ${
        compact ? 'p-4 sm:p-5' : 'p-6 sm:p-8'
      }`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Top Control Bar: Trip Type & Cabin Class */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          {/* Trip Type Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setTripType('return')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                tripType === 'return'
                  ? 'bg-[#102A43] text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Round Trip
            </button>
            <button
              type="button"
              onClick={() => setTripType('one-way')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                tripType === 'one-way'
                  ? 'bg-[#102A43] text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              One Way
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* Passenger Count */}
            <div className="flex items-center gap-1.5 text-slate-700">
              <Users className="w-4 h-4 text-[#102A43]" />
              <label htmlFor="search-passengers" className="sr-only">Passengers</label>
              <select
                id="search-passengers"
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded-md py-1 px-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#102A43]"
              >
                <option value={1}>1 Traveler</option>
                <option value={2}>2 Travelers</option>
                <option value={3}>3 Travelers</option>
                <option value={4}>4 Travelers</option>
                <option value={5}>5+ Travelers</option>
              </select>
            </div>

            {/* Cabin Class */}
            <div className="flex items-center gap-1.5 text-slate-700">
              <label htmlFor="search-cabin" className="sr-only">Cabin Class</label>
              <select
                id="search-cabin"
                value={cabin}
                onChange={(e) => setCabin(e.target.value as CabinClass)}
                className="bg-slate-50 border border-slate-200 rounded-md py-1 px-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#102A43]"
              >
                <option value="economy">Economy</option>
                <option value="premium_economy">Premium Economy</option>
                <option value="business">Business Class</option>
                <option value="first">First Class</option>
              </select>
            </div>
          </div>
        </div>

        {/* Origin / Destination & Dates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Origin */}
          <div className="md:col-span-3 relative">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Departure City
            </label>
            <div className="relative">
              <PlaneTakeoff className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
              >
                <optgroup label="Domestic (Nigeria)">
                  {NIGERIAN_AIRPORTS.map((a) => (
                    <option key={a.code} value={`${a.city} (${a.code})`}>
                      {a.city} ({a.code})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="International">
                  {INTERNATIONAL_DESTINATIONS.map((i) => (
                    <option key={i.code} value={`${i.city} (${i.code})`}>
                      {i.city} ({i.code})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center -my-1 md:my-0">
            <button
              type="button"
              onClick={handleSwapAirports}
              className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-600 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#102A43]"
              title="Swap Departure and Destination"
              aria-label="Swap Departure and Destination"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Destination */}
          <div className="md:col-span-3 relative">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Arrival City
            </label>
            <div className="relative">
              <PlaneLanding className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
              >
                <optgroup label="Domestic (Nigeria)">
                  {NIGERIAN_AIRPORTS.map((a) => (
                    <option key={a.code} value={`${a.city} (${a.code})`}>
                      {a.city} ({a.code})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="International">
                  {INTERNATIONAL_DESTINATIONS.map((i) => (
                    <option key={i.code} value={`${i.city} (${i.code})`}>
                      {i.city} ({i.code})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Departure Date */}
          <div className={tripType === 'return' ? 'md:col-span-2' : 'md:col-span-3'}>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Departure
            </label>
            <div className="relative">
              <input
                type="date"
                value={departureDate}
                min={today.toISOString().split('T')[0]}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                required
              />
            </div>
          </div>

          {/* Return Date (if return trip) */}
          {tripType === 'return' && (
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Return
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={returnDate}
                  min={departureDate || today.toISOString().split('T')[0]}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                  required
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className={tripType === 'return' ? 'md:col-span-1' : 'md:col-span-2'}>
            <label className="hidden md:block text-[11px] font-semibold uppercase tracking-wider text-transparent mb-1">
              Action
            </label>
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#102A43] hover:bg-[#071A2B] active:bg-black text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              <span>{tripType === 'return' ? 'Search' : 'Find Flights'}</span>
            </button>
          </div>
        </div>

        {/* Sample Fare Advisory */}
        <p className="text-[11px] text-slate-500 pt-1 text-center sm:text-left">
          <span className="font-medium text-slate-700">Flight Assistance Note:</span> Submitting your search opens our detailed booking enquiry with instant WhatsApp assistance for real-time fares.
        </p>
      </form>
    </div>
  );
};
