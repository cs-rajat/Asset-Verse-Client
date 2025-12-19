import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, user, loading } = useContext(AuthContext);
  const nav = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'hr') nav('/dashboard/hr');
      else nav('/dashboard/employee');
    }
  }, [user, nav]);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const data = await login(email, password);
      // Redirect based on role
      if (data.user.role === 'hr') {
        nav('/dashboard/hr');
      } else {
        nav('/dashboard/employee');
      }
    } catch (error) {
      setErr(error.response?.data?.message || 'Invalid email or password');
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      {/* Ambient Backgorund Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>

      <div className="card w-full max-w-md shadow-2xl bg-white/70 backdrop-blur-xl border border-white/50 relative z-10">
        <div className="card-body p-8">
          <div className="text-center mb-6">
            <div className="inline-block p-3 rounded-2xl bg-base-200 mb-4">
              <span className="text-4xl">🔐</span>
            </div>
            <h2 className="text-3xl font-bold font-heading text-neutral">Welcome Back</h2>
            <p className="text-gray-500 text-sm mt-2">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Email Address</span></label>
              <input type="email" className="input input-bordered input-lg w-full bg-base-50 focus:bg-white transition-all" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@company.com" />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Password</span></label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered input-lg w-full bg-base-50 focus:bg-white transition-all pr-12" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••" 
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
              <label className="label">
                <a href="#" className="label-text-alt link link-hover text-primary">Forgot password?</a>
              </label>
            </div>

            {err && <div className="alert alert-error text-sm py-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{err}</span>
            </div>}

            <button disabled={loading} className="btn btn-primary btn-lg w-full shadow-lg hover:shadow-primary/50 transition-all">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">Don't have an account? <span className="font-semibold text-neutral">Join us</span></p>
            <div className="flex justify-center gap-4 mt-2">
              <Link to="/register/employee" className="link link-primary text-sm font-medium hover:text-primary-focus">As Employee</Link>
              <span className="text-gray-300">|</span>
              <Link to="/register/hr" className="link link-secondary text-sm font-medium hover:text-secondary-focus">As HR Manager</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
