import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { PieChart, Pie, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, Legend, CartesianGrid } from 'recharts';

const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981'];

export default function Analytics() {
  const [dist, setDist] = useState([]);
  const [top, setTop] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [distRes, topRes] = await Promise.all([
        API.get('/analytics/assets-distribution'),
        API.get('/analytics/top-requested')
      ]);
      setDist(distRes.data);
      setTop(topRes.data);
    } catch (err) {
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 sm:p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          📊 Analytics Dashboard
        </h2>
        <p className="text-xs sm:text-sm opacity-60 mt-1">Visual insights into your asset management</p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Pie Chart - Asset Distribution */}
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body p-4 sm:p-6">
            <h3 className="card-title text-lg sm:text-xl mb-4 flex items-center gap-2">
              <span className="text-2xl">🔄</span>
              Asset Type Distribution
            </h3>
            {dist.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-center">
                <p className="opacity-60">No asset data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={dist} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80}
                    innerRadius={40}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {dist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="mt-4 text-sm opacity-70">
              <p>Total Assets: <span className="font-bold">{dist.reduce((sum, d) => sum + d.value, 0)}</span></p>
            </div>
          </div>
        </div>

        {/* Bar Chart - Top Requested */}
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body p-4 sm:p-6">
            <h3 className="card-title text-lg sm:text-xl mb-4 flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              Top 5 Most Requested Assets
            </h3>
            {top.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-center">
                <p className="opacity-60">No request data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={top} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="assetName" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ value: 'Requests', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}
                    cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#8b5cf6" 
                    radius={[8, 8, 0, 0]}
                    label={{ position: 'top', fontSize: 12, fontWeight: 'bold' }}
                  >
                    {top.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            <div className="mt-4 text-sm opacity-70">
              <p>Total Requests: <span className="font-bold">{top.reduce((sum, t) => sum + t.count, 0)}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="stat bg-base-100 rounded-lg shadow border border-base-200">
          <div className="stat-figure text-primary text-3xl">📦</div>
          <div className="stat-title text-xs sm:text-sm">Total Assets</div>
          <div className="stat-value text-primary text-2xl sm:text-3xl">
            {dist.reduce((sum, d) => sum + d.value, 0)}
          </div>
        </div>
        
        <div className="stat bg-base-100 rounded-lg shadow border border-base-200">
          <div className="stat-figure text-secondary text-3xl">📋</div>
          <div className="stat-title text-xs sm:text-sm">Total Requests</div>
          <div className="stat-value text-secondary text-2xl sm:text-3xl">
            {top.reduce((sum, t) => sum + t.count, 0)}
          </div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow border border-base-200">
          <div className="stat-figure text-accent text-3xl">🔄</div>
          <div className="stat-title text-xs sm:text-sm">Returnable</div>
          <div className="stat-value text-accent text-2xl sm:text-3xl">
            {dist.find(d => d.name === 'Returnable')?.value || 0}
          </div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow border border-base-200">
          <div className="stat-figure text-info text-3xl">🔒</div>
          <div className="stat-title text-xs sm:text-sm">Non-returnable</div>
          <div className="stat-value text-info text-2xl sm:text-3xl">
            {dist.find(d => d.name === 'Non-returnable')?.value || 0}
          </div>
        </div>
      </div>
    </div>
  );
}
