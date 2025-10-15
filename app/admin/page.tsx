'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaCar, FaUser, FaClock, FaCheckCircle, FaTimesCircle, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  pickupLocation: string;
  destination: string;
  date: string;
  time: string;
  vehicleId?: string;
  vehicleName?: string;
  vehicleType?: string;
  passengers: number;
  luggage?: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: any;
}

export default function AdminPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (!loading && userProfile?.role !== 'admin') {
      alert('Prieiga uždrausta. Reikalingos administratoriaus teisės.');
      router.push('/dashboard');
      return;
    }

    const q = collection(db, 'bookings');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];
      setBookings(bookingsData.sort((a, b) => b.createdAt - a.createdAt));
      setLoadingBookings(false);
    });

    return () => unsubscribe();
  }, [user, userProfile, loading, router]);

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: newStatus,
      });
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const statusLabels: any = {
    pending: 'Laukiama',
    confirmed: 'Patvirtinta',
    'in-progress': 'Vykdoma',
    completed: 'Baigta',
    cancelled: 'Atšaukta',
  };

  if (loading || loadingBookings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gold-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Elegant Gold Header */}
      <header className="bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 shadow-2xl">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-12 h-12 bg-black hover:bg-black/90 rounded-xl flex items-center justify-center transition-all shadow-lg"
              >
                <FaArrowLeft className="text-2xl text-gold-400" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-xl">
                  <FaCar className="text-2xl text-gold-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-black">Užsakymai</h1>
                  <p className="text-black/70 text-sm">Administravimas</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all font-bold shadow-lg"
            >
              <FaArrowLeft />
              <span className="hidden sm:inline">Grįžti</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-20 text-center">
            <div className="w-28 h-28 bg-gradient-to-br from-gold-100 to-gold-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FaCar className="text-6xl text-gold-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Užsakymų dar nėra</h2>
            <p className="text-gray-500 text-lg">Laukiama pirmųjų klientų užsakymų...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all"
              >
                {/* Header with Status */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center shadow-lg">
                      <FaUser className="text-2xl text-gold-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{booking.userName}</h3>
                      <div className="flex flex-col sm:flex-row gap-2 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <FaEnvelope className="text-gray-600" />
                          {booking.userEmail}
                        </span>
                        {booking.userPhone && (
                          <span className="flex items-center gap-1">
                            <FaPhone className="text-gray-600" />
                            {booking.userPhone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <span className={`px-6 py-2.5 rounded-full text-sm font-bold shadow-md ${
                    booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : booking.status === 'confirmed'
                      ? 'bg-blue-100 text-blue-700'
                      : booking.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {statusLabels[booking.status]}
                  </span>
                </div>

                {/* Trip Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaMapMarkerAlt className="text-gray-600" />
                      <p className="text-xs text-gray-500 font-semibold">PAĖMIMAS</p>
                    </div>
                    <p className="font-semibold text-gray-900">{booking.pickupLocation}</p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaMapMarkerAlt className="text-gray-600" />
                      <p className="text-xs text-gray-500 font-semibold">PASKIRTIES VIETA</p>
                    </div>
                    <p className="font-semibold text-gray-900">{booking.destination}</p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaClock className="text-gray-600" />
                      <p className="text-xs text-gray-500 font-semibold">LAIKAS</p>
                    </div>
                    <p className="font-semibold text-gray-900">{booking.date}</p>
                    <p className="text-sm text-gray-600">{booking.time}</p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCar className="text-gray-600" />
                      <p className="text-xs text-gray-500 font-semibold">AUTOMOBILIS</p>
                    </div>
                    <p className="font-semibold text-gray-900">{booking.vehicleName || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{booking.passengers} keleiviai • {booking.luggage}</p>
                  </div>
                </div>

                {booking.notes && (
                  <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                    <p className="text-xs text-blue-600 font-semibold mb-1">PASTABOS</p>
                    <p className="text-gray-800">{booking.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg font-semibold"
                      >
                        <FaCheckCircle /> Patvirtinti
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl transition-all font-semibold"
                      >
                        <FaTimesCircle /> Atšaukti
                      </button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'completed')}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg font-semibold"
                    >
                      <FaCheckCircle /> Pažymėti Baigtą
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
