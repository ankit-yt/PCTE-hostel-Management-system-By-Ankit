import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { PiStudent } from "react-icons/pi";
import { GiLetterBomb } from "react-icons/gi";
import { TfiAnnouncement } from "react-icons/tfi";



const socket = io(`https://pcte-hostel-management-system-by-ankit.onrender.com`); // Your backend URL

function AdminDashboard({isDarkTheme}) {
  const [students, setStudents] = useState([]);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStudentList, setShowStudentList] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch students by role
        const studentsRes = await axios.get(`https://pcte-hostel-management-system-by-ankit.onrender.com/api/users?role=student`);
        // Fetch other data
        const roomsRes = await axios.get(`https://pcte-hostel-management-system-by-ankit.onrender.com/api/rooms`);
        const complaintsRes = await axios.get(`https://pcte-hostel-management-system-by-ankit.onrender.com/api/complaints`);
        const announcementsRes = await axios.get(`https://pcte-hostel-management-system-by-ankit.onrender.com/api/announcements`);
        
        setStudents(studentsRes.data);
        setAvailableRooms(roomsRes.data.available || 0);
        setPendingComplaints(complaintsRes.data.filter(complaint => !complaint.resolved));
        setAnnouncements(announcementsRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();

    socket.on("dataUpdated", fetchData);

    return () => {
      socket.off("dataUpdated", fetchData); 
    };
  }, []);

  const toggleStudentList = () => {
    setShowStudentList(!showStudentList); 
  };

  console.log(isDarkTheme )

  const darkThemeStyles ={
container: "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white ",
card:"bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-[102%] hover:shadow-3xl"
  }

  const lightThemeStyles = {
    container: "bg-gradient-to-br from-white via-gray-200 to-gray-100 text-gray-900",
    card:"bg-gradient-to-r from-white to-gray-100 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-[102%] hover:shadow-3xl"

  }

  const theme = isDarkTheme ? darkThemeStyles : lightThemeStyles;

  return (
    <div className={`p-6 relative bg-[#f4f6f8]  h-full overflow-auto`} >
  

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total users */}
        <div
          
  onClick={toggleStudentList}
  className="relative w-72 border-t-4 border-green-500 h-48 rounded-2xl bg-white border  shadow-lg overflow-hidden group hover:scale-105 transition-transform duration-500 cursor-pointer"
>
  
  <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-all duration-500 blur-xl pointer-events-none"></div>


  <div className="absolute top-4 left-4 text-green-600 text-3xl">
    <PiStudent size="28px" />
  </div>

 
  <div className="z-10 relative p-6 text-gray-800 flex flex-col justify-end h-full">
    <h1 className="text-2xl font-semibold tracking-wide">Users</h1>
    <p className="text-sm text-gray-500 mb-1">Total Users</p>
    <p className="text-4xl font-extrabold tracking-wider text-green-500">{students.length}</p>
  </div>
</div>

{/* Pending Complaints */}
<div
  className="relative w-72 h-48 rounded-2xl bg-white border border-t-4 border-red-500 shadow-lg overflow-hidden group hover:scale-105 transition-transform duration-500 cursor-pointer"
>
  
  <div className="absolute inset-0 bg-gradient-to-br from-red-100 via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-all duration-500 blur-xl pointer-events-none"></div>


  <div className="absolute top-4 left-4 text-red-500 text-3xl">
    <GiLetterBomb size="28px" />
  </div>

 
  <div className="z-10 relative p-6 text-gray-800 flex flex-col justify-end h-full">
    <h1 className="text-2xl font-semibold tracking-wide">Complaints</h1>
    <p className="text-sm text-gray-500 mb-1">Pending Complaints</p>
    <p className="text-4xl font-extrabold tracking-wider text-red-500">{pendingComplaints.length}</p>
  </div>
</div>

{/* New Announcements */}
<div
  className="relative w-72 h-48 rounded-2xl bg-white border border-t-4 border-blue-500 shadow-lg overflow-hidden group hover:scale-105 transition-transform duration-500 cursor-pointer"
>
  
  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-all duration-500 blur-xl pointer-events-none"></div>


  <div className="absolute top-4 left-4 text-blue-500 text-3xl">
    <TfiAnnouncement size="28px" />
  </div>

 
  <div className="z-10 relative p-6 text-gray-800 flex flex-col justify-end h-full">
    <h1 className="text-2xl font-semibold tracking-wide">Announcements</h1>
    <p className="text-sm text-gray-500 mb-1">New Announcements</p>
    <p className="text-4xl font-extrabold tracking-wider text-blue-500">{announcements.length}</p>
  </div>
</div>

      </div>

    

    {/* Pending Complaints Section */}
<div className="mt-8">
  <h2 className="text-lg text-gray-800 font-bold mb-4">Pending Complaints</h2>
  <div className="bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-4 transition-shadow duration-300">
    {pendingComplaints.length === 0 ? (
      <p className="text-center text-gray-500 dark:text-gray-400">No pending complaints</p>
    ) : (
      <ul>
        {pendingComplaints.map((complaint) => (
          <li
            key={complaint._id}
            className="py-3 px-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start last:border-b-0"
          >
            <p className="text-sm text-gray-800 dark:text-gray-200">
              <strong>Complaint:</strong> {complaint.complaintText}
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {new Date(complaint.date).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>

     {/* Recent Announcements Section */}
<div className="mt-8">
  <h2 className="text-lg text-gray-800 font-bold mb-4">Recent Announcements</h2>
  <div className="bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-4 transition-shadow duration-300">
    {announcements.length === 0 ? (
      <p className="text-center text-gray-500 dark:text-gray-400">No new announcements</p>
    ) : (
      <ul>
        {announcements.map((announcement) => (
          <li
            key={announcement._id}
            className="py-3 px-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
          >
            <p className="text-sm text-gray-800 dark:text-gray-200">
              <strong>Announcement:</strong> {announcement.title}
            </p>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>
    </div>
  );
}

export default AdminDashboard;