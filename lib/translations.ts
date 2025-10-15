// Lithuanian translations for VIP Transfer Service

export const translations = {
  // Common
  common: {
    loading: 'Kraunama...',
    error: 'Klaida',
    success: 'Sėkmė',
    submit: 'Pateikti',
    cancel: 'Atšaukti',
    save: 'Išsaugoti',
    edit: 'Redaguoti',
    delete: 'Ištrinti',
    back: 'Atgal',
    signOut: 'Atsijungti',
    signIn: 'Prisijungti',
    register: 'Registruotis',
  },

  // Home Page
  home: {
    title: 'VIP Pervežimų Paslauga',
    subtitle: 'Premium transportas visada po ranka',
    getStarted: 'Pradėkite Dabar - Registruokitės',
    alreadyHaveAccount: 'Jau turite paskyrą?',
    features: {
      professional: 'Profesionalūs vairuotojai su daugelio metų patirtimi',
      luxury: 'Prabangūs automobiliai maksimaliam komfortui',
      availability: '24/7 prieinamumas ir užsakymas realiu laiku',
      pricing: 'Konkurencingos kainos be paslėptų mokesčių',
    },
    cards: {
      easyBooking: {
        title: 'Lengvas Užsakymas',
        desc: 'Užsisakykite kelionę per kelias sekundes su intuityviu interfeisu',
      },
      safeTy: {
        title: 'Saugu ir Patikima',
        desc: 'Jūsų saugumas yra mūsų prioritetas su patvirtintais vairuotojais',
      },
      quickAccess: {
        title: 'Greita Prieiga',
        desc: 'Vieno paspaudimo Google prisijungimas akimirksniu',
      },
    },
  },

  // Registration
  register: {
    title: 'Prisijunkite prie VIP Pervežimų Paslaugos',
    subtitle: 'Pasirinkite, kaip norite pradėti',
    client: {
      title: 'Užsakyti Kelionę',
      description: 'Noriu užsisakyti premium VIP pervežimo paslaugas',
      features: [
        'Užsisakykite prabangius pervežimus akimirksniu',
        'Stebėkite savo užsakymus',
        'Profesionalūs vairuotojai',
        'Premium automobiliai',
      ],
      button: 'Registruotis kaip Klientas',
    },
    driver: {
      title: 'Vairuoti ir Uždirbti',
      description: 'Noriu tapti VIP pervežimų vairuotoju',
      features: [
        'Lankstus grafikas',
        'Priimti/atmesti užsakymus',
        'Uždirbkite konkurencingas sumas',
        'Profesionali platforma',
      ],
      button: 'Registruotis kaip Vairuotojas',
    },
    alreadyHaveAccount: 'Jau turite paskyrą?',
  },

  // Login
  login: {
    title: 'Sveiki sugrįžę',
    subtitle: 'Prisijunkite, kad pasiektumėte VIP pervežimo paslaugą',
    continueWithGoogle: 'Tęsti su Google',
    signInWithEmail: 'Prisijungti su El. paštu',
    continueAsGuest: 'Tęsti kaip Svečias',
    email: 'El. paštas',
    password: 'Slaptažodis',
    signInButton: 'Prisijungti',
    backToOptions: '← Grįžti prie kitų variantų',
    dontHaveAccount: 'Neturite paskyros?',
    termsAgreement: 'Prisijungdami sutinkate su mūsų',
    termsAndPrivacy: 'Paslaugų Teikimo Sąlygomis ir Privatumo Politika',
    signingIn: 'Prijungiama...',
  },

  // Dashboard
  dashboard: {
    welcome: 'Sveiki',
    admin: 'Administratorius',
    client: 'Klientas',
    driver: 'Vairuotojas',
    bookRide: {
      title: 'Užsakyti Kelionę',
      desc: 'Suplanuokite savo premium pervežimo paslaugą',
    },
    adminPanel: {
      title: 'Administratoriaus Skydelis',
      desc: 'Valdyti užsakymus ir klientus',
    },
    manageVehicles: {
      title: 'Valdyti Automobilius',
      desc: 'Pridėti ir redaguoti parko automobilius',
    },
  },

  // Booking
  booking: {
    title: 'Užsakykite Savo Pervežimą',
    tripDetails: 'Kelionės Detalės',
    pickupLocation: 'Paėmimo Vieta',
    pickupPlaceholder: 'Įveskite paėmimo adresą',
    destination: 'Paskirties Vieta',
    destinationPlaceholder: 'Įveskite paskirties adresą',
    date: 'Data',
    time: 'Laikas',
    passengers: 'Keleiviai',
    luggageSize: 'Bagažo Dydis',
    luggage: {
      S: 'S - Mažas (1-2 krepšiai)',
      M: 'M - Vidutinis (3-4 krepšiai)',
      L: 'L - Didelis (5-6 krepšiai)',
      XL: 'XL - Labai Didelis (7-8 krepšiai)',
      XXL: 'XXL - Milžiniškas (9+ krepšiai)',
    },
    selectVehicle: 'Pasirinkite Automobilį',
    noVehicles: 'Šiuo metu automobilių nėra.',
    additionalNotes: 'Papildomi Pastebėjimai (Neprivaloma)',
    notesPlaceholder: 'Bet kokie specialūs prašymai ar nurodymai...',
    submitButton: 'Pateikti Užsakymo Prašymą',
    submitting: 'Pateikiama...',
    selectVehicleFirst: 'Prašome pasirinkti automobilį',
    successMessage: 'Užsakymas pateiktas sėkmingai! Netrukus su jumis susisieksime.',
    errorMessage: 'Nepavyko pateikti užsakymo. Bandykite dar kartą.',
  },

  // Admin Panel
  admin: {
    title: 'Administratoriaus Skydelis',
    allBookings: 'Visi Užsakymų Prašymai',
    noBookings: 'Užsakymų kol kas nėra',
    status: {
      pending: 'LAUKIAMA',
      confirmed: 'PATVIRTINTA',
      inProgress: 'VYKDOMA',
      completed: 'BAIGTA',
      cancelled: 'ATŠAUKTA',
    },
    pickup: 'Paėmimas',
    destination: 'Paskirties vieta',
    dateTime: 'Data ir Laikas',
    vehicle: 'Automobilis',
    notes: 'Pastabos',
    passenger: 'keleivis',
    passengers: 'keleiviai',
    at: '',
    confirm: 'Patvirtinti',
    cancel: 'Atšaukti',
    markComplete: 'Pažymėti Baigtą',
  },

  // Vehicle Management
  vehicles: {
    title: 'Automobilių Valdymas',
    addVehicle: 'Pridėti Automobilį',
    editVehicle: 'Redaguoti Automobilį',
    addNewVehicle: 'Pridėti Naują Automobilį',
    brand: 'Markė',
    brandPlaceholder: 'Mercedes',
    model: 'Modelis',
    modelPlaceholder: 'Vito',
    fullName: 'Pilnas Pavadinimas',
    fullNamePlaceholder: 'Mercedes Vito',
    vehicleImage: 'Automobilio Nuotrauka',
    uploadFromDevice: 'Įkelti iš PC/Telefono',
    uploading: 'Keliama...',
    orPasteUrl: 'ARBA įklijuokite nuotraukos URL',
    preview: 'Peržiūra:',
    maxPassengers: 'Maks. Keleivių (+ vairuotojas)',
    excludingDriver: 'Neįskaitant vairuotojo',
    luggageCapacity: 'Bagažo Talpa',
    pricePerKm: 'Kaina už KM (€)',
    eurPerKm: 'EUR už kilometrą',
    availableForBooking: 'Prieinamas užsakymams',
    updateVehicle: 'Atnaujinti Automobilį',
    addVehicleButton: 'Pridėti Automobilį',
    noVehiclesYet: 'Automobilių dar nėra. Pridėkite pirmąjį!',
    available: 'Prieinamas',
    unavailable: 'Neprieinamas',
    capacity: 'Talpa',
    luggage: 'Bagažas',
    price: 'Kaina',
    status: 'Būsena',
    deleteConfirm: 'Ar tikrai norite ištrinti šį automobilį?',
    saveFailed: 'Nepavyko išsaugoti automobilio',
    deleteFailed: 'Nepavyko ištrinti automobilio',
  },

  // Roles
  roles: {
    client: 'Klientas',
    driver: 'Vairuotojas',
    admin: 'Administratorius',
  },
};

export default translations;

