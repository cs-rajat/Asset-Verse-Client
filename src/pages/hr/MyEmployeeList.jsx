import React, { useEffect, useState } from 'react';
import API from '../../api/api';

export default function MyEmployeeList() {
    const [employees, setEmployees] = useState([]);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try { const { data } = await API.get('/users/employees'); setEmployees(data); } catch (e) { console.error(e); }
    }

    const removeEmployee = async (id) => {
        if (!window.confirm("Are you sure? Why remove them?")) return;
        // Implementation logic for remove?
        // For now just alert or call API if exists
        alert("Feature to remove employee coming soon (API needed)");
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">My Team Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map(emp => (
                    <div key={emp._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
                        <div className="card-body items-center text-center">
                            <div className="avatar">
                                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={emp.profileImage || "https://i.ibb.co/T0h284p/user-placeholder.png"} />
                                </div>
                            </div>
                            <h3 className="card-title mt-4">{emp.name || emp.employeeName}</h3>
                            <p className="text-gray-500">{emp.email || emp.employeeEmail}</p>
                            <div className="card-actions mt-4">
                                <button className="btn btn-error btn-outline btn-sm" onClick={() => removeEmployee(emp._id)}>Remove from Team</button>
                            </div>
                        </div>
                    </div>
                ))}
                {employees.length === 0 && <p>No employees found.</p>}
            </div>
        </div>
    )
}
