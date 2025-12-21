# 🏢 AssetVerse - Client Application

> **Corporate Asset Management System**  
> A modern, responsive web application for managing company assets, developed with React, Vite, and TailwindCSS.

## 🌐 Live URL

**Deployed Site**: [https://asset-verse24.netlify.app](https://asset-verse24.netlify.app)

---

## ✨ Key Features

### **For HR Managers**
- 📊 **Dashboard & Analytics**: Visual overview of asset distribution, return requests, and pending actions.
- 📦 **Asset Management**: Add, update, and delete assets with image upload (ImgBB).
- 👥 **Team Management**: View employee list, remove members, and assign assets directly.
- 💳 **Subscription Management**: Upgrade packages via Stripe securely.
- 📢 **Notice Board**: Post company-wide announcements.
- 📝 **Request Handling**: Approve or reject asset requests from employees.

### **For Employees**
- 🛒 **Request Assets**: Browse available company assets and make requests.
- 📂 **My Assets**: detailed list of assigned assets with filtering (Returned, Pending, Approved).
- 📄 **PDF Reporting**: Print or download list of assigned assets.
- 🔄 **Return Request**: Easy workflow to return assets with condition notes.
- 👤 **Profile & Team**: View own profile and see team members/birthdays.

---

## 🛠️ Tech Stack & Packages

| Category | Technology |
|----------|------------|
| **Framework** | React + Vite |
| **Styling** | TailwindCSS + DaisyUI |
| **Authentication** | Firebase Auth |
| **State Management** | React Hooks (Context API optional) |
| **Routing** | React Router DOM |
| **Payment** | Stripe.js + React Stripe |
| **Charts** | Recharts |
| **Utilities** | Axios, React-to-Print, Framer Motion |

### **📦 NPM Dependencies**
```json
{
  "@stripe/react-stripe-js": "^5.4.1",
  "@stripe/stripe-js": "^8.5.3",
  "axios": "^1.4.0",
  "daisyui": "^3.2.2",
  "firebase": "^12.6.0",
  "framer-motion": "^12.23.26",
  "react": "^18.2.0",
  "react-router-dom": "^6.14.1",
  "react-to-print": "^3.2.0",
  "recharts": "^2.5.0",
  "tailwindcss": "^3.4.12"
}
```

---

## 🚀 Setup Instructions

### **1. Clone the Repository**
```bash
git clone https://github.com/cs-rajat/Asset-Verse-Client.git
cd Asset-Verse-Client
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Configure Environment Variables**
Create a `.env` file in the root directory and add the following keys:

```env
# Firebase Configuration (Get these from Firebase Console)
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_project.firebaseapp.com
VITE_projectId=your_project_id
VITE_storageBucket=your_project.firebasestorage.app
VITE_messagingSenderId=your_sender_id
VITE_appId=your_app_id

# Backend API URL (Production URL for Vercel)
VITE_API_URL=https://asset-verse-server-mu.vercel.app/api

# Image Upload (ImgBB)
VITE_IMGBB_API_KEY=your_imgbb_api_key

# Payment (Stripe)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

### **4. Run Locally**
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🚢 Deployment (Netlify)

1.  **Build the Project**:
    ```bash
    npm run build
    ```
    This creates a `dist` folder.

2.  **Deploy**:
    - **Option A (Git)**: Connect this repo to Netlify. Set Build Command: `npm run build`, Publish Directory: `dist`.
    - **Option B (Manual)**: Drag and drop the `dist` folder into the Netlify "Sites" dashboard.

3.  **Important**:
    - Ensure all Environment Variables from `.env` are added to Netlify Site Settings.
    - Ensure `_redirects` file exists in `public/` folder (Already included in repo) to prevent 404 errors on refresh.

---

## 👨‍💻 Author

**AssetVerse Team**  
Rajat Mandal
