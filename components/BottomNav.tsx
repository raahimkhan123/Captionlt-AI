
import React from 'react';
import { Screen } from '../types';
import { HomeIcon, HistoryIcon, ProfileIcon, PremiumIcon } from './icons/NavigationIcons';

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

const NavItem: React.FC<{
  label: Screen;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 w-full transition-all duration-300 ease-in-out transform ${
        isActive ? 'text-white scale-110' : 'text-gray-400 hover:text-white'
      }`}
    >
      <div className="relative">
        {icon}
        {isActive && (
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gradient-to-r from-[#FF00EE] to-[#00FFFF] rounded-full"></span>
        )}
      </div>
      <span className="text-xs">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
  const navItems = [
    { label: Screen.Home, icon: <HomeIcon /> },
    { label: Screen.History, icon: <HistoryIcon /> },
    { label: Screen.Pricing, icon: <PremiumIcon /> },
    { label: Screen.Profile, icon: <ProfileIcon /> },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 max-w-lg mx-auto p-2">
      <div className="bg-black/20 border border-white/10 rounded-3xl backdrop-blur-xl flex justify-around items-center h-20 px-4 shadow-lg">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            isActive={activeScreen === item.label}
            onClick={() => setActiveScreen(item.label)}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
