import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import loadingAnim from "../assets/lottie/loading.json";
import confetti from "canvas-confetti";
import registerAnim from "../assets/lottie/register.json";

function CredentialUpdate({ userEditData, CloseUpdate ,finalClosureOfUpdateForm, closeUpdateFormOnSubmit }) {
	const userRole = userEditData.role;

	const [userData, setUserData] = useState({})
	useEffect(() => {
		const updatedUser = {
		  id: userEditData._id,
		  username: userEditData.username,
		  password: "",
		  role: userEditData.role,
		  email: userEditData.email,
		  phone: userEditData.phone,
		  age: userEditData.age,
		  img: null,
		};
	  
		if (userRole === "student") {
		  updatedUser.rollNumber = userEditData.rollNumber;
		  updatedUser.hostel = userEditData.hostel;
		  updatedUser.roomNumber = userEditData.roomNumber;
		}
	  
		setUserData(updatedUser);
	  }, [userEditData, userRole]);
	

  const [availableRooms, setAvailableRooms] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      if (userData.hostel) {
        try {
          const response = await axios.get(`http://localhost:5000/api/rooms/`, {
            params: { hostel: userData.hostel },
          });
          const filteredRooms = response.data.filter(
            (room) => room.occupied < room.capacity
          );
          const genderFilteredRooms = filteredRooms.filter(
            (room) => room.hostel === userData.hostel
          );
          setAvailableRooms(genderFilteredRooms);
        } catch (err) {
          setMessage("Error fetching rooms");
        }
      } else {
        setAvailableRooms([]);
      }
    };

    fetchRooms();
  }, [userData.hostel]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setUserData({
      ...userData,
      img: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
	  e.preventDefault();
	  closeUpdateFormOnSubmit()
    setLoading(true);
    const formData = new FormData();
    for (const key in userData) {
      formData.append(key, userData[key]);
    }
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
      setUserData({
        id: "",
        username: "",
        password: "",
        role: "student",
        rollNumber: "",
        hostel: "",
        roomNumber: "",
        name: "",
        email: "",
        phone: "",
        age: "",
        img: null,
      });
      setAvailableRooms([]);
     
    } catch (err) {
      setMessage(err.response?.data?.message || "Error registering user");
    } finally {
		setTimeout(() => { 
			setLoading(false);
			finalClosureOfUpdateForm()
			confetti({
				particleCount: 150,
				spread: 70,
				origin: { y: 0.6, x: 0.6 },
			  });
			
    }, 2000)
      
		
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eef2f3] to-[#8e9eab] relative p-4">
      <button
        onClick={() => CloseUpdate()}
        className="absolute top-20 z-10 right-44 text-black text-xl hover:text-red-400"
      >
        ✕
      </button>
      {loading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]   z-10 ">
          <Lottie animationData={registerAnim} loop />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white/90 p-10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md border border-gray-200 grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <AnimatePresence>
          <motion.div
            initial={
              userData.role !== "student"
                ? { x: -100, opacity: 0 }
                : { x: 100, opacity: 0 }
            }
            animate={
              userData.role !== "student"
                ? { x: 250, opacity: 1 }
                : { x: 0, opacity: 1 }
            }
            exit={
              userData.role !== "student"
                ? { x: -100, opacity: 0 }
                : { x: 100, opacity: 0 }
            }
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-[#38d151]">
              Updating {userEditData.username} Credentials
            </h2>
            {message && (
              <p
                className={` ${
                  message === "User created successfully"
                    ? "text-green-700"
                    : "text-red-500"
                } mb-4 font-medium animate-pulse`}
              >
                {message}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium text-black mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleInputChange}
                  className="w-full text-gray-800 border rounded-lg p-2 "
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-black mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  className="w-full text-gray-800 border rounded-lg p-2 "
                />
              </div>

              <div
                className={` ${
                  userData.role !== "student"
                    ? "grid grid-cols-1 lg:grid-cols-2 gap-4"
                    : ""
                } `}
              >
                <div>
                  <label className="block font-medium text-black mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={userData.role}
                    onChange={handleInputChange}
                    className="w-full border text-gray-800 rounded-lg p-2 "
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="warden">Warden</option>
                    <option value="student">Student</option>
                  </select>
                </div>
                {userData.role !== "student" && (
                  <div>
                    <label className="block font-medium text-black mb-1">
                      Profile Pic
                    </label>
                    <input
                      type="file"
                      name="img"
                      onChange={handleFileChange}
                      className="w-full border rounded-lg p-2"
                      
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-medium text-black mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="w-full text-gray-800 border rounded-lg p-2 "
                  required
                />
              </div>

              <div className="flex justify-between">
                <div>
                  <label className="block font-medium text-black mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    className="w-60 border text-gray-800 rounded-lg p-2 "
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-black mb-1">
                    Age
                  </label>
                  <input
                    type="text"
                    name="age"
                    value={userData.age}
                    onChange={handleInputChange}
                    className="w-full border text-gray-800 rounded-lg p-2 "
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#35c94d] text-white py-2 rounded-lg hover:bg-[#1d1240] transition"
              >
                {loading ? (
                  <Lottie animationData={loadingAnim} className="h-10" />
                ) : (
                  "Update"
                )}
              </button>
            </form>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {userData.role === "student" && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: 0.5, // Duration for entry animation
                ease: "easeInOut",
                // Exit transition should also be included in the same transition object
                exit: {
                  x: 100,
                  opacity: 0,
                  duration: 0.4,
                  ease: "easeInOut",
                },
              }}
              className="space-y-4"
            >
              <h3 className="text-xl mt-2  font-semibold text-[#35c94d]">
                Student Details
              </h3>
              <div>
                <label className="inline-block mt-2 font-medium mb-1">
                  Roll Number
                </label>
                <input
                  type="text"
                  name="rollNumber"
                  value={userData.rollNumber}
                  onChange={handleInputChange}
                  className="w-full text-gray-800 border rounded-lg p-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-black mb-1">
                  Hostel
                </label>
                <input
                  type="text"
                  name="hostel"
                  value={userData.hostel}
                  onChange={handleInputChange}
                  className="w-full text-gray-800 border rounded-lg p-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-black mb-1">
                  Room Number
                </label>
                <select
                  name="roomNumber"
                  value={userData.roomNumber}
                  onChange={handleInputChange}
                  className="w-full border text-gray-800 rounded-lg p-2"
                  required
                >
                  <option value="">Select Room</option>
                  {availableRooms.map((room) => (
                    <option key={room._id} value={room.roomNumber}>
                      {room.roomNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-black mb-1">
                  Profile Pic
                </label>
                <input
                  type="file"
                  name="img"
                  onChange={handleFileChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default CredentialUpdate;
