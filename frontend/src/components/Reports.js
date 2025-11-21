import React, { useState, useEffect } from 'react';
import { Flag, X } from 'lucide-react';
import { reportsAPI } from '../services/api';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [type, setType] = useState('Harassment');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await reportsAPI.getAll();
      setReports(response.data);
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!type) {
      setError('Please select a type of incident/concern.');
      return;
    }

    try {
      await reportsAPI.create({ type, location: location.trim() });
      setLocation('');
      loadReports();
    } catch (error) {
      setError('Failed to submit report. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await reportsAPI.delete(id);
      loadReports();
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-white border-b border-gray-700 pb-2 max-w-lg mx-auto">
        Community Safety Reports
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-800 rounded-xl shadow-inner max-w-lg mx-auto border border-red-700">
        <h4 className="text-lg font-semibold text-red-500 flex items-center">
          <Flag className="mr-2" size={20} /> Log Safety Concern (Anonymous)
        </h4>
        <p className="text-sm text-gray-400">
          Reports are stored in the database. In a real app, this would update the safety map for others.
        </p>
        
        <div>
          <label htmlFor="report-type-input" className="block text-sm font-medium text-gray-300">
            Type of Incident/Concern
          </label>
          <select
            id="report-type-input"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="dark-input mt-1 block w-full rounded-md shadow-sm p-2"
          >
            <option value="Harassment">Verbal Harassment</option>
            <option value="Poor Lighting">Poor Lighting / Danger Spot</option>
            <option value="Suspicious">Suspicious Activity</option>
            <option value="Theft">Attempted Theft</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="report-location-input" className="block text-sm font-medium text-gray-300">
            Location (Optional details)
          </label>
          <input
            type="text"
            id="report-location-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="dark-input mt-1 block w-full rounded-md shadow-sm p-2"
            placeholder="Intersection, nearest landmark, Lat/Lon (optional)"
          />
        </div>
        
        {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 transition duration-150 ease-in-out"
        >
          Submit Anonymous Report
        </button>
      </form>

      <div className="space-y-3 max-w-lg mx-auto">
        <h4 className="text-lg font-semibold text-gray-300 border-b border-gray-700 pb-1">
          Your Local Reports <span className="text-red-500">({reports.length})</span>
        </h4>
        <div className="space-y-3">
          {reports.length === 0 ? (
            <p className="text-gray-400 italic p-4 bg-gray-800 rounded-lg shadow text-center">
              You have not submitted any local reports yet.
            </p>
          ) : (
            reports.map((report) => (
              <div
                key={report._id}
                className="p-4 bg-gray-700 rounded-lg shadow border border-red-700 space-y-1"
              >
                <div className="flex justify-between items-start">
                  <p className="text-lg font-bold text-red-400">{report.type}</p>
                  <button
                    onClick={() => handleDelete(report._id)}
                    className="text-gray-400 hover:text-red-500 transition duration-150 p-1 rounded-full"
                    aria-label="Delete report"
                  >
                    <X size={18} />
                  </button>
                </div>
                <p className="text-sm text-gray-300">
                  *Location Detail:* {report.location || 'Not Specified'}
                </p>
                <p className="text-xs text-gray-500 italic">
                  Submitted: {new Date(report.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;