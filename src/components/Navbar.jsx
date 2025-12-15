import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav('/');
  };

  const hrLinks = (
    <>
      <li><Link to="/dashboard/hr">Asset List (Home)</Link></li>
      <li><Link to="/dashboard/hr/add-asset">Add Asset</Link></li>
      <li><Link to="/dashboard/hr/requests">All Requests</Link></li>
      <li><Link to="/dashboard/hr/employees">My Employee List</Link></li>
      <li><Link to="/profile">Profile</Link></li>
      <li><Link to="/analytics">Analytics</Link></li>
      <li><Link to="/upgrade">Upgrade Package</Link></li>
    </>
  );

  const employeeLinks = (
    <>
      <li><Link to="/my-assets">My Assets</Link></li>
      <li><Link to="/my-team">My Team</Link></li>
      <li><Link to="/dashboard/employee/request">Request Asset</Link></li>
      <li><Link to="/profile">Profile</Link></li>
    </>
  );

  return (
    <nav className="navbar bg-base-100/70 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-primary/10 transition-all duration-300">
      <div className="container mx-auto">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-2xl font-bold font-heading tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:scale-105 transition-transform">
            <span className="text-3xl mr-1">💎</span> Asset<span className="text-primary">Verse</span>
          </Link>
        </div>
        <div className="flex-none gap-2">
          {/* Public Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/" className="btn btn-ghost btn-sm font-medium hover:bg-primary/10 transition-colors">Home</Link>
            {!user && (
              <>
                <Link to="/register/employee" className="btn btn-ghost btn-sm font-medium hover:bg-primary/10 transition-colors">Join as Employee</Link>
                <Link to="/register/hr" className="btn btn-primary btn-sm rounded-full px-6 shadow-md hover:shadow-lg transition-all">Join as HR Manager</Link>
              </>
            )}
          </div>

          {!user ? (
            <Link to="/login" className="btn btn-outline btn-primary btn-sm sm:btn-md ml-2 rounded-full">Login</Link>
          ) : (
            <div className="dropdown dropdown-end ml-2">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar ring ring-primary ring-offset-base-100 ring-offset-2 transition-transform hover:scale-110">
                <div className="w-10 rounded-full">
                  <img src={user?.companyLogo || "https://i.ibb.co/T0h284p/user-placeholder.png"} alt="profile" />
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-60 border border-base-200/50">
                <li className="menu-title px-4 py-2 border-b border-base-200">
                  <span className="text-lg font-bold font-heading text-base-content">{user?.name}</span>
                  <span className="text-xs font-normal opacity-70 block capitalize badge badge-ghost badge-sm mt-1 w-fit">{user?.role === 'hr' ? 'HR Manager' : 'Employee'}</span>
                </li>
                <div className="py-2">
                  {user?.role === 'hr' ? hrLinks : employeeLinks}
                </div>
                <div className="divider my-0"></div>
                <li className="p-2"><button onClick={handleLogout} className="btn btn-error btn-sm btn-block text-white">Logout</button></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
