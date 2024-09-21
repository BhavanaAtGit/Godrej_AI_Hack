import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginRegisterModal from './components/LoginRegisterModal';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Trending from './pages/Trending';
import TrendingTopics from './components/TrendingTopics';
import NewsSummary from './components/NewsSummary';

function App() {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Firebase Auth State Listener
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#0D0D0D] text-[#FFFFFF]">
        <Navbar onLoginClick={() => setIsModalOpen(true)} user={user} onLogoutClick={handleLogout} />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path='/trending' element={<Trending/>}/>
            <Route path="/" element={<TrendingTopics />} />
            <Route path="/news/:topic" element={<NewsSummary />} />
          </Routes>
        </div>
        <Footer />
        {isModalOpen && <LoginRegisterModal onClose={() => setIsModalOpen(false)} />}
      </div>
    </Router>
  );
}

export default App;
