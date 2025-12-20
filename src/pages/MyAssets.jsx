import React, { useEffect, useState, useRef } from 'react';
import API from '../api/api';
import { useReactToPrint } from 'react-to-print';

export default function MyAssets() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [returnForm, setReturnForm] = useState({ condition: 'Safe', note: '' });

  const [modalOpen, setModalOpen] = useState(false);
  // We keep this ref because it is used in the JSX <div ref={componentRef}>
  const componentRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  // Note: We are now using native print with global CSS hiding/showing elements.
  // The 'componentRef' is no longer strictly needed for react-to-print but we keep the structure.

  useEffect(() => { fetchAssets(); }, []);

  const fetchAssets = async () => {
    try {
      const { data } = await API.get(`/assigned?limit=1000`);
      setItems(data.items || []);
      setLoading(false);
    } catch (err) { console.error(err); alert('Failed to load assigned assets'); setLoading(false); }
  };

  const openReturnModal = (id) => {
    setSelectedAssetId(id);
    setReturnForm({ condition: 'Safe', note: '' });
    window.return_modal.showModal();
  };

  const handleReturnSubmit = async () => {
    try {
      await API.patch(`/assigned/return/${selectedAssetId}`, {
        returnCondition: returnForm.condition,
        returnNote: returnForm.note
      });
      alert("Return requested successfully");
      window.return_modal.close();
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
      {/* Return Modal */}
      <dialog id="return_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Return Asset</h3>
          <p className="py-4">Please provide details about the asset's condition.</p>
          <div className="form-control w-full mb-4">
            <label className="label">Condition</label>
            <select className="select select-bordered" value={returnForm.condition} onChange={e => setReturnForm({ ...returnForm, condition: e.target.value })}>
              <option value="Safe">Safe / Good</option>
              <option value="Minor Damage">Minor Damage</option>
              <option value="Damaged">Damaged / Broken</option>
            </select>
          </div>
          <div className="form-control w-full mb-4">
            <label className="label">Note (Optional)</label>
            <textarea className="textarea textarea-bordered" value={returnForm.note} onChange={e => setReturnForm({ ...returnForm, note: e.target.value })}></textarea>
          </div>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={handleReturnSubmit}>Confirm Return</button>
            <button className="btn" onClick={() => window.return_modal.close()}>Cancel</button>
          </div>
        </div>
      </dialog>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            📦 My Assigned Assets
          </h2>
          <p className="text-sm opacity-60">Manage all assets assigned to you</p>
        </div>
        <button className="btn btn-secondary btn-outline gap-2" onClick={handlePrint}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Print List (PDF)
        </button>
      </div>

      {/* Printable Area Wrapper */}
      <div ref={componentRef} className="p-4">
        {/* Print Header */}
        <div className="print-header mb-6 hidden print:block">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">💎 AssetVerse</h1>
              <p className="text-sm opacity-60">Corporate Asset Management System</p>
            </div>
            <div className="text-right text-xs opacity-60">
              <p>Report Generated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl border border-base-200 mb-6 no-print">
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
                <option value="assigned">Assigned</option>
                <option value="return_requested">Return Pending</option>
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
                      <span className={`badge ${it.status === 'assigned' ? 'badge-success' : it.status === 'return_requested' ? 'badge-warning' : 'badge-ghost'}`}>
                        {it.status === 'return_requested' ? 'Return Requested' : it.status}
                      </span>
                    </td>
                    <td>
                      {it.assetType === 'Returnable' && (it.status === 'assigned' || !it.status) && (
                        <button
                          className="btn btn-warning btn-xs"
                          onClick={() => openReturnModal(it._id)}
                          disabled={it.status === 'returned' || it.status === 'return_requested'}
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
    </div>
  );
}
