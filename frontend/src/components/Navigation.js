import React from 'react';
import { Home, Users, Flag, Info, User } from 'lucide-react';

const Navigation = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'contacts', icon: Users, label: 'Contacts' },
    { id: 'reports', icon: Flag, label: 'Reports' },
    { id: 'resources', icon: Info, label: 'Resources' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-pink-800 shadow-2xl z-20">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`nav-button flex flex-col items-center justify-center p-2 text-sm font-medium rounded-lg transition duration-150 ${
              currentView === id ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'
            }`}
          >
            <Icon size={24} strokeWidth={2} />
            <span className="mt-1 hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;