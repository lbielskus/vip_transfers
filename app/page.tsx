	'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCar, FaShieldAlt, FaClock, FaStar, FaArrowRight, FaAndroid } from 'react-icons/fa';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showApkDownload, setShowApkDownload] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Show APK download on Android browsers and when not installed as a PWA/app
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const forceParam = url.searchParams.get('apk');
    const forceEnv = process.env.NEXT_PUBLIC_FORCE_APK_BUTTON === 'true';
    const force = forceParam === '1' || forceEnv;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    const ua = navigator.userAgent || '';
    const isAndroid = /Android/i.test(ua);
    setShowApkDownload(force || (isAndroid && !isStandalone));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gold-400"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full mb-8 shadow-2xl shadow-gold-500/50 animate-pulse">
            <FaCar className="text-5xl text-dark-900" />
          </div>
          
          {/* Title */}
          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 tracking-tight">
            VIP Pervežimai
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-400 mb-12 font-light">
            Premium transportas, elegantiškai paprasta
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href="/register"
              className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-600 hover:to-gold-700 text-white font-bold py-5 px-10 rounded-2xl transition-all transform hover:scale-105 shadow-2xl shadow-gold-500/50"
            >
              <span>Pradėti Dabar</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a
              href="/login"
              className="inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-5 px-10 rounded-2xl transition-all transform hover:scale-105 shadow-xl"
            >
              Prisijungti
            </a>
            {showApkDownload && (
              <a
                href="/app.apk"
                className="inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-5 px-10 rounded-2xl transition-all transform hover:scale-105 shadow-xl"
              >
                <FaAndroid />
                Atsisiųsti Android APK
              </a>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg shadow-gold-500/30">
                <FaClock className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">24/7 Prieinama</h3>
              <p className="text-gray-400 text-sm">Rezervuokite bet kada, bet kur</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg shadow-gold-500/30">
                <FaShieldAlt className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Saugu ir Patikima</h3>
              <p className="text-gray-400 text-sm">Profesionalūs vairuotojai</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg shadow-gold-500/30">
                <FaStar className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Premium Kokybė</h3>
              <p className="text-gray-400 text-sm">Prabangūs automobiliai</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
