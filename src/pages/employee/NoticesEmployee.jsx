import React, { useEffect, useState } from 'react';
import API from '../../api/api';

export default function NoticesEmployee() {
    const [notices, setNotices] = useState([]);

    useEffect(() => { loadNotices(); }, []);

    const loadNotices = async () => {
        try {
            const { data } = await API.get('/notices');
            setNotices(data);
        } catch (e) { console.error(e); }
    };

    const markRead = async (id) => {
        try {
            await API.patch(`/notices/${id}/read`);
            // Update local state to show as read
            setNotices(notices.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (e) {
            console.error('Failed to mark read', e);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                📢 Notice Board
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {notices.map(notice => (
                    <div
                        key={notice._id}
                        className={`card bg-base-100 shadow-xl transition-all hover:scale-[1.01] ${!notice.isRead ? 'ring-2 ring-primary ring-offset-2' : 'opacity-90'}`}
                        onClick={() => !notice.isRead && markRead(notice._id)}
                    >
                        <div className="card-body">
                            <div className="flex justify-between items-start">
                                <h3 className="card-title">
                                    {notice.title}
                                    {!notice.isRead && <span className="badge badge-primary badge-sm animate-pulse">NEW</span>}
                                </h3>
                                <div className={`badge ${notice.priority === 'high' ? 'badge-error' : notice.priority === 'medium' ? 'badge-warning' : 'badge-success'} capitalize`}>
                                    {notice.priority} Priority
                                </div>
                            </div>
                            <p className="text-gray-600 mt-2 whitespace-pre-wrap">{notice.description}</p>
                            <div className="card-actions justify-between items-center mt-4 pt-4 border-t border-base-200">
                                <span className="text-xs text-gray-400">Posted: {new Date(notice.date).toLocaleDateString()}</span>
                                {!notice.isRead && <span className="text-xs text-primary font-bold">Tap to mark as read</span>}
                            </div>
                        </div>
                    </div>
                ))}

                {notices.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-base-50 rounded-xl">
                        <p className="text-xl text-gray-400">All caught up! No new notices.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
