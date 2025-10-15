// Type definitions for the VIP Transfer Service app

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'client' | 'driver' | 'admin';
  createdAt: Date | any;
  phone?: string;
  licenseNumber?: string; // For drivers
  vehicleInfo?: string; // For drivers
}

export interface Vehicle {
  id?: string;
  name: string; // "Mercedes Vito"
  model: string; // "Toyota Corolla 2020"
  brand: string; // "Toyota"
  imageUrl: string;
  capacity: number; // Max passengers (excluding driver)
  luggageCapacity: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  pricePerKm: number; // Price in EUR per km
  available: boolean;
  createdAt: Date | any;
}

export interface Booking {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  pickupLocation: string;
  destination: string;
  date: string;
  time: string;
  vehicleId: string;
  vehicleName: string;
  passengers: number;
  luggage: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  notes?: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  assignedDriverId?: string;
  assignedDriverName?: string;
  createdAt: Date | any;
}

export type VehicleType = 'sedan' | 'suv' | 'van' | 'luxury';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type UserRole = 'client' | 'driver' | 'admin';

