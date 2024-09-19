import React from 'react';
import { useLocation } from 'react-router-dom';

export default function NewsSummary() {
  const location = useLocation();
  const { trendingTopics } = location.state;

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold mb-4 text-[#FF3C2F]">News Summary</h2>
      <div className="grid grid-cols-1 gap-8">
        {trendingTopics.map((topic, index) => (
          <div key={index} className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">{topic.interest}</h3>
            <p className="mb-2">{topic.content}</p>
            <a
              href={topic.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
