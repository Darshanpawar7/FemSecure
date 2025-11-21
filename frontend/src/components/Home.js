import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Siren, 
  Map, 
  Car, 
  Timer, 
  AlertCircle 
} from 'lucide-react';
import { profileAPI } from '../services/api';

const Home = ({ 
  onAlert, 
  currentLocation, 
  onFetchLocation, 
  isLocationLoading,
  safetyStatus,
  recommendations,
  onStartTimer,
  onCheckIn,
  onCancelTimer,
  timerActive,
  timeRemaining 
}) => {
  const [timerDuration, setTimerDuration] = useState('30');

  const handleStartTimer = (e) => {
    e.preventDefault();
    onStartTimer(parseInt(timerDuration, 10));
  };

  return (
    <div className="p-6 space-y-8 flex flex-col items-center text-center">
      <h1 className="text-3xl font-extrabold text-white">Immediate Actions</h1>

      <button 
        onClick={onFetchLocation}
        disabled={isLocationLoading}
        className="w-full max-w-md p-4 bg-gray-800 rounded-xl shadow-lg flex items-center justify-center space-x-3 transition duration-300 border border-pink-800 active:scale-[0.98] disabled:opacity-50"
      >
        <MapPin className="text-pink-500 flex-shrink-0" size={24} />
        <div className="text-sm font-medium text-gray-300 truncate">
          <span className="font-bold text-white">Location:</span>{' '}
          <span id="current-location">
            {isLocationLoading ? (
              <span className="loading-spinner mr-2"></span>
            ) : null}
            {currentLocation}
          </span>
        </div>
      </button>

      <button 
        onClick={() => onAlert('SOS Button')}
        className="w-full max-w-sm h-48 bg-red-700 text-white rounded-3xl shadow-2xl hover:bg-red-800 active:bg-red-900 focus:outline-none focus:ring-4 focus:ring-red-400 transform transition-all duration-200 ease-in-out scale-100 hover:scale-[1.03] active:scale-[0.98] flex flex-col items-center justify-center group"
        aria-label="Send Emergency Alert"
      >
        <Siren className="text-white mb-2 group-hover:animate-pulse" size={48} strokeWidth={2.5} />
        <span className="text-4xl font-black uppercase tracking-wider">SOS</span>
        <span className="text-sm font-medium mt-1">Tap to send immediate alert</span>
      </button>
      
      <section className="w-full max-w-md bg-gray-800 p-5 rounded-xl shadow-lg border border-pink-800 space-y-4 text-left">
        <h2 className="text-xl font-bold text-pink-500 flex items-center justify-center">
          <Map className="mr-2" size={24} /> Real-Time Safety & Resources
        </h2>
        <div 
          className={`p-3 rounded-lg font-bold text-center text-gray-900 ${
            safetyStatus.level === 'red' ? 'bg-red-700 border border-red-500 text-white' :
            safetyStatus.level === 'orange' ? 'bg-yellow-600 border border-yellow-400 text-gray-900' :
            'bg-green-700 border border-green-500 text-white'
          }`}
        >
          {safetyStatus.message}
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-300 border-b border-gray-600 pb-1">
            Immediate Safety Recommendations
          </h3>
          <div className="text-sm space-y-2 text-gray-400">
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <p key={index} className="flex items-start">
                  <AlertCircle size={16} className="text-pink-500 mr-2 mt-1 flex-shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: rec }} />
                </p>
              ))
            ) : (
              <p>Area is rated safe. Maintain awareness and consider setting a check-in timer.</p>
            )}
          </div>
        </div>

        <a 
          href={safetyStatus.taxiLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center py-2 bg-pink-600 text-white rounded-full font-bold hover:bg-pink-700 transition shadow-md"
        >
          <Car className="mr-2" size={20} /> Book Women-Exclusive Taxi (Simulated)
        </a>
      </section>

      <section className="w-full max-w-md bg-gray-800 p-5 rounded-xl shadow-lg border border-pink-800 space-y-4">
        <h2 className="text-xl font-bold text-pink-500 flex items-center justify-center">
          <Timer className="mr-2" size={24} /> Check-In Timer
        </h2>
        <p className="text-sm text-gray-400">
          Set a time to safely check in. If you miss it, an alert is simulated.
        </p>

        {timerActive ? (
          <div className="flex flex-col items-center p-3 bg-gray-700 rounded-lg">
            <p className="font-semibold text-gray-300">Time Remaining:</p>
            <p className="text-3xl font-extrabold text-pink-500">{timeRemaining}</p>
            <button 
              onClick={onCheckIn}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition"
            >
              I'm Safe (Check In)
            </button>
            <button 
              onClick={onCancelTimer}
              className="mt-2 text-sm text-gray-400 hover:text-white"
            >
              Cancel Timer
            </button>
          </div>
        ) : (
          <form onSubmit={handleStartTimer} className="space-y-3">
            <label htmlFor="timer-duration" className="block text-sm font-medium text-gray-300 text-left">
              Set Duration:
            </label>
            <select 
              id="timer-duration"
              value={timerDuration}
              onChange={(e) => setTimerDuration(e.target.value)}
              className="dark-input block w-full p-2 rounded-md shadow-sm"
            >
              <option value="5">5 Minutes</option>
              <option value="15">15 Minutes</option>
              <option value="30">30 Minutes</option>
              <option value="60">1 Hour</option>
              <option value="120">2 Hours</option>
            </select>
            <button 
              type="submit" 
              className="w-full py-2 bg-pink-500 text-white rounded-full font-bold hover:bg-pink-600 transition"
            >
              Start Check-In Timer
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default Home;