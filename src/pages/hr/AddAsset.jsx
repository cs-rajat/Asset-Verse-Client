import React, { useState } from 'react';
import API from '../../api/api';
import { useNavigate } from 'react-router-dom';

export default function AddAsset() {
    const [form, setForm] = useState({ productName: '', productType: 'Returnable', productQuantity: 1, productImage: '' });
    const nav = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/assets', form);
            alert('Asset added successfully!');
            nav('/dashboard/hr');
        } catch (err) { alert(err.response?.data?.msg || 'Error adding asset'); }
    }

    return (
        <div className="max-w-2xl mx-auto pt-8">
            <div className="card shadow-2xl bg-base-100 border border-base-200">
                <div className="card-body p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-2xl">
                            🆕
                        </div>
                        <div>
                            <h2 className="card-title text-2xl font-heading">Add New Asset</h2>
                            <p className="text-base-content/60 text-sm">Register a new item in the inventory</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="form-control">
                            <label className="label"><span className="label-text font-semibold">Product Name</span></label>
                            <input
                                className="input input-bordered bg-base-50 focus:bg-white transition-all"
                                value={form.productName}
                                onChange={e => setForm({ ...form, productName: e.target.value })}
                                required
                                placeholder="e.g. MacBook Pro M3"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text font-semibold">Product Image URL</span></label>
                            <input
                                className="input input-bordered bg-base-50 focus:bg-white transition-all"
                                placeholder="https://..."
                                value={form.productImage}
                                onChange={e => setForm({ ...form, productImage: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Product Type</span></label>
                                <select
                                    className="select select-bordered bg-base-50 focus:bg-white transition-all"
                                    value={form.productType}
                                    onChange={e => setForm({ ...form, productType: e.target.value })}
                                >
                                    <option>Returnable</option>
                                    <option>Non-returnable</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Quantity</span></label>
                                <input
                                    type="number"
                                    min="1"
                                    className="input input-bordered bg-base-50 focus:bg-white transition-all"
                                    value={form.productQuantity}
                                    onChange={e => setForm({ ...form, productQuantity: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button className="btn btn-primary w-full btn-lg shadow-lg hover:shadow-primary/50 transition-all font-bold">
                                Add Asset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
