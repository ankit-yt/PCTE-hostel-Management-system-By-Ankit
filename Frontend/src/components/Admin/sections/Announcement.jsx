// src/components/Admin/sections/Announcement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { motion } from "motion/react"

const socket = io('https://pcte-hostel-management-system-by-ankit.onrender.com'); // Connect to the server

function Announcement({isDarkTheme}) {
    const [announcements, setAnnouncements] = useState([]);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get('https://pcte-hostel-management-system-by-ankit.onrender.com/api/announcements');
                setAnnouncements(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

       
        fetchAnnouncements();

      
        socket.on('newAnnouncement', (announcement) => {
            setAnnouncements((prev) => [announcement, ...prev]);
        });

        return () => {
            socket.off('newAnnouncement');
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAnnouncement((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`https://pcte-hostel-management-system-by-ankit.onrender.com/api/announcements`, newAnnouncement);
            setAnnouncements((prev) => [response.data, ...prev]);
            setNewAnnouncement({ title: '', content: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await axios.delete(`https://pcte-hostel-management-system-by-ankit.onrender.com/api/announcements/${id}`);
                setAnnouncements((prev) => prev.filter((announcement) => announcement._id !== id));
            } catch (err) {
                setError(err.message);
            }
        }
    };

   

    return (
        <div className="w-full h-full p-6 overflow-hidden bg-gray-50 overflow-y-auto">
        {/* Announcement Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              name="title"
              value={newAnnouncement.title}
              onChange={handleChange}
              placeholder="Announcement Title"
              required
              className="border border-gray-300 outline-none p-2 text-black rounded-md w-full"
            />
            <textarea
              name="content"
              value={newAnnouncement.content}
              onChange={handleChange}
              placeholder="Announcement Content"
              required
              className="border border-gray-300 outline-none p-2 text-black rounded-md w-full"
            />
           <button
  type="submit"
  className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-semibold text-white transition-all duration-300 ease-in-out rounded-xl shadow-lg group bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:from-[#0072ff] hover:to-[#00c6ff] hover:shadow-blue-500/50 backdrop-blur-md border border-white/10"
>
  <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
  <span className="relative z-10"> Announce</span>
</button>

          </div>
        </form>
      
        {error && <p className="text-red-500 mb-4">{error}</p>}
      
        {/* Announcement Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="text-lg font-semibold text-gray-700 p-4 border-b">Recent Announcements</div>
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-6 py-3">Title</th>
                <th className="text-left px-6 py-3">Content</th>
                <th className="text-left px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((announcement) => (
                <motion.tr
                  key={announcement._id}
                  whileHover={{
                    backgroundColor: 'rgba(243, 244, 246, 0.6)',
                    transition: { duration: 0.3 }
                  }}
                  className="transition-all"
                >
                  <td className="px-6 py-4">{announcement.title}</td>
                  <td className="px-6 py-4">{announcement.content}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(announcement._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
              {announcements.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center px-6 py-4 text-gray-500">
                    No announcements available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
}

export default Announcement;