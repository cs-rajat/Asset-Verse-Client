import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import API from '../api/api';

export default function Profile() {
    const { user, updateUserProfile } = useContext(AuthContext);
    const [dbUser, setDbUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: '', profileImage: '', dateOfBirth: '' });

    useEffect(() => {
        loadProfile();
    }, [user]);

    const loadProfile = async () => {
        try {
            const { data } = await API.get('/users/me');
            setDbUser(data);
            setForm({
                name: data.name || user?.displayName || '',
                profileImage: data.profileImage || user?.photoURL || '',
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : ''
            });
            setLoading(false);
        } catch (err) { console.error(err); setLoading(false); }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Update Firebase Profile
            await updateUserProfile(form.name, form.profileImage);

            // Update Backend Profile
            await API.patch('/users/me', form);

            alert('Profile updated successfully!');
            setEditing(false);
            loadProfile();
        } catch (err) {
            alert(err.response?.data?.msg || 'Update failed');
        }
    };

    if (loading) return <div className="p-10 text-center"><span className="loading loading-spinner"></span></div>;

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold">My Profile</h2>
                        <button className="btn btn-primary btn-outline" onClick={() => setEditing(!editing)}>
                            {editing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>

                    <div className="flex flex-col items-center mb-8">
                        <div className="avatar">
                            <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={form.profileImage || user?.photoURL || "https://i.ibb.co/T0h284p/user-placeholder.png"} alt="profile" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold mt-4">{dbUser?.name}</h3>
                        <p className="text-gray-500">{user?.email}</p>
                        <div className="badge badge-lg badge-secondary mt-2 capitalize">{dbUser?.role}</div>
                    </div>

                    {editing ? (
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Full Name</span></label>
                                <input className="input input-bordered" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Profile Image URL</span></label>
                                <input className="input input-bordered" value={form.profileImage} onChange={e => setForm({ ...form, profileImage: e.target.value })} />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Date of Birth</span></label>
                                <input type="date" className="input input-bordered" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} />
                            </div>
                            <button className="btn btn-primary w-full">Save Changes</button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-semibold">Full Name</span>
                                <span>{dbUser?.name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-semibold">Email</span>
                                <span>{user?.email}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-semibold">Date of Birth</span>
                                <span>{dbUser?.dateOfBirth ? new Date(dbUser.dateOfBirth).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            {dbUser?.role === 'hr' && (
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-semibold">Items in Stock</span>
                                    <span>{dbUser?.packageLimit || 0}</span>
                                    {/* Using packageLimit as proxy for now or need to fetch stats */}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
