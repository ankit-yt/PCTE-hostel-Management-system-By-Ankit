import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import loadingAnim from "../../../assets/Animation - 1744743770853.json";
import loadingAnim2 from "../../../assets/Animation - 1744744956876.json";
function Hostel_rooms({ isDarkTheme }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleted, setIsDeleted] = useState(true);
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    capacity: "",
    hostel: "",
  });
  const [editRoom, setEditRoom] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newStudent, setNewStudent] = useState({ rollNumber: "", name: "" });
  const [transfer, setTransfer] = useState(false);
  const [transferData, setTransferData] = useState({
    studentId: "",
    roomId: "",
  });
  const [availableRooms, setAvailableRooms] = useState([]);
  const [boysHostel, setBoysHostel] = useState([]);
  const [girlsHostel, setGirlsHostel] = useState([]);
  const [isBoysCardOpen, setIsBoysCardOpen] = useState(false);
  const [isGirlsCardOpen, setIsGirlsCardOpen] = useState(false);
  const [activeCard, setActiveCard] = useState([]);
  const [isAddingNewRoom , setIsAddingNewRoom] = useState(false)

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/rooms`);
      setRooms(response.data);
      console.log(response.data);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

 

  

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleNewRoomChange = (e) => {
    const { name, value } = e.target;
    setNewRoom({
      ...newRoom,
      [name]: value,
    });
  };

  const handlTranfer = async (e) => {
    e.preventDefault();
    console.log(transferData.roomId);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/rooms/UpdateStuRoom/${transferData.roomId}/student/${transferData.studentId}`
      );

      if (response.status === 200) {
        setTransfer(false);
        setTransferData({ roomId: "", studentId: "", studentName: "" });
        setAvailableRooms([]);
        fetchRooms();
      }
    } catch (err) {
      setError("Error transferring student on Frontend: " + err.message);
    }
  };

  const handleTransferButton = async (roomId, studentId, studentName) => {
    console.log(`studentId: ${studentId}`);
    setTransferData({ studentId: studentId });

    console.log(transferData);
    setTransfer(true);
    const response = await axios.get(
      `http://localhost:5000/api/rooms/availableRoom`
    );
    setAvailableRooms(response.data);
    console.log(availableRooms);

    console.log(`THis is transfer Data: ${transferData.studentId}`);
  };

  const handleBoysCard = () => {
    setIsBoysCardOpen(!isBoysCardOpen);
  };
  const handleGirlsCard= () => {
    setIsGirlsCardOpen(!isGirlsCardOpen);
  };

  const handleAddRoomBtn = (gender)=>{
    setIsAddingNewRoom(!isAddingNewRoom)

     setNewRoom({
      ...newRoom,
      ["hostel"]: isBoysCardOpen ? "Boys hostel" : "Girls hostel",
    });
    
  }

  const addNewRoom = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/rooms`,
        newRoom
      );
      setRooms([...rooms, response.data]);
      setNewRoom({ roomNumber: "", capacity: "", hostel: "" });
      setTimeout( async () => {
        const newresponse = await axios.get(`http://localhost:5000/api/rooms`);
        setRooms(newresponse.data);
        setIsAddingNewRoom(false)
        setLoading(false)

      },2000)
    } catch (err) {
      setError(err.message);
    }
  };

  

  const editExistingRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/rooms/${editRoom._id}`,
        {
          roomNumber: editRoom.roomNumber,
          capacity: editRoom.capacity,
          hostel: editRoom.hostel,
        }
      );
      setRooms(
        rooms.map((room) => (room._id === editRoom._id ? response.data : room))
      );
      setEditRoom(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteRoom = async (roomId) => {
    setLoading(true)
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${roomId}`);
      setRooms(rooms.filter((room) => room._id !== roomId));
      setTimeout( async () => {
        const newresponse = await axios.get(`http://localhost:5000/api/rooms`);
        setRooms(newresponse.data);
        setIsAddingNewRoom(false)
       
      
      },2000)
    } catch (err) {
      setIsDeleted(!isDeleted);

    } finally {
      setLoading(false)
    }
  };

   useEffect(() => {
      console.log("Updated roles and active card");
    
      const boys = rooms.filter((room) => room.hostel === "Boys hostel");
    const girls = rooms.filter((room) => room.hostel === "Girls hostel");
    console.log(boys);
    console.log(girls);
    setBoysHostel(boys);
    setGirlsHostel(girls);
    
     if (isBoysCardOpen) {
       setActiveCard(boysHostel)
     }
     else if (isGirlsCardOpen) {
       setActiveCard(girlsHostel)
     }
    }, [isBoysCardOpen , isGirlsCardOpen , rooms]);
    

  // const transfer = async (roomId, studentId) => {
  //     try {
  //         const response = await axios.put(`http://localhost:5000/api/UpdateStuRoom/${roomId}/student/${studentId}`);

  //     }
  //     catch (err) {
  //         setError(err.message);
  //     }
  //  }

  const handleViewStudent = async (roomId) => {
    console.log("hellllllllllllo")
    
    if (selectedRoom === roomId) {
      setSelectedRoom(null);
      setStudents([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/StudentAccToRoom/${roomId}`
      );
      setStudents(response.data);
      console.log(response.data);
      setSelectedRoom(roomId);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteStudent = async (roomId, studentId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/rooms/${roomId}/students/${studentId}`
      );
      setStudents(students.filter((student) => student._id !== studentId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNewStudentChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({
      ...newStudent,
      [name]: value,
    });
  };

  const addNewStudent = async (e) => {
    e.preventDefault();
    if (selectedRoom) {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/rooms/${selectedRoom}/students`,
          newStudent
        );
        setStudents([
          ...students,
          response.data.students[response.data.students.length - 1],
        ]);
        setNewStudent({ rollNumber: "", name: "" });
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const hostels = [
    {
      type: 'Boys Hostel',
      total: boysHostel.length,
      icon: '👦',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-700',
      textColor: 'text-blue-900',
      accentColor: 'text-blue-600',
      labelColor: 'text-blue-500',
      glowFrom: 'from-blue-100/30',
      glowTo: 'to-blue-200/40',
      onClick: handleBoysCard,
      bgImage: '', 
      bcolor:"blue-500"
    },
    {
      type: 'Girls Hostel',
      total: girlsHostel.length,
      icon: '👧',
      borderColor: 'border-pink-200',
      iconColor: 'text-pink-700',
      textColor: 'text-pink-900',
      accentColor: 'text-pink-600',
      labelColor: 'text-pink-500',
      glowFrom: 'from-pink-100/30',
      glowTo: 'to-pink-200/40',
      onClick: handleGirlsCard,
      bgImage: 'url("/images/hostel-bg.jpg")',
      bcolor:"red-600"
    },
  ];
  



  return (
    <motion.div
   
  
      className={`p-6 h-screen relative overflow-auto bg-[#f4f6f8] `}>


    {(loading && isDeleted) && (
      <div className="w-full h-screen top-1/2 left-1/2 backdrop-blur-sm bg-black/10 flex justify-center items-center -translate-x-[50%] z-50 -translate-y-[50%] absolute">
        <div className="w-44 h-44">
          <Lottie animationData={loadingAnim2} loop />
        </div>
      </div>
      )}
     
 

      {/* <div className="w-full h-screen absolute top-0 left-0 bg-red-500 z-50">

      </div> */}
      <div className=" w-full h-full flex justify-center ">
      <div className="flex gap-6 mt-40">
  {hostels.map((hostel, index) => (
    <motion.div
      key={index}
      
      className={`relative w-72 h-48 border-t-4 border-${hostel.bcolor} rounded-2xl ${hostel.borderColor} shadow-xl overflow-hidden group hover:scale-105 transition-transform duration-500`}
      onClick={hostel.onClick}
      style={
        hostel.bgImage
          ? {
              backgroundImage: hostel.bgImage,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
      }
    >
    
      <div
        className={`absolute inset-0  bg-gradient-to-br ${hostel.glowFrom} via-transparent ${hostel.glowTo} opacity-50 group-hover:opacity-70 transition-all duration-500 blur-xl pointer-events-none`}
      ></div>

     
      <div className="absolute inset-0 bg-white/80 group-hover:bg-white/60 transition-all duration-500 backdrop-blur-sm"></div>

      
      <div className={`absolute top-4 left-4 ${hostel.iconColor} text-3xl z-10`}>
        {hostel.icon}
      </div>

     
      <div
        className={`z-10 relative p-6 ${hostel.textColor} flex flex-col justify-end h-full`}
      >
        <h1 className="text-2xl font-semibold tracking-wide">
          {hostel.type}
        </h1>
        <p className={`text-sm ${hostel.labelColor} mb-1`}>Total Rooms</p>
        <p className={`text-4xl font-extrabold tracking-wider ${hostel.accentColor}`}>
          {hostel.total}
        </p>
      </div>
    </motion.div>
  ))}
</div>

        {(isBoysCardOpen || isGirlsCardOpen) && (
          <div>
            <div className="absolute inset-0 z-30 bg-[#f4f6f8] dark:bg-[#1f2937] p-8 overflow-y-auto">
              <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
                <div className="flex items-center justify-between px-6 pt-6 border-b dark:border-gray-700">
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {isBoysCardOpen
                      ? "👨‍🎓 Boys Hoste Rooms List"
                      : "👮 Girls Hostel Rooms List"}
                  </h1>
                  <div className="flex gap-5">
                  <button
                    onClick={() => {
                     handleAddRoomBtn(isBoysCardOpen ? "boys" : "girls")
                    }}
                    className="text-green-500 font-semibold hover:underline"
                  >
                    Add Room
                  </button>
                  <button
                    onClick={() => {
                      if (isBoysCardOpen) {
                        setIsBoysCardOpen(false);
                      }
                      if (isGirlsCardOpen) {
                        setIsGirlsCardOpen(false);
                      }
                    }}
                    className="text-red-500 font-semibold hover:underline"
                  >
                    Close
                  </button>
                 </div>
                </div>

                <div className="overflow-x-auto p-6">
                  <table className="min-w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 text-left text-sm uppercase tracking-wider">
                        <th className="py-3 px-6">Room Number</th>
                        
                        <th className="py-3 px-6">Capacity</th>
                        <th className="py-3 px-6">Occupied</th>

                        <th className="py-3 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700 dark:text-gray-300">
  {activeCard.map((user, index) => (
    <React.Fragment key={user._id}>
      <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
        <td className="py-4 px-6">{user.roomNumber}</td>
        <td className="py-4 px-6">{user.capacity}</td>
        <td className="py-4 px-6">{user.occupied}</td>
        <td className="py-4 px-6 text-center">
          <button
            onClick={() => handleViewStudent(user._id)}
            className={` ${user.occupied !== 0 ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 "}  text-white text-xs px-3 py-1 rounded-md mr-2 transition duration-150`}
          >
            View Student
          </button>
          <button
            onClick={() => handleEdit(user)}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-md mr-2 transition duration-150"
          >
            Edit
          </button>
          <button
            onClick={() => deleteRoom(user._id)}
            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-md transition duration-150"
          >
            Delete
          </button>
        </td>
      </tr>

      
      {selectedRoom === user._id && (
  <AnimatePresence>
    <tr>
      <td colSpan="4" className="px-6 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="rounded-2xl backdrop-blur-md bg-white/70 shadow-lg p-6 border border-gray-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Room Overview
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Capacity: {user.capacity} | Occupied: {user.occupied}
              </p>
            </div>
            <div className="mt-3 sm:mt-0">
              <span className="inline-block text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded-full font-medium">
                Room #{user.roomNumber}
              </span>
            </div>
          </div>

          {students.length > 0 ? (
            <ul className="space-y-4">
              {students.map((student, index) => (
                <motion.li
                  key={student._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex justify-between items-center bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
                >
                  <div>
                    <p className="text-base font-semibold text-gray-800">
                      {student.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      🎓 Roll No: {student.rollNumber}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleTransferButton(
                        selectedRoom,
                        student._id,
                        student.username
                      )
                    }
                    className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-green-400 to-blue-500 hover:from-red-500 hover:to-pink-500 transition-all duration-300 rounded-md shadow-sm"
                  >
                    Transfer
                  </button>
                </motion.li>
              ))}
            </ul>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 text-sm mt-6"
            >
              No students assigned yet.
            </motion.p>
          )}
        </motion.div>
      </td>
    </tr>
  </AnimatePresence>
)}

    </React.Fragment>
  ))}
               
{!isDeleted && (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
<div className="bg-white dark:bg-gray-900 w-[90%] max-w-md rounded-2xl shadow-xl p-6 text-center border border-red-400">
<div className="mb-4">
<svg
  className="w-12 h-12 text-red-500 mx-auto"
  fill="none"
  stroke="currentColor"
  strokeWidth="1.5"
  viewBox="0 0 24 24"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  />
</svg>
</div>
<h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
Cannot Delete Room
</h2>
<p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
This room is currently occupied by one or more students. Please reassign or remove the students before deleting.
</p>
<button
onClick={() => setIsDeleted(!isDeleted)}
className="mt-6 inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg shadow-md transition duration-200"
>
Okay
</button>
</div>
</div>
)}

</tbody>

                      
                    
                  </table>
                </div>
              </div>
            </div>

            
            
          </div>
          
        )}


      </div>
      {isAddingNewRoom && (
        <div className=" inset-0 z-50 flex items-center justify-center absolute backdrop-blur-sm bg-black/30">
           {loading && (
            <div className="w-full h-screen top-1/2 left-1/2 backdrop-blur-sm bg-black/10 flex justify-center items-center  -translate-x-[50%] z-50 -translate-y-[50%]  absolute">
               <div className=" w-44 h-44    ">
          <Lottie animationData={loadingAnim} loop />
        </div>
            </div>
      )}
    <form
      onSubmit={addNewRoom}
      className="bg-white w-full h-56 max-w-lg rounded-2xl p-6 shadow-xl animate-scaleIn border border-gray-200"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-8 text-center">
        🏠 Add New Room
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="roomNumber"
          placeholder="Room Number"
          value={newRoom.roomNumber}
          onChange={handleNewRoomChange}
          required
          className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={newRoom.capacity}
          onChange={handleNewRoomChange}
          required
          className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="hostel"
          placeholder="Hostel Name"
          value={isBoysCardOpen ? "Boys Hostel" : "Girls Hostel"}
          
          required
          className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-center mt-6">
        <button
          type="submit"
          className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700 transition shadow-sm"
        >
          ➕ Add Room
        </button> 
            </div>
            <button
        type="button"
        onClick={() => setIsAddingNewRoom(false)}
        className="absolute top-4 right-5 text-black text-2xl hover:text-red-400 transition"
        aria-label="Close"
      >
        &times;
      </button>
    </form>
  </div>
      )}
      

    </motion.div>
  );
}

export default Hostel_rooms;

// <form
// onSubmit={addNewRoom}
// className={`mb-4 ${theme.card} p-4 rounded shadow-md`}
// >
// <h2
//   className={`text-base ${
//     isDarkTheme ? "text-gray-100 " : "text-black"
//   } font-semibold mb-2`}
// >
//   Add New Room
// </h2>
// <div className="flex space-x-2 mb-2">
//   <input
//     type="text"
//     name="roomNumber"
//     placeholder="Room Number"
//     value={newRoom.roomNumber}
//     onChange={handleNewRoomChange}
//     required
//     className={`${theme.input}`}
//   />
//   <input
//     type="number"
//     name="capacity"
//     placeholder="Capacity"
//     value={newRoom.capacity}
//     onChange={handleNewRoomChange}
//     required
//     className={`${theme.input}`}
//   />
//   <input
//     type="text"
//     name="hostel"
//     placeholder="Hostel Name"
//     value={newRoom.hostel}
//     onChange={handleNewRoomChange}
//     required
//     className={`${theme.input}`}
//   />
//   <button type="submit" className={`${theme.button}`}>
//     Add Room
//   </button>
// </div>
//   </form>
//  {/* Room Not Deleted Acknowledgment Modal */}
// {!isDeleted && (
// <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
// <div className="bg-white dark:bg-gray-900 w-[90%] max-w-md rounded-2xl shadow-xl p-6 text-center border border-red-400">
// <div className="mb-4">
// <svg
//   className="w-12 h-12 text-red-500 mx-auto"
//   fill="none"
//   stroke="currentColor"
//   strokeWidth="1.5"
//   viewBox="0 0 24 24"
// >
//   <path
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//   />
// </svg>
// </div>
// <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
// Cannot Delete Room
// </h2>
// <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
// This room is currently occupied by one or more students. Please reassign or remove the students before deleting.
// </p>
// <button
// onClick={() => setIsDeleted(!isDeleted)}
// className="mt-6 inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg shadow-md transition duration-200"
// >
// Okay
// </button>
// </div>
// </div>
// )}

// {/* transfer form*/}
// {transfer && (
// <div
//   className={`${darkThemeStyles.card} w-2/5 h-2/4 absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6`}
// >
//   <form onSubmit={handlTranfer}>
//     <h2 className="text-center text-2xl font-semibold mb-6">
//       {transferData.studentName} Room Transfer
//     </h2>

//     <div className="mb-6">
//       <label className="block mb-2 text-sm font-medium text-white">
//         Available Rooms
//       </label>
//       <select
//         name="roomId"
//         value={transferData.roomId}
//         onChange={(e) =>
//           setTransferData({ ...transferData, roomId: e.target.value })
//         }
//         className={`${darkThemeStyles.input2}`}
//         required
//       >
//         <option value="">-- Select a Room --</option>
//         {availableRooms.map((room) => (
//           <option key={room._id} value={room._id}>
//             {room.hostel} - Room {room.roomNumber}
//           </option>
//         ))}
//       </select>
//     </div>

//     <div className="flex justify-center">
//       <button type="submit" className={darkThemeStyles.button}>
//         Confirm Transfer
//       </button>
//     </div>
//   </form>
// </div>
// )}

// {/* Edit Room Form */}
// {editRoom && (
// <form
//   onSubmit={editExistingRoom}
//   className={`mb-4 ${theme.card} p-4 rounded shadow-md`}
// >
//   <h2
//     className={`text-base ${
//       isDarkTheme ? "text-gray-100 " : "text-black"
//     } font-semibold mb-2`}
//   >
//     Edit Room
//   </h2>
//   <div className="flex space-x-2 mb-2">
//     <input
//       type="text"
//       name="roomNumber"
//       placeholder="Room Number"
//       value={editRoom.roomNumber}
//       onChange={(e) =>
//         setEditRoom({ ...editRoom, roomNumber: e.target.value })
//       }
//       required
//       className={`${theme.input}`}
//     />
//     <input
//       type="number"
//       name="capacity"
//       placeholder="Capacity"
//       value={editRoom.capacity}
//       onChange={(e) =>
//         setEditRoom({ ...editRoom, capacity: e.target.value })
//       }
//       required
//       className={`${theme.input}`}
//     />
//     <input
//       type="text"
//       name="hostel"
//       placeholder="Hostel Name"
//       value={editRoom.hostel}
//       onChange={(e) =>
//         setEditRoom({ ...editRoom, hostel: e.target.value })
//       }
//       required
//       className={`${theme.input}`}
//     />
//     <button type="submit" className={`${theme.button} `}>
//       Save Changes
//     </button>
//   </div>
// </form>
// )}

// {loading ? (
// <p className="text-gray-500 text-center">Loading...</p>
// ) : error ? (
// <p className="text-red-500 text-center">{error}</p>
// ) : (
// <div className="">
//   <table
//     className={`min-w-full overflow-hidden  ${theme.card} shadow-md rounded-lg`}
//   >
//     <thead>
//       <tr className="bg-gray-200 text-black">
//         <th className="py-3 px-6">Room Number</th>
//         <th className="py-3 px-6">Hostel</th>
//         <th className="py-3 px-6">Capacity</th>
//         <th className="py-3 px-6">Occupied</th>
//         <th className="py-3 px-6">Actions</th>
//       </tr>
//     </thead>
//     <tbody>
//       {rooms.map((room) => (
//         <motion.tr
//           key={room._id}
//           whileHover={{
//             backgroundColor: "rgba(255, 255, 255, 0.1)", // Slight background color change on hover
//             transition: { duration: 0.3 }, // Smooth transition with a duration of 0.3s
//           }}
//           style={{ transition: "background-color 0.1s ease" }}
//         >
//           <td className="py-2 px-4  text-center">{room.roomNumber}</td>
//           <td className="py-2 px-4  text-center">{room.hostel}</td>
//           <td className="py-2 px-4  text-center">{room.capacity}</td>
//           <td className="py-2 px-4  text-center">{room.occupied}</td>
//           <td className="py-2  gap-4 justify-center flex space-x-2">
//             <button
//               onClick={() => fetchStudents(room._id)}
//               className={`${
//                 room.occupied === 0
//                   ? "text-gray-500 pointer-events-none"
//                   : "text-blue-400"
//               } hover:underline`}
//             >
//               View Students
//             </button>
//             <button
//               onClick={() => setEditRoom(room)}
//               className="text-yellow-500 hover:underline"
//             >
//               Edit
//             </button>
//             <button
//               onClick={() => deleteRoom(room._id)}
//               className="text-red-500 hover:underline"
//             >
//               Delete
//             </button>
//           </td>
//         </motion.tr>
//       ))}
//     </tbody>
//   </table>
// </div>
// )}

// {selectedRoom && (
// <div className={`mt-4 ${theme.card}  p-6 rounded-xl shadow-lg`}>
//   <h2 className="text-2xl font-bold mb-4 text-center tracking-wider">
//     Students in Room:{" "}
//     <span className="text-blue-500">
//       {rooms.find((room) => room._id === selectedRoom)?.roomNumber}
//     </span>
//   </h2>

//   {/* Students List */}
//   <div className={`${theme.card} p-5`}>
//     <h3 className="text-lg font-semibold mb-3 border-b border-gray-600 pb-2">
//       Students List
//     </h3>
//     {students.length > 0 ? (
//       <ul className="">
//         {students.map((student) => (
//           <li
//             key={student._id}
//             className="flex justify-between py-2 items-center"
//           >
//             <div className="flex flex-col">
//               <span className="font-semibold">{student.username}</span>
//               <span className="text-sm text-gray-400">
//                 Roll No: {student.rollNumber}
//               </span>
//             </div>
//             <button
//               onClick={() =>
//                 handleTransferButton(
//                   selectedRoom,
//                   student._id,
//                   student.username
//                 )
//               }
//               className="text-green-500 font-medium hover:underline hover:text-red-400 transition"
//             >
//               Transfer
//             </button>
//           </li>
//         ))}
//       </ul>
//     ) : (
//       <p className="text-gray-400 text-center">
//         No students in this room.
//       </p>
//     )}
//   </div>
// </div>
// )}
