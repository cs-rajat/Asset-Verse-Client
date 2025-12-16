import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { PieChart, Pie, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

export default function Analytics() {
  const [dist, setDist] = useState([]);
  const [top, setTop] = useState([]);

  useEffect(() => {
    API.get('/analytics/assets-distribution').then(r => setDist(r.data)).catch(() => { });
    API.get('/analytics/top-requested').then(r => setTop(r.data)).catch(() => { });
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-bold mb-2">Returnable vs Non-returnable</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={dist} dataKey="value" nameKey="name" outerRadius={80} label />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-4">
          <h3 className="font-bold mb-2">Top 5 Requested Assets</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={top}>
              <XAxis dataKey="assetName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
