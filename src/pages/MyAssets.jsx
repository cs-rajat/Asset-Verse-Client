import React, { useEffect, useState } from 'react';
import API from '../api/api';

export default function MyAssets() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => { fetchPage(page); }, [page]);

  const fetchPage = async (p = 1) => {
    try {
      const { data } = await API.get(`/assigned?page=${p}&limit=10`);
      setItems(data.items || []);
      setPagination(data.pagination || {});
    } catch (err) { console.error(err); alert('Failed to load assigned assets'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">My Assigned Assets</h2>
        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>Print / Save as PDF</button>
      </div>
      {items.length === 0 ? <p>No assets assigned.</p> : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead><tr><th>Asset</th><th>Company</th><th>Type</th><th>Assigned</th><th>Status</th></tr></thead>
            <tbody>
              {items.map(it => (
                <tr key={it._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {it.assetImage ? <img src={it.assetImage} alt="" className="w-12 h-12 object-cover rounded" /> : null}
                      <div>{it.assetName}</div>
                    </div>
                  </td>
                  <td>{it.companyName}</td>
                  <td>{it.assetType}</td>
                  <td>{new Date(it.assignmentDate).toLocaleDateString()}</td>
                  <td>{it.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="btn-group mt-4">
          <button className="btn" onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
          <button className="btn">{page}</button>
          <button className="btn" onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}>Next</button>
        </div>
      )}
    </div>
  );
}
