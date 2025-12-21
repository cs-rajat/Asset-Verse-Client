import React, { useEffect, useState } from 'react';
import API from '../../api/api';

export default function MyTeam() {
    const [team, setTeam] = useState([]);
    const [affiliations, setAffiliations] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // 1. Get Affiliations
            const { data } = await API.get('/users/affiliations');
            setAffiliations(data);

            if (data.length > 0) {
                // Default to first company
                setSelectedCompany(data[0].companyName);
                fetchTeam(data[0].companyName);
            } else {
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }

    const fetchTeam = async (companyName) => {
        setLoading(true);
        try {
            const { data } = await API.get(`/users/team/${encodeURIComponent(companyName)}`);
            setTeam(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleCompanyChange = (companyName, index) => {
        setSelectedCompany(companyName);
        setActiveTab(index);
        fetchTeam(companyName);
    };

    // Filter upcoming birthdays (Current Month)
    const currentMonth = new Date().getMonth();
    const upcomingBirthdays = team.filter(member => {
        if (!member.dateOfBirth) return false;
        const dob = new Date(member.dateOfBirth);
        return dob.getMonth() === currentMonth;
    }).sort((a, b) => {
        const dayA = new Date(a.dateOfBirth).getDate();
        const dayB = new Date(b.dateOfBirth).getDate();
        return dayA - dayB;
    });

    const getPosition = (member) => {
        if (member.role === 'hr') return 'HR Manager';
        if (member.position) return member.position;
        return 'Team Member';
    };

    if (loading && affiliations.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                    👥 My Team
                </h2>
                <p className="text-xs sm:text-sm opacity-60 mt-1">
                    Connect with your colleagues across companies
                </p>
            </div>

            {/* Company Tabs (for multiple companies) */}
            {affiliations.length > 1 && (
                <div className="mb-8">
                    <div className="tabs tabs-boxed bg-base-200 p-1 flex-wrap gap-2">
                        {affiliations.map((aff, index) => (
                            <button
                                key={aff._id}
                                className={`tab flex-1 min-w-[120px] ${activeTab === index ? 'tab-active' : ''}`}
                                onClick={() => handleCompanyChange(aff.companyName, index)}
                            >
                                <span className="truncate">{aff.companyName}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Single Company Header (for only 1 company) */}
            {affiliations.length === 1 && (
                <div className="mb-8 flex items-center gap-4 p-4 bg-base-200 rounded-lg">
                    <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-12">
                            <span className="text-xl">🏢</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{selectedCompany}</h3>
                        <p className="text-sm opacity-70">{team.length} Team Members</p>
                    </div>
                </div>
            )}

            {/* Upcoming Birthdays Section */}
            {upcomingBirthdays.length > 0 && (
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">🎂</span>
                        <h3 className="text-xl font-bold text-primary">
                            Upcoming Birthdays This Month
                        </h3>
                        <div className="badge badge-primary badge-lg ml-2">{upcomingBirthdays.length}</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {upcomingBirthdays.map(member => {
                            const birthDate = new Date(member.dateOfBirth);
                            const day = birthDate.getDate();
                            const month = birthDate.toLocaleString('default', { month: 'long' });
                            const today = new Date().getDate();
                            const isToday = day === today;

                            return (
                                <div 
                                    key={member._id} 
                                    className={`card shadow-xl flex-row p-4 items-center gap-4 ${
                                        isToday 
                                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white animate-pulse' 
                                            : 'bg-gradient-to-r from-primary/90 to-secondary/90 text-primary-content'
                                    }`}
                                >
                                    <div className="avatar">
                                        <div className="w-16 rounded-full ring ring-white ring-offset-2 ring-offset-base-100">
                                            <img 
                                                src={member.profileImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent(member.employeeName)} 
                                                alt={member.employeeName} 
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-base sm:text-lg truncate">
                                            {member.employeeName}
                                        </h3>
                                        <p className="text-sm opacity-90">
                                            {isToday ? '🎉 TODAY!' : `${day} ${month}`}
                                        </p>
                                        <span className="badge badge-accent badge-sm mt-1 font-bold">
                                            {isToday ? '🎈 Celebrate!' : '🎁 Upcoming'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="divider opacity-20 my-8"></div>

            {/* Team Members Section */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : team.length === 0 ? (
                <div className="alert alert-warning shadow-lg">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <h3 className="font-bold">No Team Members Found</h3>
                            <p className="text-sm">You are not affiliated with any company or have no team members yet. Please contact your HR.</p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Team Stats */}
                    <div className="stats stats-vertical sm:stats-horizontal shadow mb-6 w-full bg-base-100 border border-base-200">
                        <div className="stat">
                            <div className="stat-figure text-primary text-3xl">👥</div>
                            <div className="stat-title">Total Members</div>
                            <div className="stat-value text-primary">{team.length}</div>
                            <div className="stat-desc">{selectedCompany}</div>
                        </div>
                        
                        <div className="stat">
                            <div className="stat-figure text-secondary text-3xl">👔</div>
                            <div className="stat-title">HR Managers</div>
                            <div className="stat-value text-secondary">
                                {team.filter(m => m.role === 'hr').length}
                            </div>
                            <div className="stat-desc">Management Team</div>
                        </div>
                        
                        <div className="stat">
                            <div className="stat-figure text-accent text-3xl">🎂</div>
                            <div className="stat-title">Birthdays</div>
                            <div className="stat-value text-accent">{upcomingBirthdays.length}</div>
                            <div className="stat-desc">This Month</div>
                        </div>
                    </div>

                    {/* Team Members Grid */}
                    <div className="mb-4">
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                            <span>👤</span> All Team Members
                        </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {team.map(member => (
                            <div 
                                key={member._id} 
                                className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl hover:scale-105 transition-all duration-200"
                            >
                                <div className="card-body p-4">
                                    {/* Avatar & Badge */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="avatar">
                                            <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                {member.profileImage ? (
                                                    <img 
                                                        src={member.profileImage} 
                                                        alt={member.employeeName}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="bg-primary text-primary-content flex items-center justify-center text-2xl font-bold">
                                                        {member.employeeName?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {member.role === 'hr' && (
                                            <div className="badge badge-primary badge-sm">HR</div>
                                        )}
                                    </div>

                                    {/* Name */}
                                    <h3 className="card-title text-base truncate" title={member.employeeName}>
                                        {member.employeeName}
                                    </h3>

                                    {/* Email */}
                                    <p className="text-xs text-gray-500 truncate" title={member.employeeEmail || member.email}>
                                        📧 {member.employeeEmail || member.email}
                                    </p>

                                    {/* Position/Role */}
                                    <div className="mt-2">
                                        <div className="badge badge-ghost gap-1">
                                            <span>💼</span>
                                            {getPosition(member)}
                                        </div>
                                    </div>

                                    {/* Birthday Info (if available) */}
                                    {member.dateOfBirth && (
                                        <div className="mt-2 text-xs opacity-70">
                                            🎂 {new Date(member.dateOfBirth).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Read-Only Notice */}
            <div className="mt-8 alert alert-info shadow-lg">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <p className="text-sm">
                            <strong>Read-Only View:</strong> This is a view-only page. To update team information, please contact your HR manager.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
