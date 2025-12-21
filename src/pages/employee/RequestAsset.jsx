import React, { useEffect, useState } from 'react';
import API from '../../api/api';

export default function RequestAsset() {
    const [assets, setAssets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [loading, setLoading] = useState(true);

    // Modal State
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [note, setNote] = useState('');
    const [requesting, setRequesting] = useState(false);

    useEffect(() => { loadAssets(); }, []);
    
    const loadAssets = async () => { 
        try { 
            setLoading(true);
            const { data } = await API.get('/assets'); 
            setAssets(data.assets || []); 
        } catch (e) { 
            console.error(e); 
            alert('Failed to load assets');
        } finally {
            setLoading(false);
        }
    }

    const openRequestModal = (asset) => {
        setSelectedAsset(asset);
        setNote('');
        window.request_asset_modal.showModal();
    };

    const handleRequestSubmit = async () => {
        setRequesting(true);
        try {
            await API.post('/requests', {
                assetId: selectedAsset._id,
                note: note
            });
            alert('✅ Asset requested successfully! Your HR will review it soon.');
            window.request_asset_modal.close();
            loadAssets(); // Refresh to update available quantities
        } catch (e) {
            console.error(e);
            alert(e.response?.data?.msg || e.response?.data?.message || e.message || 'Error requesting asset');
        } finally {
            setRequesting(false);
        }
    };

    const filteredAssets = assets.filter(a => {
        const matchesSearch = a.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || a.productType === filterType;
        const isAvailable = a.availableQuantity > 0;
        return matchesSearch && matchesType && isAvailable; // Only show available assets
    });

    const availableCount = assets.filter(a => a.availableQuantity > 0).length;
    const totalCount = assets.length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                    🛒 Request Assets
                </h2>
                <p className="text-xs sm:text-sm opacity-60 mt-1">
                    Browse and request available assets from your company inventory
                </p>
            </div>

            {/* Stats Bar */}
            <div className="stats stats-vertical sm:stats-horizontal shadow mb-6 w-full bg-base-100 border border-base-200">
                <div className="stat">
                    <div className="stat-figure text-primary text-3xl">📦</div>
                    <div className="stat-title">Total Assets</div>
                    <div className="stat-value text-primary">{totalCount}</div>
                    <div className="stat-desc">In company inventory</div>
                </div>
                
                <div className="stat">
                    <div className="stat-figure text-success text-3xl">✅</div>
                    <div className="stat-title">Available Now</div>
                    <div className="stat-value text-success">{availableCount}</div>
                    <div className="stat-desc">Ready to request</div>
                </div>
                
                <div className="stat">
                    <div className="stat-figure text-error text-3xl">❌</div>
                    <div className="stat-title">Out of Stock</div>
                    <div className="stat-value text-error">{totalCount - availableCount}</div>
                    <div className="stat-desc">Currently unavailable</div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8 border border-base-200">
                <div className="card-body p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="form-control flex-1">
                            <div className="input-group">
                                <span className="bg-base-200 px-4 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search assets by name..."
                                    className="input input-bordered w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-control sm:w-48">
                            <select
                                className="select select-bordered w-full"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="All">All Types</option>
                                <option value="Returnable">🔄 Returnable</option>
                                <option value="Non-returnable">🔒 Non-returnable</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assets Grid */}
            {filteredAssets.length === 0 ? (
                <div className="text-center py-20 bg-base-50 rounded-xl border border-dashed border-base-300">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-lg font-semibold opacity-60">No assets available</p>
                    <p className="text-sm opacity-50 mt-2">
                        {searchTerm || filterType !== 'All' 
                            ? 'Try adjusting your search or filters' 
                            : 'Check back later for new inventory'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="mb-4 text-sm opacity-70">
                        Showing {filteredAssets.length} available {filteredAssets.length === 1 ? 'asset' : 'assets'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {filteredAssets.map(a => (
                            <div
                                key={a._id}
                                className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl hover:scale-105 transition-all duration-200"
                            >
                                <figure className="px-4 pt-4 relative">
                                    {a.productImage ? (
                                        <img 
                                            src={a.productImage} 
                                            alt={a.productName} 
                                            className="h-40 w-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                                            <span className="text-6xl">
                                                {a.productType === 'Returnable' ? '💼' : '🎁'}
                                            </span>
                                        </div>
                                    )}
                                    {/* Type Badge on Image */}
                                    <div className="absolute top-6 right-6">
                                        <div className={`badge ${a.productType === 'Returnable' ? 'badge-primary' : 'badge-secondary'} gap-1 shadow-lg`}>
                                            {a.productType === 'Returnable' ? '🔄' : '🔒'}
                                            {a.productType}
                                        </div>
                                    </div>
                                </figure>
                                
                                <div className="card-body p-4">
                                    {/* Asset Name */}
                                    <h3 className="card-title text-base font-bold truncate" title={a.productName}>
                                        {a.productName}
                                    </h3>

                                    {/* Available Quantity */}
                                    <div className="flex items-center gap-2 text-sm mb-3">
                                        <span className="opacity-70">Available:</span>
                                        <div className={`badge ${
                                            a.availableQuantity > 5 ? 'badge-success' : 
                                            a.availableQuantity > 2 ? 'badge-warning' : 
                                            'badge-error'
                                        } gap-1 font-bold`}>
                                            📊 {a.availableQuantity}
                                        </div>
                                    </div>

                                    {/* Company Info (if available) */}
                                    {a.companyName && (
                                        <div className="text-xs opacity-60 mb-2">
                                            🏢 {a.companyName}
                                        </div>
                                    )}

                                    {/* Request Button */}
                                    <div className="card-actions mt-auto">
                                        <button
                                            className="btn btn-primary btn-block btn-sm gap-2"
                                            onClick={() => openRequestModal(a)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                            Request Item
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Request Modal */}
            <dialog id="request_asset_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    {/* Modal Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="avatar">
                            <div className="w-16 rounded-lg ring ring-primary ring-offset-base-100 ring-offset-2">
                                {selectedAsset?.productImage ? (
                                    <img src={selectedAsset.productImage} alt={selectedAsset?.productName} />
                                ) : (
                                    <div className="bg-primary/20 flex items-center justify-center text-3xl">
                                        {selectedAsset?.productType === 'Returnable' ? '💼' : '🎁'}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">{selectedAsset?.productName}</h3>
                            <div className="flex gap-2 items-center mt-1">
                                <div className={`badge ${selectedAsset?.productType === 'Returnable' ? 'badge-primary' : 'badge-secondary'} badge-sm`}>
                                    {selectedAsset?.productType}
                                </div>
                                <span className="text-xs opacity-60">
                                    {selectedAsset?.availableQuantity} available
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Info Alert */}
                    <div className="alert alert-info mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div className="text-xs">
                            <p>Your request will be sent to HR for approval. You'll be notified once it's processed.</p>
                        </div>
                    </div>

                    {/* Note Field */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">Add a note (optional)</span>
                            <span className="label-text-alt opacity-60">{note.length}/200</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered h-24 w-full"
                            placeholder="e.g., Need this for the upcoming project deadline on Dec 25..."
                            value={note}
                            onChange={e => setNote(e.target.value.slice(0, 200))}
                            maxLength={200}
                        ></textarea>
                        <label className="label">
                            <span className="label-text-alt opacity-60">Explain why you need this asset</span>
                        </label>
                    </div>

                    {/* Modal Actions */}
                    <div className="modal-action">
                        <button 
                            className="btn btn-ghost" 
                            type="button" 
                            onClick={() => window.request_asset_modal.close()}
                            disabled={requesting}
                        >
                            Cancel
                        </button>
                        <button 
                            className="btn btn-primary gap-2" 
                            type="button" 
                            onClick={handleRequestSubmit} 
                            disabled={requesting}
                        >
                            {requesting ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Submit Request
                                </>
                            )}
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    )
}
