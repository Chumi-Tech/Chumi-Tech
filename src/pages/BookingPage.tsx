import React, { useEffect, useState } from 'react';
import { BookingForm } from '../components/BookingForm';
import { FlightOffer, CabinClass, TripType } from '../types';
import { dataApi } from '../lib/supabaseClient';
import { ShieldCheck, ArrowLeft, PhoneCall } from 'lucide-react';
import { DISPLAY_PHONE, FARE_DISCLAIMER } from '../lib/constants';

interface BookingPageProps {
  queryParams: Record<string, string>;
  selectedOffer: FlightOffer | null;
  onNavigate: (path: string) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  queryParams,
  selectedOffer: propOffer,
  onNavigate,
}) => {
  const [activeOffer, setActiveOffer] = useState<FlightOffer | null>(propOffer);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const offerId = queryParams.offerId;
    if (offerId && !activeOffer) {
      setIsLoading(true);
      dataApi
        .getFlightOfferById(offerId)
        .then((offer) => {
          if (offer) setActiveOffer(offer);
        })
        .finally(() => setIsLoading(false));
    }
  }, [queryParams.offerId]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Top back navigation and title */}
      <div>
        <button
          onClick={() => onNavigate('/menu')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Flight Offers</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-1">
              Travel Coordination Portal
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
              Flight Booking Enquiry
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Submit your itinerary to receive a personalized quote and seamless WhatsApp handoff.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
            <PhoneCall className="w-4 h-4 text-[#102A43]" />
            <span>Need immediate help? Call {DISPLAY_PHONE}</span>
          </div>
        </div>
      </div>

      {/* Booking Form Component */}
      <BookingForm
        initialOffer={activeOffer}
        initialParams={{
          origin: queryParams.origin,
          destination: queryParams.destination || queryParams.dest,
          departureDate: queryParams.departureDate,
          returnDate: queryParams.returnDate,
          tripType: (queryParams.tripType as TripType) || undefined,
          adults: queryParams.adults ? Number(queryParams.adults) : undefined,
          cabin: (queryParams.cabin as CabinClass) || undefined,
        }}
      />

      {/* Advisory & Terms */}
      <div className="max-w-4xl mx-auto p-4 rounded-xl bg-slate-100/90 border border-slate-200 text-xs text-slate-500 leading-relaxed space-y-1">
        <strong className="text-slate-800">Booking Advisory: </strong>
        <span>
          {FARE_DISCLAIMER} Muna-AirSpace ensures your details are communicated directly to authorized travel agents or airline ticketing desks.
        </span>
      </div>
    </div>
  );
};
