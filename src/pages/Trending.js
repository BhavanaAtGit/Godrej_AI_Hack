import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);

  useEffect(() => {
    // Check the current logged-in user
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const usersCollection = collection(db, 'users');
          const q = query(usersCollection, where('email', '==', currentUser.email));
          const userSnapshot = await getDocs(q);

          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            setUser({ id: userSnapshot.docs[0].id, ...userData });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user: ", error);
        } finally {
          setIsLoadingUser(false);
        }
      } else {
        setUser(null);
        setIsLoadingUser(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && user.interests) {
      setIsLoadingTopics(true);
      const fetchTrendingTopics = async () => {
        try {
          const response = await axios.post('http://localhost:5000/api/trending', { interests: user.interests });
          setTrendingTopics(response.data.trending_topics);
        } catch (error) {
          console.error("Error fetching trending topics: ", error);
        } finally {
          setIsLoadingTopics(false);
        }
      };

      fetchTrendingTopics();
    } else {
      setIsLoadingTopics(false);
    }
  }, [user]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold text-[#FF3C2F]">Profile</h1>
      {isLoadingUser ? (
        <p className="text-[#FFFFFF]">Loading user data...</p>
      ) : (
        <div>
          {user ? (
            <div className="bg-[#2A2A2A] p-4 rounded-lg shadow-md mt-4">
              <h2 className="text-[#FF3C2F] font-semibold">User ID: {user.id}</h2>
              <p className="text-[#FFFFFF]"><strong>Email:</strong> {user.email}</p>
              <p className="text-[#FFFFFF]"><strong>Interests:</strong> {user.interests ? user.interests.join(', ') : 'No interests selected'}</p>
            </div>
          ) : (
            <p className="text-[#FFFFFF]">Please log in to view your trending topics.</p>
          )}

          {user && (
            <>
              <h2 className="text-2xl font-bold text-[#FF3C2F] mt-8">Interest Related News</h2>
              {isLoadingTopics ? (
                <p className="text-[#FFFFFF]">Loading interest related news...</p>
              ) : (
                <div className="mt-4">
                  {trendingTopics.length === 0 ? (
                    <p className="text-[#FFFFFF]">No trending topics found.</p>
                  ) : (
                    trendingTopics.map((topic, index) => (
                      <div key={index} className="bg-[#2A2A2A] p-4 rounded-lg shadow-md mt-4">
                        <h3 className="text-[#FF3C2F] font-semibold">Interest: {topic.interest}</h3>
                        <a href={topic.url} target="_blank" rel="noopener noreferrer" className="text-[#FF3C2F]">Source</a>
                        <div
                          className="text-[#FFFFFF] mt-2"
                          dangerouslySetInnerHTML={{ __html: topic.content }}
                        ></div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}