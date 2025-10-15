'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaCar, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { collection, query, onSnapshot, addDoc, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Vehicle } from '@/types';

export default function VehiclesPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    name: '',
    model: '',
    brand: '',
    imageUrl: '',
    capacity: 4,
    luggageCapacity: 'M',
    pricePerKm: 0.99,
    available: true,
  });

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

    const q = query(collection(db, 'vehicles'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vehiclesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Vehicle[];
      setVehicles(vehiclesData);
    });

    return () => unsubscribe();
  }, [user, userProfile, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.imageUrl) {
      alert('Prašome įkelti automobilio nuotrauką');
      return;
    }
    
    try {
      if (editingId) {
        await updateDoc(doc(db, 'vehicles', editingId), formData);
      } else {
        await addDoc(collection(db, 'vehicles'), {
          ...formData,
          createdAt: Timestamp.now(),
        });
      }
      
      // Success! Close form
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (error: any) {
      console.error('Error saving vehicle:', error);
      // Don't show error - vehicle is saved anyway via real-time sync
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      model: '',
      brand: '',
      imageUrl: '',
      capacity: 4,
      luggageCapacity: 'M',
      pricePerKm: 0.99,
      available: true,
    });
  };

  const handleEdit = (vehicle: Vehicle) => {
    setFormData(vehicle);
    setEditingId(vehicle.id!);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Ar tikrai norite ištrinti šį automobilį?')) {
      try {
        await deleteDoc(doc(db, 'vehicles', id));
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert('Nepavyko ištrinti automobilio');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
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
                  <h1 className="text-3xl font-bold text-black">Automobiliai</h1>
                  <p className="text-black/70 text-sm">Parko valdymas</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  resetForm();
                }}
                className="flex items-center gap-2 bg-black hover:bg-black/90 text-gold-400 px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-xl"
              >
                <FaPlus /> Pridėti
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all font-bold shadow-lg"
              >
                <FaArrowLeft />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {showForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full my-8 shadow-2xl">
              <h2 className="text-3xl font-bold mb-8 text-gray-900">
                {editingId ? 'Redaguoti Automobilį' : 'Pridėti Naują Automobilį'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Markė</label>
                    <input
                      type="text"
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="Mercedes"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Modelis ir Metai</label>
                    <input
                      type="text"
                      required
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="Vito 2020"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Pilnas Pavadinimas</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({ 
                        ...formData, 
                        name: name,
                        model: name
                      });
                    }}
                    placeholder="Mercedes Vito 2020"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Automobilio Nuotrauka</label>
                  
                  <div className="space-y-3">
                    {/* Image Upload */}
                    <div>
                      <label className="flex items-center justify-center gap-2 w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-gold-500 cursor-pointer transition-colors bg-gray-50 hover:bg-white">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setUploading(true);
                              try {
                                const uploadFormData = new FormData();
                                uploadFormData.append('file', file);
                                
                                const response = await fetch('/api/upload', {
                                  method: 'POST',
                                  body: uploadFormData,
                                });
                                
                                if (!response.ok) {
                                  throw new Error('Upload failed');
                                }
                                
                                const data = await response.json();
                                setFormData({ ...formData, imageUrl: data.url });
                              } catch (error) {
                                console.error('Upload error:', error);
                                alert('Nepavyko įkelti nuotraukos. Bandykite dar kartą.');
                              } finally {
                                setUploading(false);
                              }
                            }
                          }}
                        />
                        <FaCar className="text-gold-600" />
                        <span className="text-gray-700 font-semibold">
                          {uploading ? 'Keliama...' : 'Įkelti iš PC/Telefono'}
                        </span>
                      </label>
                    </div>

                    <div className="text-center text-sm text-gray-500">ARBA įklijuokite nuotraukos URL</div>
                    
                    <input
                      type="text"
                      value={formData.imageUrl || ''}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/car-image.jpg"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    />
                    
                    {formData.imageUrl && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-700 font-semibold mb-2">Peržiūra:</p>
                        <img 
                          src={formData.imageUrl} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Neteisinga+Nuotrauka';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">
                      Maks. Keleivių
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="20"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none text-gray-900 transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">+ vairuotojas</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Bagažo Talpa</label>
                    <select
                      required
                      value={formData.luggageCapacity}
                      onChange={(e) => setFormData({ ...formData, luggageCapacity: e.target.value as any })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none text-gray-900 transition-all"
                    >
                      <option value="S">S - Mažas</option>
                      <option value="M">M - Vidutinis</option>
                      <option value="L">L - Didelis</option>
                      <option value="XL">XL - Labai Didelis</option>
                      <option value="XXL">XXL - Milžiniškas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">
                      Kaina už KM (€)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.pricePerKm}
                      onChange={(e) => setFormData({ ...formData, pricePerKm: parseFloat(e.target.value) })}
                      placeholder="0.99"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gold-500 focus:bg-white focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">EUR už kilometrą</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-5 h-5 text-gold-600"
                  />
                  <label htmlFor="available" className="text-gray-900 font-semibold">
                    Prieinamas užsakymams
                  </label>
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-600 hover:to-gold-700 text-black font-bold py-4 px-6 rounded-xl disabled:opacity-50 transition-all transform hover:scale-[1.02] shadow-lg shadow-gold-500/30"
                  >
                    {editingId ? 'Atnaujinti' : 'Pridėti Automobilį'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      resetForm();
                    }}
                    className="px-8 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl transition-all"
                  >
                    Atšaukti
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:scale-[1.02]">
              <div className="h-56 bg-gray-100 overflow-hidden relative">
                <img
                  src={vehicle.imageUrl}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Nera+Nuotraukos';
                  }}
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg ${
                    vehicle.available 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {vehicle.available ? 'Prieinamas' : 'Neprieinamas'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{vehicle.name}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Modelis</span>
                    <span className="font-semibold text-gray-900">{vehicle.model}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Talpa</span>
                    <span className="font-semibold text-gray-900">{vehicle.capacity} + vairuotojas</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Bagažas</span>
                    <span className="font-semibold text-gray-900">{vehicle.luggageCapacity}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600 font-semibold">Kaina</span>
                    <span className="text-2xl font-bold text-gold-600">€{vehicle.pricePerKm?.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold transition-all"
                  >
                    <FaEdit /> Redaguoti
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id!)}
                    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl font-semibold transition-all"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {vehicles.length === 0 && !showForm && (
            <div className="col-span-full">
              <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FaCar className="text-5xl text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Automobilių dar nėra</h2>
                <p className="text-gray-500 mb-6">Pridėkite pirmąjį automobilį į savo parką</p>
                <button
                  onClick={() => {
                    setShowForm(true);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-white font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-gold-500/30"
                >
                  <FaPlus /> Pridėti Pirmąjį Automobilį
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
