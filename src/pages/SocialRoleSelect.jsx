import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API, { setAuthToken } from '../api/api';
import { uploadImageToImgBB } from '../utils/imageUpload';

export default function SocialRoleSelect() {
    const { state } = useLocation();
    const nav = useNavigate();
    const [role, setRole] = useState(''); // 'employee' or 'hr'
    const [loading, setLoading] = useState(false);

    // Form states
    const [dateOfBirth, setDateOfBirth] = useState('');
    // HR specific
    const [companyName, setCompanyName] = useState('');
    const [companyLogo, setCompanyLogo] = useState('');
    const [uploading, setUploading] = useState(false);

    if (!state?.email) {
        return <div className="p-10 text-center">Error: No session found. Please login again.</div>;
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const imageUrl = await uploadImageToImgBB(file);
            setCompanyLogo(imageUrl);
        } catch (error) {
            alert('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let endpoint = role === 'hr' ? '/auth/register/hr' : '/auth/register/employee';

            const payload = {
                name: state.name,
                email: state.email,
                dateOfBirth,
                password: Math.random().toString(36).slice(-8) + "Aa1!", // Generate random secure-ish password for social
            };

            if (role === 'hr') {
                payload.companyName = companyName;
                payload.companyLogo = companyLogo;
            }

            const { data } = await API.post(endpoint, payload);

            if (data.token) {
                localStorage.setItem('token', data.token);
                setAuthToken(data.token);
                nav(role === 'hr' ? '/dashboard/hr' : '/dashboard/employee');
            }
        } catch (err) {
            alert(err.response?.data?.msg || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 py-12">
            <div className="card w-full max-w-lg bg-white shadow-xl">
                <div className="card-body">
                    <h2 className="text-2xl font-bold text-center mb-6">Complete Your Profile</h2>
                    <div className="flex items-center gap-4 mb-6 p-4 bg-base-200 rounded-lg">
                        {state.photoURL && <img src={state.photoURL} alt="" className="w-12 h-12 rounded-full" />}
                        <div>
                            <div className="font-bold">{state.name}</div>
                            <div className="text-sm opacity-70">{state.email}</div>
                        </div>
                    </div>

                    {!role ? (
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setRole('employee')} className="btn btn-outline h-32 flex-col gap-2 hover:bg-primary hover:text-white transition-all">
                                <span className="text-4xl">👤</span>
                                Join as Employee
                            </button>
                            <button onClick={() => setRole('hr')} className="btn btn-outline h-32 flex-col gap-2 hover:bg-secondary hover:text-white transition-all">
                                <span className="text-4xl">💼</span>
                                Join as HR Manager
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-lg">Registering as {role === 'hr' ? 'HR Manager' : 'Employee'}</h3>
                                <button type="button" onClick={() => setRole('')} className="btn btn-ghost btn-xs">Change Role</button>
                            </div>

                            <div className="form-control">
                                <label className="label">Date of Birth</label>
                                <input type="date" required className="input input-bordered" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} />
                            </div>

                            {role === 'hr' && (
                                <>
                                    <div className="form-control">
                                        <label className="label">Company Name</label>
                                        <input required className="input input-bordered" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">Company Logo</label>
                                        <input type="file" required accept="image/*" className="file-input file-input-bordered" onChange={handleImageUpload} />
                                        {uploading && <span className="text-xs text-info">Uploading...</span>}
                                    </div>
                                </>
                            )}

                            <button disabled={loading || (role === 'hr' && !companyLogo)} className="btn btn-primary w-full mt-4">
                                {loading ? 'Creating Account...' : 'Complete Registration'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
