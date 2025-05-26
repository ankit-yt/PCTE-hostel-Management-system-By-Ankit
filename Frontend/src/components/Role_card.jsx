// Role_card.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Role_card({ item }) {
  const navigate = useNavigate();

  const handleSelectRole = () => {
    navigate(`/login?role=${item.role.toLowerCase()}`); // Ensure URL uses lowercase for roles
  };

  return (
    <div className="w-80  border-t-4 border-red-700 h-56 bg-white/20 relative backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:shadow-2xl">
  {/* Top Section - Icon + Role */}
  <div className="flex flex-col items-center">
    <div className="text-3xl text-white">{item.icon}</div>
    <h1 className="mt-2 text-lg font-bold text-white">{item.role}</h1>
  </div>

  {/* Bottom Section - Description + Button */}
  <div className="flex flex-col items-center text-center">
    <p className="text-sm text-gray-200 mb-3 px-2">{item.description}</p>
    <button
      className="px-6 py-1 bg-[#241553] rounded-full text-white font-semibold text-sm hover:bg-[#37206d] transition"
      onClick={handleSelectRole}
    >
      Select
    </button>
  </div>
</div>

  );
}

export default Role_card;