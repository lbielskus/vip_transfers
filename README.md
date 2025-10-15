# VIP Transfer Service - PWA Prototype

A premium VIP transfer and taxi service booking platform built with Next.js 14, Firebase, and PWA capabilities.

## 🚀 Features

- ✅ **Google Authentication** - Secure sign-in with Google OAuth
- ✅ **User Roles** - User and Admin role system
- ✅ **Real-time Booking** - Submit and manage booking requests
- ✅ **Admin Panel** - Real-time dashboard for managing all bookings
- ✅ **PWA Ready** - Installable on mobile devices
- ✅ **Responsive Design** - Mobile-first design using Tailwind CSS
- ✅ **Firebase Integration** - Authentication and Firestore database

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js v18+ installed
- A Firebase account (free tier is sufficient)
- Google Cloud Platform account (for OAuth)

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing one)
3. Enable **Google Authentication**:
   - Go to Authentication > Sign-in method
   - Enable "Google" provider
4. Create a **Firestore Database**:
   - Go to Firestore Database
   - Create database in production mode
   - Start in test mode (you can secure it later)
5. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click "Web" icon to add a web app
   - Copy the configuration values

### 3. Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Firebase credentials in `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 👨‍💼 Creating an Admin User

By default, all new users are assigned the "user" role. To create an admin:

1. Sign in to the app with Google
2. Go to Firebase Console > Firestore Database
3. Find the `users` collection
4. Locate your user document (by email)
5. Edit the document and change `role` from `"user"` to `"admin"`
6. Refresh the app - you'll now see the Admin Panel option

## 📱 PWA Installation

### Testing PWA Locally

1. Build the production version:
   ```bash
   npm run build
   npm start
   ```

2. Open in mobile browser or Chrome DevTools
3. Look for "Install App" prompt or use Chrome's "Install App" option

### Deploy to Vercel

The easiest way to deploy:

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## 📦 Building APK (Android)

This guide uses **Capacitor** to wrap the Next.js PWA into a native Android app.

### Prerequisites for APK Build

- Android Studio installed
- Java JDK 11+ installed

### Steps to Create APK

1. **Install Capacitor**:
   ```bash
   npm install @capacitor/core @capacitor/cli
   npm install @capacitor/android
   ```

2. **Initialize Capacitor**:
   ```bash
   npx cap init
   ```
   - App name: `VIP Transfer Service`
   - App ID: `com.viptransfers.app` (or your domain)
   - Web directory: `out`

3. **Update next.config.js** for static export:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   }
   module.exports = nextConfig
   ```

4. **Build the Next.js app**:
   ```bash
   npm run build
   ```

5. **Add Android platform**:
   ```bash
   npx cap add android
   ```

6. **Sync the web app to Android**:
   ```bash
   npx cap sync
   ```

7. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```

8. **Build APK in Android Studio**:
   - Wait for Gradle sync to complete
   - Go to Build > Build Bundle(s) / APK(s) > Build APK(s)
   - Find APK in: `android/app/build/outputs/apk/debug/app-debug.apk`

## 🏪 Store Distribution

### Google Play Console Setup

1. Go to [Google Play Console](https://play.google.com/console)
2. Pay $25 one-time registration fee
3. Create new app
4. Fill in app details, privacy policy, content rating
5. Upload APK or AAB (Android App Bundle - recommended)
6. Submit for review

### Apple App Store Setup

1. Enroll in [Apple Developer Program](https://developer.apple.com/programs/) ($99/year)
2. Get D-U-N-S Number (for organization accounts)
3. Use Capacitor to build iOS version:
   ```bash
   npm install @capacitor/ios
   npx cap add ios
   npx cap open ios
   ```
4. Build in Xcode and submit to App Store

## 🔐 Firestore Security Rules

For production, update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 📈 Future Enhancements

- [ ] Payment integration (Stripe/PayPal)
- [ ] Real-time driver tracking with Google Maps
- [ ] Push notifications
- [ ] SMS/Email notifications
- [ ] Booking history
- [ ] Price calculator
- [ ] Driver assignment system
- [ ] Reviews and ratings

## 🤝 Support

For issues or questions, please contact support or create an issue in the repository.

## 📄 License

Copyright © 2025 VIP Transfer Service. All rights reserved.

