import React, { useState } from 'react';
import { FaBars, FaUserCircle } from 'react-icons/fa'; // Import the user circle icon

const Header = ({ toggleSidebar, sidebarOpen, profileImage }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div 
      className={`flex items-center justify-between p-4 bg-gray-100 fixed top-0 left-0 z-10 transition-all duration-300`}
      style={{ 
        marginLeft: sidebarOpen ? '256px' : '64px', 
        width: sidebarOpen ? 'calc(100% - 256px)' : 'calc(100% - 64px)', 
        height: '60px' 
      }}
    >
      <div className="flex items-center space-x-4">
        <FaBars className="text-gray-500 cursor-pointer" onClick={toggleSidebar} />
      </div>
      <div className="relative flex items-center space-x-2">
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
            onClick={toggleDropdown}
          />
        ) : (
          <FaUserCircle className="text-gray-500 cursor-pointer text-3xl" onClick={toggleDropdown} />
        )}
        <span className="text-gray-500 cursor-pointer" onClick={toggleDropdown}>&#9660;</span>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-12 w-48 bg-white border rounded shadow-lg z-20">
            <a href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
              View Profile
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
