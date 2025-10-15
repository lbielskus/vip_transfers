# 🎉 VIP PERVEŽIMŲ PASLAUGA - PROTOTIPAS BAIGTAS

## ✅ Kas Sukurta

### **1. Pilnai Veikiantis VIP Pervežimų Portalas**

**Kalbos:** 🇱🇹 **Lietuvių kalba** (visa aplikacija)

**Funkcijos:**
- ✅ Registracija (Klientas / Vairuotojas)
- ✅ Prisijungimas (Google / El. paštas / Anonimiškai)
- ✅ Automobilio rezervacija su:
  - Paėmimo/Paskirties vieta
  - Data ir laikas
  - Keleivių skaičius
  - Bagažo pasirinkimas (S, M, L, XL, XXL)
  - **Vizualus automobilio pasirinkimas su nuotraukomis**
  - Kaina už km rodoma
- ✅ Administratoriaus Skydelis
  - Visų užsakymų valdymas
  - Būsenos keitimas (Laukiama → Patvirtinta → Baigta)
- ✅ **Automobilių Valdymas** (tik adminams)
  - Pridėti/redaguoti/ištrinti automobilius
  - **Cloudinary nuotraukų įkėlimas iš PC/Telefono**
  - Modelis (pvz., "Toyota Corolla 2020")
  - Kaina už km (€)
  - Talpa (keleiviai + vairuotojas)
  - Bagažo talpa

---

## 🔐 Administratoriaus Prisijungimas

**Email:** info@viptransfer.lt  
**Slaptažodis:** info123

**SVARBU:** Pirmą kartą prisijungus, eikite į:
- Firebase Console → Firestore Database → users → raskite savo vartotoją
- Pakeiskite `role` iš `"client"` į `"admin"`
- Atnaujinkite puslapį

---

## 📊 Duomenų Bazės Struktūra

### **Collections:**

#### 1. `users` - Vartotojai
```
{
  uid: string
  email: string
  displayName: string
  role: "client" | "driver" | "admin"
  createdAt: timestamp
}
```

#### 2. `vehicles` - Automobiliai (NEW!)
```
{
  name: "Mercedes Vito 2020"
  model: "Vito 2020"
  brand: "Mercedes"
  imageUrl: "https://res.cloudinary.com/..."
  capacity: 7
  luggageCapacity: "L"
  pricePerKm: 1.29
  available: true
  createdAt: timestamp
}
```

#### 3. `bookings` - Užsakymai
```
{
  userId: string
  userName: string
  userEmail: string
  pickupLocation: string
  destination: string
  date: string
  time: string
  vehicleId: string
  vehicleName: string
  passengers: number
  luggage: "S"|"M"|"L"|"XL"|"XXL"
  notes: string
  status: "pending"|"confirmed"|"in-progress"|"completed"|"cancelled"
  createdAt: timestamp
}
```

---

## 🎨 Cloudinary Integracija

✅ **Veikia!** Administratorius gali:
- Įkelti nuotraukas iš PC/Telefono
- Arba įklijuoti URL nuorodą
- Nuotraukos saugomos Cloudinary **vip-transfers** aplanke
- Automatinis peržiūros vaizdas

**Cloudinary Folder:** https://console.cloudinary.com/app/c-8ae5ab57710794a8f02066926bbc96/assets/media_library/folders/ccf410728d890f5cbe5b138bb423c73786

---

## 🌐 Kaip Testuoti Prototipą

### **Kaip Klientas:**
1. Eikite į http://localhost:3000
2. Spauskite "Registruotis"
3. Pasirinkite "Registruotis kaip Klientas"
4. Prisijunkite su Google
5. Spauskite "Užsakyti Kelionę"
6. Užpildykite formą
7. Pasirinkite automobilį (su nuotrauka!)
8. Pateikite užsakymą

### **Kaip Administratorius:**
1. Prisijunkite: info@viptransfer.lt / info123
2. **Pakeiskite role į "admin" Firestore**
3. Atnaujinkite puslapį → matote 3 mygtukus
4. "Valdyti Automobilius" → Pridėti Toyota Corolla, Mercedes Vito
5. "Administratoriaus Skydelis" → Matyti visus užsakymus
6. Patvirtinti/Baigti užsakymus

---

## 📱 Mobiliai Optimizuota

✅ Responsive dizainas  
✅ Touch-friendly  
✅ PWA ready (installable)  
✅ Veikia Android/iOS naršyklėse  

---

## 🚀 Kas Veikia:

1. ✅ 3 prisijungimo būdai (Google, El. paštas, Anonimiškai)
2. ✅ Rolės sistema (Klientas, Vairuotojas, Administratorius)
3. ✅ Automobilio rezervacija su vizualiu pasirinkimu
4. ✅ Bagažo dydžio pasirinkimas
5. ✅ Kaina už km rodoma
6. ✅ Administratorius valdo automobilius
7. ✅ **Cloudinary nuotraukų įkėlimas**
8. ✅ Real-time užsakymų atnaujinimai
9. ✅ **100% Lietuvių kalba**

---

## 🎯 Sekantys Žingsniai (Ateičiai)

### **Papildomos Funkcijos:**
- [ ] Vairuotojų skydelis
- [ ] Vairuotojo priskyrimas prie užsakymo
- [ ] Google Maps integracija
- [ ] Mokėjimų sistema (Stripe)
- [ ] SMS/Email pranešimai
- [ ] Push notifications
- [ ] Užsakymų istorija
- [ ] Atsiliepimų sistema
- [ ] Kelionės atstumo skaičiuoklė

---

## 💰 Išlaidos

### **Iki Šiol (Nemokamai):**
- ✅ Firebase (nemokamas planas)
- ✅ Cloudinary (nemokamas planas - 25GB/mėn)
- ✅ Next.js hosting (Vercel nemokamas)

### **Kai Reikės Mokėti:**
- Google Play Store: $25 (vienkartinis)
- Apple App Store: $99/metams
- Domenas: ~€12/metams

---

## 📲 Deployment

### **Dabar Testuojate:**
http://localhost:3000

### **Kai Pasirengę Paleisti:**
```bash
npm run build
vercel deploy --prod
```

Arba → Perskaitykite `README.md` ir `APK_BUILD_GUIDE.md`

---

## ✅ Prototipo Čeklistasas

- ✅ Firebase konfigūracija
- ✅ Cloudinary konfigūracija  
- ✅ Lietuvių kalba visame portale
- ✅ 3 autentifikacijos būdai
- ✅ Rolių sistema
- ✅ Automobilių valdymas su nuotraukomis
- ✅ Rezervacijos sistema
- ✅ Administratoriaus skydelis
- ✅ Mobile-responsive
- ✅ PWA ready

---

## 🎊 PROTOTIPAS PILNAI VEIKIANTIS!

Galite rodyti klientui. Viskas veikia lietuvių kalba ir Cloudinary nuotraukos įkeliamos!

**Test URL:** http://localhost:3000

**Admin Login:**
- Email: info@viptransfer.lt
- Password: info123
- **NEPAMIRŠKITE:** Pakeisti role į "admin" Firestore!

---

Sėkmės su prezentacija! 🚀

