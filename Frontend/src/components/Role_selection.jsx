import React, { useState } from 'react';
import { RiAdminLine } from 'react-icons/ri';
import { IoPersonOutline } from 'react-icons/io5';
import { PiStudentLight } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

function Role_selection() {
  const navigate = useNavigate();
  const roles = [
    {
      icon: <RiAdminLine size="50px" color="#240046" />,
      role: "Admin",
      description: "Oversee all operations",
    },
    {
      icon: <IoPersonOutline size="50px" color="#240046" />,
      role: "Warden",
      description: "Supervise hostel activities",
    },
    {
      icon: <PiStudentLight size="50px" color="#240046" />,
      role: "Student",
      description: "Access personal details",
    },
  ];

  const [selectedRole, setSelectedRole] = useState(roles[0]);

  const handleChange = (e) => {
    const role = roles.find(r => r.role === e.target.value);
    setSelectedRole(role);
  };

  const handleSelectRole = () => {
    navigate(`/login?role=${selectedRole.role.toLowerCase()}`);
  };

  return (
    <div className='w-full h-screen flex flex-col relative bg-[#EBEFFF]'>
     
      <div className='pointer-events-none w-full h-full absolute top-0'>
        <img
          className='w-full h-full object-cover'
          src="/role_selection/39535853_1929872993736078_4675401329982570496_n.jpg"
          alt=""
        />
      </div>

     
      <div className='z-10 w-full gap-5 flex items-center justify-center h-1/4'>
        <div className='w-46 h-16'>
          <img
            className='w-full object-cover h-full'
            src="https://pcte.edu.in/wp-content/uploads/2024/02/PCTE-removebg-preview.png"
            alt=""
          />
        </div>
        <div className='w-42 h-20'>
          <img
            className='w-full h-full object-cover'
            src="/role_selection/hostel.jpg"
            alt=""
          />
        </div>
      </div>

  
      <div className='  z-10 w-full h-3/4 flex justify-center items-center p-4'>
        <div className="w-80 h-64  border-t-4 border-green-500  bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:scale-105">
        
          <select
            value={selectedRole.role}
            onChange={handleChange}
            className="mb-4 px-3 py-2 rounded-md bg-white/80 text-[#240046] font-semibold focus:outline-none"
          >
            {roles.map((role, index) => (
              <option key={index} value={role.role}>{role.role}</option>
            ))}
          </select>


          <div className="flex flex-col items-center">
            <div className="text-3xl text-white">{selectedRole.icon}</div>
            <h1 className="mt-2 text-lg font-bold text-white">{selectedRole.role}</h1>
          </div>

          <div className="flex flex-col items-center text-center">
            <p className="text-sm text-gray-200 mb-3 px-2">{selectedRole.description}</p>
            <button
              className="px-6 py-1 bg-[#240046] rounded-full text-white font-semibold text-sm hover:bg-[#930014] transition"
              onClick={handleSelectRole}
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Role_selection;
