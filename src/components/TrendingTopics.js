import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TrendingTopics() {
  const topics = ['AI', 'Sustainability', 'Tech Innovations', 'Business Growth'];
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Function to handle the click event and fetch news summary from the backend
  const handleTopicClick = async (topic) => {
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/trending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interests: [topic] }),
      });
      const data = await response.json();

      if (data.error) {
        console.error(data.error);
        setIsLoading(false);
        return;
      }

      // Redirect to the news summary page with the response data
      navigate(`/news/${topic}`, { state: { trendingTopics: data.trending_topics } });
    } catch (error) {
      console.error('Error fetching news:', error);
      setIsLoading(false);
    }
  };

  // Function to handle redirect to /trending
  const handleViewTopics = () => {
    navigate('/trending'); // Redirect to the /trending page
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4 text-white"></h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="bg-[#FF3C2F] text-white p-4 rounded-lg hover:bg-[#FF645C] cursor-pointer transition duration-300"
            onClick={() => handleTopicClick(topic)}
          >
            {isLoading ? (
              <div className="text-white">Loading...</div>  // Display loading text when fetching
            ) : (
              topic
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          className="bg-[#FF3C2F] text-white px-8 py-4 rounded-lg hover:bg-[#FF645C] transition duration-300 ease-in-out text-lg shadow-lg"
          onClick={handleViewTopics}  // Navigate to /trending when clicked
        >
          View Your Favourite Topics
        </button>
      </div>
    </div>
  );
}
