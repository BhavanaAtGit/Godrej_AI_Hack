import React from 'react';

export default function Navbar({ onLoginClick, user, onLogoutClick }) {
  return (
    <nav className="bg-[#FF3C2F] p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="font-bold text-xl">Godrej AI</a>
        <div className="flex items-center">
          {user ? (
            <>
              <a href="/profile" className="text-white ml-4">Profile</a>
              <button onClick={onLogoutClick} className="ml-4 bg-white text-[#FF3C2F] py-1 px-3 rounded hover:bg-[#FF645C]">Logout</button>
            </>
          ) : (
            <button onClick={onLoginClick} className="bg-white text-[#FF3C2F] py-1 px-3 rounded hover:bg-[#FF645C]">Login / Register</button>
          )}
        </div>
      </div>
    </nav>
  );
}
