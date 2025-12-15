import React from 'react';
import { Outlet } from 'react-router-dom';

export default function DashboardHR() {
  return (
    <div className="min-h-[80vh]">
      {/* Child routes will render here */}
      <Outlet />
    </div>
  );
}
