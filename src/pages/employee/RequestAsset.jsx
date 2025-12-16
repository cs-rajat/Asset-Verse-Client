import React, { useEffect, useState } from 'react';
import API from '../../api/api';

export default function RequestAsset() {
    const [assets, setAssets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    // Modal State
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [note, setNote] = useState('');
    const [requesting, setRequesting] = useState(false);

    useEffect(() => { loadAssets(); }, []);
    const loadAssets = async () => { try { const { data } = await API.get('/assets'); setAssets(data.assets); } catch (e) { console.error(e); } }

    const openRequestModal = (asset) => {
        setSelectedAsset(asset);
        setNote('');
        window.my_modal_5.showModal();
    };

    const handleRequestSubmit = async () => {
        setRequesting(true);
        try {
            await API.post('/requests', {
                assetId: selectedAsset._id,
                note: note
            });
            alert('✅ Asset requested successfully!');
            window.my_modal_5.close();
            loadAssets();
        } catch (e) {
            alert(e.response?.data?.msg || 'Error requesting asset');
        } finally {
            setRequesting(false);
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
                        className={`card bg-base-100 shadow-xl transition-all hover:-translate-y-1 ${a.availableQuantity < 1 ? 'opacity-75 grayscale' : ''}`}
                    >
                        <figure className="px-6 pt-6 relative">
                            {a.productImage ? (
                                <img src={a.productImage} alt={a.productName} className="h-48 w-full object-cover rounded-xl" />
                            ) : (
                                <div className="w-full h-48 bg-base-200 rounded-xl flex items-center justify-center text-5xl">
                                    {a.productType === 'Returnable' ? '💼' : '🎁'}
                                </div>
                            )}
                            {a.availableQuantity < 1 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
                                    <span className="badge badge-error badge-lg font-bold">OUT OF STOCK</span>
                                </div>
                            )}
                        </figure>
                        <div className="card-body">
                            <div className="flex justify-between items-start">
                                <h3 className="card-title text-lg">{a.productName}</h3>
                                <div className={`badge ${a.productType === 'Returnable' ? 'badge-primary' : 'badge-secondary'} badge-sm`}>
                                    {a.productType}
                                </div>
                            </div>

                            <div className="text-sm text-gray-500 mb-4">
                                Available: <span className={a.availableQuantity > 0 ? 'text-success font-bold' : 'text-error'}>{a.availableQuantity}</span>
                            </div>

                            <div className="card-actions justify-end mt-auto">
                                <button
                                    className="btn btn-primary btn-block"
                                    onClick={() => openRequestModal(a)}
                                    disabled={a.availableQuantity < 1}
                                >
                                    Request Item
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredAssets.length === 0 && <p className="col-span-full text-center py-10 text-gray-400">No assets found matching your search.</p>}
            </div>

            {/* Request Modal */}
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <form method="dialog" className="modal-box p-6">
                    <h3 className="font-bold text-lg mb-4">Request {selectedAsset?.productName}</h3>
                    <p className="py-2 text-sm text-gray-500 mb-4">Add a note for your HR manager (optional):</p>

                    <textarea
                        className="textarea textarea-bordered w-full h-24"
                        placeholder="e.g. Need this for the upcoming project..."
                        value={note}
                        onChange={e => setNote(e.target.value)}
                    ></textarea>

                    <div className="modal-action">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn" type="button" onClick={() => window.my_modal_5.close()}>Cancel</button>
                        <button className="btn btn-primary" type="button" onClick={handleRequestSubmit} disabled={requesting}>
                            {requesting ? <span className="loading loading-spinner"></span> : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </dialog>
        </div>
    )
}
