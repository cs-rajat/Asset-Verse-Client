import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import API from '../api/api';

export default function Home() {
  const [packages, setPackages] = useState([]);

  React.useEffect(() => {
    API.get('/public/packages')
      .then(res => setPackages(res.data))
      .catch(err => console.error("Failed to load packages", err));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="flex flex-col font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-indigo-50/50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-accent/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-left space-y-8"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/60 shadow-sm backdrop-blur-md cursor-default">
              <span className="badge badge-primary badge-xs">NEW</span>
              <span className="text-sm font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Enterprise AI Analytics
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-6xl md:text-7xl lg:text-8xl font-black font-heading tracking-tight leading-[1.1] text-neutral">
              Corporate<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary animate-gradient bg-[length:200%_auto]">Asset Control</span>
              <br />Redefined.
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-600 max-w-xl leading-relaxed font-light">
              Streamline your equipment lifecycle. Empower your HR team with a professional, automated, and secure asset management platform.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
              <Link to="/register/hr" className="btn btn-primary btn-lg h-16 px-8 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-lg font-bold border-0 bg-gradient-to-r from-primary to-primary-focus">
                Start Free Trial
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </Link>
              <Link to="/register/employee" className="btn btn-ghost btn-lg h-16 px-8 rounded-full border border-base-300 hover:bg-white hover:shadow-lg transition-all text-lg font-medium text-neutral">
                Employee Portal
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-4 text-sm font-medium text-slate-400 pt-8">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=1" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=2" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=8" alt="User" />
                <div className="w-10 h-10 rounded-full border-2 border-white bg-base-200 flex items-center justify-center text-xs">+5k</div>
              </div>
              <span>Trusted by 500+ Enterprises</span>
            </motion.div>
          </motion.div>

          {/* Hero Visual with Framer Motion */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block perspective-1000"
          >
            <div className="relative z-20 bg-white/40 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-2xl p-6 transform transition-transform duration-500 hover:rotate-0">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-[2.5rem] pointer-events-none"></div>
              {/* Mock UI Content */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-inner h-[400px] flex flex-col">
                <div className="h-16 border-b flex items-center px-6 justify-between bg-slate-50">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Asset Verse Dashboard</div>
                </div>
                <div className="p-6 flex-1 bg-slate-50/50">
                  <div className="flex gap-4 mb-6">
                    <div className="w-1/3 h-24 rounded-2xl bg-indigo-50 border border-indigo-100 p-4">
                      <div className="text-indigo-600 font-bold text-2xl">124</div>
                      <div className="text-xs text-indigo-400 uppercase mt-1">Total Assets</div>
                    </div>
                    <div className="w-1/3 h-24 rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
                      <div className="text-emerald-600 font-bold text-2xl">98%</div>
                      <div className="text-xs text-emerald-400 uppercase mt-1">Utilization</div>
                    </div>
                    <div className="w-1/3 h-24 rounded-2xl bg-purple-50 border border-purple-100 p-4">
                      <div className="text-purple-600 font-bold text-2xl">12</div>
                      <div className="text-xs text-purple-400 uppercase mt-1">Pending</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-full h-14 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center px-4 gap-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-100"></div>
                        <div className="flex-1 h-3 rounded bg-slate-100 w-1/2"></div>
                        <div className="w-16 h-6 rounded-full bg-green-100 text-green-600 text-[10px] flex items-center justify-center font-bold">ACTIVE</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -top-10 -right-10 z-30 bg-white p-4 rounded-2xl shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                <div>
                  <div className="text-xs font-bold text-slate-400">Request Approved</div>
                  <div className="font-bold text-neutral">MacBook Pro M2</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="absolute -bottom-10 -left-10 z-30 bg-white p-4 rounded-2xl shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">📦</div>
                <div>
                  <div className="text-xs font-bold text-slate-400">New Asset Added</div>
                  <div className="font-bold text-neutral">Dell Monitor</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="py-32 bg-base-100 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 tracking-tight">Everything you need to <span className="text-primary">scale</span></h2>
            <p className="text-slate-500 text-lg">A complete suite of tools designed for modern asset management.</p>
          </motion.div>

          {/* 6 Grid Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Centralized Inventory",
                desc: "Single source of truth for all assets. Track serials, warranties, and status in real-time."
              },
              {
                icon: "⚡",
                title: "Automated Workflows",
                desc: "Streamline requests and approvals. Let intelligent automation handle the busy work."
              },
              {
                icon: "🛡️",
                title: "Audit & Compliance",
                desc: "Generate PDF reports instantly. Maintain an immutable history for absolute compliance."
              },
              {
                icon: "🔔",
                title: "Smart Notifications",
                desc: "Get alerted on low stock, return dates, and warranty expirations automatically."
              },
              {
                icon: "📱",
                title: "Mobile Friendly",
                desc: "Manage assets on the go. Optimized for all devices from smartphones to tablets."
              },
              {
                icon: "🔐",
                title: "Role-Based Security",
                desc: "Granular access controls ensure data is seen only by those who need it."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-8 rounded-[2rem] bg-base-100 border border-base-200 hover:border-primary/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform shadow-sm">{feature.icon}</div>
                <h3 className="text-xl font-bold font-heading mb-3 text-neutral">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-light text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Stats Section */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-white rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold mb-6">
              TRUSTED BY 100+ COMPANIES
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-neutral">Empowering modern teams</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            {[
              {
                quote: "AssetVerse completely transformed how we handle equipment. Using spreadsheets was a nightmare, but now everything is automated. Highly recommended!",
                author: "Sarah Jenkins",
                role: "HR Director, TechFlow Inc.",
                img: "https://i.pravatar.cc/100?img=5"
              },
              {
                quote: "The audit reports alone are worth the subscription. We passed our ISO compliance check with zero stress thanks to the detailed history tracking.",
                author: "Michael Chen",
                role: "Operations Lead, InnovateCorp",
                img: "https://i.pravatar.cc/100?img=11"
              }
            ].map((testi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100"
              >
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map(star => <span key={star} className="text-yellow-400">★</span>)}
                </div>
                <p className="text-lg text-slate-600 italic mb-8">"{testi.quote}"</p>
                <div className="flex items-center gap-4">
                  <img src={testi.img} alt={testi.author} className="w-12 h-12 rounded-full border-2 border-slate-100" />
                  <div>
                    <div className="font-bold text-neutral">{testi.author}</div>
                    <div className="text-sm text-slate-400">{testi.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-slate-200 pt-16">
            {[
              { label: "Assets Tracked", value: "50k+" },
              { label: "Companies", value: "100+" },
              { label: "Uptime", value: "99.9%" },
              { label: "Support", value: "24/7" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-indigo-600 mb-2">{stat.value}</div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Pricing Section */}
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
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[3rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black font-heading mb-8">Ready to modernize?</h2>
              <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">Join thousands of HR managers who have switched to a smarter way of working.</p>
              <Link to="/register/hr" className="btn bg-white text-indigo-600 btn-lg rounded-full px-12 h-16 text-lg hover:bg-indigo-50 border-0 shadow-xl">
                Get Started Free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
