import React, { useState } from 'react';
import {
  PhoneCall,
  Mail,
  Clock,
  MapPin,
  MessageSquare,
  Send,
  CheckCircle,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { DISPLAY_PHONE, WHATSAPP_NUMBER } from '../lib/constants';
import { createGeneralWhatsAppUrl } from '../lib/whatsapp';
import { dataApi } from '../lib/supabaseClient';

export const ContactPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || fullName.trim().length < 3) {
      setError('Please provide your full name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Please provide a valid phone number (at least 10 digits).');
      return;
    }
    if (!subject.trim()) {
      setError('Please specify the subject of your enquiry.');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setError('Please enter your message (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      await dataApi.submitContactMessage({
        full_name: fullName.trim(),
        email: email.trim() || 'Not provided',
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
        status: 'new',
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Contact submission error:', err);
      setError('An error occurred submitting your message. Please try sending via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="text-xs font-bold text-[#102A43] uppercase tracking-wider">
          Reach Our Team
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
          Contact Muna-AirSpace
        </h1>
        <p className="text-sm text-slate-600">
          Have questions about a flight route, fare estimates, or booking assistance? Send us a message or chat directly on WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Direct WhatsApp & Business Details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Highlight WhatsApp Box */}
          <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center">
                <MessageSquare className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Instant WhatsApp Chat
                </h3>
                <p className="text-xs text-slate-600">Fastest response for flight enquiries</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Connect directly with our booking coordinator on WhatsApp. We can check route options, discuss timings, and guide you through ticket issuance.
            </p>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Chat with 081-67-6938-69</span>
            </a>
          </div>

          {/* Contact Details Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
              Business Information
            </h3>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-[#102A43]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Office Address</div>
                  <div className="text-slate-800 font-medium">NO 1, Jim Ovia Street, River Park Estate, Abuja.</div>
                  <div className="text-[11px] text-slate-500">Walk-in consultations & booking coordination</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-[#102A43]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Customer Contact Email</div>
                  <a
                    href="mailto:enquiry@muna-airspace.com"
                    className="text-[#102A43] font-medium hover:underline block"
                  >
                    enquiry@muna-airspace.com
                  </a>
                  <div className="text-[11px] text-slate-500">We respond to all customer emails promptly</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-[#102A43]">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Phone & WhatsApp</div>
                  <a href="tel:+2348167693869" className="text-slate-800 hover:text-[#102A43]">
                    {DISPLAY_PHONE}
                  </a>
                  <div className="text-[11px] text-slate-500">WhatsApp: 081-67-6938-69</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-[#102A43]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Working Hours</div>
                  <div className="text-slate-600">Monday – Saturday: 8:00 AM – 7:00 PM WAT</div>
                  <div className="text-[11px] text-slate-500">Urgent travel enquiries monitored on WhatsApp</div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-[#102A43]" />
              <span>Data Confidentiality</span>
            </div>
            <p>
              Your personal information is kept strictly confidential and used solely to assist you with flight quotes and bookings.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Thank You, {fullName}!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your message has been received by Muna-AirSpace. Our travel coordinator will review your request and get in touch with you shortly.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={createGeneralWhatsAppUrl(subject, fullName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold inline-flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Also Message on WhatsApp</span>
                </a>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setSubject('');
                    setMessage('');
                  }}
                  className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 underline"
                >
                  Send another message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Send a Direct Message
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in the details below and we will get back to you promptly.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chukwuma Onwuka"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 08012345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flight inquiry for Lagos to London or Group Booking"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Message or Travel Request <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Please describe your planned route, dates, passenger count, or any questions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-xl bg-[#102A43] hover:bg-[#071A2B] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending Message...' : 'Send Message to Muna-AirSpace'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
