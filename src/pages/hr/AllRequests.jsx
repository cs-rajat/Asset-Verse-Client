import React, { useEffect, useState } from 'react';
import API from '../../api/api';

export default function AllRequests() {
    const [requests, setRequests] = useState([]);

    useEffect(() => { loadRequests(); }, []);

    const loadRequests = async () => {
        try { const { data } = await API.get('/requests/hr'); setRequests(data); } catch (e) { console.error(e); }
    }

    const approve = async id => { try { await API.patch(`/requests/approve/${id}`); alert('Approved'); loadRequests(); } catch (e) { alert(e.response?.data?.msg || 'Error'); } }
    const reject = async id => { try { await API.patch(`/requests/reject/${id}`); alert('Rejected'); loadRequests(); } catch (e) { alert(e.response?.data?.msg || 'Error'); } }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">All Requests</h2>
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="overflow-x-auto">
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
                                {requests.length === 0 && <tr><td colSpan="7" className="text-center">No requests found</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
