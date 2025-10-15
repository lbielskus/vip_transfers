# VIP Transfer Service - Quick Reference Card

## 🎯 Essential Commands

```powershell
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for errors
npm run lint

# Deploy to Vercel
vercel
```

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `.env.local` | Firebase credentials (CREATE THIS!) |
| `app/layout.tsx` | App name, metadata |
| `lib/firebase.ts` | Firebase config |
| `tailwind.config.ts` | Colors, design tokens |
| `public/manifest.json` | PWA settings |

---

## 🔗 Important URLs

| What | URL |
|------|-----|
| Local dev server | http://localhost:3000 |
| Firebase Console | https://console.firebase.google.com |
| Vercel Dashboard | https://vercel.com/dashboard |
| Google Play Console | https://play.google.com/console |

---

## 📱 App Routes

| Route | Purpose | Access |
|-------|---------|--------|
| `/` | Landing page | Public |
| `/login` | Sign in page | Public |
| `/dashboard` | User dashboard | Authenticated |
| `/booking` | Booking form | Authenticated |
| `/admin` | Admin panel | Admin only |

---

## 🔐 Firebase Collections

### `users` Collection
```
users/{userId}
  ├─ uid: string
  ├─ email: string
  ├─ displayName: string
  ├─ role: "user" | "admin"
  └─ createdAt: timestamp
```

### `bookings` Collection
```
bookings/{bookingId}
  ├─ userId: string
  ├─ userName: string
  ├─ userEmail: string
  ├─ pickupLocation: string
  ├─ destination: string
  ├─ date: string
  ├─ time: string
  ├─ vehicleType: string
  ├─ passengers: number
  ├─ notes: string
  ├─ status: string
  └─ createdAt: timestamp
```

---

## 🎨 Customization Quick Tips

### Change Primary Color
`tailwind.config.ts` → `theme.extend.colors.primary`

### Change App Name
- `app/layout.tsx` → `metadata.title`
- `public/manifest.json` → `name` and `short_name`

### Change Icons
- Replace in `public/` folder: `icon-192.png`, `icon-512.png`

---

## 🚨 Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| Firebase auth error | Check `.env.local` credentials |
| Can't see admin panel | Change role to "admin" in Firestore |
| npm not found | Restart PowerShell after Node.js install |
| Build errors | Delete `node_modules` and `.next`, run `npm install` |
| Page won't load | Check console for errors, verify Firebase setup |

---

## 💾 Environment Variables

Create `.env.local` with these variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

**Never commit `.env.local` to Git!**

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `next` | React framework |
| `react` | UI library |
| `firebase` | Auth & database |
| `tailwindcss` | Styling |
| `react-icons` | Icon library |
| `typescript` | Type safety |

---

## 🧪 Testing Checklist

- [ ] Can sign in with Google
- [ ] Can create booking as user
- [ ] Can see booking in Firestore
- [ ] Can access admin panel (after role change)
- [ ] Can see bookings in admin panel
- [ ] Can update booking status
- [ ] Responsive on mobile
- [ ] PWA can be installed

---

## 📊 Firestore Security Rules (Production)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    match /bookings/{bookingId} {
      allow read, create: if request.auth != null;
      allow update, delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## 🚀 Deployment Checklist

- [ ] Firebase credentials configured
- [ ] Environment variables set in hosting provider
- [ ] Firebase security rules updated
- [ ] App icons created (192x192, 512x512)
- [ ] Privacy policy URL added
- [ ] Terms of service created
- [ ] App tested on mobile
- [ ] Google Analytics configured (optional)

---

## 💰 Cost Summary

| Service | Cost |
|---------|------|
| Firebase (free tier) | $0 |
| Vercel hosting | $0 |
| Google Play Store | $25 (one-time) |
| Apple App Store | $99/year |
| Domain name | ~$12/year |

---

## 🎓 Learning Resources

- Next.js: https://nextjs.org/learn
- Firebase: https://firebase.google.com/docs/web
- Tailwind: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs

---

## 📝 Version Control

```bash
# Initialize git
git init

# Add files
git add .

# Commit
git commit -m "Initial VIP Transfer Service app"

# Add remote (GitHub)
git remote add origin YOUR_REPO_URL

# Push
git push -u origin main
```

**Remember:** `.env.local` is in `.gitignore` (don't commit it!)

---

## 🔄 Update Workflow

1. Make changes to code
2. Test locally: `npm run dev`
3. Build: `npm run build`
4. Commit: `git commit -am "Description"`
5. Deploy: `git push` (if connected to Vercel)
   Or run: `vercel --prod`

---

## 📞 Quick Help

- **Can't install packages?** → Check Node.js installation
- **Firebase errors?** → Read `FIREBASE_SETUP.md`
- **Build failing?** → Read `SETUP_INSTRUCTIONS.md`
- **Need APK?** → Read `APK_BUILD_GUIDE.md`
- **General questions?** → Read `README.md`

---

## 🎉 Success Indicators

✅ `npm run dev` starts without errors
✅ Can open http://localhost:3000
✅ Can sign in with Google
✅ Can create a booking
✅ Can see booking in Firebase Console
✅ Can access admin panel
✅ All pages are responsive

---

**Keep this file handy for quick reference!** 📌

