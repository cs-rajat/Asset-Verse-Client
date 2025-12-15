import React from 'react';
import { Outlet } from 'react-router-dom';

export default function DashboardEmployee() {
  return (
    <div className="min-h-[80vh]">
      <Outlet />
    </div>
  );
}
