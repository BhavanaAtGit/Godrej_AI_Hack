import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import axios from 'axios';

const allInterests = [
  'Technology', 'Health', 'Sports', 'Entertainment', 'Science', 'Travel', 
  'Machine Learning', 'Artificial Intelligence', 'Blockchain', 'Cybersecurity',
  'Quantum Computing', 'Data Science', 'Robotics', 'Virtual Reality', 'Augmented Reality'
];

export default function Profile() {
  const [userData, setUserData] = useState({});
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [customInterest, setCustomInterest] = useState('');
  const [newsArticles, setNewsArticles] = useState({});
  const [loadingNews, setLoadingNews] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setSelectedInterests(data.interests || []);
        }
      }
    };
    fetchUserData();
  }, []);

  const fetchNewsArticles = async (interests) => {
    setLoadingNews(true);
    try {
      console.log("Fetching news articles for interests:", interests);
      const response = await axios.post('https://godrej-ai-hack.onrender.com/api/trending', { interests });
      console.log("News articles response:", response.data);
      setNewsArticles(response.data.trending_topics.reduce((acc, topic) => {
        const interest = topic.interest;
        if (!acc[interest]) {
          acc[interest] = [];
        }
        acc[interest].push(topic);
        return acc;
      }, {}));
    } catch (error) {
      console.error('Error fetching news articles:', error);
    }
    setLoadingNews(false);
  };

  const handleInterestChange = (interest) => {
    setSelectedInterests((prevInterests) =>
      prevInterests.includes(interest)
        ? prevInterests.filter((item) => item !== interest)
        : [...prevInterests, interest]
    );
  };

  const handleAddCustomInterest = () => {
    if (customInterest.trim() && !selectedInterests.includes(customInterest)) {
      setSelectedInterests([...selectedInterests, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const handleUpdate = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, { interests: selectedInterests });
      console.log("Updated interests:", selectedInterests);
      fetchNewsArticles(selectedInterests); // Fetch news articles on profile update
      alert('Profile updated successfully!');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold text-[#FF3C2F]">Profile</h1>
      <div className="mt-4">
        <p><strong>Email:</strong> {auth.currentUser && auth.currentUser.email}</p>
        
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-2 text-[#FFFFFF]">Interests</label>
          <div className="flex flex-wrap gap-2">
            {allInterests.map((interest) => (
              <div
                key={interest}
                className={`p-2 rounded-lg cursor-pointer ${
                  selectedInterests.includes(interest)
                    ? 'bg-[#FF3C2F] text-white'
                    : 'bg-[#2A2A2A] text-[#FFFFFF]'
                }`}
                onClick={() => handleInterestChange(interest)}
              >
                {interest}
              </div>
            ))}
          </div>
          
          {/* Custom Interest Input */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              placeholder="Add a custom interest"
              className="p-2 bg-[#2A2A2A] text-[#FFFFFF] rounded-lg flex-grow"
            />
            <button
              onClick={handleAddCustomInterest}
              className="bg-[#FF3C2F] text-white py-2 px-4 rounded-lg hover:bg-[#FF645C] transition duration-300"
            >
              Add
            </button>
          </div>
        </div>

        <button
          onClick={handleUpdate}
          className="bg-[#FF3C2F] text-white py-2 px-4 rounded-lg mt-4 hover:bg-[#FF645C] transition duration-300"
        >
          Update Profile
        </button>
      </div>

      {/* Displaying News Based on Interests */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-[#FF3C2F]"></h2>
        {loadingNews ? (
          <p className="text-[#FFFFFF]"></p>
        ) : selectedInterests.length > 0 && Object.keys(newsArticles).length > 0 ? (
          <div>
            {Object.keys(newsArticles).map((interest) => (
              <div key={interest} className="mt-4">
                <h3 className="text-lg font-semibold text-[#FF3C2F]">{interest}</h3>
                <ul>
                  {newsArticles[interest].map((article, index) => (
                    <li key={index} className="bg-[#2A2A2A] p-4 rounded-lg shadow-md mt-2 text-[#FFFFFF]">
                      <strong>{article.interest}</strong>: {article.content}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#FFFFFF]"></p>
        )}
      </div>
    </div>
  );
}
