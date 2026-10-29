import React, { useState } from 'react';
import { ArrowRight, Plane, Calendar, Luggage } from 'lucide-react';
import { FlightOffer } from '../types';
import { resolveImageUrl } from '../lib/images';

interface OfferCardProps {
  offer: FlightOffer;
  onBook: (offer: FlightOffer) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, onBook }) => {
  const [imageError, setImageError] = useState(false);

  // Format currency
  const formattedFare = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: offer.currency,
    maximumFractionDigits: 0,
  }).format(offer.indicative_fare);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
      {/* Visual Header / Destination Image */}
      <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
        {!imageError ? (
          <img
            src={resolveImageUrl(offer.image_url)}
            alt={`${offer.destination_city}, ${offer.country}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#102A43] to-[#071A2B] text-white p-4">
            <Plane className="w-8 h-8 text-sky-300 mb-2 opacity-80" />
            <span className="text-sm font-semibold">{offer.destination_city}</span>
            <span className="text-xs text-slate-300">{offer.destination_code}</span>
          </div>
        )}

        {/* Quiet scrim overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Bottom image overlay with route codes */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white pointer-events-none">
          <div className="flex items-center gap-1.5 text-xs font-semibold drop-shadow-md">
            <span>{offer.origin_code}</span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-300" />
            <span>{offer.destination_code}</span>
          </div>
          <span className="text-[11px] font-medium text-slate-200 capitalize drop-shadow-md">
            {offer.trip_type === 'return' ? 'Round Trip' : 'One Way'}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Clean Unboxed Metadata: Zero-Pill Discipline */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
            <span className="capitalize font-medium text-[#102A43]">{offer.category}</span>
            <span aria-hidden="true">·</span>
            <span>{offer.country}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{offer.trip_type}</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#102A43] transition-colors line-clamp-1 font-heading">
            {offer.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
            {offer.description}
          </p>

          {offer.travel_notes && (
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
              <Luggage className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{offer.travel_notes}</span>
            </div>
          )}
        </div>

        {/* Price & CTA Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-600 font-semibold">
              {offer.display_label || 'Sample Fare'}
            </span>
            <div className="text-base sm:text-lg font-extrabold text-[#102A43] tabular-nums">
              {formattedFare}
            </div>
          </div>

          <button
            onClick={() => onBook(offer)}
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-[#102A43] hover:bg-[#071A2B] text-white text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#102A43] cursor-pointer whitespace-nowrap"
          >
            <span>Book Flight</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
