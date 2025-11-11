import React from 'react';
import { BellIcon, UserCircleIcon } from './IconComponents';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </span>
          <input
            type="text"
            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border border-transparent rounded-md focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
            placeholder="Search..."
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-gray-700 relative">
          <BellIcon />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center">
          <UserCircleIcon className="h-8 w-8 text-gray-500" />
          <div className="ml-2">
            <p className="text-sm font-medium text-gray-800">Admin</p>
            <p className="text-xs text-gray-500">Security Analyst</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;