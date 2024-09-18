import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const allInterests = ['Technology', 'Health', 'Sports', 'Entertainment', 'Science', 'Travel'];

const newsArticles = {
  Technology: [
    { title: 'Tech Innovations 2024', summary: 'Explore the latest tech innovations of 2024.' },
    { title: 'AI in Everyday Life', summary: 'How AI is becoming a part of our daily lives.' },
  ],
  Health: [
    { title: 'Mental Health Awareness', summary: 'Understanding the importance of mental health.' },
    { title: 'Nutrition Tips', summary: 'Tips for maintaining a balanced diet.' },
  ],
  Sports: [
    { title: 'Olympics 2024 Highlights', summary: 'Top moments from the 2024 Olympics.' },
    { title: 'Football World Cup Preview', summary: 'A look at the upcoming Football World Cup.' },
  ],
  Entertainment: [
    { title: 'Top Movies of the Year', summary: 'The must-watch movies of this year.' },
    { title: 'Music Trends 2024', summary: 'Latest trends in the music industry.' },
  ],
  Science: [
    { title: 'Space Exploration Advances', summary: 'New discoveries in space exploration.' },
    { title: 'Climate Change Updates', summary: 'Recent updates on climate change research.' },
  ],
  Travel: [
    { title: 'Top Travel Destinations 2024', summary: 'Best places to visit this year.' },
    { title: 'Travel Safety Tips', summary: 'Important tips for safe travels.' },
  ],
};

export default function Profile() {
  const [userData, setUserData] = useState({});
  const [selectedInterests, setSelectedInterests] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setSelectedInterests(docSnap.data().interests || []);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleInterestChange = (event) => {
    const value = event.target.value;
    setSelectedInterests(prevInterests =>
      prevInterests.includes(value)
        ? prevInterests.filter(interest => interest !== value)
        : [...prevInterests, value]
    );
  };

  const handleUpdate = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, { interests: selectedInterests });
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
          <div className="flex flex-col gap-2">
            {allInterests.map(interest => (
              <label key={interest} className="inline-flex items-center text-[#FFFFFF]">
                <input
                  type="checkbox"
                  value={interest}
                  checked={selectedInterests.includes(interest)}
                  onChange={handleInterestChange}
                  className="form-checkbox text-[#FF3C2F]"
                />
                <span className="ml-2">{interest}</span>
              </label>
            ))}
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
        <h2 className="text-xl font-bold text-[#FF3C2F]">Your Interests' Latest News</h2>
        {selectedInterests.length === 0 ? (
          <p className="text-[#FFFFFF]">Select your interests to see relevant news articles.</p>
        ) : (
          selectedInterests.map(interest => (
            <div key={interest} className="mt-4">
              <h3 className="text-lg font-semibold text-[#FF3C2F]">{interest} News</h3>
              {newsArticles[interest]?.map((article, index) => (
                <div key={index} className="bg-[#2A2A2A] p-4 rounded-lg shadow-md mt-2">
                  <h4 className="text-[#FFFFFF] font-semibold">{article.title}</h4>
                  <p className="text-[#9A9A9A]">{article.summary}</p>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
