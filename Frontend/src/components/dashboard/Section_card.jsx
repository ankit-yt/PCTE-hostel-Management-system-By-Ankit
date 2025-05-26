import React from "react";

function Section_card({ admin_sec, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all 
        ${isActive ? "bg-[#d6cece] text-black shadow-sm" : "hover:bg-red-700  text-gray-100"}
      `}
    >
      {admin_sec.icon}
      <h1 className="text-sm font-medium">{admin_sec.sec_name}</h1>
    </div>
  );
}

export default Section_card;
