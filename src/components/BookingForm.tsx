import React, { useState } from 'react';
import {
  Plane,
  Calendar,
  Users,
  MessageSquare,
  CheckCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Info,
} from 'lucide-react';
import { BookingEnquiry, CabinClass, FlightOffer, TripType } from '../types';
import {
  NIGERIAN_AIRPORTS,
  INTERNATIONAL_DESTINATIONS,
  FARE_DISCLAIMER,
  WHATSAPP_NUMBER,
} from '../lib/constants';
import {
  createWhatsAppUrl,
  generateReferenceNumber,
  buildWhatsAppMessage,
} from '../lib/whatsapp';
import { dataApi } from '../lib/supabaseClient';

interface BookingFormProps {
  initialOffer?: FlightOffer | null;
  initialParams?: {
    origin?: string;
    destination?: string;
    departureDate?: string;
    returnDate?: string;
    tripType?: TripType;
    adults?: number;
    cabin?: CabinClass;
  };
}

export const BookingForm: React.FC<BookingFormProps> = ({ initialOffer, initialParams }) => {
  // Prepopulate from offer or search params
  const [tripType, setTripType] = useState<TripType>(
    initialParams?.tripType || initialOffer?.trip_type || 'return'
  );
  const [origin, setOrigin] = useState(
    initialParams?.origin ||
      (initialOffer ? `${initialOffer.origin_city} (${initialOffer.origin_code})` : 'Lagos (LOS)')
  );
  const [destination, setDestination] = useState(
    initialParams?.destination ||
      (initialOffer ? `${initialOffer.destination_city} (${initialOffer.destination_code})` : 'Abuja (ABV)')
  );

  const today = new Date().toISOString().split('T')[0];
  const [departureDate, setDepartureDate] = useState(
    initialParams?.departureDate || ''
  );
  const [returnDate, setReturnDate] = useState(
    initialParams?.returnDate || ''
  );

  const [adults, setAdults] = useState(initialParams?.adults || 1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabin, setCabin] = useState<CabinClass>(initialParams?.cabin || 'economy');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [preferredAirline, setPreferredAirline] = useState('');
  const [flexibleDates, setFlexibleDates] = useState(false);
  const [passportStatus, setPassportStatus] = useState('');
  const [travelRequests, setTravelRequests] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<BookingEnquiry | null>(null);
  const [copied, setCopied] = useState(false);

  // Determine if international
  const isInternational =
    origin.includes('London') ||
    origin.includes('Dubai') ||
    destination.includes('London') ||
    destination.includes('Dubai') ||
    destination.includes('LHR') ||
    destination.includes('DXB') ||
    destination.includes('JNB') ||
    destination.includes('YYZ') ||
    destination.includes('JFK') ||
    initialOffer?.category === 'international';

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 3) {
      errs.fullName = 'Please enter your full legal passenger name.';
    }

    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      errs.phone = 'Please provide a valid WhatsApp phone number (at least 10 digits).';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please provide a valid email address or leave blank.';
    }

    if (!departureDate) {
      errs.departureDate = 'Please select a departure date.';
    } else if (departureDate < today) {
      errs.departureDate = 'Departure date cannot be in the past.';
    }

    if (tripType === 'return') {
      if (!returnDate) {
        errs.returnDate = 'Please select a return date for your round trip.';
      } else if (returnDate < departureDate) {
        errs.returnDate = 'Return date must be on or after the departure date.';
      }
    }

    if (!origin.trim()) {
      errs.origin = 'Please specify departure airport.';
    }
    if (!destination.trim()) {
      errs.destination = 'Please specify destination airport.';
    }
    if (origin.trim().toLowerCase() === destination.trim().toLowerCase()) {
      errs.destination = 'Destination cannot be identical to origin airport.';
    }

    if (!privacyAgreed) {
      errs.privacy = 'You must acknowledge the privacy notice to submit your enquiry.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleReviewClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setShowReviewModal(true);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const refNumber = generateReferenceNumber();

      const newEnquiry: Omit<BookingEnquiry, 'id' | 'created_at' | 'updated_at'> = {
        reference_number: refNumber,
        full_name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        current_city: currentCity.trim() || 'Nigeria',
        departure_airport: origin,
        destination_airport: destination,
        departure_date: departureDate,
        return_date: tripType === 'return' ? returnDate : undefined,
        trip_type: tripType,
        adults,
        children,
        infants,
        cabin_preference: cabin,
        preferred_airline: preferredAirline.trim() || undefined,
        flexible_dates: flexibleDates,
        passport_status: isInternational ? passportStatus.trim() : undefined,
        travel_requests: travelRequests.trim() || undefined,
        status: 'new',
        internal_notes: initialOffer ? `Initiated from Offer ID: ${initialOffer.id}` : undefined,
      };

      const saved = await dataApi.submitBookingEnquiry(newEnquiry);
      setSubmittedEnquiry(saved);
      setShowReviewModal(false);

      // Construct and trigger WhatsApp handoff
      const waUrl = createWhatsAppUrl(saved);
      // Attempt opening WhatsApp in new tab
      try {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      } catch (e) {
        console.warn('Pop-up prevented, user can click explicit WhatsApp button in confirmation dialog.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('An error occurred submitting your enquiry. Please try again or chat with us directly on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyMessage = () => {
    if (!submittedEnquiry) return;
    const msg = buildWhatsAppMessage(submittedEnquiry);
    navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Selected Offer Banner if arriving from a specific offer */}
      {initialOffer && (
        <div className="mb-6 p-4 rounded-xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#102A43] text-white flex items-center justify-center shrink-0">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <span className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
                Selected Offer
              </span>
              <h4 className="text-sm font-bold text-slate-900">{initialOffer.title}</h4>
              <p className="text-xs text-slate-600">
                Indicative Fare:{' '}
                <strong className="text-[#102A43]">
                  {new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: initialOffer.currency,
                    maximumFractionDigits: 0,
                  }).format(initialOffer.indicative_fare)}
                </strong>{' '}
                · {initialOffer.category} ({initialOffer.trip_type})
              </p>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200 shrink-0">
            Fares verified upon enquiry
          </span>
        </div>
      )}

      {/* Main Booking Form */}
      <form onSubmit={handleReviewClick} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        {/* Section 1: Flight & Itinerary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
              <Plane className="w-4 h-4 text-[#102A43]" />
              <span>1. Flight Itinerary & Schedule</span>
            </h3>

            {/* Trip Type Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setTripType('return')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  tripType === 'return'
                    ? 'bg-[#102A43] text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Round Trip
              </button>
              <button
                type="button"
                onClick={() => setTripType('one-way')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  tripType === 'one-way'
                    ? 'bg-[#102A43] text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                One Way
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Departure Airport / City <span className="text-rose-500">*</span>
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
              >
                <optgroup label="Nigeria Domestic Airports">
                  {NIGERIAN_AIRPORTS.map((a) => (
                    <option key={a.code} value={`${a.city} (${a.code})`}>
                      {a.city} ({a.code}) - {a.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="International Destinations">
                  {INTERNATIONAL_DESTINATIONS.map((i) => (
                    <option key={i.code} value={`${i.city} (${i.code})`}>
                      {i.city} ({i.code}) - {i.country}
                    </option>
                  ))}
                </optgroup>
              </select>
              {errors.origin && <p className="text-xs text-rose-500 mt-1">{errors.origin}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Destination Airport / City <span className="text-rose-500">*</span>
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
              >
                <optgroup label="Nigeria Domestic Airports">
                  {NIGERIAN_AIRPORTS.map((a) => (
                    <option key={a.code} value={`${a.city} (${a.code})`}>
                      {a.city} ({a.code}) - {a.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="International Destinations">
                  {INTERNATIONAL_DESTINATIONS.map((i) => (
                    <option key={i.code} value={`${i.city} (${i.code})`}>
                      {i.city} ({i.code}) - {i.country}
                    </option>
                  ))}
                </optgroup>
              </select>
              {errors.destination && <p className="text-xs text-rose-500 mt-1">{errors.destination}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Departure Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                min={today}
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                required
              />
              {errors.departureDate && <p className="text-xs text-rose-500 mt-1">{errors.departureDate}</p>}
            </div>

            {tripType === 'return' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Return Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  min={departureDate || today}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                  required={tripType === 'return'}
                />
                {errors.returnDate && <p className="text-xs text-rose-500 mt-1">{errors.returnDate}</p>}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="flexibleDates"
              checked={flexibleDates}
              onChange={(e) => setFlexibleDates(e.target.checked)}
              className="w-4 h-4 rounded text-[#102A43] focus:ring-[#102A43] border-slate-300"
            />
            <label htmlFor="flexibleDates" className="text-xs text-slate-700 select-none cursor-pointer">
              My dates are flexible (± 1–2 days helps us locate lower fares)
            </label>
          </div>
        </div>

        {/* Section 2: Passengers & Cabin */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 font-heading">
            <Users className="w-4 h-4 text-[#102A43]" />
            <span>2. Passenger Count & Cabin Preference</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adults (Age 12+) <span className="text-rose-500">*</span>
              </label>
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#102A43]"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>
                    {n} Adult{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Children (Age 2–11)
              </label>
              <select
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#102A43]"
              >
                {[0, 1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Child' : 'Children'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Infants (Under 2)
              </label>
              <select
                value={infants}
                onChange={(e) => setInfants(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#102A43]"
              >
                {[0, 1, 2].map((n) => (
                  <option key={n} value={n}>
                    {n} Infant{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cabin Class Preference <span className="text-rose-500">*</span>
              </label>
              <select
                value={cabin}
                onChange={(e) => setCabin(e.target.value as CabinClass)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#102A43]"
              >
                <option value="economy">Economy Class</option>
                <option value="premium_economy">Premium Economy</option>
                <option value="business">Business Class</option>
                <option value="first">First Class</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Airline (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Air Peace, Ibom Air, British Airways, Emirates"
                value={preferredAirline}
                onChange={(e) => setPreferredAirline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#102A43]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Passenger Contact Details */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 font-heading">
            <MessageSquare className="w-4 h-4 text-[#102A43]" />
            <span>3. Passenger Contact & WhatsApp Handoff</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lead Passenger Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="As written on ID or International Passport"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#102A43]"
                required
              />
              {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp / Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. 08012345678 or +234 816 769 3869"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#102A43]"
                required
              />
              {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
              <p className="text-[11px] text-slate-500 mt-1">
                Used to hand off your enquiry to Muna-AirSpace on WhatsApp.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com (for itinerary copy)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#102A43]"
              />
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Location / City
              </label>
              <input
                type="text"
                placeholder="e.g. Lagos, Abuja, Port Harcourt, London"
                value={currentCity}
                onChange={(e) => setCurrentCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#102A43]"
              />
            </div>
          </div>

          {/* International Passport Status if international */}
          {isInternational && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Passport & Visa Status (For International Travel)
              </label>
              <input
                type="text"
                placeholder="e.g. Valid Nigerian Passport with valid UK/US/UAE Visa"
                value={passportStatus}
                onChange={(e) => setPassportStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#102A43]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Special Travel Requests / Extra Baggage / Preferred Times
            </label>
            <textarea
              rows={2}
              placeholder="e.g., Morning flight preferred, extra student baggage, traveling with elderly parent requiring wheelchair assistance."
              value={travelRequests}
              onChange={(e) => setTravelRequests(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#102A43]"
            />
          </div>
        </div>

        {/* Section 4: Privacy & Anti-Fraud Notice */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#102A43]" />
              <span>Customer Security & Payment Safety Guarantee</span>
            </div>
            <p>
              Muna-AirSpace will <strong>never</strong> ask for bank card numbers, CVVs, ATM PINs, or online banking passwords. We assist in verifying official airline itineraries and fares before you proceed with legitimate provider payments.
            </p>
          </div>

          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="privacyAgreed"
              checked={privacyAgreed}
              onChange={(e) => setPrivacyAgreed(e.target.checked)}
              className="w-4 h-4 rounded text-[#102A43] focus:ring-[#102A43] border-slate-300 mt-0.5 cursor-pointer"
            />
            <label htmlFor="privacyAgreed" className="text-xs text-slate-600 select-none cursor-pointer">
              I acknowledge that sample fares are indicative and subject to confirmation, and I consent to Muna-AirSpace contacting me via WhatsApp/Email regarding this enquiry. <span className="text-rose-500">*</span>
            </label>
          </div>
          {errors.privacy && <p className="text-xs text-rose-500">{errors.privacy}</p>}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-[#102A43] hover:bg-[#071A2B] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#102A43]/20"
          >
            <span>Review Travel Enquiry & Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[11px] text-center text-slate-400 mt-2">
            You will review your details before the WhatsApp handoff is prepared.
          </p>
        </div>
      </form>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  Review Your Flight Enquiry
                </h3>
                <p className="text-xs text-slate-500">
                  Please verify your details before sending to Muna-AirSpace
                </p>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            {/* Itinerary summary */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Route:</span>
                <span className="font-bold text-slate-900">{origin} → {destination}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Trip Type:</span>
                <span className="font-semibold text-slate-900 capitalize">{tripType}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Departure Date:</span>
                <span className="font-semibold text-slate-900">{departureDate}</span>
              </div>
              {tripType === 'return' && (
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Return Date:</span>
                  <span className="font-semibold text-slate-900">{returnDate}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Passengers:</span>
                <span className="font-semibold text-slate-900">
                  {adults} Adult{adults > 1 ? 's' : ''}
                  {children > 0 ? `, ${children} Children` : ''}
                  {infants > 0 ? `, ${infants} Infant` : ''}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Cabin Class:</span>
                <span className="font-semibold text-slate-900 capitalize">{cabin.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Passenger Name:</span>
                <span className="font-bold text-slate-900">{fullName}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Contact / WhatsApp:</span>
                <span className="font-bold text-[#102A43]">{phone}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/70 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Next Step:</strong> Submitting will save your booking enquiry and open WhatsApp with your prefilled details. You will need to press <strong>Send</strong> in WhatsApp to finish the handoff.
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="w-1/3 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
              >
                Back to Edit
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="w-2/3 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving & Preparing WhatsApp...' : 'Confirm & Open WhatsApp'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success / Next-Steps Handoff Modal */}
      {submittedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in duration-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                Booking Enquiry Created!
              </h3>
              <p className="text-xs text-slate-600">
                Your enquiry reference is{' '}
                <span className="font-mono font-bold text-[#102A43] text-sm bg-slate-100 px-2 py-0.5 rounded">
                  {submittedEnquiry.reference_number}
                </span>
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200/80 text-xs text-emerald-950 space-y-2 leading-relaxed">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <Info className="w-4 h-4 text-emerald-700" />
                <span>Action Required to Complete Booking Handoff</span>
              </div>
              <p>
                WhatsApp was opened with your prefilled travel request. Please click <strong>Send</strong> in WhatsApp so Muna-AirSpace receives your details.
              </p>
              <p className="text-[11px] text-emerald-800">
                If WhatsApp did not open automatically, use the direct button below.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={createWhatsAppUrl(submittedEnquiry)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Open WhatsApp Chat Now</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Formatted Message'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSubmittedEnquiry(null)}
                className="w-full py-2 text-center text-xs text-slate-500 hover:text-slate-800 underline"
              >
                Start Another Enquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
