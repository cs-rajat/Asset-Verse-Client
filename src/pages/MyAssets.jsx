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

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

  const [modalOpen, setModalOpen] = useState(false);
  // We keep this ref because it is used in the JSX <div ref={componentRef}>
  const componentRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  // Note: We are now using native print with global CSS hiding/showing elements.
  // The 'componentRef' is no longer strictly needed for react-to-print but we keep the structure.

  useEffect(() => { fetchAssets(currentPage); }, [currentPage]);

  const fetchAssets = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await API.get(`/assigned?page=${page}&limit=10`);
      setItems(data.items || []);
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
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

  // Calculate stats
  const totalAssets = items.length;
  const assignedCount = items.filter(it => it.status === 'assigned').length;
  const returnableCount = items.filter(it => it.assetType === 'Returnable').length;
  const pendingReturnCount = items.filter(it => it.status === 'return_requested').length;

  if (loading) return <div className="text-center mt-10"><span className="loading loading-spinner"></span></div>;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      {/* Return Modal */}
      <dialog id="return_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <span className="text-2xl">🔄</span>
            Return Asset Request
          </h3>
          <p className="py-4 text-sm opacity-70">
            Please provide details about the asset's condition before returning.
          </p>

          {/* Alert */}
          <div className="alert alert-info mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="text-xs">
              <p>Your return request will be sent to HR for review. The asset will remain assigned until approved.</p>
            </div>
          </div>

          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text font-semibold">Asset Condition</span>
              <span className="label-text-alt text-error">Required</span>
            </label>
            <select
              className="select select-bordered"
              value={returnForm.condition}
              onChange={e => setReturnForm({ ...returnForm, condition: e.target.value })}
            >
              <option value="Safe">✅ Safe / Good Condition</option>
              <option value="Minor Damage">⚠️ Minor Damage</option>
              <option value="Damaged">❌ Damaged / Broken</option>
            </select>
          </div>

          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text font-semibold">Additional Notes</span>
              <span className="label-text-alt opacity-60">{returnForm.note.length}/200</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Describe any issues or additional information..."
              value={returnForm.note}
              onChange={e => setReturnForm({ ...returnForm, note: e.target.value.slice(0, 200) })}
              maxLength={200}
            ></textarea>
          </div>

          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => window.return_modal.close()}>
              Cancel
            </button>
            <button className="btn btn-warning gap-2" onClick={handleReturnSubmit}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Submit Return Request
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            📦 My Assigned Assets
          </h2>
          <p className="text-xs sm:text-sm opacity-60">View and manage all assets assigned to you across companies</p>
        </div>
        <button className="btn btn-secondary btn-outline btn-sm sm:btn-md gap-2" onClick={handlePrint}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Print List (PDF)
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="stats stats-vertical sm:stats-horizontal shadow mb-6 w-full bg-base-100 border border-base-200 no-print">
        <div className="stat">
          <div className="stat-figure text-primary text-3xl">📊</div>
          <div className="stat-title">Total Assets</div>
          <div className="stat-value text-primary">{totalAssets}</div>
          <div className="stat-desc">From all companies</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-success text-3xl">✅</div>
          <div className="stat-title">Active</div>
          <div className="stat-value text-success">{assignedCount}</div>
          <div className="stat-desc">Currently assigned</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-info text-3xl">🔄</div>
          <div className="stat-title">Returnable</div>
          <div className="stat-value text-info">{returnableCount}</div>
          <div className="stat-desc">Can be returned</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-warning text-3xl">⏳</div>
          <div className="stat-title">Pending Return</div>
          <div className="stat-value text-warning">{pendingReturnCount}</div>
          <div className="stat-desc">Awaiting approval</div>
        </div>
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
                  <th className="hidden lg:table-cell">Type</th>
                  <th>Company</th>
                  <th className="hidden md:table-cell">Request Date</th>
                  <th className="hidden md:table-cell">Approval Date</th>
                  <th>Status</th>
                  <th className="no-print text-right min-w-[120px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(it => (
                  <tr key={it._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {it.assetImage ? <img src={it.assetImage} alt="" className="w-12 h-12 object-cover rounded-lg bg-base-200" /> : <div className="w-12 h-12 bg-base-300 rounded-lg flex items-center justify-center">📦</div>}
                        <div>
                          <div className="font-bold">{it.assetName}</div>
                          {/* Mobile Only: Type Badge under Title */}
                          <div className="lg:hidden mt-1 text-left">
                            <span className={`badge ${it.assetType === 'Returnable' ? 'badge-primary' : 'badge-secondary'} badge-xs opacity-90 whitespace-nowrap h-auto py-0.5`}>{it.assetType}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell">
                      <span className={`badge ${it.assetType === 'Returnable' ? 'badge-primary' : 'badge-secondary'} badge-sm whitespace-nowrap`}>{it.assetType}</span>
                    </td>
                    <td>
                      <div className="text-sm">{it.companyName}</div>
                    </td>
                    <td className="hidden md:table-cell">
                      <div className="text-xs opacity-70 flex items-center gap-1">
                        📝 {it.requestDate ? new Date(it.requestDate).toLocaleDateString() :
                          it.assignmentDate ? new Date(it.assignmentDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="hidden md:table-cell">
                      <div className="text-xs opacity-70 flex items-center gap-1">
                        ✅ {it.approvalDate ? new Date(it.approvalDate).toLocaleDateString() :
                          it.assignmentDate ? new Date(it.assignmentDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-sm ${it.status === 'assigned' ? 'badge-success' :
                        it.status === 'return_requested' ? 'badge-warning' :
                          it.status === 'returned' ? 'badge-ghost' :
                            'badge-info'
                        }`}>
                        {it.status === 'return_requested' ? 'Return Pending' :
                          it.status === 'assigned' ? 'Assigned' :
                            it.status === 'returned' ? 'Returned' : it.status}
                      </span>
                    </td>
                    <td className="no-print text-right min-w-[120px]">
                      {it.assetType === 'Returnable' && it.status === 'assigned' && (
                        <button
                          className="btn btn-warning btn-xs gap-1"
                          onClick={() => openReturnModal(it._id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                          Return
                        </button>
                      )}
                      {it.status === 'return_requested' && (
                        <span className="text-xs opacity-60">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredItems.length > 0 && pagination.pages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 no-print">
            <div className="text-sm opacity-70">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} assets
            </div>
            <div className="join">
              <button
                className="join-item btn btn-sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                «
              </button>
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`join-item btn btn-sm ${currentPage === i + 1 ? 'btn-active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="join-item btn btn-sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                disabled={currentPage === pagination.pages}
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
