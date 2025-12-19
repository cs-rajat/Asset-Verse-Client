import React, { useEffect, useState } from 'react';
import API from '../../api/api';

export default function NoticesHR() {
    const [notices, setNotices] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', priority: 'low' });
    const [loading, setLoading] = useState(false);

    useEffect(() => { loadNotices(); }, []);

    const loadNotices = async () => {
        try {
            const { data } = await API.get('/notices');
            setNotices(data);
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/notices', form);
            alert('Notice created successfully');
            setForm({ title: '', description: '', priority: 'low' });
            loadNotices();
        } catch (e) {
            alert('Failed to create notice');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-6">📢 Manage Notices</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Create Form */}
                <div className="card bg-base-100 shadow-xl h-fit">
                    <div className="card-body">
                        <h3 className="card-title mb-4">Post New Announcement</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-control">
                                <label className="label">Title</label>
                                <input
                                    className="input input-bordered"
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">Description</label>
                                <textarea
                                    className="textarea textarea-bordered h-24"
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <div className="form-control">
                                <label className="label">Priority</label>
                                <select
                                    className="select select-bordered"
                                    value={form.priority}
                                    onChange={e => setForm({ ...form, priority: e.target.value })}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <button className="btn btn-primary w-full" disabled={loading}>
                                {loading ? 'Posting...' : 'Post Notice'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold">Recent Notices</h3>
                    {notices.map(notice => (
                        <div key={notice._id} className={`card bg-base-100 shadow border-l-4 ${notice.priority === 'high' ? 'border-error' : notice.priority === 'medium' ? 'border-warning' : 'border-success'}`}>
                            <div className="card-body p-4">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-lg">{notice.title}</h4>
                                    <span className={`badge ${notice.priority === 'high' ? 'badge-error' : notice.priority === 'medium' ? 'badge-warning' : 'badge-success'} badge-sm uppercase`}>{notice.priority}</span>
                                </div>
                                <p className="text-gray-600 text-sm mt-2">{notice.description}</p>
                                <div className="text-xs text-gray-400 mt-4 text-right">
                                    {new Date(notice.date).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                    {notices.length === 0 && <p className="text-gray-500">No notices posted yet.</p>}
                </div>
            </div>
        </div>
    );
}
