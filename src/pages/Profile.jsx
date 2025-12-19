import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import API from '../api/api';

export default function Profile() {
    const { user, updateUser } = useContext(AuthContext);
    const [dbUser, setDbUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: '', profileImage: '', dateOfBirth: '' });
    const [affiliation, setAffiliation] = useState(null);

    useEffect(() => {
        loadProfile();
    }, [user]);

    const loadProfile = async () => {
        if (!user) return;
        try {
            const [userRes, affiliationRes] = await Promise.all([
                API.get('/users/me'),
                API.get('/users/affiliations')
            ]);

            const userData = userRes.data;
            setDbUser(userData);

            // For employee showing connection
            if (affiliationRes.data && affiliationRes.data.length > 0) {
                setAffiliation(affiliationRes.data[0]);
            }

            setForm({
                name: userData.name || user?.displayName || '',
                profileImage: userData.profileImage || user?.photoURL || '',
                dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : ''
            });
            setLoading(false);
        } catch (err) { console.error(err); setLoading(false); }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Update Context State
            await updateUser(form.name, form.profileImage);

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
            <div className="card bg-base-100 shadow-xl border border-base-200">
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
                        <div className="flex gap-2 mt-2">
                            <div className="badge badge-lg badge-secondary capitalize">{dbUser?.role}</div>
                            {affiliation && (
                                <div className="badge badge-lg badge-outline gap-1">
                                    🏢 {affiliation.companyName}
                                </div>
                            )}
                        </div>
                    </div>

                    {editing ? (
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Full Name</span></label>
                                <input className="input input-bordered" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Profile Image</span></label>
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        className="file-input file-input-bordered w-full"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            setLoading(true);
                                            try {
                                                const { uploadImageToImgBB } = await import('../utils/imageUpload');
                                                const url = await uploadImageToImgBB(file);
                                                setForm({ ...form, profileImage: url });
                                            } catch (err) {
                                                alert('Image upload failed');
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                    />
                                </div>
                                {form.profileImage && <div className="text-xs text-success mt-1">Image uploaded!</div>}
                            </div>

                            {dbUser?.role === 'hr' && (
                                <div className="form-control">
                                    <div className="label"><span className="label-text">Company Logo</span></div>
                                    <div className="flex gap-2">
                                        <input
                                            type="file"
                                            className="file-input file-input-bordered w-full"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;
                                                setLoading(true);
                                                try {
                                                    const { uploadImageToImgBB } = await import('../utils/imageUpload');
                                                    const url = await uploadImageToImgBB(file);
                                                    setForm({ ...form, companyLogo: url });
                                                } catch (err) {
                                                    alert('Logo upload failed');
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                        />
                                    </div>
                                    {form.companyLogo && <div className="text-xs text-success mt-1">Logo uploaded!</div>}
                                </div>
                            )}

                            <div className="form-control">
                                <label className="label"><span className="label-text">Date of Birth</span></label>
                                <input type="date" className="input input-bordered" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} />
                            </div>
                            <button className="btn btn-primary w-full" disabled={loading}>
                                {loading ? 'Uploading...' : 'Save Changes'}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            {dbUser?.companyLogo && (
                                <div className="flex justify-center mb-4">
                                    <img src={dbUser.companyLogo} alt="Company Logo" className="h-16 object-contain" />
                                </div>
                            )}
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
                            {/* Show Company if Employee */}
                            {affiliation && (
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-semibold">Company</span>
                                    <div className="flex items-center gap-2">
                                        {affiliation.companyLogo && <img src={affiliation.companyLogo} className="w-6 h-6 rounded" alt="" />}
                                        <span>{affiliation.companyName}</span>
                                    </div>
                                </div>
                            )}

                            {dbUser?.role === 'hr' && (
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-semibold">Package Limit</span>
                                    <div className="badge badge-accent badge-outline">{dbUser?.packageLimit || 0} Employees</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}
