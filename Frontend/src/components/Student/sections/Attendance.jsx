import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentAttendance({ studentId }) {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/attendance/${studentId}`);
                setAttendanceRecords(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [studentId]);

    if (loading) {
        return (
            <p className="text-center text-blue-600 animate-pulse mt-10">
                Loading attendance records...
            </p>
        );
    }

    if (error) {
        return (
            <p className="text-center text-red-600 mt-10">
                {error}
            </p>
        );
    }

    return (
        <div className="min-h-screen bg-[#f9fafb] text-gray-900 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">
                    Attendance Records
                </h2>

                {attendanceRecords.length === 0 ? (
                    <p className="text-center text-gray-500">No attendance records available.</p>
                ) : (
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="text-base text-gray-700 border-b border-gray-300">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceRecords.map((record) => (
                                <tr
                                    key={record._id}
                                    className="hover:bg-blue-50 transition duration-200 ease-in-out"
                                >
                                    <td className="px-6 py-4 border-b border-gray-200">
                                        {new Date(record.date).toLocaleDateString()}
                                    </td>
                                    <td
                                        className={`px-6 py-4 border-b border-gray-200 font-semibold ${
                                            record.status === 'Present' ? 'text-green-600' : 'text-red-600'
                                        }`}
                                    >
                                        {record.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default StudentAttendance;
