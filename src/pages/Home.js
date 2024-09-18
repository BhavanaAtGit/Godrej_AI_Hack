import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import TrendingTopics from '../components/TrendingTopics';
import LoginRegisterModal from '../components/LoginRegisterModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLoginSuccess = () => {
    // Handle post-login success logic here
    handleCloseModal();
  };

  return (
    <div className="bg-[#0D0D0D] text-[#FFFFFF] min-h-screen">
      {/* Modal */}
      {isModalOpen && <LoginRegisterModal onClose={handleCloseModal} onLoginSuccess={handleLoginSuccess} />}

      {/* Hero Section */}
      <div className="p-8 text-center">
        <h1 className="text-[#FF3C2F] text-5xl font-extrabold mb-4">Welcome to Godrej AI Summarizer</h1>
        <p className="text-[#9A9A9A] text-lg mb-6">Transforming the way you consume information with AI-powered summaries.</p>
        <SearchBar />
      </div>

      {/* Features Section */}
      <div className="container mx-auto mt-12 p-8 bg-[#1A1A1A] rounded-lg shadow-lg">
        <h2 className="text-[#FF3C2F] text-4xl font-bold mb-6 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-[#2A2A2A] rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Quick Summarization</h3>
            <p className="text-[#9A9A9A]">Get concise summaries of lengthy articles in seconds with our advanced AI technology.</p>
          </div>
          <div className="p-6 bg-[#2A2A2A] rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Customized Insights</h3>
            <p className="text-[#9A9A9A]">Receive summaries tailored to your interests for a more relevant and personalized experience.</p>
          </div>
          <div className="p-6 bg-[#2A2A2A] rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">User-Friendly Interface</h3>
            <p className="text-[#9A9A9A]">Enjoy a seamless experience with our intuitive design that makes navigation effortless.</p>
          </div>
        </div>
      </div>

      {/* Trending Topics Section */}
      <div className="container mx-auto mt-12 p-8">
        <h2 className="text-[#FF3C2F] text-4xl font-bold mb-6 text-center">Trending Topics</h2>
        <TrendingTopics />
      </div>

      {/* Testimonials Section */}
      <div className="bg-[#1A1A1A] text-center py-12 mt-12">
        <div className="container mx-auto px-8">
          <h2 className="text-[#FF3C2F] text-4xl font-bold mb-6">What Our Users Say</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="bg-[#2A2A2A] text-[#FFFFFF] p-6 rounded-lg shadow-md flex-1">
              <p className="mb-4">"Godrej AI Summarizer has revolutionized my workflow. It's fast, efficient, and incredibly easy to use!"</p>
              <p className="font-semibold">- Alex Johnson</p>
            </div>
            <div className="bg-[#2A2A2A] text-[#FFFFFF] p-6 rounded-lg shadow-md flex-1">
              <p className="mb-4">"The personalized summaries are a game-changer. I get exactly what I need without sifting through endless articles."</p>
              <p className="font-semibold">- Jamie Lee</p>
            </div>
            <div className="bg-[#2A2A2A] text-[#FFFFFF] p-6 rounded-lg shadow-md flex-1">
              <p className="mb-4">"An exceptional tool for anyone who needs quick and accurate information. Highly recommended!"</p>
              <p className="font-semibold">- Taylor Smith</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-[#FF3C2F] text-center py-12 mt-12">
        <h2 className="text-4xl font-bold mb-6 text-[#FFFFFF]">Ready to Experience the Future of Information?</h2>
        <p className="text-lg mb-6 text-[#FFFFFF]">Sign up now and start summarizing with our powerful AI tool.</p>
        <button
          onClick={handleOpenModal}
          className="bg-[#FF645C] text-white py-3 px-6 rounded-lg text-lg hover:bg-[#FF3C2F] transition duration-300"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
