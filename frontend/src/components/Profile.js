import React, { useState, useEffect } from 'react';
import { authAPI, profileAPI } from '../services/api';

const Profile = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await authAPI.getMe();
      const userData = response.data;
      setName(userData.name || '');
      setPhone(userData.phone || '');
    } catch (error) {
      console.error('Error loading profile:', error);
      // Set default values if API fails
      setName('Anya Sharma');
      setPhone('+91 98765 43210');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await profileAPI.update({ name, phone });
      setSaveMessage('Profile Saved! 👍');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveMessage('Error saving profile. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-sm bg-gray-800 p-8 rounded-xl shadow-2xl border border-pink-700 space-y-6">
        <h1 className="text-3xl font-extrabold text-white text-center">Your Profile</h1>
        <p className="text-gray-400 text-center">Manage your personal information and safety profile.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="profile-name-input" className="block text-sm font-medium text-gray-300 text-left">
              Your Name
            </label>
            <input
              type="text"
              id="profile-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="dark-input mt-1 block w-full rounded-md shadow-sm p-3"
              required
            />
          </div>
          <div>
            <label htmlFor="profile-phone-input" className="block text-sm font-medium text-gray-300 text-left">
              Your Phone #
            </label>
            <input
              type="tel"
              id="profile-phone-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="dark-input mt-1 block w-full rounded-md shadow-sm p-3"
              required
            />
          </div>
          {saveMessage && (
            <p className={`text-sm font-medium text-center ${
              saveMessage.includes('Error') ? 'text-red-400' : 'text-green-400'
            }`}>
              {saveMessage}
            </p>
          )}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-4 py-3 font-bold rounded-full shadow-md text-white bg-pink-600 hover:bg-pink-700 transition duration-150 ease-in-out"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;