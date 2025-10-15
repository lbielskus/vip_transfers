'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaGoogle, FaCar, FaEnvelope, FaLock, FaUserSecret } from 'react-icons/fa';

export default function LoginPage() {
  const { user, signInWithGoogle, signInWithEmail, signInAnonymously, loading } = useAuth();
  const router = useRouter();
  const [signingIn, setSigningIn] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Nepavyko prisijungti. Bandykite dar kartą.');
    } finally {
      setSigningIn(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);
    try {
      await signInWithEmail(email, password);
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        alert('Neteisingas el. paštas arba slaptažodis');
      } else {
        alert('Nepavyko prisijungti. Bandykite dar kartą.');
      }
    } finally {
      setSigningIn(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setSigningIn(true);
    try {
      await signInAnonymously();
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Nepavyko prisijungti anonimiškai. Bandykite dar kartą.');
    } finally {
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gold-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full mb-4 sm:mb-6 shadow-lg shadow-gold-500/50">
            <FaCar className="text-3xl sm:text-4xl text-dark-900" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Sveiki sugrįžę
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Prisijunkite prie VIP pervežimų
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
          <div className="space-y-4">
            {!showEmailForm ? (
              <>
                {/* Google Sign In */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={signingIn}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-sm disabled:opacity-50"
                >
                  <FaGoogle className="text-xl text-red-500" />
                  <span>Tęsti su Google</span>
                </button>

                {/* Email/Password Sign In Button */}
                <button
                  onClick={() => setShowEmailForm(true)}
                  disabled={signingIn}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-600 hover:to-gold-700 text-black font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-gold-500/30"
                >
                  <FaEnvelope className="text-xl" />
                  <span>Prisijungti su El. paštu</span>
                </button>

                {/* Anonymous Sign In */}
                <button
                  onClick={handleAnonymousSignIn}
                  disabled={signingIn}
                  className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 border-2 border-gold-500 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02]"
                >
                  <FaUserSecret className="text-xl text-gold-400" />
                  <span>Tęsti kaip Svečias</span>
                </button>
              </>
            ) : (
              <>
                {/* Email/Password Form */}
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">El. paštas</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vardenis@elpastas.lt"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none text-gray-900 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Slaptažodis</label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-4 text-gray-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none text-gray-900 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={signingIn}
                    className="w-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-600 hover:to-gold-700 text-black font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-gold-500/30 disabled:opacity-50"
                  >
                    {signingIn ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-black"></div>
                        Prijungiama...
                      </span>
                    ) : (
                      'Prisijungti'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    className="w-full text-gray-600 hover:text-gray-800 font-semibold py-2 text-sm"
                  >
                    ← Grįžti
                  </button>
                </form>
              </>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Neturite paskyros?{' '}
              <a href="/register" className="text-gold-600 font-semibold hover:text-gold-700">
                Registruotis
              </a>
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-xs text-gray-500">
          Prisijungdami sutinkate su mūsų <span className="text-gold-400">Paslaugų Sąlygomis</span>
        </p>
      </div>
    </main>
  );
}
