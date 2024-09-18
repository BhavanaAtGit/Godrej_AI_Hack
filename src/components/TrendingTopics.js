import React from 'react';

export default function TrendingTopics() {
  const topics = ['AI', 'Sustainability', 'Tech Innovations', 'Business Growth'];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Trending Topics</h2>
      <div className="grid grid-cols-2 gap-4">
        {topics.map((topic, index) => (
          <div key={index} className="bg-[#FF3C2F] text-white p-4 rounded-lg hover:bg-[#FF645C] cursor-pointer">
            {topic}
          </div>
        ))}
      </div>
    </div>
  );
}
