import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { dataApi, isSupabaseConfigured } from '../lib/supabaseClient';
import { AdminUser } from '../types';

interface AdminLoginPageProps {
  onLoginSuccess: (user: AdminUser) => void;
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both your administrator email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await dataApi.adminLogin(email, password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setError(res.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDemoAdmin = () => {
    setEmail('admin@muna-airspace.com');
    setPassword('MunaAirspace2026!');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#102A43] text-white flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-6 h-6 text-sky-300" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">
            Admin Portal Sign In
          </h1>
          <p className="text-xs text-slate-500">
            Secure Supabase Auth access to manage flight inventory and enquiries.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                placeholder="admin@muna-airspace.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#102A43] hover:bg-[#071A2B] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Authenticating with Supabase...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo / Evaluator Quick Fill Box */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-800">Quick Credentials:</span>
            <button
              type="button"
              onClick={handleUseDemoAdmin}
              className="text-xs text-[#102A43] hover:underline font-bold cursor-pointer"
            >
              Fill Credentials
            </button>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            admin@muna-airspace.com / MunaAirspace2026!
          </p>
          <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between border-t border-slate-200/60 mt-1">
            <span>Auth Engine:</span>
            <span className={isSupabaseConfigured ? 'text-emerald-600 font-semibold' : 'text-slate-600'}>
              {isSupabaseConfigured ? 'Supabase Auth (Live)' : 'Local / Preview Mode'}
            </span>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => onNavigate('/')}
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
