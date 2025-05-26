// components/sections/Announcements.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';

const socket = io(`http://localhost:5000`);

function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/announcements`);
                setAnnouncements(response.data);
            } catch (error) {
                console.error("Error fetching announcements:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();

        socket.on('newAnnouncement', (announcement) => {
            setAnnouncements(prev => [announcement, ...prev]);
        });

        return () => {
            socket.off('newAnnouncement');
        };
    }, []);

    if (loading) {
        return (
            <div className="text-blue-500 text-center mt-10 animate-pulse">
                Loading announcements...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] text-gray-900 p-6">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Recent Announcements
            </h2>

            {announcements.length === 0 ? (
                <p className="text-center text-gray-500">No announcements available.</p>
            ) : (
                <ul className="space-y-4 max-w-4xl mx-auto">
                    {announcements.map((announcement) => (
                        <motion.li
                            key={announcement._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white shadow-sm border border-gray-200 rounded-lg px-6 py-4"
                        >
                            <h3 className="text-lg font-semibold text-blue-600 mb-1">
                                Announcement: {announcement.title}
                            </h3>
                            <p className="text-gray-700">{announcement.content}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                {new Date(announcement.createdAt).toLocaleString()}
                            </p>
                        </motion.li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Announcements;
