import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CredentialUpdate from "../../CredentialUpdate";

function User_sec({ isDarkTheme }) {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hostel, setHostel] = useState("");
  const [error, setError] = useState(null);
  const [isStudnetCardOpen, setIsStudentCardOpen] = useState(false);
  const [isWardenCardOpen, setIsWardenCardOpen] = useState(false);
  const [isAdminCardOpen, setIsAdminCardOpen] = useState(false);
  const [isRightBarOpen, setIsRightBarOpen] = useState(false);
  const [studentData, setStudentData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [dataForEdit, setDataForEdit] = useState(null);
    const [activeCard, setActiveCard] = useState([]);
    const [students, setStudent] = useState([])
    const [warden, setWarden] = useState([])
    const [admin, setAdmin] = useState([])
    

  const navigate = useNavigate(); 

    const fetchUsers = async () => {
        try {
          console.log("fetchUsers called")
        const response = await axios.get(`https://pcte-hostel-management-system-by-ankit.onrender.com/api/users`);
            
            setUsers(response.data);
            
            
      } catch (err) {
        setError(err.message);
      }
    };
    
  useEffect(() => {
    fetchUsers();
  }, []);
    
  

  const CloseUpdateForm = () => {
    setIsEditing(false);
    setDataForEdit(null);
    };
    
    const closeUpdateFromOnSubmit = () => {
        
        
        setTimeout(() => {
            fetchUsers();
          }, 2000);
        
    }

    const finalClosureOfUpdateForm = () => { 
        setIsEditing(false);
        setDataForEdit(null);
    }

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`https://pcte-hostel-management-system-by-ankit.onrender.com/api/users/${userId}`);
        setUsers((prev) => prev.filter((user) => user._id !== userId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleWardenCard = () => {
    setIsWardenCardOpen(!isWardenCardOpen);
  };

  const handleRegisterNewUser = () => {
    navigate("/register");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleHostelChange = (e) => {
    setHostel(e.target.value);
  };

  const showSelectStuData = (
    username,
    rollNumber,
    hostel,
    roomNumber,
    imageData,
    age,
    email,
    phone
  ) => {
    
    setStudentData({
      username,
      rollNumber,
      hostel,
      roomNumber,
      imageData,
      age,
      email,
      phone,
    });
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setDataForEdit(user);
    };
    
  const handleStudentCard = () => {
    setIsStudentCardOpen(!isStudnetCardOpen);
  };

  const handleAdminCard = () => {
    setIsAdminCardOpen(!isAdminCardOpen);
  };

  useEffect(() => {
    console.log("Updated roles and active card");
  
    const studentUsers = users.filter((user) => user.role === "student");
    const wardenUsers = users.filter((user) => user.role === "warden");
    const adminUsers = users.filter((user) => user.role === "admin");
  
    setStudent(studentUsers);
    setWarden(wardenUsers);
    setAdmin(adminUsers);
  
    if (isStudnetCardOpen) {
      setActiveCard(studentUsers);
    } else if (isWardenCardOpen) {
      setActiveCard(wardenUsers);
    } else if (isAdminCardOpen) {
      setActiveCard(adminUsers);
    }
  }, [isStudnetCardOpen, isWardenCardOpen, isAdminCardOpen, users]);
  
  

  const InfoRow = ({ icon, label, value }) => (
    <div className="flex justify-between items-center px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white shadow-inner border border-white/10">
      <span className="text-sm font-medium flex text-gray-900 items-center gap-2">
        <span>{icon}</span> {label}
      </span>
      <span className="text-sm font-semibold text-gray-900">
        {value || "N/A"}
      </span>
    </div>
  );

  // const filteredUsers = users
  // .filter(user => {
  //   if (!searchQuery) return true; // if hostel input is empty, don't filter by it
  //   return user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase());
  // })
  // .filter(user => {
  //   if (!hostel) return true; // if rollNumber input is empty, don't filter by it
  //   return user.hostel && user.hostel.toLowerCase().includes(hostel.toLowerCase());
  // });


  return (
    <div
      className={`w-full h-full p-6 bg-[#f4f6f8] overflow-y-auto flex flex-col items-center justify-center`}
    >
      <div className="w-full min-h-[20vh] flex justify-center mb-40 items-center gap-10  flex-wrap">
        {/* Light Theme Card */}
<div className="relative w-72 h-48 rounded-2xl border-t-4 border-blue-500 bg-white border shadow-lg overflow-hidden group hover:scale-105 transition-transform duration-500">
 
  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-all duration-500 blur-xl pointer-events-none"></div>

  
  <div className="absolute top-4 left-4 text-gray-600 text-3xl">🎓</div>

  
  <div
    onClick={handleStudentCard}
    className="z-10 relative p-6 text-gray-800 flex flex-col justify-end h-full"
  >
    <h1 className="text-2xl font-semibold tracking-wide">Students</h1>
    <p className="text-sm text-gray-500 mb-1">Total Students</p>
    <p className="text-4xl font-extrabold tracking-wider text-blue-500">
      {students.length}
    </p>
  </div>
</div>


        {(isStudnetCardOpen || isWardenCardOpen || isAdminCardOpen) && (
          <div>
            <div className="absolute inset-0 z-30 bg-[#f4f6f8] dark:bg-[#1f2937] p-8 overflow-y-auto">
              <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
                <div className="flex items-center justify-between px-6 pt-6 border-b dark:border-gray-700">
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {isStudnetCardOpen
                      ? "👨‍🎓 Student List"
                      : isWardenCardOpen
                      ? "👮 Wardens List"
                      : "👨🏻‍💻 Admins List"}
                  </h1>
                  <button
                    onClick={() => {
                      if (isStudnetCardOpen) {
                        setIsStudentCardOpen(false);
                      }
                      if (isWardenCardOpen) {
                        setIsWardenCardOpen(false);
                      }
                      if (isAdminCardOpen) {
                        setIsAdminCardOpen(false);
                      }
                    }}
                    className="text-red-500 font-semibold hover:underline"
                  >
                    Close
                  </button>
                </div>

                <div className="overflow-x-auto p-6">
                  <table className="min-w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 text-left text-sm uppercase tracking-wider">
                        <th className="py-3 px-6">Username</th>
                        {isStudnetCardOpen && (
                          <>
                            <th className="py-3 px-6">Roll Number</th>
                            <th className="py-3 px-6">Hostel</th>
                            <th className="py-3 px-6">Room Number</th>
                          </>
                        )}

                        <th className="py-3 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700 dark:text-gray-300">
                      {activeCard.map((user, index) => (
                        <tr
                          onClick={() =>
                            showSelectStuData(
                              user.username,
                              user.rollNumber,
                              user.hostel,
                              user.roomNumber,
                              user.imageData,
                              user.age,
                              user.email,
                              user.phone
                            )
                          }
                          key={user._id}
                          className={`border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition`}
                        >
                          <td onClick={()=>setIsRightBarOpen(true)} className="py-4 px-6">{user.username}</td>
                          {isStudnetCardOpen && (
                            <>
                              <td onClick={()=>setIsRightBarOpen(true)} className="py-4 px-6">
                                {user.rollNumber || "N/A"}
                              </td>
                              <td onClick={()=>setIsRightBarOpen(true)} className="py-4 px-6">
                                {user.hostel || "N/A"}
                              </td>
                              <td onClick={()=>setIsRightBarOpen(true)} className="py-4 px-6">
                                {user.roomNumber || "N/A"}
                              </td>
                            </>
                          )}

                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => handleEdit(user)}
                              className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-md mr-2 transition duration-150"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-md transition duration-150"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {isRightBarOpen && (
              <div className="fixed top-0 right-0 z-50 h-screen w-[340px] p-5 bg-white/10 backdrop-blur-lg border-l border-white/20 shadow-2xl rounded-l-3xl flex flex-col items-center transition-all duration-500 ease-in-out">
                
                <button
                  onClick={() => setIsRightBarOpen(false)}
                  className="absolute top-5 right-5 text-black text-xl hover:text-red-400"
                >
                  ✕
                </button>

                {/* Profile Section */}
                <div className="mt-12 flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full p-[3px] bg-gradient-to-tr from-purple-500 via-blue-500 to-cyan-400 shadow-[0_0_30px_rgba(0,255,255,0.4)]">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-900">
                      <img
                        src={studentData.imageData}
                        alt="Profile"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>

                  <h2 className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 drop-shadow-[0_2px_4px_rgba(0,255,255,0.4)] shadow-blue-400">
                    {studentData.username}
                  </h2>

                  <p className="text-sm text-gray-300">{studentData.role}</p>
                </div>

             
                <div className="mt-8 w-full space-y-4">
                  {isStudnetCardOpen && (
                    <>
                      <InfoRow
                        icon="🎓"
                        label="Roll Number"
                        value={studentData.rollNumber}
                      />
                      <InfoRow
                        icon="🏨"
                        label="Hostel"
                        value={studentData.hostel}
                      />
                      <InfoRow
                        icon="🚪"
                        label="Room Number"
                        value={studentData.roomNumber}
                      />
                    </>
                  )}
                  <InfoRow icon="🎂" label="Age" value={studentData.age} />
                  <InfoRow icon="📞" label="Phone" value={studentData.phone} />
                  <InfoRow icon="📧" label="Email" value={studentData.email} />
                </div>

                {/* Action Button */}
                <div className="mt-auto pt-10">
                  <button className="bg-blue-500 text-white px-5 py-2 rounded-xl shadow-md hover:bg-blue-600 transition">
                    View Full Profile{" "}
                    <span className="text-red-600 animate-pulse">(soon)</span>
                  </button>
                </div>
              </div>
            )}
            {isEditing && (
              <div className="w-full h-screen bg-gray-400 absolute left-0 z-50 top-0">
                {
                  <CredentialUpdate
                    userEditData={dataForEdit}
                                      CloseUpdate={CloseUpdateForm}
                                      closeUpdateFormOnSubmit={closeUpdateFromOnSubmit}
                                        finalClosureOfUpdateForm={finalClosureOfUpdateForm}
                                      
                  />
                }
              </div>
            )}
          </div>
        )}

        {/* Warden Card */}
<div
  onClick={handleWardenCard}
  className="relative w-72 h-48 rounded-2xl border-t-4 border-purple-500 bg-white border  shadow-lg overflow-hidden group hover:scale-105 transition-transform duration-500"
>

  <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-all duration-500 blur-xl pointer-events-none"></div>

  
  <div className="absolute top-4 left-4 text-gray-600 text-3xl">🛡️</div>

  
  <div className="z-10 relative p-6 text-gray-800 flex flex-col justify-end h-full">
    <h1 className="text-2xl font-semibold tracking-wide">Wardens</h1>
    <p className="text-sm text-gray-500 mb-1">Total Wardens</p>
    <p className="text-4xl font-extrabold tracking-wider text-purple-500">
      {warden.length}
    </p>
  </div>
</div>

        {/* Admin Card */}
<div
  onClick={handleAdminCard}
  className="relative w-72 h-48 rounded-2xl bg-white border border-t-4 border-cyan-500 shadow-lg overflow-hidden group hover:scale-105 transition-transform duration-500"
>

  <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-all duration-500 blur-xl pointer-events-none"></div>

  
  <div className="absolute top-4 left-4 text-gray-600 text-3xl">👑</div>

  
  <div className="z-10 relative p-6 text-gray-800 flex flex-col justify-end h-full">
    <h1 className="text-2xl font-semibold tracking-wide">Admins</h1>
    <p className="text-sm text-gray-500 mb-1">Total Admins</p>
    <p className="text-4xl font-extrabold tracking-wider text-cyan-500">
      {admin.length}
    </p>
  </div>
</div>

      </div>
      <button
  onClick={handleRegisterNewUser}
  className="
    relative z-10 mt-6
    p-1 rounded-xl
    transition-all duration-300 ease-in-out
    hover:border-green-500
  "
>
  <div
    className="relative
      w-32 h-32
      flex items-center justify-center
      transition-all duration-300 ease-in-out
      rounded-xl
      
      hover:scale-105
    
    "
        >
         
    <img
      src="/register.png"
      alt="Add User Icon"
      className="w-full h-full object-contain"
    />
  </div>
</button>



    </div>
  );
}

export default User_sec;

{
  /* <div className="flex flex-col md:flex-row gap-3 mb-6"> */
}
{
  /* Search Bar */
}
{
  /* <input
                    type="text"
                    placeholder="Search by username or roll number"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className={`${theme.input}`}
                />
                <input
                    type="text"
                    placeholder="Search by username or roll number"
                    value={hostel}
                    onChange={handleHostelChange}
                    className={`${theme.input}`}
                /> */
}
{
  /* Button to navigate to the Register component */
}
{
  /* <button onClick={handleRegisterNewUser} className={`${theme.button} md:mt-0 `}>
                    Register New User
                </button> */
}
{
  /* </div> */
}

{
  /* {error && <p className="text-red-500">{error}</p>} */
}

// <div className="overflow-x-auto">
{
  /* <table className={`min-w-full ${theme.card} text-black shadow-md overflow-hidden rounded-lg`}>
    <thead>
        <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Roll Number</th>
            <th className="py-2 px-4 border-b">Hostel</th>
            <th className="py-2 px-4 border-b">Room Number</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Actions</th>
        </tr>
    </thead>
    <tbody>
        {filteredUsers.map((user) => (
            <tr key={user._id} className={`${isDarkTheme ? "text-gray-100" : "text-black"} text-sm`}>
                <td className="py-2 px-4 text-center">{user.username}</td>
                <td className="py-2 px-4 text-center">{user.rollNumber || 'N/A'}</td>
                <td className="py-2 px-4 text-center">{user.hostel || 'N/A'}</td>
                <td className="py-2 px-4 text-center">{user.roomNumber || 'N/A'}</td>
                <td className="py-2 px-4 text-center">{user.role}</td>
                <td className="py-2 px-4 text-center">
                    <button className="text-blue-500 hover:underline">
                        Edit
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="text-red-500 ml-2 hover:underline">
                        Delete
                    </button>
                </td>
            </tr>
        ))}
    </tbody>
</table> */
}
// </div>
