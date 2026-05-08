'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Building2, Building, GraduationCap, User, ArrowLeft } from 'lucide-react';
import { signIn } from 'next-auth/react';

// ==================== SVG Illustration ====================

function WelcomePersonIllustration() {
  return (
    <svg
      viewBox="0 0 400 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full max-w-[300px] mx-auto desk-illustration"
    >
      {/* Standing person */}
      <rect x="175" y="210" width="14" height="70" rx="6" fill="#2d3436" />
      <rect x="210" y="210" width="14" height="70" rx="6" fill="#2d3436" />
      <ellipse cx="182" cy="282" rx="12" ry="6" fill="#2d3436" />
      <ellipse cx="217" cy="282" rx="12" ry="6" fill="#2d3436" />
      <path d="M168 100 C165 120 162 150 164 210 L235 210 C237 150 234 120 231 100 Z" fill="#059669" />
      <path d="M168 110 C145 100 130 80 135 55 L140 50" fill="#059669" stroke="#047857" strokeWidth="1" />
      <ellipse cx="138" cy="48" rx="7" ry="6" fill="#f0c8a0" transform="rotate(-20, 138, 48)" />
      <path d="M231 110 C255 95 265 70 258 48" fill="#059669" stroke="#047857" strokeWidth="1">
        <animateTransform attributeName="transform" type="rotate" values="0 231 110;5 231 110;0 231 110;-5 231 110;0 231 110" dur="1.5s" repeatCount="indefinite" />
      </path>
      <ellipse cx="260" cy="46" rx="7" ry="6" fill="#f0c8a0" transform="rotate(15, 260, 46)">
        <animateTransform attributeName="transform" type="rotate" values="15 260 46;20 260 46;15 260 46;10 260 46;15 260 46" dur="1.5s" repeatCount="indefinite" />
      </ellipse>
      <rect x="192" y="72" width="16" height="22" rx="7" fill="#f0c8a0" />
      <ellipse cx="200" cy="50" rx="26" ry="30" fill="#f0c8a0" />
      <path d="M174 42 C174 22 187 15 200 15 C213 15 226 22 226 42 C226 37 223 25 200 25 C177 25 174 37 174 42 Z" fill="#047857" />
      <path d="M172 42 C170 38 173 32 178 28" stroke="#047857" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M228 42 C230 38 227 32 222 28" stroke="#047857" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M186 48 Q190 44 194 48" stroke="#2d3436" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M206 48 Q210 44 214 48" stroke="#2d3436" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M188 58 Q200 70 212 58" stroke="#c0785c" strokeWidth="2" fill="#e17055" opacity="0.5" strokeLinecap="round" />
      <ellipse cx="183" cy="56" rx="6" ry="3" fill="#fab1a0" opacity="0.4" />
      <ellipse cx="217" cy="56" rx="6" ry="3" fill="#fab1a0" opacity="0.4" />
      <g>
        <path d="M130 30 L133 20 L136 30 L146 33 L136 36 L133 46 L130 36 L120 33 Z" fill="#ffeaa7" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M260 80 L262 74 L264 80 L270 82 L264 84 L262 90 L260 84 L254 82 Z" fill="#dfe6e9" opacity="0.5">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.5s" repeatCount="indefinite" />
        </path>
        <path d="M155 100 L157 95 L159 100 L164 102 L159 104 L157 109 L155 104 L150 102 Z" fill="#ffeaa7" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.8s" repeatCount="indefinite" />
        </path>
      </g>
      <g opacity="0.5">
        <path d="M110 60 C110 55 115 50 120 55 C125 50 130 55 130 60 C130 68 120 75 120 75 C120 75 110 68 110 60 Z" fill="#fd79a8">
          <animateTransform attributeName="transform" type="translate" values="0,0;-5,-10;0,0" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M270 35 C270 31 274 27 278 31 C282 27 286 31 286 35 C286 41 278 47 278 47 C278 47 270 41 270 35 Z" fill="#fd79a8">
          <animateTransform attributeName="transform" type="translate" values="0,0;5,-8;0,0" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3.5s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  );
}

function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute w-20 h-20 rounded-full bg-white/20 animate-pulse" style={{ top: '15%', right: '10%', animationDuration: '3s' }} />
      <div className="absolute w-14 h-14 rounded-full bg-white/15 animate-pulse" style={{ top: '60%', right: '25%', animationDuration: '4s', animationDelay: '1s' }} />
      <div className="absolute w-24 h-24 rounded-full bg-white/10 animate-pulse" style={{ bottom: '15%', left: '5%', animationDuration: '5s', animationDelay: '0.5s' }} />
      <div className="absolute w-10 h-10 rounded-lg bg-white/15 rotate-45 animate-pulse" style={{ top: '40%', left: '15%', animationDuration: '3.5s', animationDelay: '1.5s' }} />
    </div>
  );
}

interface SignInPageProps {
  onBack?: () => void;
}

export default function SignInPage({ onBack }: SignInPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrors({ general: 'Please enter your email and password.' });
      return;
    }
    setIsLoading(true);
    setErrors({});

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setErrors({ general: 'Invalid email or password. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>
      
      <div className="w-full max-w-5xl relative z-10">
        <div className="grid md:grid-cols-2 gap-0 bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Left Panel */}
          <div className="relative flex flex-col items-center justify-center px-6 py-8 sm:px-8 sm:py-10 md:p-12 min-h-[200px] md:min-h-full bg-gradient-to-br from-emerald-700 via-green-700 to-emerald-800">
            <FloatingShapes />
            
            <div className="relative z-10 text-center">
              <div className="mb-4 md:mb-6">
                <WelcomePersonIllustration />
              </div>
              <motion.h2 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1.5 md:mb-2">
                Welcome Back!
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="text-white/70 text-xs sm:text-sm md:text-base max-w-[220px] sm:max-w-[240px] mx-auto">
                Enter your credentials to access your account and continue your journey.
              </motion.p>
            </div>
          </div>

          {/* Right Panel */}
          <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex flex-col justify-center p-6 sm:p-8 md:p-10 relative">
            {onBack && (
              <button
                onClick={onBack}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-1.5 text-gray-500 hover:text-emerald-600 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Home</span>
              </button>
            )}

            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Sign In</h2>
              <p className="text-gray-400 text-xs sm:text-sm">Welcome back! Please sign in to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email / Username / Roll Number</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errors.general && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-70 transition-all"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
