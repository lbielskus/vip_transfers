'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCar, FaUser, FaUserTie, FaArrowRight } from 'react-icons/fa';

export default function RegisterPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'client' | 'driver' | null>(null);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleRoleSelection = async (role: 'client' | 'driver') => {
    setSelectedRole(role);
    setRegistering(true);
    
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Registration error:', error);
      alert('Nepavyko užsiregistruoti. Bandykite dar kartą.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gold-400"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 px-4 py-12 sm:py-16">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full mb-4 sm:mb-6 shadow-2xl shadow-gold-500/50">
            <FaCar className="text-3xl sm:text-4xl text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
            Pradėkite Kelionę
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 font-light">
            Pasirinkite savo vaidmenį
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* Client Card */}
          <div className="group bg-white hover:shadow-2xl rounded-3xl p-6 sm:p-10 text-left transition-all transform hover:scale-105">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-black rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <FaUser className="text-2xl sm:text-3xl text-gold-400" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Klientas
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
              Užsakykite premium VIP pervežimo paslaugas
            </p>
            
            <ul className="space-y-3 text-gray-700 mb-8">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-gold-100 rounded-full flex items-center justify-center text-gold-600 font-bold text-sm">✓</span>
                <span>Greitas užsakymas</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-gold-100 rounded-full flex items-center justify-center text-gold-600 font-bold text-sm">✓</span>
                <span>Premium automobiliai</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-gold-100 rounded-full flex items-center justify-center text-gold-600 font-bold text-sm">✓</span>
                <span>Profesionalūs vairuotojai</span>
              </li>
            </ul>
            
            <button
              onClick={() => handleRoleSelection('client')}
              disabled={registering}
              className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-600 text-gold-400 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {registering && selectedRole === 'client' ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-current"></div>
                  Registruojama...
                </>
              ) : (
                <>
                  <span>Registruotis</span>
                  <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Driver Card */}
          <div className="group bg-white hover:shadow-2xl rounded-3xl p-10 text-left transition-all transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
              <FaUserTie className="text-3xl text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Vairuotojas
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Tapkite VIP pervežimų vairuotoju
            </p>
            
            <ul className="space-y-3 text-gray-700 mb-8">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">✓</span>
                <span>Lankstus grafikas</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">✓</span>
                <span>Geros pajamos</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">✓</span>
                <span>Profesionali platforma</span>
              </li>
            </ul>
            
            <button
              onClick={() => handleRoleSelection('driver')}
              disabled={registering}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-100 disabled:text-gray-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {registering && selectedRole === 'driver' ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-current"></div>
                  Registruojama...
                </>
              ) : (
                <>
                  <span>Registruotis</span>
                  <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-12 text-gray-400">
          Jau turite paskyrą?{' '}
          <a href="/login" className="text-gold-400 hover:text-gold-300 font-semibold">
            Prisijungti
          </a>
        </p>
      </div>
    </main>
  );
}
