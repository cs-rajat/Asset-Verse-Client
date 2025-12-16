import React from 'react';
import { Outlet } from 'react-router-dom';

export default function DashboardHR() {
  return (
    <div className="min-h-[80vh] w-full p-4 md:p-6 lg:p-8">
      {/* Child routes will render here */}
      <Outlet />
    </div>
  );
}
