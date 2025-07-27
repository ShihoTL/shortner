# short.com - URL Shortener

A clean, minimal URL shortener built with Next.js and Firebase.

## Features

- 🔐 Google Authentication
- 🔗 URL shortening with optional custom aliases
- 📊 Click tracking and analytics
- 📱 Responsive design
- ⚡ Fast redirects
- 🎨 Clean, minimal UI

## Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Firebase:**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication with Google provider
   - Create a Firestore database
   - Copy your Firebase config

3. **Environment Variables:**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Firebase configuration values

4. **Firestore Security Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow users to read/write their own links
       match /users/{userId}/links/{linkId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Allow anyone to read short URLs for redirection
       match /shortUrls/{shortCode} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

## Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase Hosting:**
   - Install Firebase CLI: `npm install -g firebase-tools`
   - Login: `firebase login`
   - Initialize: `firebase init hosting`
   - Deploy: `firebase deploy`

## Usage

1. Sign in with your Google account
2. Enter a long URL to shorten
3. Optionally add a custom alias
4. Copy and share your short link
5. Track clicks in your dashboard

## Tech Stack

- **Framework:** Next.js 13 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Authentication:** Firebase Auth
- **Database:** Firestore
- **Deployment:** Firebase Hosting
- **Icons:** Lucide React

## License

MIT License