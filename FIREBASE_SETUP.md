# Firebase Setup Guide for VIP Transfer Service

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `VIP Transfer Service` (or your preferred name)
4. (Optional) Enable Google Analytics - Choose your preference
5. Click "Create project" and wait for setup to complete

## Step 2: Enable Google Authentication

1. In Firebase Console, go to **Build** > **Authentication**
2. Click "Get started" if this is your first time
3. Go to **Sign-in method** tab
4. Find **Google** in the providers list
5. Click on **Google** to enable it
6. Toggle the **Enable** switch
7. Set a **Project support email** (your email)
8. Click **Save**

### Important: Configure OAuth Consent Screen

1. You may need to configure OAuth consent in Google Cloud Console
2. Firebase will provide a link - click it
3. Choose **External** user type (for testing)
4. Fill in required fields:
   - App name: `VIP Transfer Service`
   - User support email: your email
   - Developer contact: your email
5. Skip scopes and test users for now
6. Click **Save and Continue**

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Build** > **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
   - ⚠️ Note: This allows open read/write access for 30 days
   - You'll need to update security rules before production
4. Select a location closest to your users (e.g., `us-central`, `europe-west`, etc.)
5. Click "Enable"

## Step 4: Create Collections Structure

Firestore will create collections automatically when data is written. The app will create:

### Collections:
- **users** - User profiles with roles
  ```
  users/{userId}
    - uid: string
    - email: string
    - displayName: string
    - role: "user" | "admin"
    - createdAt: timestamp
  ```

- **bookings** - Booking requests
  ```
  bookings/{bookingId}
    - userId: string
    - userName: string
    - userEmail: string
    - pickupLocation: string
    - destination: string
    - date: string
    - time: string
    - vehicleType: string
    - passengers: number
    - notes: string
    - status: "pending" | "confirmed" | "completed" | "cancelled"
    - createdAt: timestamp
  ```

## Step 5: Get Firebase Configuration

1. In Firebase Console, click the **gear icon** ⚙️ (Settings) > **Project settings**
2. Scroll down to **Your apps** section
3. Click the **Web icon** `</>` to add a web app
4. Enter app nickname: `VIP Transfer Web App`
5. ✅ Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. **Copy the configuration object** - you'll need these values!

Example configuration:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Step 6: Configure Environment Variables

1. In your project root, create `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Add your Firebase credentials to `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
   ```

## Step 7: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)
3. Click "Sign In" and try Google authentication
4. Check Firebase Console > Authentication > Users to see your account
5. Check Firestore Database > users collection for your profile

## Step 8: Create Your First Admin User

1. Sign in to the app with your Google account
2. Go to Firebase Console > Firestore Database
3. Click on **users** collection
4. Find your user document (look for your email)
5. Click on the document to edit
6. Find the `role` field
7. Change the value from `"user"` to `"admin"`
8. Refresh your app - you should now see "Admin Panel" option

## Step 9: Update Security Rules (Before Production!)

⚠️ **Important**: Before deploying to production, update your security rules!

1. Go to Firebase Console > Firestore Database > **Rules** tab
2. Replace the test rules with these production rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection - users can read all, but only write their own
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid == userId;
      allow update, delete: if request.auth.uid == userId || isAdmin();
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      // Anyone authenticated can read and create
      allow read, create: if request.auth != null;
      // Only admins can update or delete
      allow update, delete: if isAdmin();
    }
  }
}
```

3. Click **Publish**

## Troubleshooting

### "Auth domain is not configured" error
- Make sure you've enabled Google sign-in in Authentication
- Check that your domain is authorized in Firebase Console > Authentication > Settings > Authorized domains

### "Permission denied" errors
- Check your Firestore security rules
- Make sure you're signed in when testing
- Verify your test mode hasn't expired (30 days limit)

### Environment variables not loading
- Make sure `.env.local` is in your project root
- Restart your dev server after creating/editing `.env.local`
- Never commit `.env.local` to git (it's in .gitignore)

## Cost Information

Firebase offers a **generous free tier** (Spark Plan):

### Free Tier Limits:
- **Authentication**: 50,000 monthly active users
- **Firestore**: 1 GB storage, 50K reads/day, 20K writes/day
- **Hosting**: 10 GB storage, 360 MB/day bandwidth

This is more than enough for initial testing and small-scale production!

### When to Upgrade:
Only upgrade to paid "Blaze" plan when you exceed free tier limits. You'll only pay for what you use beyond the free limits.

## Next Steps

✅ Firebase is now configured!
✅ Authentication is working
✅ Database is ready
✅ You have an admin account

You can now:
1. Test the booking system
2. Try the admin panel
3. Deploy to Vercel or your hosting provider
4. Start building your APK for mobile distribution

