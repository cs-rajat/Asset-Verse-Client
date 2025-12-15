import React, { useEffect, useState } from 'react';
import API from '../../api/api';
import HRStats from './HRStats';
import { Link } from 'react-router-dom';

export default function AssetList() {
    const [assets, setAssets] = useState([]);
    const [requests, setRequests] = useState([]); // Needed for stats
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');

    const loadData = async () => {
        try {
            const [assetsRes, requestsRes] = await Promise.all([
                API.get('/assets'),
                API.get('/requests/hr')
            ]);
            setAssets(assetsRes.data.assets || []);
            setRequests(requestsRes.data || []);
            setLoading(false);
        } catch (err) { console.error(err); setLoading(false); }
    }

    useEffect(() => { loadData(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await API.delete(`/assets/${id}`);
            loadData();
        } catch (err) { alert("Failed to delete"); }
    }

    // Calculate stats
    const totalAssets = assets.length;
    const totalQuantity = assets.reduce((sum, a) => sum + a.productQuantity, 0);
    const availableQuantity = assets.reduce((sum, a) => sum + a.availableQuantity, 0);
    const pendingRequests = requests.length;

    const filteredAssets = assets.filter(a => {
        const matchName = a.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = filterType ? a.productType === filterType : true;
        return matchName && matchType;
    });

    if (loading) return <div className="text-center mt-20"><span className="loading loading-dots loading-lg"></span></div>;

    return (
        <div>
            <h2 className="text-3xl font-bold font-heading mb-6 flex items-center gap-3">
                <span>📦</span> Asset Inventory
            </h2>
            <HRStats
                totalAssets={totalAssets}
                totalQuantity={totalQuantity}
                availableQuantity={availableQuantity}
                pendingRequests={pendingRequests}
            />

            <div className="card bg-base-100 shadow-xl border border-base-200">
                <div className="card-body p-6">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4 items-center bg-base-50 p-4 rounded-xl">
                        <div className="form-control w-full md:w-auto">
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    className="input input-bordered w-full md:w-80 bg-white"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                                <button className="btn btn-square btn-ghost bg-base-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <select
                                className="select select-bordered w-full md:w-auto bg-white"
                                value={filterType}
                                onChange={e => setFilterType(e.target.value)}
                            >
                                <option value="">All Types</option>
                                <option value="Returnable">Returnable</option>
                                <option value="Non-returnable">Non-returnable</option>
                            </select>

                            <Link to="/dashboard/hr/add-asset" className="btn btn-primary gap-2 w-full md:w-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                Add Asset
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-base-200">
                        <table className="table table-zebra w-full">
                            <thead className="bg-base-200/50 text-base-content/70">
                                <tr>
                                    <th className="font-bold uppercase tracking-wider">Asset</th>
                                    <th className="font-bold uppercase tracking-wider">Type</th>
                                    <th className="font-bold uppercase tracking-wider">Availability</th>
                                    <th className="font-bold uppercase tracking-wider">Date Added</th>
                                    <th className="font-bold uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAssets.length > 0 ? filteredAssets.map(asset => (
                                    <tr key={asset._id} className="hover:bg-base-50 transition-colors">
                                        <td>
                                            <div className="flex items-center gap-4">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12 bg-base-200 ring-2 ring-base-300 ring-offset-2">
                                                        <img src={asset.productImage || "https://placehold.co/100"} alt="Asset" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-lg">{asset.productName}</div>
                                                    <div className="text-xs text-base-content/50">ID: {asset._id.slice(-6)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge badge-md font-medium border-0 ${asset.productType === 'Returnable' ? 'badge-primary bg-primary/10 text-primary' : 'badge-secondary bg-secondary/10 text-secondary'}`}>
                                                {asset.productType}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <progress className={`progress w-20 ${asset.availableQuantity < 5 ? 'progress-error' : 'progress-success'}`} value={asset.availableQuantity} max={asset.productQuantity}></progress>
                                                <span className="font-mono font-bold text-sm">{asset.availableQuantity} / {asset.productQuantity}</span>
                                            </div>
                                        </td>
                                        <td className="text-sm">{new Date(asset.dateAdded).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                        <td className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Link to={`/dashboard/hr/assets/${asset._id}/edit`} className="btn btn-sm btn-ghost btn-square text-info hover:bg-info/10">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </Link>
                                                <button className="btn btn-sm btn-ghost btn-square text-error hover:bg-error/10" onClick={() => handleDelete(asset._id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-20 text-gray-400">
                                            <div className="flex flex-col items-center">
                                                <span className="text-6xl mb-4">🔍</span>
                                                <span className="text-xl">No assets found</span>
                                                <span className="text-sm">Try adjusting your search or filters</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
