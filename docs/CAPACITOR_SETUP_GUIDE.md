# GUÍA DE CONFIGURACIÓN CAPACITOR — Apps Nativas iOS/Android

## 📱 ¿Por qué Capacitor?

Capacitor permite empaquetar la aplicación Next.js existente como app nativa para App Store y Google Play **sin reescribir código**. Ventajas sobre la PWA:

- ✅ Distribución en stores oficiales
- ✅ APIs nativas completas (HealthKit, Google Fit, notificaciones push, cámara mejorada)
- ✅ Mejor rendimiento (WebView nativo optimizado)
- ✅ Sin limitaciones de iOS Safari (storage, background tasks)
- ✅ Iconos y splash screens nativos
- ✅ Deep linking nativo

## 🚀 Instalación (15 min)

### 1. Instalar dependencias

```bash
# Core de Capacitor
npm install @capacitor/core @capacitor/cli

# Plataformas
npm install @capacitor/ios @capacitor/android

# Plugins esenciales
npm install @capacitor/app
npm install @capacitor/haptics
npm install @capacitor/status-bar
npm install @capacitor/splash-screen
npm install @capacitor/camera
npm install @capacitor/filesystem
npm install @capacitor/push-notifications
npm install @capacitor/share
```

### 2. Inicializar Capacitor

```bash
npx cap init
```

Configuración:
- **App name:** EZEQUIEL COACHING
- **App ID:** com.ezequielcoaching.app
- **Web dir:** out (cambiaremos a 'out' para export estático)

### 3. Configurar Next.js para export estático

Editar `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ← AGREGAR ESTA LÍNEA
  images: {
    unoptimized: true, // ← Requerido para export estático
  },
  // ... resto de config existente
};

export default nextConfig;
```

### 4. Agregar plataformas

```bash
npx cap add ios
npx cap add android
```

Esto crea las carpetas `/ios` y `/android` con proyectos nativos.

### 5. Build y sincronizar

```bash
# Build de Next.js en modo export
npm run build

# Copiar archivos al proyecto nativo
npx cap sync
```

---

## 🔧 Configuración del proyecto

### capacitor.config.ts

Crear en la raíz del proyecto:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ezequielcoaching.app',
  appName: 'EZEQUIEL COACHING',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    // Para desarrollo, conectar al servidor Next.js local
    // url: 'http://localhost:3001', // Comentar para producción
    cleartext: true,
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0A0F14',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      iosSpinnerStyle: 'small',
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0A0F14',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  ios: {
    contentInset: 'automatic',
  },
  android: {
    buildOptions: {
      keystorePath: 'capacitor-release-key.keystore', // Crear para producción
      keystoreAlias: 'ezequiel-coaching',
    },
  },
};

export default config;
```

---

## 📱 Configuración iOS

### 1. Abrir Xcode

```bash
npx cap open ios
```

### 2. Configurar en Xcode

1. Seleccionar proyecto "App" en el navegador
2. En **General** → **Identity**:
   - Display Name: `EZEQUIEL COACHING`
   - Bundle Identifier: `com.ezequielcoaching.app`
   - Version: `1.0.0`
   - Build: `1`
3. En **Signing & Capabilities**:
   - Team: (seleccionar tu Apple Developer team)
   - Agregar capabilities:
     - ✅ Push Notifications
     - ✅ Background Modes → Remote notifications
     - ✅ HealthKit (para futuro)

### 3. Configurar Info.plist

Abrir `ios/App/App/Info.plist` y agregar:

```xml
<key>NSCameraUsageDescription</key>
<string>Para tomar fotos de progreso y check-ins</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Para seleccionar fotos de tu galería</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Para guardar fotos de progreso</string>
<key>NSHealthShareUsageDescription</key>
<string>Para sincronizar datos de salud y fitness</string>
<key>NSHealthUpdateUsageDescription</key>
<string>Para actualizar datos de salud</string>
```

### 4. Iconos y Splash

Capacitor genera automáticamente desde los assets existentes:

```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate --ios
```

O manualmente:
1. Arrastrar `icon-1024.png` a `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
2. Splash: usar Launch Screen Storyboard (ya configurado)

---

## 🤖 Configuración Android

### 1. Abrir Android Studio

```bash
npx cap open android
```

### 2. Configurar en Android Studio

1. Abrir `android/app/build.gradle`:

```gradle
android {
    namespace "com.ezequielcoaching.app"
    compileSdk 34
    
    defaultConfig {
        applicationId "com.ezequielcoaching.app"
        minSdk 22  // Android 5.1+
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
    }
    
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

2. Permisos en `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Ya incluidos por plugins, verificar: -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<!-- Para HealthKit/Google Fit (futuro) -->
<uses-permission android:name="android.permission.ACTIVITY_RECOGNITION" />
```

3. Colores y tema en `android/app/src/main/res/values/styles.xml`:

```xml
<style name="AppTheme" parent="Theme.AppCompat.NoActionBar">
    <item name="android:statusBarColor">@color/colorPrimaryDark</item>
    <item name="android:windowBackground">@color/colorPrimaryDark</item>
</style>
```

### 3. Iconos y Splash

```bash
npx capacitor-assets generate --android
```

O manualmente:
- Iconos: `android/app/src/main/res/mipmap-*/ic_launcher.png`
- Splash: `android/app/src/main/res/drawable/splash.png`

---

## 🔌 Integrar Plugins en el código

### 1. Wrapper de Capacitor

Crear `src/lib/capacitor.ts`:

```typescript
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { PushNotifications } from '@capacitor/push-notifications';
import { Filesystem, Directory } from '@capacitor/filesystem';

// Helper: detectar si estamos en app nativa
export const isNativeApp = () => Capacitor.isNativePlatform();
export const isIOS = () => Capacitor.getPlatform() === 'ios';
export const isAndroid = () => Capacitor.getPlatform() === 'android';

// Wrapper de cámara
export async function takePicture() {
  if (!isNativeApp()) {
    // Fallback a input file en web
    return null;
  }
  
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Prompt, // Permite elegir cámara o galería
  });
  
  return image.dataUrl;
}

// Wrapper de vibración
export async function vibrate(style: 'light' | 'medium' | 'heavy' = 'medium') {
  if (!isNativeApp()) {
    // Fallback a Vibration API web
    if ('vibrate' in navigator) {
      navigator.vibrate(style === 'heavy' ? 200 : style === 'medium' ? 100 : 50);
    }
    return;
  }
  
  const impactStyle = 
    style === 'heavy' ? ImpactStyle.Heavy :
    style === 'light' ? ImpactStyle.Light :
    ImpactStyle.Medium;
  
  await Haptics.impact({ style: impactStyle });
}

// Wrapper de compartir
export async function share(title: string, text: string, url?: string) {
  if (!isNativeApp()) {
    // Fallback a Web Share API
    if ('share' in navigator) {
      await navigator.share({ title, text, url });
    }
    return;
  }
  
  await Share.share({ title, text, url });
}

// Status bar
export async function setStatusBarStyle(dark: boolean) {
  if (!isNativeApp()) return;
  
  await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light });
}

// Splash
export async function hideSplash() {
  if (!isNativeApp()) return;
  
  await SplashScreen.hide();
}

// Push notifications
export async function registerPushNotifications() {
  if (!isNativeApp()) return null;
  
  let permStatus = await PushNotifications.checkPermissions();
  
  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }
  
  if (permStatus.receive !== 'granted') {
    return null;
  }
  
  await PushNotifications.register();
  
  return new Promise((resolve) => {
    PushNotifications.addListener('registration', (token) => {
      resolve(token.value);
    });
  });
}

// Guardar archivo
export async function saveFile(filename: string, data: string, mimeType: string) {
  if (!isNativeApp()) {
    // Fallback a download web
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    return;
  }
  
  await Filesystem.writeFile({
    path: filename,
    data: data,
    directory: Directory.Documents,
  });
}
```

### 2. Usar en componentes existentes

Ejemplo: Reemplazar fotos de check-in

```typescript
// Antes (src/app/(client)/checkin/page.tsx)
<input type="file" accept="image/*" capture="environment" />

// Después
import { takePicture } from '@/lib/capacitor';

const handleTakePhoto = async () => {
  const photo = await takePicture();
  if (photo) {
    // photo es base64 data URL, usar directamente
    setPhotos([...photos, photo]);
  }
};

<button onClick={handleTakePhoto}>Tomar foto</button>
```

Ejemplo: Vibración en timer

```typescript
// Antes (src/components/workout-timer.tsx)
if ('vibrate' in navigator) {
  navigator.vibrate(200);
}

// Después
import { vibrate } from '@/lib/capacitor';

await vibrate('heavy');
```

---

## 🧪 Testing en dispositivos

### iOS Simulator

```bash
# Build y sincronizar
npm run build && npx cap sync ios

# Abrir Xcode y ejecutar
npx cap open ios
# Xcode → Seleccionar simulator → Run (⌘R)
```

### Android Emulator

```bash
# Build y sincronizar
npm run build && npx cap sync android

# Abrir Android Studio y ejecutar
npx cap open android
# Android Studio → Seleccionar emulator → Run (Shift+F10)
```

### Dispositivos físicos

**iOS:**
1. Conectar iPhone con cable USB
2. Xcode → Window → Devices and Simulators
3. Confiar en el dispositivo
4. En Xcode, seleccionar tu iPhone en el selector de dispositivos
5. Run

**Android:**
1. Habilitar opciones de desarrollador en Settings
2. Habilitar USB debugging
3. Conectar con USB
4. Android Studio → Seleccionar dispositivo → Run

---

## 🔄 Workflow de desarrollo

### Desarrollo con Hot Reload

```bash
# Terminal 1: Next.js dev server
npm run dev

# Terminal 2: Capacitor live reload
npx cap run ios --livereload --external
# o
npx cap run android --livereload --external
```

Esto permite ver cambios en tiempo real en el dispositivo/emulator.

### Build de producción

```bash
# 1. Build Next.js
npm run build

# 2. Sincronizar con nativos
npx cap sync

# 3. Abrir IDE y crear release build
npx cap open ios     # Xcode → Product → Archive
npx cap open android # Build → Generate Signed Bundle / APK
```

---

## 📦 Publicación en stores

### App Store (iOS)

1. **Crear app en App Store Connect**
   - https://appstoreconnect.apple.com
   - My Apps → + → New App
   - SKU: `ezequiel-coaching-ios`
   - Bundle ID: `com.ezequielcoaching.app`

2. **Archivar en Xcode**
   - Product → Archive
   - Window → Organizer → Upload to App Store

3. **TestFlight**
   - Primero testear con TestFlight (beta testing)
   - Invitar hasta 10,000 testers externos

4. **Submission**
   - Completar metadata (descripción, screenshots, categoría)
   - Submit for Review (revisión ~24-48h)

### Google Play (Android)

1. **Crear app en Google Play Console**
   - https://play.google.com/console
   - Create app
   - Package name: `com.ezequielcoaching.app`

2. **Generar Signed APK/AAB**
   - Android Studio → Build → Generate Signed Bundle / APK
   - Crear keystore (guardar SEGURO):
     ```bash
     keytool -genkey -v -keystore capacitor-release-key.keystore \
       -alias ezequiel-coaching -keyalg RSA -keysize 2048 -validity 10000
     ```

3. **Internal Testing**
   - Primero subir a Internal Testing
   - Testing → Internal → Create Release

4. **Production**
   - Completar store listing (screenshots, descripción)
   - Pricing: Free (in-app purchases para planes)
   - Submit for Review (revisión ~3-7 días)

---

## 🔐 Consideraciones de seguridad

### 1. API URLs
No hardcodear URLs, usar variables de entorno:

```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  // ...
  server: {
    url: process.env.NEXT_PUBLIC_API_URL || 'https://api.ezequielcoaching.com',
  },
};
```

### 2. Cookies y Auth
El JWT httpOnly existente funciona, pero verificar:

```typescript
// src/lib/auth.ts
export function getCookieOptions(req: Request) {
  const isNative = req.headers.get('User-Agent')?.includes('Capacitor');
  
  return {
    httpOnly: true,
    secure: !isNative, // Capacitor usa http://localhost
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };
}
```

### 3. Datos sensibles
- No guardar tokens en localStorage (ya usas httpOnly ✅)
- Encriptar fotos privadas con Filesystem Encryption (iOS/Android automático)

---

## 📊 Analytics y Crash Reporting

Agregar para producción:

```bash
# Firebase (Analytics + Crashlytics)
npm install @capacitor-firebase/analytics
npm install @capacitor-firebase/crashlytics

# Sentry (alternativa)
npm install @sentry/capacitor
```

---

## 🚨 Problemas comunes

### 1. CORS en API
Si la API rechaza requests desde Capacitor:

```typescript
// API route (src/app/api/*/route.ts)
export async function GET(req: Request) {
  const origin = req.headers.get('origin');
  const isCapacitor = origin?.startsWith('capacitor://');
  
  const headers = {
    'Access-Control-Allow-Origin': isCapacitor ? origin : 'https://ezequielcoaching.com',
    'Access-Control-Allow-Credentials': 'true',
  };
  
  return NextResponse.json(data, { headers });
}
```

### 2. Audio no reproduce
iOS requiere interacción del usuario antes de reproducir audio:

```typescript
// Reproducir silencio en primer tap
const unlockAudio = () => {
  const audio = new Audio('/audio/silence.mp3');
  audio.play().catch(() => {});
  document.removeEventListener('click', unlockAudio);
};
document.addEventListener('click', unlockAudio, { once: true });
```

### 3. Imágenes no cargan
Usar rutas absolutas, no relativas:

```typescript
// ❌ Mal
<img src="../images/logo.png" />

// ✅ Bien
<img src="/images/logo.png" />
```

### 4. Service Worker conflicto
Deshabilitar SW en apps nativas:

```typescript
// src/components/pwa-register.tsx
import { isNativeApp } from '@/lib/capacitor';

useEffect(() => {
  if (isNativeApp()) return; // No registrar SW en nativo
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
}, []);
```

---

## 📚 Recursos adicionales

- [Capacitor Docs](https://capacitorjs.com/docs)
- [iOS Guidelines](https://capacitorjs.com/docs/ios)
- [Android Guidelines](https://capacitorjs.com/docs/android)
- [Plugin API Reference](https://capacitorjs.com/docs/apis)
- [Next.js + Capacitor Template](https://github.com/mlynch/nextjs-capacitor)

---

## ✅ Checklist final

- [ ] Dependencias instaladas
- [ ] `capacitor.config.ts` configurado
- [ ] `next.config.mjs` con `output: 'export'`
- [ ] Plataformas agregadas (`ios`, `android`)
- [ ] Build funciona (`npm run build`)
- [ ] Sync funciona (`npx cap sync`)
- [ ] App corre en iOS Simulator
- [ ] App corre en Android Emulator
- [ ] Permisos configurados (cámara, notificaciones)
- [ ] Plugins integrados en código
- [ ] Iconos y splash generados
- [ ] Testear en dispositivo físico
- [ ] Auth funciona (cookies)
- [ ] Upload de fotos funciona
- [ ] Audio del narrador funciona
- [ ] Vibración funciona
- [ ] Push notifications (si implementado)
- [ ] Keystore creado (Android)
- [ ] Certificado creado (iOS)
- [ ] Metadata de stores preparada
- [ ] Build de producción testeado

---

**¿Necesitas ayuda?** Abre un issue con el tag `[capacitor]`
