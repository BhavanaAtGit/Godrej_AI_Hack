import React from 'react';
import { Link } from 'react-router-dom';

export default function TrendingTopics() {
  const topics = ['AI', 'Sustainability', 'Tech Innovations', 'Business Growth'];

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Trending Topics</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="bg-[#FF3C2F] text-white p-4 rounded-lg hover:bg-[#FF645C] cursor-pointer"
          >
            {topic}
          </div>
        ))}
      </div>
      <Link to="/trending">
        <button className="bg-[#FF3C2F] text-white p-4 rounded-lg mx-[499px]  hover:bg-[#FF645C] transition duration-300 ease-in-out">
          View Your Favourtie Topics
        </button>
      </Link>
    </div>
  );
}