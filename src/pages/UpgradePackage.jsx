import React, { useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../providers/AuthProvider';

const PACKAGES = [
  { id: 'basic', name: 'Basic', employeeLimit: 5, price: 5 },
  { id: 'standard', name: 'Standard', employeeLimit: 10, price: 8 },
  { id: 'premium', name: 'Premium', employeeLimit: 20, price: 15 }
];

export default function UpgradePackage() {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleBuy = async (pkg) => {
    setLoading(true);
    try {
      const { data } = await API.post('/stripe/create-session', {
        hrEmail: user?.email,
        packageId: pkg.id,
        packageName: pkg.name,
        employeeLimit: pkg.employeeLimit,
        amount: pkg.price
      });
      console.log('Stripe Session URL:', data.url);
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Checkout failed');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Upgrade Package</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {PACKAGES.map(p => (
          <div className="card p-4" key={p.id}>
            <h3 className="text-xl font-bold">{p.name}</h3>
            <p>Employee limit: {p.employeeLimit}</p>
            <p className="mb-3">${p.price} / month</p>
            <button className="btn btn-primary" disabled={loading} onClick={() => handleBuy(p)}>
              {loading ? 'Processing...' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
