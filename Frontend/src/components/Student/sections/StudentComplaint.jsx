import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentComplaint({ studentName, studentRoom, isDarkTheme }) {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComplaint, setNewComplaint] = useState("");

    const lightThemeStyles = {
        container: " w-full h-screen bg-white text-gray-900 overflow-x-hidden  mb-10 px-6 overflow-auto py-10 flex flex-col items-center justify-center",
        card: "w-full max-w-2xl",
        header: "text-4xl font-bold text-center mb-8 text-blue-600 tracking-tight",
        input: "w-full px-4 py-3 rounded-md bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4",
        textarea: "w-full px-4 py-3 rounded-md bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 resize-none",
        button: "w-full px-4 py-3 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold transition duration-200 ease-in-out",
        loading: "text-center text-blue-400 text-sm",
        error: "text-center text-red-500 text-sm",
        complaintList: "mt-10 space-y-4",
        complaintCard: "p-5 overflow-auto min rounded-lg border border-gray-200 bg-gray-50",
        complaintText: "text-base font-medium text-gray-800 mb-2",
        date: "text-xs text-gray-500 mb-1",
        statusBadge: "inline-block px-3 py-1 text-xs font-semibold rounded-full",
        resolved: "bg-green-100 text-green-600",
        unresolved: "bg-red-100 text-red-600",
    };

    const theme = lightThemeStyles;

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

    const handleSubmitComplaint = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/api/complaints`, {
                studentName,
                complaintText: newComplaint,
            });
            setComplaints((prev) => [...prev, response.data]);
            setNewComplaint("");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={theme.container}>
            <div className={theme.card}>
                <h1 className={theme.header}>Student Complaint Portal</h1>

                {loading && <p className={theme.loading}>Loading complaints...</p>}
                {error && <p className={theme.error}>{error}</p>}

                {/* Complaint Form */}
                <form onSubmit={handleSubmitComplaint}>
                    <input
                        type="text"
                        value={studentName}
                        readOnly
                        className={theme.input}
                    />
                    <textarea
                        placeholder="Write your complaint..."
                        value={newComplaint}
                        onChange={(e) => setNewComplaint(e.target.value)}
                        className={theme.textarea}
                    />
                    <button type="submit" className={theme.button}>
                        Submit Complaint
                    </button>
                </form>

                {/* Complaints */}
                <div className={theme.complaintList}>
                    {complaints.map((complaint) => (
                        <div key={complaint.id} className={theme.complaintCard}>
                            <p className={theme.complaintText}>{complaint.complaintText}</p>
                            <p className={theme.date}>{new Date(complaint.date).toLocaleString()}</p>
                            <span className={`${theme.statusBadge} ${complaint.resolved ? theme.resolved : theme.unresolved}`}>
                                {complaint.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="h-20 w-full "></div>
        </div>
    );
}

export default StudentComplaint;
