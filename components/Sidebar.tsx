import React, { useState } from 'react';
import { ShieldCheckIcon, DashboardIcon, BugIcon, DesktopComputerIcon, UserCircleIcon } from './IconComponents';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false }) => (
  <a
    href="#"
    className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
      active
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    {icon}
    <span className="ml-4 font-medium">{label}</span>
  </a>
);

const Sidebar: React.FC = () => {
  const [activeItem] = useState('Dashboard');
  const { session } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon /> },
    { label: 'Endpoints', icon: <DesktopComputerIcon /> },
    { label: 'Vulnerabilities', icon: <BugIcon /> },
  ];
  
  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold ml-2 text-gray-800">CyberGuard</h1>
      </div>
      <nav className="flex-1 px-4 py-4">
        {navItems.map(item => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={activeItem === item.label}
          />
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
              <UserCircleIcon className="h-10 w-10 text-gray-400" />
              <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-semibold text-gray-700 truncate" title={session?.user?.email}>{session?.user?.email}</p>
                  <button 
                    onClick={handleLogout} 
                    className="text-xs text-blue-600 hover:underline focus:outline-none"
                    aria-label="Logout"
                  >
                      Logout
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Sidebar;