import React, { useEffect, useState } from 'react';
import API from '../../api/api';

export default function MyTeam() {
    const [team, setTeam] = useState([]);
    const [affiliations, setAffiliations] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [loading, setLoading] = useState(true);

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

    const handleCompanyChange = (e) => {
        const company = e.target.value;
        setSelectedCompany(company);
        fetchTeam(company);
    };

    // Filter upcoming birthdays (Current Month)
    const currentMonth = new Date().getMonth();
    const upcomingBirthdays = team.filter(member => {
        if (!member.dateOfBirth) return false;
        const dob = new Date(member.dateOfBirth);
        return dob.getMonth() === currentMonth;
    });

    if (loading && affiliations.length === 0) return <div className="text-center mt-20"><span className="loading loading-spinner"></span></div>;

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            {/* Header with Company Selector */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <span>👥</span> My Team
                </h2>

                {/* Company Dropdown / Tabs */}
                {affiliations.length > 1 && (
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-bold mr-2">Select Company:</span>
                        </label>
                        <select
                            className="select select-bordered"
                            value={selectedCompany}
                            onChange={handleCompanyChange}
                        >
                            {affiliations.map(aff => (
                                <option key={aff._id} value={aff.companyName}>{aff.companyName}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Upcoming Birthdays Section */}
            {upcomingBirthdays.length > 0 && (
                <div className="mb-10 animate-fade-in-up">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                        <span>🎂</span> Upcoming Birthdays (This Month)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingBirthdays.map(member => (
                            <div key={member._id} className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-xl flex-row p-4 items-center gap-4">
                                <div className="avatar">
                                    <div className="w-16 rounded-full ring ring-white ring-offset-2 ring-offset-primary">
                                        <img src={member.profileImage || "https://placehold.co/100"} alt={member.employeeName} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{member.employeeName}</h3>
                                    <p className="text-sm opacity-90">
                                        {new Date(member.dateOfBirth).getDate()} {new Date(member.dateOfBirth).toLocaleString('default', { month: 'long' })}
                                    </p>
                                    <span className="badge badge-accent mt-1 text-xs font-bold">🎉 Wish Them!</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="divider opacity-20 my-8"></div>

            {team.length === 0 ? (
                <div className="alert alert-warning">
                    You are not affiliated with any company or have no team members yet. Please contact your HR.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {team.map(member => (
                        <div key={member._id} className="card bg-base-100 shadow-xl flex-row p-4 items-center gap-4 border border-base-200 transaction-all hover:shadow-2xl">
                            <div className="avatar placeholder">
                                <div className="bg-neutral-focus text-neutral-content rounded-full w-16 ring ring-base-300 ring-offset-2">
                                    {member.profileImage ? (
                                        <img src={member.profileImage} alt={member.employeeName} className="object-cover" />
                                    ) : (
                                        <span className="text-xl">{member.employeeName?.charAt(0)}</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{member.employeeName}</h3>
                                <div className="badge badge-ghost mt-1">{member.role === 'hr' ? 'HR Manager' : 'Team Member'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
