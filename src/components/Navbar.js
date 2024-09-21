import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onLoginClick, user, onLogoutClick }) {
  const navigate = useNavigate();

  // Function to navigate to the profile page
  const handleViewProfile = () => {
    navigate('/profile'); // Redirect to the /profile page
  };

  return (
    <nav className="bg-[#FF3C2F] p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="font-bold text-xl">Godrej AI</a>
        <div className="flex items-center">
          {user ? (
            <>
              <button
                onClick={handleViewProfile}
                className="text-white ml-4"
              >
                Profile
              </button>
              <button
                onClick={onLogoutClick}
                className="ml-4 bg-white text-[#FF3C2F] py-1 px-3 rounded hover:bg-[#FF645C]"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="bg-white text-[#FF3C2F] py-1 px-3 rounded hover:bg-[#FF645C]"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
