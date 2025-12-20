import React, { useState } from 'react';
import API, { setAuthToken } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';


export default function RegisterEmployee() {
  const [form, setForm] = useState({ name: '', email: '', password: '', dateOfBirth: '' });
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden py-8 sm:py-12 px-4">
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
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered bg-base-50 focus:bg-white transition-all w-full pr-12" 
                  placeholder="Min 6 chars, 1 uppercase, 1 lowercase" 
                  value={form.password} 
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    setPasswordError('');
                  }} 
                  required 
                  minLength="6" 
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
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
