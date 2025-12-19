# AssetVerse - Corporate Asset Management System

AssetVerse is a comprehensive Web Application designed for HR Managers to efficiently manage company assets and for Employees to request and track their assigned equipment.

## Live Site
**URL**: [Add your Vercel/Netlify URL here]

## Key Features
- **HR Dashboard**: 
  - Asset Inventory Management (CRUD, Image Upload via ImgBB).
  - Employee Management (Team view, Remove affiliation).
  - Request Approval Workflow.
  - Subscription Package System (Stripe Integration).
- **Employee Dashboard**:
  - View Assigned Assets (Search, Filter).
  - Request New Assets.
  - My Team View (Birthdays, Colleagues).
  - Profile Management.
- **Home Page**:
  - Dynamic Package Pricing.
  - Professional Corporate UI with Framer Motion.
- **Security**:
  - JWT Authentication.
  - Role-Based Access Control (HR vs Employee).

## Tech Stack & Packages
- **Frontend**: React, Vite, DaisyUI, TailwindCSS
- **State/Auth**: Firebase Auth, Context API
- **Visualization**: Recharts, Framer Motion
- **Payment**: Stripe Elements (`@stripe/react-stripe-js`)
- **HTTP**: Axios

## Setup Instructions
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file with the variables listed below.
4. Run `npm run dev` to start the local development server.

## Environment Variables
Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:5001/api
VITE_apiKey=YOUR_FIREBASE_API_KEY
VITE_authDomain=YOUR_FIREBASE_AUTH_DOMAIN
VITE_projectId=YOUR_FIREBASE_PROJECT_ID
VITE_storageBucket=YOUR_FIREBASE_STORAGE_BUCKET
VITE_messagingSenderId=YOUR_FIREBASE_SENDER_ID
VITE_appId=YOUR_FIREBASE_APP_ID
VITE_IMGBB_API_KEY=YOUR_IMGBB_API_KEY
VITE_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PUBLIC_KEY
```

## Admin Test Credentials
- **Email**: hr@testcompany.com
- **Password**: (Please use the password provided in submission notes)
