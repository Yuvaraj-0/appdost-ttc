import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiUser, HiLogout } from 'react-icons/hi';
import { UserAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const { session, signOut } = UserAuth();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className='bg-gray-900 text-white flex items-center justify-between px-8 w-full h-16 shadow-lg'>
      <Link to="/admindashboard" className="text-2xl font-bold flex items-center gap-2 hover:text-gray-300 transition-colors">
        <span className="bg-white text-gray-900 px-3 py-1 rounded-md">E-Shop</span>
        <span className="text-sm text-gray-400">Admin</span>
      </Link>

      <div className='flex items-center gap-6'>
        {session?.user?.email && (
          <div className="relative z-50" ref={userMenuRef}>
            <button
              onClick={() => {
                console.log('Button clicked, current state:', isUserMenuOpen);
                setIsUserMenuOpen(!isUserMenuOpen);
              }}
              className="p-2 hover:bg-gray-800 rounded-lg transition-all duration-200"
            >
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-gray-600 hover:scale-110">
                <HiUser className="text-white text-xl" />
              </div>
            </button>

            {isUserMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-2xl py-2 z-50 animate-slideDown origin-top"
              >
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 font-semibold flex items-center gap-2 hover:scale-105"
                >
                  <HiLogout className="transition-transform duration-200" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;