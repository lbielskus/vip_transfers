# Android APK Build Guide

This guide walks you through converting your VIP Transfer Service PWA into a native Android APK using Capacitor.

## Prerequisites

### Required Software

1. **Node.js** (already installed ✅)
2. **Android Studio** - Download from [https://developer.android.com/studio](https://developer.android.com/studio)
3. **Java JDK 11 or higher** - Usually comes with Android Studio

### Install Android Studio

1. Download Android Studio from the link above
2. Run the installer
3. Follow the setup wizard:
   - Choose "Standard" installation
   - Accept licenses
   - Wait for SDK downloads to complete (this takes a while!)
4. Once installed, open Android Studio and go to:
   - **Tools** > **SDK Manager**
   - Ensure these are installed:
     - Android SDK Platform (latest version)
     - Android SDK Build-Tools
     - Android SDK Command-line Tools

## Step 1: Install Capacitor

In your project directory, install Capacitor:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

## Step 2: Initialize Capacitor

```bash
npx cap init
```

When prompted, enter:
- **App name**: `VIP Transfer Service`
- **App ID**: `com.viptransfers.app` (or use your company domain reversed, e.g., `com.yourcompany.viptransfers`)
- **Web asset directory**: Press Enter to accept default

## Step 3: Configure Next.js for Static Export

Edit `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

⚠️ **Note**: Static export has limitations:
- No API routes (we're using Firebase, so this is fine)
- Image optimization is disabled
- Some dynamic features may not work

## Step 4: Build Your Next.js App

```bash
npm run build
```

This creates an optimized production build in the `out` directory.

## Step 5: Add Android Platform

```bash
npx cap add android
```

This creates an `android` folder with a complete Android Studio project.

## Step 6: Sync Your Web App

Whenever you make changes to your web app, run:

```bash
npm run build
npx cap sync
```

This copies your built web app into the Android project.

## Step 7: Configure Android App

### Update App Name and Icon

1. **App Name**: Edit `android/app/src/main/res/values/strings.xml`:
   ```xml
   <resources>
       <string name="app_name">VIP Transfers</string>
       <string name="title_activity_main">VIP Transfers</string>
       <string name="package_name">com.viptransfers.app</string>
       <string name="custom_url_scheme">com.viptransfers.app</string>
   </resources>
   ```

2. **App Icon**: 
   - Create icon files (192x192 and 512x512 PNG)
   - Use [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html) to generate all sizes
   - Replace files in `android/app/src/main/res/mipmap-*` folders

### Update Android Permissions

Edit `android/app/src/main/AndroidManifest.xml` to ensure these permissions:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## Step 8: Open in Android Studio

```bash
npx cap open android
```

This opens the project in Android Studio.

### First Time in Android Studio

1. **Wait for Gradle Sync** - This happens automatically and may take 5-10 minutes
2. If you see errors about SDK, go to **File** > **Project Structure** > **SDK Location** and set:
   - Android SDK location
   - Accept any license agreements

## Step 9: Build APK

### Option A: Debug APK (for testing)

1. In Android Studio, go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**
2. Wait for build to complete (you'll see a notification)
3. Click "locate" in the notification, or find it at:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Option B: Release APK (for distribution)

#### Generate Keystore (one-time setup)

In Android Studio terminal or your command line:

```bash
keytool -genkey -v -keystore vip-transfers.keystore -alias vip-transfers -keyalg RSA -keysize 2048 -validity 10000
```

Follow prompts to set password and details. **Keep this keystore file safe!**

#### Configure Signing

1. Create `android/key.properties`:
   ```properties
   storePassword=YOUR_KEYSTORE_PASSWORD
   keyPassword=YOUR_KEY_PASSWORD
   keyAlias=vip-transfers
   storeFile=../vip-transfers.keystore
   ```

2. Edit `android/app/build.gradle`, add before `android {`:
   ```groovy
   def keystoreProperties = new Properties()
   def keystorePropertiesFile = rootProject.file('key.properties')
   if (keystorePropertiesFile.exists()) {
       keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
   }
   ```

3. Inside `android {`, add:
   ```groovy
   signingConfigs {
       release {
           keyAlias keystoreProperties['keyAlias']
           keyPassword keystoreProperties['keyPassword']
           storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
           storePassword keystoreProperties['storePassword']
       }
   }
   buildTypes {
       release {
           signingConfig signingConfigs.release
           minifyEnabled false
           proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
       }
   }
   ```

4. Build release APK:
   - **Build** > **Generate Signed Bundle / APK**
   - Select **APK**
   - Choose your keystore
   - Select **release** build variant
   - Click **Finish**

Release APK location:
```
android/app/build/outputs/apk/release/app-release.apk
```

## Step 10: Test APK on Device

### Via USB:

1. Enable Developer Options on your Android phone:
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
2. Enable USB Debugging in Developer Options
3. Connect phone to computer via USB
4. In Android Studio, click the ▶️ Run button
5. Select your device from the list

### Via APK File:

1. Copy the APK to your phone (email, Google Drive, etc.)
2. Open the APK file on your phone
3. Allow "Install from Unknown Sources" if prompted
4. Install the app

## Step 11: Prepare for Google Play Store

### Create App Bundle (Recommended)

Google Play prefers AAB (Android App Bundle) format:

```bash
# In Android Studio
Build > Generate Signed Bundle / APK > Android App Bundle
```

### Requirements for Play Store:

1. **Google Play Console Account** ($25 one-time fee)
2. **App Icon** (512x512 PNG, 1024x1024 for store listing)
3. **Screenshots** (at least 2, phone and/or tablet)
4. **Privacy Policy** (URL to your privacy policy)
5. **App Description** (short and full)
6. **Content Rating** (questionnaire in Play Console)
7. **Signed Release Build** (AAB or APK)

### Upload to Play Console:

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app
3. Fill in all required details
4. Upload your AAB/APK
5. Complete the content rating questionnaire
6. Set up pricing & distribution
7. Submit for review

Review typically takes 1-3 days.

## Troubleshooting

### Gradle Sync Failed
- Make sure Android Studio and SDKs are fully updated
- Try **File** > **Invalidate Caches and Restart**

### "JAVA_HOME not set" error
- Make sure JDK is installed
- Set JAVA_HOME environment variable to JDK location

### App crashes on startup
- Check Android Studio Logcat for errors
- Ensure all environment variables are set
- Make sure Firebase is properly configured

### Can't install APK on phone
- Enable "Install from Unknown Sources" in phone settings
- For newer Android: Settings > Apps > Special access > Install unknown apps

## Build Optimization

### Reduce APK Size:

1. Enable ProGuard minification (already in release build)
2. Use WebP images instead of PNG
3. Remove unused dependencies
4. Enable App Bundle (.aab) which automatically optimizes for different devices

### Improve Performance:

1. Optimize images before build
2. Minimize JavaScript bundle size
3. Enable service worker caching
4. Use lazy loading for routes

## Updating Your App

When you make changes:

1. Update version in `package.json`
2. Update `versionCode` and `versionName` in `android/app/build.gradle`:
   ```groovy
   android {
       defaultConfig {
           versionCode 2  // Increment this
           versionName "1.1"  // Update this
       }
   }
   ```
3. Build your Next.js app: `npm run build`
4. Sync with Android: `npx cap sync`
5. Build new APK/AAB
6. Upload to Play Console as an update

## Next Steps

✅ You now have an Android APK!
✅ You can install it on your phone
✅ You're ready to submit to Play Store

For iOS build, follow similar process with:
```bash
npm install @capacitor/ios
npx cap add ios
npx cap open ios
```

**Note**: iOS requires a Mac with Xcode and Apple Developer account ($99/year).

