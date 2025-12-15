import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterHR from './pages/RegisterHR';
import RegisterEmployee from './pages/RegisterEmployee';
import DashboardHR from './pages/DashboardHR';
import DashboardEmployee from './pages/DashboardEmployee';
import Navbar from './components/Navbar';
import MyAssets from './pages/MyAssets';
import UpgradePackage from './pages/UpgradePackage';
import Analytics from './pages/Analytics';
import { setAuthToken } from './api/api';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import AssetList from './pages/hr/AssetList';
import AddAsset from './pages/hr/AddAsset';
import AllRequests from './pages/hr/AllRequests';
import MyEmployeeList from './pages/hr/MyEmployeeList';
import EditAsset from './pages/hr/EditAsset';
import RequestAsset from './pages/employee/RequestAsset';
import MyTeam from './pages/employee/MyTeam';
import Profile from './pages/Profile';
import PaymentSuccess from './pages/PaymentSuccess';

import Footer from './components/Footer';

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthToken(token);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Navbar />
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/hr" element={<RegisterHR />} />
          <Route path="/register/employee" element={<RegisterEmployee />} />
          <Route path="/dashboard/hr" element={<AdminRoute><DashboardHR /></AdminRoute>}>
            <Route index element={<AssetList />} />
            <Route path="add-asset" element={<AddAsset />} />
            <Route path="assets/:id/edit" element={<EditAsset />} />
            <Route path="requests" element={<AllRequests />} />
            <Route path="employees" element={<MyEmployeeList />} />
          </Route>
          <Route path="/dashboard/employee" element={<PrivateRoute><DashboardEmployee /></PrivateRoute>}>
            <Route index element={<RequestAsset />} />
            <Route path="request" element={<RequestAsset />} />
          </Route>
          <Route path="/my-assets" element={<PrivateRoute><MyAssets /></PrivateRoute>} />
          <Route path="/my-team" element={<PrivateRoute><MyTeam /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/upgrade" element={<AdminRoute><UpgradePackage /></AdminRoute>} />
          <Route path="/payment-success" element={<AdminRoute><PaymentSuccess /></AdminRoute>} />
          <Route path="/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App;
