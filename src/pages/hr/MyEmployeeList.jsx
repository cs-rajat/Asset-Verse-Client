import React, { useEffect, useState } from 'react';
import API from '../../api/api';
import { Link } from 'react-router-dom';

export default function MyEmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [hrStats, setHrStats] = useState({ current: 0, limit: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            // Parallel fetch: Employees List and HR Profile (for limits)
            const [empRes, userRes] = await Promise.all([
                API.get('/users/employees'),
                API.get('/users/me')
            ]);
            setEmployees(empRes.data);
            setHrStats({
                current: empRes.data.length, // More accurate from list length
                limit: userRes.data.packageLimit || 5
            });
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    }

    const removeEmployee = async (id) => {
        if (!window.confirm("Are you sure? This will remove them from your team.")) return;
        try {
            await API.delete(`/users/affiliations/${id}`);
            alert('Employee removed successfully.');
            loadData();
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to remove employee');
        }
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [availableAssets, setAvailableAssets] = useState([]);
    const [selectedAssetId, setSelectedAssetId] = useState('');
    const [assignNote, setAssignNote] = useState('');

    const openAssignModal = async (employee) => {
        setSelectedEmployee(employee);
        try {
            const { data } = await API.get('/assets'); // Fetch assets
            // Filter only available assets
            setAvailableAssets(data.assets.filter(a => a.availableQuantity > 0));
            setIsModalOpen(true);
        } catch (e) {
            console.error(e);
            alert("Failed to load assets");
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        if (!selectedAssetId) return alert("Please select an asset");

        console.log("Assigning:", {
            email: selectedEmployee.employeeEmail || selectedEmployee.email,
            asset: selectedAssetId,
            note: assignNote
        });

        try {
            await API.post('/assigned', {
                employeeEmail: selectedEmployee.employeeEmail || selectedEmployee.email,
                assetId: selectedAssetId,
                notes: assignNote
            });
            alert("Asset assigned successfully!");
            setIsModalOpen(false);
            setAssignNote('');
            setSelectedAssetId('');
            loadData(); // Refresh counts
        } catch (err) {
            console.error("Assignment Error:", err);
            const serverMsg = err.response?.data?.msg || err.response?.data?.message;
            alert(serverMsg || ("Assignment failed: " + err.message + "\nFull Error: " + JSON.stringify(err.response?.data)));
        }
    };

    if (loading) return <div className="text-center mt-20"><span className="loading loading-spinner"></span></div>;

    const usagePercentage = Math.min((hrStats.current / hrStats.limit) * 100, 100);

    return (
        <div className="container mx-auto p-2 sm:p-4">
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="modal-box w-full max-w-md bg-white p-6 rounded-2xl shadow-2xl">
                        <h3 className="font-bold text-lg mb-4">Assign Asset to {selectedEmployee?.name}</h3>
                        <form onSubmit={handleAssign}>
                            <div className="form-control mb-4">
                                <label className="label font-semibold">Select Asset</label>
                                <select
                                    className="select select-bordered w-full"
                                    value={selectedAssetId}
                                    onChange={e => setSelectedAssetId(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose available asset --</option>
                                    {availableAssets.map(asset => (
                                        <option key={asset._id} value={asset._id}>
                                            {asset.productName} ({asset.productType}) - {asset.availableQuantity} left
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-control mb-6">
                                <label className="label font-semibold">Note (Optional)</label>
                                <textarea
                                    className="textarea textarea-bordered h-24"
                                    placeholder="Reason for assignment..."
                                    value={assignNote}
                                    onChange={e => setAssignNote(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="modal-action">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Assign</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <span>👥</span> My Team Members
                    </h2>
                    <p className="text-sm opacity-60 mt-1">Manage your team assignments</p>
                </div>

                {/* Usage Stats Card */}
                <div className="card bg-base-100 shadow-md border border-base-200 px-6 py-2 flex flex-row items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Employee Limit</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-primary">{hrStats.current}</span>
                            <span className="text-gray-400">/ {hrStats.limit}</span>
                        </div>
                    </div>

                    <div className="radial-progress text-primary text-xs" style={{ "--value": usagePercentage, "--size": "3rem" }}>
                        {Math.round(usagePercentage)}%
                    </div>

                    {hrStats.current >= hrStats.limit && (
                        <Link to="/dashboard/hr/upgrade-package" className="btn btn-warning btn-xs animate-pulse">
                            Upgrade
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map(emp => (
                    <div key={emp._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all border border-base-200">
                        <div className="card-body items-center text-center">
                            <div className="avatar">
                                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={emp.profileImage || "https://i.ibb.co/T0h284p/user-placeholder.png"} alt="Profile" />
                                </div>
                            </div>
                            <h3 className="card-title mt-4">{emp.name || emp.employeeName}</h3>
                            <p className="text-gray-500 text-sm">{emp.email || emp.employeeEmail}</p>

                            <div className="stats shadow w-full mt-4 bg-base-50">
                                <div className="stat py-2 px-1">
                                    <div className="stat-title text-xs">Joined</div>
                                    <div className="stat-value text-sm">
                                        {emp.affiliationDate ? new Date(emp.affiliationDate).toLocaleDateString() : 'N/A'}
                                    </div>
                                </div>
                                <div className="stat py-2 px-1">
                                    <div className="stat-title text-xs">Assets</div>
                                    <div className="stat-value text-sm text-primary">{emp.assetsCount || 0}</div>
                                </div>
                            </div>

                            <div className="card-actions mt-6 w-full flex flex-col gap-2">
                                <button className="btn btn-primary btn-sm w-full" onClick={() => openAssignModal(emp)}>
                                    Assign Asset
                                </button>
                                <button className="btn btn-error btn-outline btn-xs w-full" onClick={() => removeEmployee(emp._id)}>
                                    Remove from Team
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {employees.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-400">
                        <div className="flex flex-col items-center">
                            <span className="text-6xl mb-4">🤷‍♂️</span>
                            <span className="text-xl">No team members yet</span>
                            <p>Share your join code or wait for requests.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8 text-right text-sm text-gray-400">
                Total Employees: {employees.length}
            </div>
        </div>
    )
}
