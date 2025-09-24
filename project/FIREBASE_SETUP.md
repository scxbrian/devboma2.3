# 🔥 Firebase Setup Guide for Google Authentication

## 📋 **STEP-BY-STEP SETUP**

### 1️⃣ **Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"**
3. Enter project name: `devboma-saas`
4. **Disable** Google Analytics (not needed for auth)
5. Click **"Create project"**

### 2️⃣ **Add Web App to Firebase**
1. In your Firebase project dashboard
2. Click the **Web icon** `</>`
3. App nickname: `DevBoma Web App`
4. **Don't check** "Also set up Firebase Hosting"
5. Click **"Register app"**
6. **COPY** the config object (you'll need this!)

### 3️⃣ **Enable Google Authentication**
1. In Firebase Console, go to **"Authentication"**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Find **"Google"** in the providers list
5. Click **"Google"** to configure it
6. **Enable** the toggle
7. Add your email in **"Project support email"**
8. Click **"Save"**

### 4️⃣ **Configure Authorized Domains**
1. Still in **Authentication > Sign-in method**
2. Scroll down to **"Authorized domains"**
3. Add these domains:
   - `localhost` (should already be there)
   - `127.0.0.1` (should already be there)
   - Your production domain when ready

### 5️⃣ **Get Your Config Keys**
Your Firebase config should look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "devboma-saas.firebaseapp.com",
  projectId: "devboma-saas",
  storageBucket: "devboma-saas.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 6️⃣ **Add to Environment Variables**
Create/update your `.env` file in the project root:
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=devboma-saas.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=devboma-saas
VITE_FIREBASE_STORAGE_BUCKET=devboma-saas.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 7️⃣ **Restart Development Server**
```bash
npm run dev
```

## 🚨 **TROUBLESHOOTING**

### **Error: "Firebase config not found"**
- Make sure all `VITE_FIREBASE_*` variables are in your `.env` file
- Restart the dev server after adding env variables

### **Error: "This domain is not authorized"**
- Go to Firebase Console > Authentication > Sign-in method
- Add your domain to "Authorized domains"

### **Error: "Google sign-in popup blocked"**
- Allow popups in your browser
- Try using incognito/private mode

## 🎯 **TESTING**
1. Go to `/login` page
2. Click "Continue with Google"
3. Should open Google sign-in popup
4. After signing in, you should be redirected to dashboard

## 📞 **NEED HELP?**
If you get stuck, share the exact error message and I'll help you fix it!