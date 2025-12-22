import React, { useState, useEffect, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../providers/AuthProvider';

const PACKAGES = [
  { id: 'basic', name: 'Basic', employeeLimit: 5, price: 5 },
  { id: 'standard', name: 'Standard', employeeLimit: 10, price: 8 },
  { id: 'premium', name: 'Premium', employeeLimit: 20, price: 15 }
];

export default function UpgradePackage() {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await API.get('/stripe/history');
      setHistory(data);
    } catch (err) { console.error('Failed to load history', err); }
  }

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
      console.error("Payment Error:", err);
      const errorMessage = err.response?.data?.msg || err.message || 'Payment session creation failed';
      alert(`Payment Failed: ${errorMessage}`);
    } finally { setLoading(false); }
  };

  return (
    <div className="container mx-auto p-2 sm:p-4 lg:p-8 max-w-6xl">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
        <span>⚡</span> Upgrade Package
      </h2>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {PACKAGES.map(p => (
          <div className="card bg-base-100 shadow-xl border border-base-200 hover:border-primary transition-all" key={p.id}>
            <div className="card-body items-center text-center">
              <h3 className="card-title text-2xl font-bold">{p.name}</h3>
              <div className="text-4xl font-black my-4">${p.price}<span className="text-sm font-normal text-gray-400">/mo</span></div>
              <div className="badge badge-accent badge-outline mb-4">Up to {p.employeeLimit} employees</div>
              <button className="btn btn-primary w-full" disabled={loading} onClick={() => handleBuy(p)}>
                {loading ? <span className="loading loading-spinner"></span> : 'Upgrade Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment History */}
      <div className="divider">Payment History</div>

      <div className="card bg-base-100 shadow-lg border border-base-200">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">Transaction History</h3>
          {history.length === 0 ? (
            <p className="text-gray-500">No payment history available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Package</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((pay, idx) => (
                    <tr key={idx}>
                      <td className="font-bold">{pay.packageName} Package</td>
                      <td>${pay.amount}</td>
                      <td>{new Date(pay.paymentDate).toLocaleDateString()} {new Date(pay.paymentDate).toLocaleTimeString()}</td>
                      <td className="font-mono text-xs opacity-70">{pay.transactionId || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
