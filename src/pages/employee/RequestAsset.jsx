import React, { useEffect, useState } from 'react';
import API from '../../api/api';

export default function RequestAsset() {
    const [assets, setAssets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    useEffect(() => { loadAssets(); }, []);
    const loadAssets = async () => { try { const { data } = await API.get('/assets'); setAssets(data.assets); } catch (e) { console.error(e); } }

    const requestAsset = async (assetId, assetName) => {
        try {
            await API.post('/requests', { assetId });
            alert('✅ Asset requested successfully!');
            loadAssets();
        } catch (e) {
            alert(e.response?.data?.msg || 'Error requesting asset');
        }
    };

    const filteredAssets = assets.filter(a => {
        const matchesSearch = a.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || a.productType === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Request Assets</h2>

            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
                <div className="card-body">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="form-control flex-1">
                            <input
                                type="text"
                                placeholder="Search assets..."
                                className="input input-bordered w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="form-control">
                            <select
                                className="select select-bordered w-full md:w-48"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="All">All Types</option>
                                <option value="Returnable">Returnable</option>
                                <option value="Non-returnable">Non-returnable</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssets.map(a => (
                    <div
                        key={a._id}
                        className={`card bg-base-100 shadow-xl transition-all hover:-translate-y-1 ${a.availableQuantity < 1 ? 'opacity-75' : ''}`}
                    >
                        <figure className="px-6 pt-6">
                            <div className="w-full h-32 bg-base-200 rounded-lg flex items-center justify-center text-5xl">
                                {a.productType === 'Returnable' ? '💼' : '🎁'}
                            </div>
                        </figure>
                        <div className="card-body">
                            <h3 className="card-title justify-between">
                                {a.productName}
                                <div className={`badge ${a.productType === 'Returnable' ? 'badge-primary' : 'badge-secondary'} badge-sm`}>
                                    {a.productType}
                                </div>
                            </h3>

                            <div className="flex items-center gap-2 mt-2">
                                <div className={`badge ${a.availableQuantity > 0 ? 'badge-success' : 'badge-error'} gap-2`}>
                                    {a.availableQuantity > 0 ? '✅' : '❌'}
                                    {a.availableQuantity} available
                                </div>
                            </div>

                            <div className="card-actions justify-end mt-4">
                                <button
                                    className="btn btn-primary btn-block"
                                    onClick={() => requestAsset(a._id, a.productName)}
                                    disabled={a.availableQuantity < 1}
                                >
                                    {a.availableQuantity > 0 ? 'Request' : 'Out of Stock'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredAssets.length === 0 && <p className="col-span-full text-center py-10">No assets found</p>}
            </div>
        </div>
    )
}
