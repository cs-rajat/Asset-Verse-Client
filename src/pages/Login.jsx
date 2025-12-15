import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
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
              <input type="password" className="input input-bordered input-lg w-full bg-base-50 focus:bg-white transition-all" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
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
