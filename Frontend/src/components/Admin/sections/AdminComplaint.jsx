import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MdDone, MdClose } from 'react-icons/md';
import { FaFilter } from 'react-icons/fa';

function AdminComplaint({isDarkTheme}) {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [announcements, setAnnouncements] = useState({});
    const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('latest');

  const filteredComplaints = complaints
  .filter((c) => {
    if (filter === 'resolved') return c.resolved;
    if (filter === 'unresolved') return !c.resolved;
    return true;
  })
  .sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
  });

  

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/complaints`);
                setComplaints(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    const handleResolve = async (complaintId) => {
        const announcement = announcements[complaintId];
        if (!announcement.trim()) return; 

        try {
            const response = await axios.put(`http://localhost:5000/api/complaints/${complaintId}/resolve`, {
                announcement,
            });
            setComplaints((prev) =>
                prev.map((complaint) =>
                    complaint._id === complaintId ? response.data : complaint
                )
            );
            setAnnouncements((prev) => ({ ...prev, [complaintId]: '' })); 
        } catch (err) {
            setError(`Failed to resolve complaint: ${err.message}`);
        }
    };

    const handleDelete = async (complaintId) => {
        try {
            await axios.delete(`http://localhost:5000/api/complaints/${complaintId}`);
            setComplaints((prev) => prev.filter((complaint) => complaint._id !== complaintId));
        } catch (err) {
            setError(`Failed to delete complaint: ${err.message}`);
        }
    };

    return (
        <div className="p-6 bg-[#f5f7fa] min-h-screen">
      

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-600" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 shadow-sm"
          >
            <option value="all">All</option>
            <option value="resolved">Resolved</option>
            <option value="unresolved">Unresolved</option>
          </select>
        </div>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 shadow-sm"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((complaint, index) => (
            <motion.div
              key={complaint._id}
            //   initial={{ opacity: 0, y: 20 }}
            //   animate={{ opacity: 1, y: 0 }}
            //   transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-lg p-6 space-y-4 border-t-4 border-indigo-500"
            >
              <div className="flex justify-between text-sm text-gray-600">
                <div>
                  <p className="font-semibold">Name</p>
                  <p>{complaint.studentName}</p>
                </div>
                <div>
                  <p className="font-semibold">Time</p>
                  <p>{new Date(complaint.date).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Complaint</p>
                <p className="text-gray-600">{complaint.complaintText}</p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                    complaint.resolved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {complaint.resolved ? 'Resolved' : 'Unresolved'}
                </span>
              </div>
              {!complaint.resolved && (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={announcements[complaint._id] || ''}
                    onChange={(e) => setAnnouncements((prev) => ({
                      ...prev,
                      [complaint._id]: e.target.value,
                    }))}
                    placeholder="Enter announcement"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleResolve(complaint._id)}
                      className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                      <MdDone /> Resolve
                    </button>
                    <button
                      onClick={() => handleDelete(complaint._id)}
                      className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      <MdClose /> Delete
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
      
    
    );
}

export default AdminComplaint;
