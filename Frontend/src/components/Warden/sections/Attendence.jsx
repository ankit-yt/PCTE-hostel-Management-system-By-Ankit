import React, { useEffect, useState } from "react";
import axios from "axios";

function Attendance() {
  const [students, setStudents] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmittedToday, setIsSubmittedToday] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users?role=student`);
        const filtered = response.data.filter((user) => user.role === "student");
        setStudents(filtered);

        const initialStatus = filtered.reduce((acc, student) => {
          acc[student._id] = "";
          return acc;
        }, {});
        setAttendanceStatus(initialStatus);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const checkAttendanceToday = async () => {
      const date = new Date().toISOString().split("T")[0];
      try {
        const responses = await Promise.all(
          students.map((student) =>
            axios.get(`http://localhost:5000/api/attendance/today/${student._id}`)
          )
        );
        const hasSubmitted = responses.some((res) => res.data.submitted);
        setIsSubmittedToday(hasSubmitted);
      } catch (err) {
        console.error(err.message);
      }
    };

    if (students.length > 0) {
      checkAttendanceToday();
    }
  }, [students]);

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittedToday) return alert("Attendance already submitted today.");

    const date = new Date().toISOString().split("T")[0];

    try {
      await Promise.all(
        students.map(async (student) => {
          const status = attendanceStatus[student._id];
          const res = await axios.get(
            `http://localhost:5000/api/attendance/${student._id}/${date}`
          );
          if (res.data.length === 0) {
            await axios.post(`http://localhost:5000/api/attendance`, {
              studentId: student._id,
              date,
              status,
            });
          }
        })
      );
      alert("Attendance recorded successfully!");
      setIsSubmittedToday(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = async () => {
    const date = new Date().toISOString().split("T")[0];
    try {
      await Promise.all(
        students.map(async (student) => {
          const res = await axios.get(
            `http://localhost:5000/api/attendance/${student._id}/${date}`
          );
          if (res.data.length > 0) {
            setAttendanceStatus((prev) => ({
              ...prev,
              [student._id]: res.data[0].status,
            }));
          }
        })
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateAttendance = async () => {
    const date = new Date().toISOString().split("T")[0];
    try {
      await Promise.all(
        students.map(async (student) => {
          const res = await axios.get(
            `http://localhost:5000/api/attendance/${student._id}/${date}`
          );
          if (res.data.length > 0) {
            const id = res.data[0]._id;
            await axios.put(`http://localhost:5000/api/attendance/${id}`, {
              status: attendanceStatus[student._id],
            });
          }
        })
      );
      alert("Attendance updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-center text-blue-600 animate-pulse">Loading students...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-100 to-slate-200 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center">Attendance Sheet</h2>

        {isSubmittedToday && (
          <div className="text-center mb-6 text-red-500 font-semibold">
            Attendance has already been submitted today.
          </div>
        )}

        <form onSubmit={handleAttendanceSubmit}>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm rounded-lg shadow-sm">
              <thead>
                <tr className="bg-blue-100 text-blue-700 text-left">
                  <th className="px-6 py-3 border-b">Name</th>
                  <th className="px-6 py-3 border-b">Roll Number</th>
                  <th className="px-6 py-3 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-blue-50 transition-all">
                    <td className="px-6 py-4 border-b">{student.username}</td>
                    <td className="px-6 py-4 border-b">{student.rollNumber}</td>
                    <td className="px-6 py-4 border-b">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`attendance-${student._id}`}
                            value="Present"
                            checked={attendanceStatus[student._id] === "Present"}
                            onChange={() =>
                              setAttendanceStatus((prev) => ({
                                ...prev,
                                [student._id]: "Present",
                              }))
                            }
                            className="accent-green-600"
                          />
                          <span className="text-green-700 font-medium">Present</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`attendance-${student._id}`}
                            value="Absent"
                            checked={attendanceStatus[student._id] === "Absent"}
                            onChange={() =>
                              setAttendanceStatus((prev) => ({
                                ...prev,
                                [student._id]: "Absent",
                              }))
                            }
                            className="accent-red-500"
                          />
                          <span className="text-red-700 font-medium">Absent</span>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center space-x-4">
            <button
              type="submit"
              disabled={isSubmittedToday}
              className={`px-6 py-3 rounded-lg font-semibold shadow transition-all ${
                isSubmittedToday
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Submit Attendance
            </button>
            <button
              type="button"
              onClick={handleEditClick}
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg shadow font-semibold"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleUpdateAttendance}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow font-semibold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Attendance;
