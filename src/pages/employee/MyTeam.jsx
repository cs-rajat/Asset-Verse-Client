import React, { useEffect, useState } from 'react';
import API from '../../api/api';

export default function MyTeam() {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTeam = async () => {
            try {
                // 1. Get Affiliations
                const { data: affiliations } = await API.get('/users/affiliations');
                if (affiliations.length > 0) {
                    // 2. Get Team for the first active affiliation (assuming single company for now)
                    // The URL requires companyName, but checking routes usually IDs are safer.
                    // The existing route is /users/team/:companyName using encoded URI.
                    const companyName = affiliations[0].companyName;
                    if (companyName) {
                        const { data: teammates } = await API.get(`/users/team/${encodeURIComponent(companyName)}`);
                        setTeam(teammates);
                    }
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        }
        loadTeam();
    }, []);

    if (loading) return <div className="text-center mt-20"><span className="loading loading-spinner"></span></div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">My Team</h2>
            {team.length === 0 ? (
                <div className="alert alert-warning">
                    You are not affiliated with any company or have no team members yet. Please contact your HR.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {team.map(member => (
                        <div key={member._id} className="card bg-base-100 shadow-xl flex-row p-4 items-center gap-4">
                            <div className="avatar placeholder">
                                <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
                                    <span className="text-xl">{member.employeeName?.charAt(0)}</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{member.employeeName}</h3>
                                {/* We don't necessarily show email? Or maybe status? */}
                                <div className="badge badge-ghost">{member.role === 'hr' ? 'HR Manager' : 'Employee'}</div>
                                {/* Wait, the response uses 'employeeName' from affiliation record? Or user record? */}
                                {/* API /users/team/:companyName returns 'employeeAffiliations' records? */}
                                {/* Yes, based on usersRoutes.js: db.collection("employeeAffiliations").find... */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
