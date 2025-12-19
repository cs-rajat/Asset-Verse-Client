import React, { useState } from 'react';
import API, { setAuthToken } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';


export default function RegisterEmployee() {
  const [form, setForm] = useState({ name: '', email: '', password: '', dateOfBirth: '' });
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const nav = useNavigate();

  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    return '';
  };

  const submit = async (e) => {
    e.preventDefault();
    
    // Validate password
    const error = validatePassword(form.password);
    if (error) {
      setPasswordError(error);
      return;
    }
    
    setPasswordError('');
    try {
      // 3. Create User via Backend Auth API (handles both MongoDB and JWT)
      const { data } = await API.post('/auth/register/employee', form);

      if (data.token) {
        localStorage.setItem('token', data.token);
        setAuthToken(data.token);
        nav('/dashboard/employee');
      }
    }
    catch (err) { alert(err.response?.data?.msg || 'Registration failed'); }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden py-12">
      {/* Ambient Backgorund Elements */}
      <div className="absolute top-[0%] left-[0%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[0%] right-[0%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>

      <div className="card w-full max-w-md shadow-2xl bg-white/70 backdrop-blur-xl border border-white/50 relative z-10">
        <div className="card-body p-8">
          <div className="text-center mb-6">
            <div className="inline-block p-3 rounded-2xl bg-base-200 mb-4">
              <span className="text-4xl">👤</span>
            </div>
            <h2 className="text-3xl font-bold font-heading text-neutral">Join as Employee</h2>
            <p className="text-gray-500 mt-2">Connect with your team and request assets</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Full Name</span></label>
              <input className="input input-bordered bg-base-50 focus:bg-white transition-all" placeholder="Jane Smith" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Email</span></label>
              <input type="email" className="input input-bordered bg-base-50 focus:bg-white transition-all" placeholder="employee@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Password</span></label>
              <input 
                type="password" 
                className="input input-bordered bg-base-50 focus:bg-white transition-all" 
                placeholder="Min 6 chars, 1 uppercase, 1 lowercase" 
                value={form.password} 
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  setPasswordError('');
                }} 
                required 
                minLength="6" 
              />
              {passwordError && (
                <label className="label">
                  <span className="label-text-alt text-error">{passwordError}</span>
                </label>
              )}
              <label className="label">
                <span className="label-text-alt text-gray-500">Must contain: 6+ characters, 1 uppercase, 1 lowercase</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Date of Birth</span></label>
              <input type="date" className="input input-bordered bg-base-50 focus:bg-white transition-all" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} required />
            </div>

            <button disabled={loading} className="btn btn-primary w-full btn-lg mt-6 shadow-lg hover:shadow-primary/50 transition-all font-bold">Register as Employee</button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">Already have an account? <Link to="/login" className="link link-primary font-semibold">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
