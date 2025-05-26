// components/sections/StudentProfile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUserGraduate } from 'react-icons/fa';

function StudentProfile({ studentId }) {
    const [studentData, setStudentData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/${studentId}`);
                setStudentData(response.data);
            } catch (err) {
                setError(err.response ? err.response.data.message : err.message);
            } finally {
                setLoading(false);
            }
        };

        if (studentId) fetchStudentData();
    }, [studentId]);

    if (loading) return <div className="text-center text-blue-600 animate-pulse mt-10">Loading...</div>;
    if (error) return <div className="text-center text-red-600 mt-10">Error: {error}</div>;
    if (!studentData) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md backdrop-blur-xl border border-gray-200 relative"
            >
                <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                        <img
                            src={studentData.imageData}
                            alt="profile"
                            className="w-36 h-36 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                        />
                        <div className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white shadow-md">
                            <FaUserGraduate size={20} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{studentData.username}</h2>
                    <p className="text-gray-500 text-sm mb-6">{studentData.email}</p>
                </div>

                <div className="space-y-4 text-sm text-gray-700">
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-500">Roll Number:</span>
                        <span>{studentData.rollNumber}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-500">Hostel:</span>
                        <span>{studentData.hostel}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-500">Room Number:</span>
                        <span>{studentData.roomNumber}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-500">Phone:</span>
                        <span>{studentData.phone}</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default StudentProfile;
