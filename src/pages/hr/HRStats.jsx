import React from 'react';

const HRStats = ({ totalAssets, availableQuantity, totalQuantity, pendingRequests, packageLimit, currentEmployees }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="stat shadow-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-2xl transform hover:-translate-y-1 transition-transform">
                <div className="stat-figure text-blue-200 text-4xl opacity-80 mix-blend-overlay">📦</div>
                <div className="stat-title text-blue-100 font-medium tracking-wide">Total Assets</div>
                <div className="stat-value text-5xl font-heading">{totalAssets}</div>
            </div>

            <div className="stat shadow-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl transform hover:-translate-y-1 transition-transform">
                <div className="stat-figure text-emerald-200 text-4xl opacity-80 mix-blend-overlay">✅</div>
                <div className="stat-title text-emerald-100 font-medium tracking-wide">Available</div>
                <div className="stat-value text-5xl font-heading">{availableQuantity}</div>
            </div>

            <div className="stat shadow-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-2xl transform hover:-translate-y-1 transition-transform">
                <div className="stat-figure text-purple-200 text-4xl opacity-80 mix-blend-overlay">📊</div>
                <div className="stat-title text-purple-100 font-medium tracking-wide">Total Stock</div>
                <div className="stat-value text-5xl font-heading">{totalQuantity}</div>
            </div>

            <div className="stat shadow-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl transform hover:-translate-y-1 transition-transform">
                <div className="stat-figure text-orange-200 text-4xl opacity-80 mix-blend-overlay">⏳</div>
                <div className="stat-title text-orange-100 font-medium tracking-wide">Pending Requests</div>
                <div className="stat-value text-5xl font-heading">{pendingRequests}</div>
            </div>

            {packageLimit !== undefined && (
                <div className="stat shadow-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-2xl transform hover:-translate-y-1 transition-transform">
                    <div className="stat-figure text-pink-200 text-4xl opacity-80 mix-blend-overlay">👥</div>
                    <div className="stat-title text-pink-100 font-medium tracking-wide">Employee Limit</div>
                    <div className="stat-value text-5xl font-heading">{currentEmployees || 0}/{packageLimit}</div>
                    <div className="stat-desc text-pink-100 mt-2">
                        {packageLimit - (currentEmployees || 0)} slots remaining
                    </div>
                </div>
            )}
        </div>
    );
};

export default HRStats;
