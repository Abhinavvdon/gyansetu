import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Database,
  KeyRound,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import type { User, LoginCredentials, RegisterCredentials } from '../types';
import { GyanSetuApi } from '../api/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User, token: string) => void;
  initialMode?: 'login' | 'register';
  lang?: 'en' | 'hi';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
  lang = 'en'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Form states
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // UI status
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<{ database?: string; table?: string; encryption?: string; status?: string } | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [initialMode, isOpen]);

  useEffect(() => {
    if (isOpen) {
      GyanSetuApi.getAuthStatus().then((status) => {
        setDbStatus(status);
      }).catch(() => {
        setDbStatus({ database: 'PostgreSQL 14 (port 5434)', status: 'ACTIVE', encryption: 'BCrypt (10 rounds)' });
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const isPasswordValid = password.length >= 6;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage(lang === 'hi' ? 'कृपया ईमेल और पासवर्ड दर्ज करें' : 'Please enter your email and password');
      return;
    }

    setLoading(true);
    try {
      const creds: LoginCredentials = { email, password };
      const res = await GyanSetuApi.login(creds);

      if (res.success && res.token && res.userId && res.name && res.email) {
        const loggedUser: User = {
          id: res.userId,
          name: res.name,
          email: res.email,
          role: res.role || 'STUDENT'
        };
        GyanSetuApi.saveAuthSession(loggedUser, res.token);
        setSuccessMessage(lang === 'hi' ? 'सफलतापूर्वक लॉगिन हुआ!' : 'Logged in successfully!');
        setTimeout(() => {
          onAuthSuccess(loggedUser, res.token!);
          onClose();
        }, 600);
      } else {
        setErrorMessage(res.message || (lang === 'hi' ? 'अमान्य क्रेडेंशियल्स' : 'Invalid email or password'));
      }
    } catch {
      setErrorMessage(lang === 'hi' ? 'सर्वर से कनेक्ट करने में त्रुटि' : 'Could not connect to authentication server');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage(lang === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें' : 'Please enter your full name');
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMessage(lang === 'hi' ? 'कृपया एक मान्य ईमेल दर्ज करें' : 'Please enter a valid email address');
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage(lang === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए' : 'Password must be at least 6 characters long');
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage(lang === 'hi' ? 'पासवर्ड और कन्फर्म पासवर्ड मेल नहीं खाते' : 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const creds: RegisterCredentials = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword
      };
      const res = await GyanSetuApi.register(creds);

      if (res.success && res.token && res.userId && res.name && res.email) {
        const newUser: User = {
          id: res.userId,
          name: res.name,
          email: res.email,
          role: res.role || 'STUDENT'
        };
        GyanSetuApi.saveAuthSession(newUser, res.token);
        setSuccessMessage(lang === 'hi' ? 'खाता सफलतापूर्वक बनाया गया! पासवर्ड PostgreSQL में BCrypt द्वारा सुरक्षित है।' : 'Account created successfully! Password encrypted with BCrypt in PostgreSQL.');
        setTimeout(() => {
          onAuthSuccess(newUser, res.token!);
          onClose();
        }, 800);
      } else {
        setErrorMessage(res.message || (lang === 'hi' ? 'पंजीकरण विफल रहा' : 'Registration failed'));
      }
    } catch {
      setErrorMessage(lang === 'hi' ? 'सर्वर से कनेक्ट करने में त्रुटि' : 'Could not connect to registration server');
    } finally {
      setLoading(false);
    }
  };

  const fillAaravDemo = () => {
    setEmail('aarav.sharma@example.com');
    setPassword('Password@123');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-indigo-600 px-6 py-4 text-white relative">
          <button
            onClick={onClose}
            className="cursor-pointer absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 p-1.5 flex items-center justify-center shadow-xs">
              <img src="/logo-icon.png" alt="GyanSetu" className="w-full h-full object-contain filter brightness-125" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">
                Gyan<span className="text-amber-200">Setu</span> {lang === 'hi' ? 'खाता' : 'Portal'}
              </h2>
              <p className="text-[11px] text-amber-100 font-medium">
                {lang === 'hi'
                  ? 'सुरक्षित PostgreSQL और BCrypt एन्क्रिप्शन'
                  : 'Secured with PostgreSQL & BCrypt Password Hashing'}
              </p>
            </div>
          </div>
        </div>

        {/* Database Telemetry Badge */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-2 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-mono">
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-semibold text-slate-700">PostgreSQL (gyansetu)</span>
            <span aria-hidden="true" className="text-slate-400 select-none">•</span>
            <span className="text-emerald-800 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {typeof window !== 'undefined' && window.location.hostname.includes('onrender.com')
                ? 'Render Cloud DB (Port 5432)'
                : 'Local Port 5434'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <KeyRound className="w-3 h-3 text-amber-600" />
            <span>BCrypt 10-Rounds</span>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 p-1 m-4 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`cursor-pointer flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'लॉगिन करें' : 'Sign In'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`cursor-pointer flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'नया खाता बनाएं' : 'Sign Up (Register)'}</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 pt-1">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'ईमेल पता' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white placeholder-slate-400 font-semibold selection:bg-indigo-100"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {lang === 'hi' ? 'पासवर्ड' : 'Password'}
                  </label>
                  <span className="text-[10px] text-amber-700 font-medium">
                    {lang === 'hi' ? 'BCrypt हैश द्वारा सत्यापित' : 'BCrypt Hash Verified'}
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white placeholder-slate-400 font-semibold selection:bg-indigo-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Demo Fill Helper */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={fillAaravDemo}
                  className="cursor-pointer text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{lang === 'hi' ? 'आरव शर्मा का डेमो क्रेडेंशियल भरें' : 'Fill Aarav Demo (Test Account)'}</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition disabled:opacity-60"
              >
                {loading ? (
                  <span className="animate-spin text-sm">⏳</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'लॉगिन करें' : 'Sign In to GyanSetu'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'पूरा नाम' : 'Full Name'}
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-slate-900 bg-white placeholder-slate-400 font-semibold selection:bg-amber-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'ईमेल पता' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-slate-900 bg-white placeholder-slate-400 font-semibold selection:bg-amber-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'पासवर्ड (कम से कम 6 अक्षर)' : 'Password (min 6 characters)'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-slate-900 bg-white placeholder-slate-400 font-semibold selection:bg-amber-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-1 flex items-center gap-1 text-[10px]">
                    {isPasswordValid ? (
                      <span className="text-emerald-800 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        {lang === 'hi' ? 'पासवर्ड की लंबाई उपयुक्त है' : 'Valid length (>= 6 chars)'}
                      </span>
                    ) : (
                      <span className="text-rose-700 flex items-center gap-1 font-semibold">
                        <AlertCircle className="w-3 h-3" />
                        {lang === 'hi' ? 'कम से कम 6 अक्षरों की आवश्यकता है' : 'Needs at least 6 characters'}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'hi' ? 'कन्फर्म पासवर्ड (Confirm Password)' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-slate-900 bg-white placeholder-slate-400 font-semibold selection:bg-amber-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="cursor-pointer absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && (
                  <div className="mt-1 flex items-center gap-1 text-[10px]">
                    {passwordsMatch ? (
                      <span className="text-emerald-800 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        {lang === 'hi' ? 'पासवर्ड मेल खाता है' : 'Passwords match perfectly'}
                      </span>
                    ) : (
                      <span className="text-rose-700 flex items-center gap-1 font-semibold">
                        <AlertCircle className="w-3 h-3" />
                        {lang === 'hi' ? 'पासवर्ड मेल नहीं खा रहे' : 'Passwords do not match'}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  {lang === 'hi'
                    ? 'आपका पासवर्ड कभी भी सादे टेक्स्ट (Plain Text) में सेव नहीं होगा। यह स्प्रिंग बूट के BCrypt अल्गोरिदम द्वारा हैश होकर PostgreSQL में स्टोर होता है।'
                    : 'Your password is never stored in plain text. It is encrypted via Spring Boot BCrypt and stored securely in your PostgreSQL database.'}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || !passwordsMatch || !isPasswordValid}
                className="cursor-pointer w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-spin text-sm">⏳</span>
                ) : (
                  <>
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'खाता बनाएं (Sign Up)' : 'Create Student Account'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Switch Prompt */}
          <div className="mt-5 pt-3 border-t border-slate-100 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-slate-500">
                {lang === 'hi' ? 'नया छात्र हैं? ' : "Don't have an account yet? "}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="cursor-pointer font-bold text-amber-600 hover:text-amber-700 underline underline-offset-2"
                >
                  {lang === 'hi' ? 'साइन अप करें' : 'Sign Up with Name & Email'}
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                {lang === 'hi' ? 'पहले से खाता है? ' : 'Already registered? '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="cursor-pointer font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
                >
                  {lang === 'hi' ? 'लॉगिन करें' : 'Sign In with Email & Password'}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
