'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCar, FaArrowLeft, FaMapMarkerAlt, FaClock, FaUsers, FaSuitcase, FaEnvelope, FaPhone, FaArrowRight, FaCheckCircle, FaSignOutAlt } from 'react-icons/fa';
import { collection, addDoc, Timestamp, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Vehicle } from '@/types';

interface BookingFormData {
  pickupLocation: string;
  destination: string;
  date: string;
  time: string;
  vehicleId: string;
  passengers: number;
  luggage: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  email: string;
  phone: string;
  notes: string;
}

export default function BookingPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [formData, setFormData] = useState<BookingFormData>({
    pickupLocation: '',
    destination: '',
    date: '',
    time: '',
    vehicleId: '',
    passengers: 1,
    luggage: 'M',
    email: userProfile?.email || '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (userProfile?.email) {
      setFormData(prev => ({ ...prev, email: userProfile.email }));
    }

    const q = query(collection(db, 'vehicles'), where('available', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vehiclesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Vehicle[];
      setVehicles(vehiclesData);
    });

    return () => unsubscribe();
  }, [user, userProfile, loading, router]);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({ ...formData, vehicleId: vehicle.id! });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVehicle) {
      alert('Prašome pasirinkti automobilį');
      return;
    }

    setSubmitting(true);

    try {
      const bookingData = {
        userId: user?.uid,
        userName: userProfile?.displayName || 'Svečias',
        userEmail: formData.email,
        userPhone: formData.phone,
        pickupLocation: formData.pickupLocation,
        destination: formData.destination,
        date: formData.date,
        time: formData.time,
        vehicleId: formData.vehicleId,
        vehicleName: selectedVehicle.name,
        passengers: formData.passengers,
        luggage: formData.luggage,
        notes: formData.notes,
        status: 'pending',
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'bookings'), bookingData);
      
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Nepavyko pateikti užsakymo. Bandykite dar kartą.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'passengers' ? parseInt(value) : value,
    });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gold-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header with Gold Gradient */}
      <header className="bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 shadow-2xl">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-black hover:bg-black/90 rounded-xl flex items-center justify-center transition-all shadow-lg"
              >
                <FaArrowLeft className="text-2xl text-gold-400" />
              </button>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-2xl flex items-center justify-center shadow-xl">
                  <FaCar className="text-xl sm:text-2xl text-gold-400" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold text-black">Užsakyti Pervežimą</h1>
                  <p className="text-black/70 text-xs sm:text-sm">Premium paslauga</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl transition-all font-bold shadow-lg"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Trip Details Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center text-white text-sm">1</span>
                Kelionės Detalės
              </h2>
              
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm">
                      <FaMapMarkerAlt className="text-gold-500" />
                      Paėmimo Vieta
                    </label>
                    <input
                      type="text"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleChange}
                      required
                      placeholder="Pvz: Vilnius oro uostas"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm">
                      <FaMapMarkerAlt className="text-green-500" />
                      Paskirties Vieta
                    </label>
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      required
                      placeholder="Pvz: Vilnius centras"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm">
                      <FaClock className="text-gold-500" />
                      Data
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none text-gray-900 transition-all"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm">
                      <FaClock className="text-gold-500" />
                      Laikas
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none text-gray-900 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm">
                      <FaUsers className="text-gold-500" />
                      Keleivių Skaičius
                    </label>
                    <input
                      type="number"
                      name="passengers"
                      value={formData.passengers}
                      onChange={handleChange}
                      required
                      min="1"
                      max="20"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none text-gray-900 transition-all"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm">
                      <FaSuitcase className="text-gold-500" />
                      Bagažo Dydis
                    </label>
                    <select
                      name="luggage"
                      value={formData.luggage}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none text-gray-900 transition-all"
                    >
                      <option value="S">S - Mažas</option>
                      <option value="M">M - Vidutinis</option>
                      <option value="L">L - Didelis</option>
                      <option value="XL">XL - Labai Didelis</option>
                      <option value="XXL">XXL - Milžiniškas</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-5 border-t border-gray-200">
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm">
                      <FaEnvelope className="text-gold-500" />
                      El. paštas
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="jusu@email.lt"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm">
                      <FaPhone className="text-gold-500" />
                      Telefono Numeris
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+370 600 00000"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Selection Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center text-white text-sm">2</span>
                Pasirinkite Automobilį
              </h2>
              
              {vehicles.length === 0 ? (
                <div className="text-center py-12">
                  <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Šiuo metu automobilių nėra.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:gap-5">
                  {vehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      onClick={() => handleVehicleSelect(vehicle)}
                      className={`group relative border-2 rounded-3xl p-4 sm:p-6 cursor-pointer transition-all ${
                        selectedVehicle?.id === vehicle.id
                          ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-2xl shadow-green-500/30'
                          : 'border-gray-200 hover:border-gold-400 hover:shadow-xl bg-gray-50'
                      }`}
                    >
                      {/* Selected Checkmark - BIG & GREEN */}
                      {selectedVehicle?.id === vehicle.id && (
                        <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl shadow-green-500/50 animate-bounce">
                          <FaCheckCircle className="text-2xl sm:text-3xl text-white" />
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <div className="flex-shrink-0 mx-auto sm:mx-0">
                          <img
                            src={vehicle.imageUrl}
                            alt={vehicle.name}
                            className={`w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-2xl shadow-xl transition-all ${
                              selectedVehicle?.id === vehicle.id ? 'ring-4 ring-green-400' : ''
                            }`}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Auto';
                            }}
                          />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <div className="mb-3">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{vehicle.name}</h3>
                            <p className="text-gray-600">{vehicle.model}</p>
                          </div>
                          <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 mb-4">
                            <div className="flex items-center gap-2 bg-white px-3 py-2 sm:px-4 rounded-xl shadow-sm">
                              <FaUsers className="text-gold-500" />
                              <span className="font-semibold text-gray-800">{vehicle.capacity} keleiviai</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-3 py-2 sm:px-4 rounded-xl shadow-sm">
                              <FaSuitcase className="text-gold-500" />
                              <span className="font-semibold text-gray-800">{vehicle.luggageCapacity}</span>
                            </div>
                          </div>
                          <div className="inline-flex items-center gap-2 bg-white border-2 border-gold-400 px-4 py-2 sm:px-6 sm:py-3 rounded-xl shadow-lg">
                            <span className="text-xl sm:text-2xl font-bold text-gray-900">€{vehicle.pricePerKm.toFixed(2)}</span>
                            <span className="text-gray-700 text-sm">/km</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Papildomi Pastebėjimai</h2>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Bet kokie specialūs prašymai..."
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none resize-none text-gray-900 placeholder-gray-400 transition-all"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !selectedVehicle}
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-5 px-6 rounded-3xl border-4 border-white transition-all transform hover:scale-[1.02] shadow-2xl disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  Pateikiama...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Pateikti Užsakymą
                  <FaArrowRight />
                </span>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full mx-4 transform animate-in zoom-in-95 duration-300">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl">
                <FaCheckCircle className="text-4xl text-white" />
              </div>
            </div>
            
            {/* Success Message */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Užsakymas Pateiktas!
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Jūsų užsakymas sėkmingai pateiktas. Netrukus su jumis susisieksime dėl detalių.
              </p>
            </div>
            
            {/* Action Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-8 rounded-xl transition-all"
              >
                Užverti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
