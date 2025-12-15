import React, { useEffect, useState } from 'react';
import API from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditAsset() {
    const { id } = useParams();
    const nav = useNavigate();
    const [form, setForm] = useState({ productName: '', productType: 'Returnable', productQuantity: 1, productImage: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAsset = async () => {
            try {
                const { data } = await API.get(`/assets/${id}`);
                setForm(data); // Assuming API returns the asset object directly
                setLoading(false);
            } catch (err) {
                console.error(err);
                alert("Failed to load asset");
                nav('/dashboard/hr');
            }
        };
        loadAsset();
    }, [id, nav]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/assets/${id}`, form); // Assuming PUT endpoint exists
            alert('Asset updated successfully!');
            nav('/dashboard/hr');
        } catch (err) { alert(err.response?.data?.msg || 'Error updating asset'); }
    }

    if (loading) return <div className="p-10 text-center"><span className="loading loading-spinner"></span></div>;

    return (
        <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
            <div className="card-body">
                <h2 className="card-title text-2xl mb-6">Edit Asset</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label"><span className="label-text">Product Name</span></label>
                        <input
                            className="input input-bordered"
                            value={form.productName}
                            onChange={e => setForm({ ...form, productName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Product Image URL</span></label>
                        <input
                            className="input input-bordered"
                            placeholder="https://..."
                            value={form.productImage}
                            onChange={e => setForm({ ...form, productImage: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Product Type</span></label>
                            <select
                                className="select select-bordered"
                                value={form.productType}
                                onChange={e => setForm({ ...form, productType: e.target.value })}
                            >
                                <option>Returnable</option>
                                <option>Non-returnable</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text">Quantity</span></label>
                            <input
                                type="number"
                                min="1"
                                className="input input-bordered"
                                value={form.productQuantity}
                                onChange={e => setForm({ ...form, productQuantity: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button type="button" className="btn" onClick={() => nav('/dashboard/hr')}>Cancel</button>
                        <button className="btn btn-primary flex-1">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
