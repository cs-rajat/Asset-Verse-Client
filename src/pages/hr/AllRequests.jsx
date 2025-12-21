import React, { useEffect, useState } from 'react';
import API from '../../api/api';

export default function AllRequests() {
    const [requests, setRequests] = useState([]);
    const [returnRequests, setReturnRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('assets'); // 'assets' or 'returns'
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

    useEffect(() => {
        loadRequests(currentPage);
        loadReturnRequests();
    }, [currentPage]);

    const loadRequests = async (page = 1) => {
        try { 
            const { data } = await API.get(`/requests/hr?page=${page}&limit=10`); 
            // Handle both old format (array) and new format (object with requests property)
            setRequests(data.requests || data || []); 
            setPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
        } catch (e) { 
            console.error(e); 
            setRequests([]);
        }
    }

    const loadReturnRequests = async () => {
        try { 
            const { data } = await API.get('/assigned/return-requests'); 
            setReturnRequests(data || []); 
        } catch (e) { 
            console.error(e); 
            setReturnRequests([]);
        }
    }

    const approve = async id => { try { await API.patch(`/requests/approve/${id}`); alert('Approved'); loadRequests(); } catch (e) { alert(e.response?.data?.msg || 'Error'); } }
    const reject = async id => { try { await API.patch(`/requests/reject/${id}`); alert('Rejected'); loadRequests(); } catch (e) { alert(e.response?.data?.msg || 'Error'); } }

    const approveReturn = async id => {
        if (!window.confirm("Approve return and update stock?")) return;
        try {
            await API.patch(`/assigned/approve-return/${id}`);
            alert("Return Approved");
            loadReturnRequests();
        } catch (e) {
            alert(e.response?.data?.msg || "Error approving return");
        }
    }

    return (
        <div className="container mx-auto p-2 sm:p-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">All Requests</h2>

            <div className="tabs tabs-boxed mb-4 sm:mb-6 w-full">
                <a className={`tab flex-1 ${activeTab === 'assets' ? 'tab-active' : ''}`} onClick={() => setActiveTab('assets')}>Asset Requests</a>
                <a className={`tab flex-1 ${activeTab === 'returns' ? 'tab-active' : ''}`} onClick={() => setActiveTab('returns')}>Return Requests</a>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-2 sm:p-4">
                    <div className="overflow-x-auto -mx-2 sm:mx-0">
                        {activeTab === 'assets' ? (
                            <table className="table table-zebra">
                                <thead>
                                    <tr className="bg-base-200">
                                        <th>Employee</th>
                                        <th>Asset</th>
                                        <th>Type</th>
                                        <th>Note</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map(r => (
                                        <tr key={r._id}>
                                            <td>
                                                <div className="font-bold">{r.requesterName}</div>
                                                <div className="text-sm opacity-50">{r.requesterEmail}</div>
                                            </td>
                                            <td>{r.assetName}</td>
                                            <td>{r.assetType}</td>
                                            <td className="max-w-xs truncate text-xs text-gray-500" title={r.note}>{r.note || '-'}</td>
                                            <td>{new Date(r.requestDate).toLocaleDateString()}</td>
                                            <td>
                                                <div className={`badge ${r.requestStatus === 'pending' ? 'badge-warning' : r.requestStatus === 'approved' ? 'badge-success' : 'badge-error'}`}>
                                                    {r.requestStatus}
                                                </div>
                                            </td>
                                            <td>
                                                {r.requestStatus === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <button className="btn btn-success btn-xs" onClick={() => approve(r._id)}>Approve</button>
                                                        <button className="btn btn-error btn-xs" onClick={() => reject(r._id)}>Reject</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {requests.length === 0 && <tr><td colSpan="7" className="text-center">No asset requests found</td></tr>}
                                </tbody>
                            </table>
                        ) : (
                            <table className="table table-zebra">
                                <thead>
                                    <tr className="bg-base-200">
                                        <th>Employee</th>
                                        <th>Asset</th>
                                        <th>Condition</th>
                                        <th>Note</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {returnRequests.map(r => (
                                        <tr key={r._id}>
                                            <td>
                                                <div className="font-bold">{r.employeeName}</div>
                                                <div className="text-sm opacity-50">{r.employeeEmail}</div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    {r.assetImage && <img src={r.assetImage} className="w-8 h-8 rounded object-cover" />}
                                                    {r.assetName}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${r.returnCondition === 'Safe' ? 'badge-success' : 'badge-error'}`}>{r.returnCondition}</span>
                                            </td>
                                            <td className="max-w-xs truncate text-xs text-gray-500">{r.returnNote || '-'}</td>
                                            <td>{new Date(r.returnRequestDate).toLocaleDateString()}</td>
                                            <td>
                                                <button className="btn btn-primary btn-xs" onClick={() => approveReturn(r._id)}>Finalize Return</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {returnRequests.length === 0 && <tr><td colSpan="6" className="text-center">No return requests found</td></tr>}
                                </tbody>

                    {/* Pagination Controls - Only for Asset Requests */}
                    {activeTab === 'assets' && pagination.pages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                            <div className="text-sm opacity-70">
                                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} requests
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
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
