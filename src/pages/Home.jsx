import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [packages] = useState([
    {
      name: "Basic",
      employeeLimit: 5,
      price: 5,
      features: ["Asset Tracking", "Employee Management", "Basic Support"]
    },
    {
      name: "Standard",
      employeeLimit: 10,
      price: 8,
      features: ["All Basic features", "Advanced Analytics", "Priority Support"]
    },
    {
      name: "Premium",
      employeeLimit: 20,
      price: 15,
      features: ["All Standard features", "Custom Branding", "24/7 Support"]
    }
  ]);

  return (
    <div className="flex flex-col font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-indigo-50/50">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-accent/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/60 shadow-sm backdrop-blur-md transition-all hover:bg-white/80 cursor-default">
              <span className="badge badge-primary badge-xs">NEW</span>
              <span className="text-sm font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AI-Powered Analytics 2.0
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black font-heading tracking-tight leading-[1.1] text-neutral">
              Asset<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary animate-gradient bg-[length:200%_auto]">Management</span>
              <br />Reimagined.
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 max-w-xl leading-relaxed font-light">
              Stop losing track of company equipment. Empower your HR team with the world's most intuitive asset tracking platform.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/register/hr" className="btn btn-primary btn-lg h-16 px-8 rounded-full shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_20px_60px_-15px_rgba(79,70,229,0.6)] hover:-translate-y-1 transition-all text-lg font-bold border-0 bg-gradient-to-r from-primary to-primary-focus">
                Start Free Trial
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </Link>
              <Link to="/register/employee" className="btn btn-ghost btn-lg h-16 px-8 rounded-full border border-base-300 hover:bg-white hover:shadow-lg transition-all text-lg font-medium text-neutral">
                Employee Login
              </Link>
            </div>

            <div className="flex items-center gap-4 text-sm font-medium text-slate-400 pt-8">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=1" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=2" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=3" alt="User" />
                <div className="w-10 h-10 rounded-full border-2 border-white bg-base-200 flex items-center justify-center text-xs">+2k</div>
              </div>
              <span>Trusted by modern teams worldwide</span>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative hidden lg:block perspective-1000">
            {/* Main Glass Card */}
            <div className="relative z-20 bg-white/40 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-2xl p-6 transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-transform duration-700 ease-out">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-[2.5rem] pointer-events-none"></div>
              {/* Mock UI Content */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-inner h-[400px] flex flex-col">
                <div className="h-16 border-b flex items-center px-6 justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="w-32 h-2 rounded-full bg-slate-100"></div>
                </div>
                <div className="p-6 flex-1 bg-slate-50/50">
                  <div className="flex gap-4 mb-6">
                    <div className="w-1/3 h-24 rounded-2xl bg-indigo-100/50"></div>
                    <div className="w-1/3 h-24 rounded-2xl bg-pink-100/50"></div>
                    <div className="w-1/3 h-24 rounded-2xl bg-purple-100/50"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="w-full h-12 rounded-xl bg-white shadow-sm"></div>
                    <div className="w-full h-12 rounded-xl bg-white shadow-sm"></div>
                    <div className="w-full h-12 rounded-xl bg-white shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-10 -right-10 z-30 bg-white p-4 rounded-2xl shadow-xl animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                <div>
                  <div className="text-xs font-bold text-slate-400">Request Approved</div>
                  <div className="font-bold text-neutral">MacBook Pro M2</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-10 -left-10 z-30 bg-white p-4 rounded-2xl shadow-xl animate-float animation-delay-2000">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">📦</div>
                <div>
                  <div className="text-xs font-bold text-slate-400">New Asset Added</div>
                  <div className="font-bold text-neutral">Dell Monitor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-base-100 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 tracking-tight">Everything you need to <span className="text-primary">scale</span></h2>
            <p className="text-slate-500 text-lg">AssetVerse provides a complete toolkit for managing physical assets across your organization. From procurement to retirement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-[2rem] bg-base-100 border border-base-200 hover:border-primary/20 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="text-2xl font-bold font-heading mb-4 text-neutral">Real-time Visibility</h3>
              <p className="text-slate-500 leading-relaxed">Know exactly who has what. Track asset location, status, and condition in real-time with our intuitive dashboard.</p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-[2rem] bg-base-100 border border-base-200 hover:border-secondary/20 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">⚡</div>
              <h3 className="text-2xl font-bold font-heading mb-4 text-neutral">Instant Requests</h3>
              <p className="text-slate-500 leading-relaxed">Employees can request equipment in seconds. Automated workflows expedite approvals and minimize downtime.</p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-[2rem] bg-base-100 border border-base-200 hover:border-accent/20 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🛡️</div>
              <h3 className="text-2xl font-bold font-heading mb-4 text-neutral">Compliance Ready</h3>
              <p className="text-slate-500 leading-relaxed">Full audit logs for every assignment. Generate detailed PDF reports for internal audits and compliance checks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Dark */}
      <section className="py-32 bg-neutral text-neutral-content relative overflow-hidden">
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black font-heading mb-6 tracking-tight text-white">Simple Pricing</h2>
            <p className="text-slate-400 text-xl">Start small and scale as your team grows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {packages.map((pkg, idx) => (
              <div key={idx} className={`relative p-8 rounded-3xl transition-all duration-300 ${idx === 1 ? 'bg-white text-slate-900 scale-105 shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] z-10' : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800'}`}>

                {idx === 1 && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-secondary to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">MOST POPULAR</div>}

                <h3 className={`text-xl font-bold font-heading uppercase tracking-widest mb-2 ${idx === 1 ? 'text-primary' : 'text-slate-400'}`}>{pkg.name}</h3>
                <div className="my-6 flex items-baseline gap-1">
                  <span className="text-5xl font-black font-heading tracking-tight">${pkg.price}</span>
                  <span className={`font-medium ${idx === 1 ? 'text-slate-400' : 'text-slate-500'}`}>/month</span>
                </div>
                <p className={`text-sm mb-8 pb-8 border-b ${idx === 1 ? 'border-slate-100 text-slate-500' : 'border-slate-700 text-slate-400'}`}>Perfect for up to <strong>{pkg.employeeLimit} employees</strong></p>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${idx === 1 ? 'bg-primary/10 text-primary' : 'bg-slate-700 text-white'}`}>✓</div>
                      <span className={idx === 1 ? 'text-slate-600' : 'text-slate-300'}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/register/hr" className={`btn w-full btn-lg rounded-xl border-0 ${idx === 1 ? 'bg-neutral text-white hover:bg-slate-800' : 'bg-white text-neutral hover:bg-slate-200'}`}>
                  Choose {pkg.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[3rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black font-heading mb-8">Ready to modernize?</h2>
              <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">Join thousands of HR managers who have switched to a smarter way of working.</p>
              <Link to="/register/hr" className="btn bg-white text-indigo-600 btn-lg rounded-full px-12 h-16 text-lg hover:bg-indigo-50 border-0 shadow-xl">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
