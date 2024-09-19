import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const emailToFind = 'krutiventi@gmail.com'; // Email to search for

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('email', '==', emailToFind));
        const userSnapshot = await getDocs(q);
        
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          setUser({ id: userSnapshot.docs[0].id, ...userData });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user: ", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user && user.interests) {
      const fetchTrendingTopics = async () => {
        try {
          const response = await axios.post('http://localhost:5000/api/trending', { interests: user.interests });
          setTrendingTopics(response.data.trending_topics);
        } catch (error) {
          console.error("Error fetching trending topics: ", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchTrendingTopics();
    }
  }, [user]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold text-[#FF3C2F]">Admin - User Details</h1>
      {isLoading ? (
        <p className="text-[#FFFFFF]">Loading data...</p>
      ) : (
        <div>
          {user ? (
            <div className="bg-[#2A2A2A] p-4 rounded-lg shadow-md mt-4">
              <h2 className="text-[#FF3C2F] font-semibold">User ID: {user.id}</h2>
              <p className="text-[#FFFFFF]"><strong>Email:</strong> {user.email}</p>
              <p className="text-[#FFFFFF]"><strong>Interests:</strong> {user.interests ? user.interests.join(', ') : 'No interests selected'}</p>
            </div>
          ) : (
            <p className="text-[#FFFFFF]">No user found with the email {emailToFind}.</p>
          )}

          <h2 className="text-2xl font-bold text-[#FF3C2F] mt-8">Trending Topics</h2>
          <div className="mt-4">
            {trendingTopics.length === 0 ? (
              <p className="text-[#FFFFFF]">No trending topics found.</p>
            ) : (
              trendingTopics.map((topic, index) => (
                <div key={index} className="bg-[#2A2A2A] p-4 rounded-lg shadow-md mt-4">
                  <h3 className="text-[#FF3C2F] font-semibold">Interest: {topic.interest}</h3>
                  <a href={topic.url} target="_blank" rel="noopener noreferrer" className="text-[#FF3C2F]">Source</a>
                  <p className="text-[#FFFFFF] mt-2">{topic.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}