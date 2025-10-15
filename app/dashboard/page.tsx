'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaUser, FaCar, FaSignOutAlt, FaUserShield, FaClock, FaMapMarkerAlt, FaStar, FaCheckCircle, FaEnvelope, FaPhone, FaListUl } from 'react-icons/fa';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Booking {
  id: string;
  pickupLocation: string;
  destination: string;
  date: string;
  time: string;
  vehicleName: string;
  passengers: number;
  luggage: string;
  status: string;
  createdAt: any;
}

export default function DashboardPage() {
  const { user, userProfile, loading, signOut } = useAuth();
  const router = useRouter();
  const [myBookings, setMyBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user && userProfile?.role !== 'admin') {
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', user.uid)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const bookingsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Booking[];
        setMyBookings(bookingsData.sort((a, b) => b.createdAt - a.createdAt));
      });

      return () => unsubscribe();
    }
  }, [user, userProfile, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading || !user || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gold-400"></div>
      </div>
    );
  }

  const roleLabels = {
    client: 'Klientas',
    driver: 'Vairuotojas',
    admin: 'Administratorius',
  };

  const statusLabels: any = {
    pending: 'Laukiama',
    confirmed: 'Patvirtinta',
    'in-progress': 'Vykdoma',
    completed: 'Baigta',
    cancelled: 'Atšaukta',
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Elegant Header with Gold */}
      <header className="bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 shadow-2xl">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-2xl flex items-center justify-center shadow-xl">
                <FaCar className="text-3xl text-gold-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-black">VIP Pervežimai</h1>
                <p className="text-black/70 text-xs sm:text-sm">Premium paslauga</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl transition-all font-bold shadow-lg"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Atsijungti</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        {/* Welcome Card - White with Gold Border (high contrast) */}
        <div className="bg-white border-4 border-gold-500 rounded-3xl shadow-2xl p-6 sm:p-10 mb-8 sm:mb-12">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-black rounded-3xl flex items-center justify-center shadow-xl">
              <FaUser className="text-3xl sm:text-5xl text-gold-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Sveiki, {user?.isAnonymous ? 'Anonime' : userProfile.email}!
              </h2>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-xl">
                  <FaEnvelope className="text-gray-600" />
                  {userProfile.email || '—'}
                </span>
                <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-xl">
                  <FaPhone className="text-gray-600" />
                  {userProfile.phone || user?.phoneNumber || '—'}
                </span>
                <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-xl">
                  <FaListUl className="text-gray-600" />
                  {myBookings.length} rezerv.
                </span>
                <span className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl">
                  {userProfile.role === 'admin' && <FaStar className="text-white" />}
                  {roleLabels[userProfile.role]}
                </span>
                {user?.isAnonymous && (
                  <button 
                    onClick={() => {
                      // Sign out first, then go to login
                      signOut().then(() => {
                        router.push('/login');
                      });
                    }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2 rounded-xl transition-all font-medium"
                  >
                    <FaUser />
                    Prisijungti
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards - Luxury Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {/* Book Ride - Gold Card with black CTA */}
          <a
            href="/booking"
            className="group bg-gradient-to-br from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 rounded-3xl p-8 shadow-2xl shadow-gold-500/40 transition-all transform hover:scale-105 border-4 border-white"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-black rounded-2xl flex items-center justify-center mb-4 sm:mb-5 shadow-xl">
              <FaCar className="text-2xl sm:text-3xl text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Atlikti rezervaciją</h3>
            <p className="text-white/90 mb-4 sm:mb-5 font-medium">Greita VIP kelionės rezervacija</p>
            <div className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-bold shadow-lg">
              <span>Pradėti</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </a>

          {/* Admin Cards */}
          {userProfile.role === 'admin' && (
            <>
              <a
                href="/admin"
                className="group bg-white hover:shadow-2xl rounded-3xl p-8 shadow-xl transition-all transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-purple-500/30">
                  <FaUserShield className="text-3xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Užsakymai</h3>
                <p className="text-gray-600 mb-5 leading-relaxed">Valdyti visus užsakymus</p>
                <div className="inline-flex items-center gap-2 text-purple-600 font-bold">
                  <span>Atidaryti</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </a>
              
              <a
                href="/admin/vehicles"
                className="group bg-white hover:shadow-2xl rounded-3xl p-8 shadow-xl transition-all transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-500/30">
                  <FaCar className="text-3xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Automobiliai</h3>
                <p className="text-gray-600 mb-5 leading-relaxed">Valdyti parką</p>
                <div className="inline-flex items-center gap-2 text-blue-600 font-bold">
                  <span>Valdyti</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </a>
            </>
          )}
        </div>

        {/* My Bookings Section */}
        {userProfile.role !== 'admin' && (
          <div className="bg-white rounded-3xl shadow-2xl p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gold-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaStar className="text-2xl text-black" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Mano Rezervacijos</h2>
            </div>

            {myBookings.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FaCar className="text-5xl text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Dar neturite rezervacijų</h3>
                <p className="text-gray-500 mb-8">Užsakykite savo pirmąją VIP kelionę</p>
                <a 
                  href="/booking" 
                  className="inline-flex items-center gap-3 bg-black text-white font-bold px-10 py-5 rounded-2xl transition-all transform hover:scale-105 shadow-xl"
                >
                  <FaCar />
                  <span>Užsakyti Kelionę</span>
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {myBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 hover:border-gold-300 hover:shadow-xl rounded-2xl p-8 transition-all"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{booking.vehicleName}</h3>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaClock className="text-gold-500" />
                          <span>{booking.date} • {booking.time}</span>
                        </div>
                      </div>
                      <span className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-md ${
                        booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                          : booking.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                          : booking.status === 'completed'
                          ? 'bg-green-100 text-green-700 border-2 border-green-300'
                          : 'bg-gray-100 text-gray-700 border-2 border-gray-300'
                      }`}>
                        {statusLabels[booking.status] || booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <FaMapMarkerAlt className="text-xl text-gray-700" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold mb-1 uppercase">Paėmimas</p>
                          <p className="text-gray-900 font-semibold text-lg">{booking.pickupLocation}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <FaMapMarkerAlt className="text-xl text-gray-700" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold mb-1 uppercase">Paskirties vieta</p>
                          <p className="text-gray-900 font-semibold text-lg">{booking.destination}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t-2 border-gray-100">
                      <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">
                        <FaUser className="text-gray-700" />
                        <span className="font-semibold text-gray-800">{booking.passengers} keleiviai</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">
                        <span className="text-lg">🧳</span>
                        <span className="font-semibold text-gray-800">Bagažas: {booking.luggage}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

