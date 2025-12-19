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
      <li><Link to="/dashboard/hr/notices">Notices</Link></li>
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
      <li><Link to="/dashboard/employee/notices">Notice Board</Link></li>
      <li><Link to="/profile">Profile</Link></li>
    </>
  );

  return (
    <nav className="navbar bg-base-100/70 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-primary/10 transition-all duration-300">
      <div className="container mx-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><Link to="/">Home</Link></li>
              {!user && (
                <>
                  <li><Link to="/register/employee">Join as Employee</Link></li>
                  <li><Link to="/register/hr">Join as HR Manager</Link></li>
                </>
              )}
            </ul>
          </div>
          <Link to="/" className="btn btn-ghost normal-case text-xl font-bold font-heading tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            <span className="text-3xl mr-1">💎</span> Asset<span className="text-primary">Verse</span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/" className="font-medium hover:text-primary transition-colors">Home</Link></li>
            {!user && (
              <>
                <li><Link to="/register/employee" className="font-medium hover:text-primary transition-colors">Join as Employee</Link></li>
                <li><Link to="/register/hr" className="font-medium hover:text-primary transition-colors">Join as HR Manager</Link></li>
              </>
            )}
          </ul>
        </div>

        <div className="navbar-end gap-2">
          {!user ? (
            <Link to="/login" className="btn btn-primary btn-sm rounded-full px-6">Login</Link>
          ) : (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar ring ring-primary ring-offset-base-100 ring-offset-2 transition-transform hover:scale-110">
                <div className="w-10 rounded-full">
                  <img src={user?.profileImage || user?.companyLogo || `https://ui-avatars.com/api/?name=${user?.name}&background=4F46E5&color=fff`} alt="profile" />
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
