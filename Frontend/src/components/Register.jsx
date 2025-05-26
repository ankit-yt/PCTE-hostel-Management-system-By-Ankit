import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import loadingAnim from "../assets/lottie/loading.json";
import confetti from "canvas-confetti";
import registerAnim from "../assets/lottie/register.json";
import { useNavigate } from "react-router-dom";

function Register() {
  const [userData, setUserData] = useState({
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
  const navigate = useNavigate();

  const [availableRooms, setAvailableRooms] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      if (userData.hostel) {
        try {
          const response = await axios.get(`https://pcte-hostel-management-system-by-ankit.onrender.com/api/rooms`, {
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
    setLoading(true);
    const formData = new FormData();
    for (const key in userData) {
      formData.append(key, userData[key]);
    }
    try {
      const response = await axios.post(
        `https://pcte-hostel-management-system-by-ankit.onrender.com/api/users/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
      setUserData({
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
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error registering user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6f8] to-[#24243e] relative p-4">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-24 z-10 right-80 text-black text-xl hover:text-red-400"
      >
        ✕
      </button>
      

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="  w-full max-w-5xl bg-white/70 p-10 rounded-2xl backdrop-blur-sm shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-8"
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
            <h2 className="text-3xl font-bold mb-6 text-[#241553]">
              Register New User
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
                <label className="block font-medium mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2 "
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2 "
                  required
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
                  <label className="block font-medium mb-1">Role</label>
                  <select
                    name="role"
                    value={userData.role}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 "
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="warden">Warden</option>
                    <option value="student">Student</option>
                  </select>
                </div>
                {userData.role !== "student" && (
                  <div>
                    <label className="block font-medium mb-1">
                      Profile Pic
                    </label>
                    <input
                      type="file"
                      name="img"
                      onChange={handleFileChange}
                      className="w-full border rounded-lg p-2"
                      required
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2 "
                  required
                />
              </div>

              <div className="flex justify-between">
                <div>
                  <label className="block font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    className="w-60 border rounded-lg p-2 "
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Age</label>
                  <input
                    type="text"
                    name="age"
                    value={userData.age}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2 "
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#241553] text-white py-2 rounded-lg hover:bg-[#1d1240] transition"
              >
                {loading ? (
                  <Lottie animationData={loadingAnim} className="h-10" />
                ) : (
                  "Register"
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
                duration: 0.5, 
                ease: "easeInOut",
                
                exit: {
                  x: 100,
                  opacity: 0,
                  duration: 0.4,
                  ease: "easeInOut",
                },
              }}
              className="space-y-4"
            >
              <h3 className="text-xl mt-2  font-semibold text-[#241553]">
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
                  className="w-full border rounded-lg p-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Hostel</label>
                <input
                  type="text"
                  name="hostel"
                  value={userData.hostel}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Room Number</label>
                <select
                  name="roomNumber"
                  value={userData.roomNumber}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2"
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
                <label className="block font-medium mb-1">Profile Pic</label>
                <input
                  type="file"
                  name="img"
                  onChange={handleFileChange}
                  className="w-full border rounded-lg p-2"
                  required
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Register;
