import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function LoginRegisterModal({ onClose, onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);

  const googleProvider = new GoogleAuthProvider();

  const handleInterestChange = (event) => {
    const value = event.target.value;
    setSelectedInterests(prevInterests => 
      prevInterests.includes(value) 
        ? prevInterests.filter(interest => interest !== value)
        : [...prevInterests, value]
    );
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user interests to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        interests: selectedInterests,
      });

      alert('Registration successful! Please log in.');
      setIsRegistering(false); // Switch to login mode
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Error during registration: ' + error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
      if (onLoginSuccess) onLoginSuccess(); // Ensure this callback is defined before calling it
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error during login:', error);
      alert('Error during login: ' + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert('Google login successful!');
      if (onLoginSuccess) onLoginSuccess(); // Ensure this callback is defined before calling it
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error during Google login:', error);
      alert('Error during Google login: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md p-8 relative shadow-lg">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-black hover:text-gray-700">
          &#x2715;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-black">{isRegistering ? 'Register' : 'Login'}</h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2 text-black">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black" // Added text-black here
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2 text-black">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black" // Added text-black here
          />
        </div>

        {isRegistering && (
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-black">Interests</label>
            <div>
              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  value="Technology"
                  onChange={handleInterestChange}
                  className="form-checkbox"
                />
                <span className="ml-2 text-black">Technology</span>
              </label>
              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  value="Science"
                  onChange={handleInterestChange}
                  className="form-checkbox"
                />
                <span className="ml-2 text-black">Science</span>
              </label>
              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  value="Engineering"
                  onChange={handleInterestChange}
                  className="form-checkbox"
                />
                <span className="ml-2 text-black">Engineering</span>
              </label>
              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  value="Mathematics"
                  onChange={handleInterestChange}
                  className="form-checkbox"
                />
                <span className="ml-2 text-black">Mathematics</span>
              </label>
              <label className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  value="Artificial Intelligence"
                  onChange={handleInterestChange}
                  className="form-checkbox"
                />
                <span className="ml-2 text-black">Artificial Intelligence</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="Data Science"
                  onChange={handleInterestChange}
                  className="form-checkbox"
                />
                <span className="ml-2 text-black">Data Science</span>
              </label>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {isRegistering ? (
            <button
              onClick={handleRegister}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Register
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Login
            </button>
          )}

          <button
            onClick={handleGoogleLogin}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Login with Google
          </button>
        </div>

        <p className="mt-4 text-sm text-center text-black">
          {isRegistering ? 'Already have an account? ' : 'Don\'t have an account? '}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-500 hover:underline"
          >
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}
