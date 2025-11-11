
import React from 'react';
import { BellIcon, UserCircleIcon } from './IconComponents';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </span>
          <input
            type="text"
            className="w-full py-2 pl-10 pr-4 text-gray-300 bg-gray-700 border border-transparent rounded-md focus:border-blue-500 focus:bg-gray-800 focus:ring-0"
            placeholder="Search for assets, vulnerabilities..."
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-white relative">
          <BellIcon />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center">
          <UserCircleIcon className="h-8 w-8 text-gray-400" />
          <div className="ml-2">
            <p className="text-sm font-medium text-white">Admin</p>
            <p className="text-xs text-gray-400">Security Analyst</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
