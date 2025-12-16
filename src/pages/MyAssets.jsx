import React, { useEffect, useState } from 'react';
import API from '../api/api';

export default function MyAssets() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchAssets(); }, []);

  const fetchAssets = async () => {
    try {
      // Fetch all assigned assets (pagination optional for "My Assets" unless huge)
      // If we need pagination with search, we'd pass query params here.
      // For now, let's fetch all and filter client-side for "My Assets" typical scale.
      const { data } = await API.get(`/assigned?limit=1000`);
      setItems(data.items || []);
      setLoading(false);
    } catch (err) { console.error(err); alert('Failed to load assigned assets'); setLoading(false); }
  };

  const handleReturn = async (id) => {
    if (!window.confirm("Are you sure you want to return this asset?")) return;
    try {
      await API.patch(`/assigned/return/${id}`);
      alert("Asset returned successfully");
      fetchAssets();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to return asset");
    }
  };

  const filteredItems = items.filter(item => {
    const matchName = item.assetName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType ? item.assetType === filterType : true;
    const matchStatus = statusFilter ? item.status === statusFilter : true;
    return matchName && matchType && matchStatus;
  });

  if (loading) return <div className="text-center mt-10"><span className="loading loading-spinner"></span></div>;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            📦 My Assigned Assets
          </h2>
          <p className="text-sm opacity-60">Manage all assets assigned to you</p>
        </div>
        <button className="btn btn-secondary btn-outline gap-2" onClick={() => window.print()}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Print List
        </button>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200 mb-6">
        <div className="card-body p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search asset name..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <select
              className="select select-bordered w-full md:w-auto"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Returnable">Returnable</option>
              <option value="Non-returnable">Non-returnable</option>
            </select>
            <select
              className="select select-bordered w-full md:w-auto"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="assigned">Pending Return</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-base-50 rounded-xl border border-dashed border-base-300">
          <p className="text-lg opacity-60">No assets found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-xl shadow-xl border border-base-200">
          <table className="table w-full">
            <thead className="bg-base-200">
              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Company</th>
                <th>Assigned Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(it => (
                <tr key={it._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {it.assetImage ? <img src={it.assetImage} alt="" className="w-12 h-12 object-cover rounded-lg bg-base-200" /> : <div className="w-12 h-12 bg-base-300 rounded-lg flex items-center justify-center">📦</div>}
                      <div className="font-bold">{it.assetName}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${it.assetType === 'Returnable' ? 'badge-primary' : 'badge-secondary'} badge-sm`}>{it.assetType}</span>
                  </td>
                  <td>{it.companyName}</td>
                  <td>{new Date(it.assignmentDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${it.status === 'assigned' ? 'badge-success' : 'badge-ghost'}`}>{it.status}</span>
                  </td>
                  <td>
                    {it.assetType === 'Returnable' && (it.status === 'assigned' || !it.status) && (
                      <button
                        className="btn btn-warning btn-xs"
                        onClick={() => handleReturn(it._id)}
                        disabled={it.status === 'returned'}
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
