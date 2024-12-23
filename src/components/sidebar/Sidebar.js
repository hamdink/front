import React from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../../images/logo.png';

const Sidebar = React.memo(({ items, openIndexes, toggleDropdown, isOpen, onMouseEnter, onMouseLeave, onLogout }) => {
  return (
    <div 
      className={`flex flex-col bg-gray-100 text-gray-800 shadow-lg transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} h-screen fixed sm:relative z-10`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`flex items-center justify-center mb-6 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        <img src={logo} alt="Logo" className="h-12 w-auto" />
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul>
          {items.map((item, index) => (
            <li key={index} className="mb-2">
              {item.path ? (
                <Link to={item.path} className="block">
                  <div
                    className={`flex items-center justify-between p-2 rounded hover:bg-gray-200 cursor-pointer ${!isOpen && 'justify-center'}`}
                  >
                    <div className="flex items-center w-full">
                      {item.icon && <item.icon className="text-blue-500 h-5 w-5" />}
                      {isOpen && (
                        <div className="flex items-center ml-3">
                          <span className="text-gray-700 text-sm">
                            {item.title}
                          </span>
                          {item.counter !== undefined && (
                            <span className="ml-2 inline-flex items-center justify-center text-xs bg-red-500 text-white rounded-full w-5 h-5">
                              {item.counter}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {item.subItems && isOpen && (
                      <div className="ml-3">
                        {openIndexes[index] ? (
                          <FaChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <FaChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ) : (
                <div
                  className={`flex items-center justify-between p-2 rounded hover:bg-gray-200 cursor-pointer ${!isOpen && 'justify-center'}`}
                  onClick={item.onClick ? item.onClick : () => toggleDropdown(index)}
                >
                  <div className="flex items-center w-full">
                    {item.icon && <item.icon className="text-blue-500 h-5 w-5" />}
                    {isOpen && (
                      <div className="flex items-center ml-3">
                        <span className="text-gray-700 text-sm">
                          {item.title}
                        </span>
                        {item.counter !== undefined && (
                          <span className="ml-2 inline-flex items-center justify-center text-xs bg-red-500 text-white rounded-full w-5 h-5">
                            {item.counter}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {item.subItems && isOpen && (
                    <div className="ml-3">
                      {openIndexes[index] ? (
                        <FaChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                          <FaChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  )}
                </div>
              )}
              {item.subItems && openIndexes[index] && isOpen && (
                <ul className="ml-6 mt-2">
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link to={subItem.path} className="block">
                        <div className="flex items-center p-2 rounded hover:bg-gray-200">
                          {subItem.icon && <subItem.icon className="text-blue-400 h-4 w-4 mr-3" />}
                          <span className="text-gray-600 text-sm">{subItem.title}</span>
                          {subItem.counter !== undefined && (
                            <span className="ml-2 inline-flex items-center justify-center text-xs bg-red-500 text-white rounded-full w-5 h-5">
                              {subItem.counter}
                            </span>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
});

export default Sidebar;
